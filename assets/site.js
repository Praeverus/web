// Replaces the interactive bits of the original React landing page:
// the mobile navigation toggle and the demo-request form.
(function () {
  var ARROW_RIGHT = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>';
  var MENU = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-menu" aria-hidden="true"><path d="M4 5h16"></path><path d="M4 12h16"></path><path d="M4 19h16"></path></svg>';
  var CLOSE = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>';

  // Mobile navigation
  var toggle = document.querySelector('.mp-menu-toggle');
  var header = document.querySelector('.mp-header');
  var desktopNav = document.querySelector('.mp-desktop-nav');
  if (toggle && header && desktopNav) {
    var mobileNav = document.createElement('nav');
    mobileNav.id = 'marketing-mobile-nav';
    mobileNav.className = 'mp-mobile-nav';
    mobileNav.setAttribute('aria-label', 'Mobile navigation');
    mobileNav.hidden = true;
    desktopNav.querySelectorAll('a').forEach(function (link) {
      var a = document.createElement('a');
      a.href = link.getAttribute('href');
      a.innerHTML = link.textContent + ARROW_RIGHT;
      a.addEventListener('click', function () { setOpen(false); });
      mobileNav.appendChild(a);
    });
    header.appendChild(mobileNav);

    function setOpen(open) {
      mobileNav.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      toggle.innerHTML = open ? CLOSE : MENU;
    }
    toggle.addEventListener('click', function () {
      setOpen(mobileNav.hidden);
    });
  }

  // Demo request form (Formspree)
  var form = document.getElementById('demoForm');
  if (form) {
    var button = form.querySelector('button[type="submit"]');
    var buttonHtml = button.innerHTML;
    var errorEl = document.createElement('p');
    errorEl.className = 'mp-form-error';
    errorEl.setAttribute('role', 'alert');
    errorEl.hidden = true;
    form.insertBefore(errorEl, button);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      errorEl.hidden = true;
      button.disabled = true;
      button.innerHTML = buttonHtml.replace('Request a Demo', 'Submitting…');

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      }).then(function (res) {
        if (!res.ok) throw new Error('Request failed');
        var done = document.createElement('div');
        done.className = 'mp-form';
        done.innerHTML = '<p class="mp-form-status" role="status">Thank you — your demo request has been received. Our team will contact you shortly.</p>';
        form.replaceWith(done);
      }).catch(function () {
        errorEl.textContent = "We couldn't submit your request. Please check your details and try again, or email demo@praeverus.com.";
        errorEl.hidden = false;
        button.disabled = false;
        button.innerHTML = buttonHtml;
      });
    });
  }
})();
