document.getElementById('create-config-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const payload = {
    redirectURL: form.redirectURL.value,
    webhookURL: form.webhookURL.value,
    webhookSecurity: {
      type: form.webhookType.value,
      hash: form.webhookHash.value,
    },
    processPayment: form.processPayment.value,
    generateTxIdForInic: form.generateTxIdForInic.checked,
  };

  try {
    const resp = await fetch('/internal/configuration', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const json = await resp.json();

    if (resp.ok) {
      console.log('entrou2');
      alert(`Config criada! ID: ${json.configId}`);
    } else {
      console.log('entrou3');
      throw new Error(json.error || 'Erro desconhecido');
    }
  } catch (err) {
    alert(`Falha: ${err.message}`);
  }
});
