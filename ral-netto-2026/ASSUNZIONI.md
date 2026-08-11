# Assunzioni e limiti del prototipo

Anno d'imposta **2026**. Verifica delle fonti effettuata all'**11/08/2026**.

## Obiettivo

Il prototipo stima la retribuzione netta annuale a partire dalla RAL e mostra anche un netto mensile medio.

L'obiettivo è coprire bene un caso standard, mantenendo il modello abbastanza semplice da essere comprensibile, verificabile e utilizzabile in una demo.

Il calcolo segue questa struttura:

**RAL → contributi previdenziali → imponibile IRPEF → IRPEF lorda → detrazioni → IRPEF netta → addizionali → netto annuo**

---

## Caso standard

Il prototipo assume:

- lavoratore dipendente del settore privato;
- full-time;
- contratto a tempo indeterminato;
- domicilio fiscale a Milano;
- 365 giorni di lavoro nell'anno;
- un solo datore di lavoro;
- nessun familiare a carico;
- nessuna agevolazione particolare;
- nessun altro reddito;
- nessun onere deducibile o detraibile;
- iscrizione previdenziale successiva al 31/12/1995.

Queste assunzioni permettono di limitare il numero di input e mantenere il prototipo focalizzato sulla logica principale del calcolo.

---

# 1. Contributi previdenziali

## Aliquota utilizzata

Il prototipo applica una quota contributiva a carico del lavoratore pari al **9,19%**, corrispondente alla componente IVS del Fondo Pensioni Lavoratori Dipendenti.

La trattenuta effettiva può essere superiore in base a settore e dimensione aziendale, per effetto di componenti contributive aggiuntive come FIS e CIGS.

Il prototipo non richiede queste informazioni come input e mantiene quindi il 9,19% come aliquota ordinaria del caso standard.

**Impatto della semplificazione:** nei casi in cui siano dovute ulteriori componenti a carico del lavoratore, il netto stimato può risultare leggermente superiore a quello effettivo.

## Aliquota aggiuntiva dell'1%

Per il 2026 l'aliquota contributiva aggiuntiva dell'1% viene verificata nella realtà su base mensile rispetto alla soglia di **4.685 €**.

Il prototipo effettua invece una proiezione annuale e utilizza come riferimento **56.224 €**.

Questa semplificazione può produrre differenze rispetto a un cedolino reale quando la retribuzione non è distribuita uniformemente durante l'anno.

## Massimale contributivo

Per il caso standard viene applicato il massimale contributivo di **122.295 €**, previsto per i lavoratori iscritti a forme pensionistiche obbligatorie dopo il 31/12/1995.

## Minimale contributivo

Il minimale contributivo non è implementato.

Il riferimento utilizzato per il 2026 è **58,13 € al giorno × 312 giornate convenzionali = 18.136,56 € annui**.

Sotto questa soglia il risultato del prototipo può sovrastimare il netto. In questa fascia viene mostrato un avviso.

## Altri casi esclusi

Il modello non gestisce:

- più rapporti di lavoro;
- part-time;
- apprendistato;
- Gestione pubblica;
- contributi specifici per sport e spettacolo;
- casistiche previdenziali precedenti al 1996.

---

# 2. Imponibile fiscale e IRPEF

Nel caso standard:

**imponibile IRPEF = RAL − contributi previdenziali obbligatori**

Non vengono considerati altri redditi o oneri deducibili.

## Scaglioni IRPEF 2026

Il prototipo utilizza:

- **23%**
- **33%**
- **43%**

Il modello 730/2026 riguarda i redditi prodotti nel 2025, quindi non rappresenta direttamente l'anno d'imposta utilizzato dal prototipo.

---

# 3. Detrazioni e misure sul lavoro dipendente

Il prototipo applica le detrazioni previste dall'art. 13 TUIR.

In sintesi:

- **1.955 €** fino a 15.000 € di reddito complessivo;
- detrazione progressivamente decrescente nelle fasce successive;
- azzeramento a 50.000 €;
- maggiorazione di **65 €** tra 25.000 € e 35.000 €.

Il codice contiene anche i minimi previsti dall'art. 13 (**690 €** e **1.380 € per il tempo determinato**). Nel caso standard, a tempo indeterminato e con 365 giorni lavorati, non modificano il risultato.

## Troncamento dei rapporti

I rapporti presenti nelle formule di detrazione vengono **troncati alla quarta cifra decimale**.

Esempio:

`0,00247 → 0,0024`

Il codice gestisce anche i piccoli errori di rappresentazione floating point prima di eseguire il troncamento.

## Ulteriore detrazione

La misura prevista dalla L. 207/2024 è pari a **1.000 €** tra 20.000 € e 32.000 € di reddito e diminuisce fino ad azzerarsi a 40.000 €.

Essendo una detrazione, viene applicata nei limiti dell'IRPEF lorda disponibile.

## Somma integrativa

Per redditi complessivi fino a **20.000 €** può spettare una somma aggiuntiva.

La soglia di accesso viene verificata sul **reddito complessivo**; percentuale e base di calcolo fanno invece riferimento al **reddito di lavoro dipendente**.

Nel caso standard le due grandezze coincidono.

## Capienza

