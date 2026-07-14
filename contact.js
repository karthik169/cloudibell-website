/* =========================================================
   Cloudibell Tech — Contact form (Web3Forms, no backend)
   Free, no account/card required. Get your access key at
   https://web3forms.com — replace the value below.
   ========================================================= */
(function () {
  'use strict';

  // ---- Replace with your own Web3Forms access key ----
  const WEB3FORMS_ACCESS_KEY = '2f1dc609-4c6f-4ef8-ad20-1455e50efd1b';
  // ------------------------------------------------------

  const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

  const form = document.getElementById('contactForm');
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  const submitBtnDefaultText = submitBtn ? submitBtn.textContent : 'Send message';

  // Status message element — created once, reused on every submit.
  let statusEl = form.querySelector('.form-status');
  if (!statusEl) {
    statusEl = document.createElement('p');
    statusEl.className = 'form-status';
    statusEl.setAttribute('role', 'status');
    statusEl.setAttribute('aria-live', 'polite');
    form.appendChild(statusEl);
  }

  function setStatus(kind, text) {
    statusEl.textContent = text;
    statusEl.classList.remove('form-status--success', 'form-status--error');
    if (kind) statusEl.classList.add('form-status--' + kind);
  }

  function setLoading(isLoading) {
    if (!submitBtn) return;
    submitBtn.disabled = isLoading;
    submitBtn.textContent = isLoading ? 'Sending…' : submitBtnDefaultText;
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    setStatus(null, '');
    setLoading(true);

    const nameField = form.querySelector('#name');
    const emailField = form.querySelector('#email');
    const messageField = form.querySelector('#message');

    const payload = {
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: 'New contact form submission — Cloudibell Tech',
      from_name: nameField ? nameField.value.trim() : '',
      name: nameField ? nameField.value.trim() : '',
      email: emailField ? emailField.value.trim() : '',
      message: messageField ? messageField.value.trim() : ''
    };

    fetch(WEB3FORMS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (response) { return response.json(); })
      .then(function (data) {
        if (data.success) {
          setStatus('success', 'Thanks — your message is on its way. We\'ll get back to you within one business day.');
          form.reset();
        } else {
          throw new Error(data.message || 'Submission failed');
        }
      })
      .catch(function (error) {
        console.error('Web3Forms error:', error);
        setStatus('error', 'Something went wrong sending your message. Please email hello@cloudibelltech.com directly, or try again.');
      })
      .finally(function () {
        setLoading(false);
      });
  });
})();