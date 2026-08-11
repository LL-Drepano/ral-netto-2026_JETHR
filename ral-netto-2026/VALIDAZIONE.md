# Validazione del calcolatore

Verifica effettuata l'**11/08/2026**.

## Obiettivo

Il confronto con calcolatori pubblici serve come **test di coerenza**, non come prova di correttezza assoluta: strumenti diversi possono usare ipotesi differenti su addizionali, detrazioni, contributi e mensilità.

Per rendere il confronto leggibile ho usato quattro RAL che attraversano punti diversi del modello:

- **25.000 €** — imponibile sotto la soglia di esenzione comunale di Milano;
- **30.000 €** — detrazione lavoro dipendente + maggiorazione di 65 € + ulteriore detrazione piena;
- **40.000 €** — secondo scaglione IRPEF e ulteriore detrazione in fase di riduzione;
- **60.000 €** — terzo scaglione IRPEF e aliquota contributiva aggiuntiva dell'1%.

Scenario del prototipo: dipendente privato standard, Milano, nessun familiare o altra agevolazione, 13 mensilità.

---

## Risultati del prototipo

| RAL | Netto annuo | Netto medio / 13 | Contributi | IRPEF netta | Addizionali |
|---:|---:|---:|---:|---:|---:|
| 25.000 € | 20.569,65 € | 1.582,28 € | 2.297,50 € | 1.826,65 € | 306,20 € |
| 30.000 € | 23.425,48 € | 1.801,96 € | 2.757,00 € | 3.221,63 € | 595,88 € |
| 40.000 € | 27.960,17 € | 2.150,78 € | 3.676,00 € | 7.540,16 € | 823,66 € |
| 60.000 € | 37.554,66 € | 2.888,82 € | 5.551,76 € | 15.612,74 € | 1.280,84 € |

---

## Confronto con calcolatori pubblici

Scarto = risultato del prototipo − risultato pubblicato.

| RAL | Prototipo | CalcoloNetto.it | Scarto | RalToNetto.it | Scarto | nettoo.it | Scarto |
|---:|---:|---:|---:|---:|---:|---:|---:|
| 25.000 € | 20.569,65 € | 20.388 € | +0,89% | 20.392 € | +0,87% | 19.301 € | +6,57% |
| 30.000 € | 23.425,48 € | 23.426 € | −0,00% | 23.441 € | −0,07% | 22.267 € | +5,20% |
| 40.000 € | 27.960,17 € | 27.960 € | +0,00% | 28.010 € | −0,18% | 27.405 € | +2,03% |
| 60.000 € | 37.554,66 € | 37.555 € | −0,00% | 37.671 € | −0,31% | 37.479 € | +0,20% |

### Fonti di confronto

- CalcoloNetto.it  
  https://www.calcolonetto.it/
- RalToNetto.it  
  https://raltonetto.it/
- nettoo.it  
  https://www.nettoo.it/ral

---

## Lettura degli scarti

### CalcoloNetto.it

A **30.000 €, 40.000 € e 60.000 €** il risultato coincide sostanzialmente con il prototipo, anche nel dettaglio delle principali voci.

A **25.000 €** compare invece uno scarto di circa **182 € annui**.

La causa è identificabile nell'addizionale comunale:

- imponibile del prototipo: **22.702,50 €**;
- soglia di esenzione usata per Milano: **23.000 €**;
- addizionale comunale del prototipo: **0 €**;
- CalcoloNetto applica nel proprio scenario standard una comunale stimata dello **0,8%**, pari a circa **182 €**.

Lo scarto è quindi coerente con una diversa gestione dell'esenzione comunale e non con una differenza nel calcolo IRPEF.

### RalToNetto.it

Gli scarti restano entro circa **0,3%**.

Le differenze sono principalmente nelle addizionali. Il sito, nelle pagine pubbliche usate per il confronto:

- applica alla Lombardia un'aliquota regionale rappresentativa del **1,73%**;
- usa di default un'addizionale comunale media dello **0,40%**.

Il prototipo utilizza invece gli **scaglioni progressivi regionali della Lombardia** e per Milano applica **0,80% con esenzione fino a 23.000 €**.

Per questo il confronto è molto vicino sul netto complessivo, ma non identico voce per voce.

### nettoo.it

La divergenza è maggiore nelle RAL **25.000–40.000 €** e si riduce quasi completamente a **60.000 €**.

I valori pubblicati sono numericamente coerenti con una diversa gestione delle misure di riduzione del cuneo fiscale:

- a 25.000 € lo scarto è vicino a **1.000 € + differenza nelle addizionali**;
- a 30.000 € è vicino a **1.000 € + maggiorazione art. 13 di 65 € + differenza nelle addizionali**;
- a 40.000 € è vicino all'**ulteriore detrazione residua (~460 €) + differenza nelle addizionali**;
- a 60.000 € queste detrazioni non spettano più e lo scarto scende a circa **0,2%**.

Inoltre, a 60.000 € il sito pubblica contributi pari a circa **9,19% della RAL**, mentre il prototipo aggiunge anche l'**1% sulla quota oltre 56.224 €**.

Questa lettura è un'inferenza dai risultati pubblicati: non viene usata come fonte normativa.

---

## Conclusione

Il confronto non evidenzia anomalie strutturali nel motore.

Il riferimento più vicino, CalcoloNetto.it, produce risultati praticamente identici in tre casi su quattro. Nel quarto caso la differenza è spiegabile quasi integralmente con l'esenzione dell'addizionale comunale di Milano.

Gli altri strumenti mostrano che le differenze tra calcolatori pubblici dipendono soprattutto da:

1. modalità di calcolo delle addizionali regionali e comunali;
2. applicazione delle misure 2026 di riduzione del cuneo fiscale;
3. aliquota contributiva aggiuntiva dell'1%;
4. ipotesi usate per mensilità e situazione personale.

Il prototipo espone queste scelte in `ASSUNZIONI.md`, così gli scarti possono essere ricondotti a ipotesi verificabili invece di essere nascosti.

---

## Nota sulle mensilità

Prima della consegna va resa coerente una scelta di perimetro.

Il **CCNL Terziario/Commercio prevede tredicesima e quattordicesima**. Se il prototipo continua a mostrare il netto medio su **13 mensilità**, è preferibile descrivere il caso come **dipendente privato standard** senza associare il calcolo a quel CCNL specifico.

Il netto annuo non cambia: cambia soltanto il divisore usato per mostrare il netto mensile.
