(function () {
  'use strict';
  var data = window.DaveScottData;
  var icon = {
    home: '<path d="m3 10 9-7 9 7M5 9v12h14V9M9 21v-7h6v7"/>',
    pin: '<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
    bed: '<path d="M3 18v-8M21 18v-8M3 14h18M5 10h5a2 2 0 0 1 2 2v2H3v-2a2 2 0 0 1 2-2ZM14 10h5a2 2 0 0 1 2 2v2h-9v-2a2 2 0 0 1 2-2ZM3 18v2M21 18v2"/>',
    bath: '<path d="M4 12h16v4a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-4ZM6 12V6a2 2 0 0 1 4 0v1M8 20v1M16 20v1"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    heart: '<path d="M20.8 8.7c0 5.4-8.8 10.3-8.8 10.3S3.2 14.1 3.2 8.7A4.7 4.7 0 0 1 12 6a4.7 4.7 0 0 1 8.8 2.7Z"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.7 6.8-4.4M8.6 13.3l6.8 4.4"/>',
    check: '<path d="m5 12 4 4L19 6"/>'
  };
  function money(property) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency', currency: property.currency || 'USD', maximumFractionDigits: 0
    }).format(property.price);
  }
  function svg(name, size) {
    return '<svg aria-hidden="true" width="' + (size || 18) + '" height="' + (size || 18) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + (icon[name] || icon.home) + '</svg>';
  }
  function getFavorites() {
    try {
      return JSON.parse(localStorage.getItem('daveScottFavorites') || '[]');
    }
    catch (error) {
      return [];
    }
  }
  function toggleFavorite(id) {
    var ids = getFavorites();
    ids = ids.indexOf(id) >= 0 ? ids.filter(function (saved) {
      return saved !== id;
    }) : ids.concat(id);
    try {
      localStorage.setItem('daveScottFavorites', JSON.stringify(ids));
    }
    catch (error) {
      /* Private browsing may disable storage. */
    }
    return ids;
  }
  function photo(image, className) {
    var url = image && image.src ? image.src : 'images/properties/home-placeholder.svg';
    var alt = image && image.alt ? image.alt : 'Mobile home photograph';
    return '<img class="' + (className || '') + '" src="' + url + '" alt="' + alt.replace(/"/g, '&quot;') + '" loading="lazy" onerror="this.onerror=null;this.src=\'images/properties/home-placeholder.svg\'">';
  }
  function header() {
    var active = location.pathname.split('/').pop() || 'index.html';
    return '<div class="site-header"><div class="container nav-row"><a class="brand" href="index.html" aria-label="Dave Scott Mobile Home for Sale home"><span class="brand-mark">' + svg('home', 24) + '</span><span><strong>Dave Scott</strong><small>Mobile Home for Sale</small></span></a><button class="menu-toggle" type="button" aria-label="Open navigation" aria-expanded="false" aria-controls="primary-nav">' + svg('menu', 22) + '</button><nav id="primary-nav" class="nav-links" aria-label="Main navigation"><a ' + (active === 'index.html' ? 'aria-current="page"' : '') + ' href="index.html">Home</a><a ' + (active === 'properties.html' ? 'aria-current="page"' : '') + ' href="properties.html">Browse homes</a><a href="properties.html?transaction=Sale">For sale</a><a href="properties.html?transaction=Rent">For rent</a><a ' + (active === 'about.html' ? 'aria-current="page"' : '') + ' href="about.html">About us</a><a ' + (active === 'faq.html' ? 'aria-current="page"' : '') + ' href="faq.html">FAQs</a><a class="nav-contact" href="contact.html">Contact us ' + svg('arrow', 15) + '</a></nav></div></div>';
  }
  function footer() {
    var year = new Date().getFullYear();
    return '<div class="footer-main container"><div class="footer-about"><a class="brand brand-light" href="index.html"><span class="brand-mark">' + svg('home', 24) + '</span><span><strong>Dave Scott</strong><small>Mobile Home for Sale</small></span></a><p>A friendly place to start your search for a home that fits your life and your budget.</p></div><div><h2>Explore</h2><a href="properties.html">Browse homes</a><a href="about.html">About us</a><a href="faq.html">Frequently asked questions</a></div><div><h2>Get in touch</h2><p>Questions about a home?</p><a class="footer-email" href="mailto:' + data.business.email + '">' + svg('mail', 16) + data.business.email + '</a><a href="contact.html">Send an enquiry ' + svg('arrow', 15) + '</a></div></div><div class="footer-bottom container"><span>© ' + year + ' ' + data.business.name + '</span><span>Demonstration listings shown for illustration.</span></div>';
  }
  function init() {
    var headerTarget = document.getElementById('site-header');
    var footerTarget = document.getElementById('site-footer');
    if (headerTarget) headerTarget.innerHTML = header();
    if (footerTarget) footerTarget.innerHTML = footer();
    var button = document.querySelector('.menu-toggle');
    if (button) button.addEventListener('click', function () {
      var nav = document.getElementById('primary-nav');
      var open = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!open));
      button.setAttribute('aria-label', open ? 'Open navigation' : 'Close navigation');
      button.innerHTML = svg(open ? 'menu' : 'close', 22);
      nav.classList.toggle('is-open', !open);
    });
    document.querySelectorAll('[data-back-to-top]').forEach(function (el) {
      el.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
    });
  }
  window.DaveScottUI = { money: money, svg: svg, photo: photo, getFavorites: getFavorites, toggleFavorite: toggleFavorite };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
}());
