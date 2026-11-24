(function () {
  'use strict';
  var list = document.getElementById('faq-list');
  if (!list) return;
  list.querySelectorAll('.faq-item > h2 > button').forEach(function (button) {
    button.addEventListener('click', function () {
      var open = button.getAttribute('aria-expanded') === 'true';
      var panel = document.getElementById(button.getAttribute('aria-controls'));
      button.setAttribute('aria-expanded', String(!open));
      button.querySelector('span').textContent = open ? '+' : '−';
      panel.hidden = open;
    });
  });
}());
