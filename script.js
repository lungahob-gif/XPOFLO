document.getElementById('year').textContent = new Date().getFullYear();

const form = document.getElementById('demoForm');
const message = document.getElementById('formMessage');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = document.getElementById('email').value.trim();
  if (!email) return;

  message.textContent = `Thanks — we’ll use ${email} for the demo follow-up.`;
  message.style.color = '#8ebfa9';
  form.querySelector('button').textContent = 'Request received ✓';
});
