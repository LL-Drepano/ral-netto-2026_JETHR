/* =========================================================================
   calcolo.js — Logica RAL → Netto, anno d'imposta 2026

   Funzioni pure, senza accesso al DOM o stato applicativo.
   Parametri numerici: parametri2026.js
   ========================================================================= */

// Tronca a 4 decimali evitando piccoli errori di floating point.
function troncaQuattro(x) {
  return Math.floor(Number((x * 10000).toFixed(6))) / 10000;
}

function euro(n) {
  return n.toLocaleString('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// Applica aliquote progressive alla parte di imponibile compresa in ogni scaglione.
function applicaScaglioni(imponibile, scaglioni) {
  let imposta = 0;
  let precedente = 0;

  for (const scaglione of scaglioni) {
    if (imponibile <= precedente) break;

    const quota = Math.min(imponibile, scaglione.fino) - precedente;
    imposta += quota * scaglione.aliquota;
    precedente = scaglione.fino;
  }

  return imposta;
}

// Valida la RAL e segnala i casi in cui la stima è meno affidabile.
function validaRAL(ral) {
  const minimale =
    CONTRIBUTI_2026.minimaleGiornaliero *
    CONTRIBUTI_2026.giorniConvenzionaliAnno;

  if (!Number.isFinite(ral) || ral <= 0) {
    return {
      valida: false,
      tipo: 'errore',
      messaggio: 'Inserisci una retribuzione annua lorda maggiore di zero.'
    };
  }

  if (ral < minimale) {
    return {
      valida: true,
      tipo: 'avviso',
      soglia: minimale,
      messaggio:
        `Sotto ${euro(minimale)} annui il prototipo non applica il minimale ` +
        'contributivo e può quindi sovrastimare il netto.'
    };
  }

  return { valida: true, tipo: 'ok' };
}

// Contributi a carico del lavoratore.
// L'aliquota aggiuntiva dell'1% è annualizzata: vedi ASSUNZIONI.md.
function contributiInps(ral) {
  const p = CONTRIBUTI_2026;
  const base = Math.min(ral, p.massimaleAnnuo);

  const ivs = base * p.aliquotaDipendente;
  const eccedenza = Math.max(0, base - p.primaFasciaAnnua);
  const aggiuntivo = eccedenza * p.aliquotaAggiuntiva;

  return {
    ivs,
    aggiuntivo,
    totale: ivs + aggiuntivo,
    baseUsata: base,
    massimaleRaggiunto: ral > p.massimaleAnnuo
  };
}

// Nel caso standard: imponibile fiscale = RAL - contributi obbligatori.
function imponibileFiscale(ral, contributiTotali) {
  return ral - contributiTotali;
}

function irpefLorda(imponibile) {
  return applicaScaglioni(imponibile, IRPEF_2026.scaglioni);
}

// Detrazione per lavoro dipendente, art. 13 TUIR.
// I rapporti delle formule sono troncati alla quarta cifra decimale.
function detrazioneArt13(
  redditoComplessivo,
  giorniLavorati = 365,
  tempoDeterminato = false
) {
  const a = DETRAZIONI_2026.art13;
  const R = redditoComplessivo;
  let detrazione;

  if (R <= a.fasciaBassa.limite) {
    detrazione = a.fasciaBassa.importo;
  } else if (R <= a.fasciaMedia.limite) {
    const m = a.fasciaMedia;
    const rapporto = troncaQuattro((m.riferimento - R) / m.ampiezza);
    detrazione = m.base + m.quota * rapporto;
  } else if (R <= a.fasciaAlta.limite) {
    const h = a.fasciaAlta;
    const rapporto = troncaQuattro((h.riferimento - R) / h.ampiezza);
    detrazione = h.quota * rapporto;
  } else {
    return 0;
  }

  detrazione *= giorniLavorati / 365;

  if (R <= a.fasciaBassa.limite) {
    const minimo = tempoDeterminato
      ? a.fasciaBassa.minimoTempoDeterminato
      : a.fasciaBassa.minimo;

    detrazione = Math.max(detrazione, minimo);
  }

  return detrazione;
}

function maggiorazione65(redditoComplessivo, giorniLavorati = 365) {
  const m = DETRAZIONI_2026.maggiorazione;
  const dovuta =
    redditoComplessivo > m.da &&
    redditoComplessivo <= m.a;

  return dovuta
    ? m.importo * giorniLavorati / 365
    : 0;
}

function ulterioreDetrazione(redditoComplessivo, giorniLavorati = 365) {
  const u = DETRAZIONI_2026.ulteriore;
  const R = redditoComplessivo;

  if (R <= u.da || R > u.azzeramento) return 0;

  const detrazione =
    R <= u.pienoFino
      ? u.importo
      : u.importo * (u.azzeramento - R) / u.ampiezza;

  return detrazione * giorniLavorati / 365;
}

// Somma aggiuntiva al netto.
// Accesso sul reddito complessivo; calcolo sul reddito da lavoro dipendente.
function sommaIntegrativa(redditoComplessivo, redditoLavoroDipendente) {
  const s = DETRAZIONI_2026.sommaIntegrativa;

  if (redditoComplessivo > s.limiteRedditoComplessivo) return 0;

  const fascia = s.scaglioni.find(
    ({ fino }) => redditoLavoroDipendente <= fino
  );

  return redditoLavoroDipendente * fascia.percentuale;
}

// Addizionale regionale Lombardia e comunale Milano.
function addizionali(imponibile, irpefNetta) {
  const a = ADDIZIONALI_2026;

  if (irpefNetta <= a.sogliaIrpefNetta) {
    return {
      regionale: 0,
      comunale: 0,
      totale: 0,
      dovute: false
    };
  }

  const regionale = applicaScaglioni(imponibile, a.regionale);
  const comunale =
    imponibile > a.comunale.sogliaEsenzione
      ? imponibile * a.comunale.aliquota
      : 0;

  return {
    regionale,
    comunale,
    totale: regionale + comunale,
    dovute: true,
    esenteComunale: comunale === 0
  };
}

// Orchestratore: compone tutte le voci e restituisce il dettaglio del calcolo.
function calcolaNetto(ral, opzioni = {}) {
  const giorni = opzioni.giorniLavorati ?? 365;
  const tempoDeterminato = opzioni.tempoDeterminato ?? false;
  const mensilita = opzioni.mensilita ?? 13;

  const validazione = validaRAL(ral);

  if (!validazione.valida) {
    return { ok: false, validazione };
  }

  const contributi = contributiInps(ral);
  const imponibile = imponibileFiscale(ral, contributi.totale);
  const lorda = irpefLorda(imponibile);

  const dArt13 = detrazioneArt13(imponibile, giorni, tempoDeterminato);
  const dMagg = maggiorazione65(imponibile, giorni);
  const dUlteriore = ulterioreDetrazione(imponibile, giorni);
  const detrazioniTotali = dArt13 + dMagg + dUlteriore;

  const netta = Math.max(0, lorda - detrazioniTotali);
  const detrazioniPerse = Math.max(0, detrazioniTotali - lorda);

  const somma = sommaIntegrativa(imponibile, imponibile);
  const add = addizionali(imponibile, netta);

  const totaleTrattenute =
    contributi.totale +
    netta +
    add.totale;

  const nettoAnnuo =
    ral -
    totaleTrattenute +
    somma;

  return {
    ok: true,
    validazione,
    input: {
      ral,
      giorni,
      tempoDeterminato,
      mensilita
    },
    contributi,
    imponibile,
    irpef: {
      lorda,
      detrazioneArt13: dArt13,
      maggiorazione65: dMagg,
      ulterioreDetrazione: dUlteriore,
      detrazioniTotali,
      detrazioniPerse,
      netta
    },
    addizionali: add,
    sommaIntegrativa: somma,
    totaleTrattenute,
    nettoAnnuo,
    nettoMensile: nettoAnnuo / mensilita,
    aliquotaEffettiva: totaleTrattenute / ral
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    troncaQuattro,
    euro,
    applicaScaglioni,
    validaRAL,
    contributiInps,
    imponibileFiscale,
    irpefLorda,
    detrazioneArt13,
    maggiorazione65,
    ulterioreDetrazione,
    sommaIntegrativa,
    addizionali,
    calcolaNetto
  };
}
