async function submitForm(e) {
  e.preventDefault();
  
  const response = await fetch('https://contacto.ammonita.cl', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value || "",
      company: document.getElementById('company').value || "",
      message: document.getElementById('message').value
    })
  });
  
  const result = await response.json();
  
  if (result.success) {
    alert('¡Mensaje enviado! Te responderemos a la brevedad.');
  } else {
    alert('Error al enviar el mensaje: ' + result.error);
  }
}