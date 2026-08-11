# RAL → Netto 2026

Prototipo di calcolatore della retribuzione netta per un lavoratore dipendente in Italia.

L'utente inserisce una **RAL** e ottiene una proiezione di:

- netto annuale;
- netto mensile medio;
- contributi previdenziali;
- IRPEF lorda e netta;
- detrazioni;
- addizionale regionale;
- addizionale comunale.

## Come funziona

1. La RAL viene usata per calcolare i contributi previdenziali.
2. I contributi vengono sottratti dalla RAL per ottenere l'imponibile IRPEF.
3. Si calcola l'IRPEF lorda per scaglioni.
4. Si applicano detrazioni e misure sul lavoro dipendente.
5. Si calcolano addizionale regionale Lombardia e comunale Milano.
6. Si ottengono netto annuo e netto mensile medio.

`RAL → contributi → imponibile → IRPEF → detrazioni → addizionali → netto`

## Caso considerato

Il prototipo assume:

- lavoratore dipendente del settore privato;
- full-time;
- tempo indeterminato;
- domicilio fiscale a Milano;
- 365 giorni di lavoro;
- un solo datore di lavoro;
- nessun familiare a carico;
- nessun altro reddito;
- nessun onere deducibile o detraibile;
- iscrizione previdenziale successiva al 31/12/1995.

Il **netto mensile medio** è una convenzione di visualizzazione: `netto annuo / 13`.

## Struttura

- `index.html` — pagina del calcolatore
- `style.css` — stile
- `app.js` — collegamento tra interfaccia e motore
- `parametri2026.js` — aliquote, soglie e valori numerici
- `calcolo.js` — logica di calcolo
- `ASSUNZIONI.md` — assunzioni, semplificazioni e limiti
- `VALIDAZIONE.md` — confronto con calcolatori pubblici

## Validazione

Il motore è stato confrontato su quattro RAL con tre calcolatori pubblici 2026.

| RAL | Prototipo | CalcoloNetto | RalToNetto | nettoo |
|---:|---:|---:|---:|---:|
| 25.000 € | 20.569,65 € | 20.388 € | 20.392 € | 19.301 € |
| 30.000 € | 23.425,48 € | 23.426 € | 23.441 € | 22.267 € |
| 40.000 € | 27.960,17 € | 27.960 € | 28.010 € | 27.405 € |
| 60.000 € | 37.554,66 € | 37.555 € | 37.671 € | 37.479 € |

Su 30k, 40k e 60k il risultato coincide sostanzialmente con il riferimento più vicino. Gli scarti sugli altri strumenti sono riconducibili soprattutto a diverse ipotesi sulle addizionali locali e sulle misure di riduzione del cuneo fiscale.

Il caso 25k evidenzia l'effetto dell'esenzione comunale di Milano applicata dal prototipo.

Dettagli: [`VALIDAZIONE.md`](./VALIDAZIONE.md).

## Principali fonti

- **INPS** — aliquote contributive, minimale, prima fascia pensionabile e massimale  
  https://www.inps.it/
- **Normattiva** — TUIR e normativa vigente  
  https://www.normattiva.it/
- **Dipartimento delle Finanze / MEF** — addizionale comunale e delibere  
  https://www1.finanze.gov.it/
- **Regione Lombardia** — addizionale regionale IRPEF  
  https://www.regione.lombardia.it/
- **Agenzia delle Entrate** — controlli puntuali sulle formule e documentazione 730  
  https://www.agenziaentrate.gov.it/

## Limiti principali

Il prototipo è una stima annuale per un caso standard. In particolare:

- usa il 9,19% come aliquota contributiva ordinaria;
- annualizza il controllo dell'aliquota INPS aggiuntiva dell'1%;
- segnala ma non applica il minimale contributivo;
- non gestisce familiari, altri redditi, welfare o oneri personali;
- non simula il cedolino mese per mese;
- il parametro comunale di Milano va riverificato in caso di nuove delibere.

Dettagli: [`ASSUNZIONI.md`](./ASSUNZIONI.md).

## Test rapido

Per verificare il motore, provare almeno:

- 25.000 €
- 30.000 €
- 40.000 €
- 60.000 €

Netti annuali attesi:

- 25k → **20.569,65 €**
- 30k → **23.425,48 €**
- 40k → **27.960,17 €**
- 60k → **37.554,66 €**

## Disclaimer

Prototipo dimostrativo. Il risultato è una stima e non sostituisce un cedolino, un software payroll o una consulenza fiscale/previdenziale.