Le detrazioni vengono applicate fino a concorrenza dell'imposta lorda.

L'IRPEF netta non può quindi diventare negativa.

---

# 4. Addizionale regionale Lombardia

Il prototipo utilizza le aliquote regionali vigenti per la Lombardia:

| Fascia di reddito | Aliquota |
|---|---:|
| fino a 15.000 € | 1,23% |
| 15.001 – 28.000 € | 1,58% |
| 28.001 – 50.000 € | 1,72% |
| oltre 50.000 € | 1,73% |

Gli scaglioni regionali sono gestiti separatamente da quelli IRPEF.

La base di calcolo coincide, nel caso standard, con il reddito complessivo prima delle detrazioni.

## Condizione di applicazione

Il prototipo applica le addizionali quando l'IRPEF netta supera **12 €**, secondo il criterio utilizzato nella Circolare Agenzia delle Entrate 3/E/1998.

---

# 5. Addizionale comunale di Milano

Il prototipo utilizza:

- aliquota comunale **0,80%**;
- esenzione fino a **23.000 €** di reddito imponibile.

Superata la soglia, l'aliquota viene applicata all'intero imponibile.

Questo produce una discontinuità nel netto in prossimità della soglia.

## Dato utilizzato per il 2026

Alla data di verifica, la banca dati del Dipartimento delle Finanze non riportava una nuova delibera del Comune di Milano per l'addizionale comunale IRPEF 2026.

Il prototipo mantiene quindi i parametri dell'anno precedente sulla base della disciplina di proroga prevista dalla **L. 296/2006, art. 1, c. 169**.

Questo parametro va riverificato prima di un utilizzo futuro del calcolatore, perché una nuova delibera può modificare aliquota o soglia di esenzione.

---

# 6. Netto annuale e netto mensile medio

Il netto annuale viene ottenuto sottraendo dalla RAL:

- contributi previdenziali;
- IRPEF netta;
- addizionale regionale;
- addizionale comunale.

Le eventuali somme integrative previste dalla normativa vengono aggiunte al risultato quando applicabili.

## Convenzione di visualizzazione

Il motore calcola il **netto annuale**.

Per rendere il risultato più immediato, l'interfaccia mostra anche un netto mensile medio calcolato come:

**netto annuo / 13**

Il divisore 13 è una **convenzione di visualizzazione del prototipo** e non un'assunzione fiscale o contrattuale sul lavoratore.

Il modello non simula la distribuzione reale della retribuzione e delle trattenute nei singoli cedolini. Di conseguenza, il valore mensile mostrato va interpretato come media indicativa.

---

# 7. Principali semplificazioni

Le semplificazioni che possono incidere maggiormente sul risultato sono:

1. **Contributi:** il modello utilizza il 9,19% come aliquota ordinaria e non differenzia settore e dimensione aziendale.
2. **Calcolo annuale:** alcune regole previdenziali vengono applicate nella realtà mese per mese.
3. **Addizionale Milano 2026:** viene mantenuto il parametro precedente finché non risulta una nuova delibera nella banca dati MEF.
4. **Caso personale semplice:** familiari, bonus, welfare, previdenza complementare e altre situazioni individuali sono escluse.
5. **Cedolino:** il risultato è una proiezione annuale e non replica conguagli, acconti o distribuzione mensile delle trattenute.
6. **Netto mensile:** il valore mostrato è una media convenzionale ottenuta dividendo il netto annuo per 13.

---

# 8. Elementi esclusi dal prototipo

Per mantenere il perimetro gestibile non vengono modellati:

- familiari a carico;
- altri redditi;
- oneri deducibili e detraibili;
- previdenza complementare;
- casse sanitarie;
- fringe benefit;
- buoni pasto;
- rimborsi trasferta;
- premi di risultato;
- welfare aziendale;
- imposte sostitutive su componenti specifiche della retribuzione;
- più rapporti di lavoro;
- part-time;
- apprendistato;
- conguagli e recuperi rateizzati;
- distribuzione reale delle mensilità;
- costo complessivo per il datore di lavoro.

---

# 9. Fonti principali

La ricerca è stata effettuata principalmente su fonti istituzionali.

### INPS

Utilizzato per aliquote contributive, aliquota aggiuntiva dell'1%, massimale, minimale e altre regole previdenziali applicabili al caso standard.

### Normattiva

Utilizzata per verificare il testo vigente delle norme, in particolare TUIR, normativa previdenziale, Leggi di Bilancio e disciplina delle addizionali.

### Dipartimento delle Finanze / MEF

Utilizzato per aliquote e delibere relative all'addizionale comunale e per verificare i parametri applicabili al Comune di Milano.

Alcuni controlli puntuali sono stati effettuati anche sulla documentazione dell'Agenzia delle Entrate e su fonti regionali o comunali.

L'obiettivo della ricerca è stato verificare da fonti primarie i parametri che incidono direttamente sul calcolo, senza costruire una bibliografia esaustiva.

---

# 10. Limite del risultato

Il prototipo punta a **calcolare correttamente un caso standard e a rendere chiare le semplificazioni adottate**.

Il risultato è una stima e non sostituisce un cedolino elaborato da un payroll specialist.
