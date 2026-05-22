/**
 * Contact form handling — content-driven messages
 *  - Basic validation (required fields)
 *  - Simulated submission (mock endpoint)
 *  - State updates: Submitting → Success / Error
 */
(function() {
  var form = document.getElementById('quoteForm');
  if (!form) return;

  var submitBtn = document.getElementById('submitBtn');

  // Helper: get localized state message from content, with fallback
  function getStateMessage(key) {
    if (window.apexContent && typeof window.apexContent.get === 'function') {
      var val = window.apexContent.get('home.contactCta.states.' + key);
      if (val) return val;
    }
    // Fallback defaults
    var defaults = {
      submitting: 'Sending...',
      success: 'Enquiry received. We\'ll respond within 4 hours.',
      error: 'Something went wrong. Please WhatsApp us directly.'
    };
    return defaults[key] || '';
  }

  // Status display (create if missing)
  var statusEl = document.getElementById('formStatus');
  var messageEl = document.getElementById('formMessage');
  if (!statusEl) {
    statusEl = document.createElement('div');
    statusEl.id = 'formStatus';
    statusEl.style.display = 'none';
    statusEl.style.marginTop = 'var(--space-4)';
    messageEl = document.createElement('p');
    statusEl.appendChild(messageEl);
    form.appendChild(statusEl);
  }

  function setStatus(msg, isError) {
    statusEl.style.display = 'block';
    messageEl.textContent = msg;
    messageEl.style.color = isError ? 'var(--apex-error)' : 'var(--apex-success)';
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Basic validation (HTML required handles most)
    if (!form.checkValidity()) {
      setStatus('Please fill in all required fields.', true);
      return;
    }

    // Capture current button label to restore later
    var originalLabel = submitBtn.textContent;

    // Set submitting state
    submitBtn.disabled = true;
    submitBtn.setAttribute('aria-busy', 'true');
    submitBtn.textContent = getStateMessage('submitting');
    setStatus(''); // clear

    // Gather form data
    var data = {
      name: form.name.value,
      company: form.company.value,
      phone: form.phone.value,
      origin: form.origin.value,
      destination: form.destination.value,
      cargo: form.cargo.value
    };

    // Mock API call — replace URL with real endpoint before launch
    fetch('/api/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(function(resp) {
      // Simulate network delay for demo
      return new Promise(function(resolve) {
        setTimeout(function() { resolve({ ok: true }); }, 1200);
      });
      // Real: return resp.json();
    })
    .then(function(json) {
      setStatus(getStateMessage('success'), false);
      form.reset();
    })
    .catch(function(err) {
      setStatus(getStateMessage('error'), true);
    })
    .finally(function() {
      submitBtn.disabled = false;
      submitBtn.removeAttribute('aria-busy');
      submitBtn.textContent = originalLabel;
    });
  });

  // Clear errors on input
  form.querySelectorAll('input, textarea, select').forEach(function(el) {
    el.addEventListener('input', function() {
      if (statusEl.style.display !== 'none') {
        statusEl.style.display = 'none';
      }
    });
  });
})();
