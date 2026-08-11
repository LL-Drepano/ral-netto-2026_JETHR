/* =========================================================================
   parametri2026.js — Calcolatore RAL → Netto, anno d'imposta 2026

   Parametri numerici centralizzati.
   Fonti principali: INPS, Normattiva/TUIR, Dipartimento delle Finanze (MEF).
   Verifica fonti: 11/08/2026
   ========================================================================= */

// Contributi previdenziali a carico del lavoratore
const CONTRIBUTI_2026 = {
  // Quota IVS lavoratore. FIS/CIGS esclusi: vedi ASSUNZIONI.md.
  aliquotaDipendente: 0.0919,

  // Soglie per l'aliquota aggiuntiva dell'1%.
  // Fonte: Circolare INPS 6/2026, par. 5.
  primaFasciaAnnua: 56224,
  primaFasciaMensile: 4685,

  // Fonte: art. 3-ter D.L. 384/1992, conv. L. 438/1992.
  aliquotaAggiuntiva: 0.01,

  // Massimale per iscritti successivamente al 31/12/1995.
  // Fonte: L. 335/1995, art. 2 c.18; Circolare INPS 6/2026, par. 6.
  massimaleAnnuo: 122295,

  // Valori usati per individuare la fascia sotto il minimale.
  // Fonte: Circolare INPS 6/2026.
  minimaleGiornaliero: 58.13,
  giorniConvenzionaliAnno: 312
};

// IRPEF
const IRPEF_2026 = {
  // Fonte: art. 11 TUIR, come modificato dalla L. 199/2025.
  scaglioni: [
    { fino: 28000, aliquota: 0.23 },
    { fino: 50000, aliquota: 0.33 },
    { fino: Infinity, aliquota: 0.43 }
  ]
};

// Detrazioni e misure di riduzione del cuneo fiscale
const DETRAZIONI_2026 = {
  // Art. 13 TUIR. I rapporti delle formule sono troncati a 4 decimali.
  art13: {
    fasciaBassa: {
      limite: 15000,
      importo: 1955,
      minimo: 690,
      minimoTempoDeterminato: 1380
    },
    fasciaMedia: {
      limite: 28000,
      base: 1910,
      quota: 1190,
      riferimento: 28000,
      ampiezza: 13000
    },
    fasciaAlta: {
      limite: 50000,
      quota: 1910,
      riferimento: 50000,
      ampiezza: 22000
    }
  },

  // Fonte: art. 13 c.1.1 TUIR.
  maggiorazione: { da: 25000, a: 35000, importo: 65 },

  // Ulteriore detrazione. Fonte: L. 207/2024, art. 1 c.6.
  ulteriore: {
    da: 20000,
    pienoFino: 32000,
    azzeramento: 40000,
    importo: 1000,
    ampiezza: 8000
  },

  // Somma integrativa. Accesso sul reddito complessivo; calcolo sul reddito
  // di lavoro dipendente. Fonte: L. 207/2024, art. 1 cc.4-5.
  sommaIntegrativa: {
    limiteRedditoComplessivo: 20000,
    scaglioni: [
      { fino: 8500, percentuale: 0.071 },
      { fino: 15000, percentuale: 0.053 },
      { fino: Infinity, percentuale: 0.048 }
    ]
  }
};

// Addizionali regionale e comunale
const ADDIZIONALI_2026 = {
  // Lombardia. Fonte: l.r. 10/2003, art. 72, come adeguato dalla l.r. 5/2022.
  regionale: [
    { fino: 15000, aliquota: 0.0123 },
    { fino: 28000, aliquota: 0.0158 },
    { fino: 50000, aliquota: 0.0172 },
    { fino: Infinity, aliquota: 0.0173 }
  ],

  // Milano: aliquota ed esenzione verificate sul MEF.
  // Nessuna nuova delibera 2026 risultava pubblicata alla data di verifica.
  // Dettagli e criterio adottato: ASSUNZIONI.md.
  comunale: {
    aliquota: 0.008,
    sogliaEsenzione: 23000,
    fonteVerificataIl: '2026-08-11'
  },

  // Le addizionali si applicano se l'IRPEF netta supera 12 €.
  // Fonte: D.Lgs. 446/1997, art. 50 c.2; Circ. AE 3/E/1998.
  sogliaIrpefNetta: 12
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CONTRIBUTI_2026,
    IRPEF_2026,
    DETRAZIONI_2026,
    ADDIZIONALI_2026
  };
}
