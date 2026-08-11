const form = document.getElementById('calculator-form');
const ralInput = document.getElementById('ral');
const results = document.getElementById('results');
const message = document.getElementById('message');

const money = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

const percent = new Intl.NumberFormat('it-IT', {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1
});

function setText(id, value) {
  document.getElementById(id).textContent = value;
}

function showMessage(validazione) {
  if (!validazione || validazione.tipo === 'ok') {
    message.hidden = true;
    message.className = 'message';
    message.textContent = '';
    return;
  }

  message.hidden = false;
  message.className =
    validazione.tipo === 'errore'
      ? 'message error'
      : 'message warning';
  message.textContent = validazione.messaggio;
}

function render(result) {
  const tasse = result.irpef.netta + result.addizionali.totale;

  setText('netto-annuo', money.format(result.nettoAnnuo));
  setText('netto-mensile', money.format(result.nettoMensile));
  setText('tasse-totali', money.format(tasse));
  setText('contributi-totali', money.format(result.contributi.totale));
  setText('aliquota-effettiva', `Prelievo effettivo ${percent.format(result.aliquotaEffettiva)}`);
 setText('row-inps-aggiuntivo', `− ${money.format(result.contributi.aggiuntivo)}`);

document.getElementById('inps-aggiuntivo-row').hidden =
  result.contributi.aggiuntivo === 0;
  setText('row-ral', money.format(result.input.ral));
  setText('row-contributi', `− ${money.format(result.contributi.totale)}`);
  setText('row-imponibile', money.format(result.imponibile));
  setText('row-irpef-lorda', money.format(result.irpef.lorda));
  setText('row-detrazioni', `− ${money.format(result.irpef.detrazioniTotali)}`);
  setText('row-irpef-netta', `− ${money.format(result.irpef.netta)}`);
  setText('row-regionale', `− ${money.format(result.addizionali.regionale)}`);
  setText('row-comunale', `− ${money.format(result.addizionali.comunale)}`);
  setText('row-somma', `+ ${money.format(result.sommaIntegrativa)}`);
  setText('row-netto', money.format(result.nettoAnnuo));

  document.getElementById('somma-row').hidden = result.sommaIntegrativa === 0;
  results.hidden = false;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const ral = Number(ralInput.value);
  const result = calcolaNetto(ral);

  showMessage(result.validazione);

  if (!result.ok) {
    results.hidden = true;
    ralInput.focus();
    return;
  }

  render(result);
});

ralInput.addEventListener('input', () => {
  if (!message.hidden && Number(ralInput.value) > 0) {
    message.hidden = true;
  }
});
