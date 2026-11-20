(function () {
  'use strict';
  var form = document.getElementById('contact-form');
  if (!form) return;
  var kind = document.getElementById('contact-kind');
  var property = document.getElementById('contact-property');
  var viewing = document.getElementById('viewing-fields');
  var success = document.getElementById('form-success');
  var params = new URLSearchParams(window.location.search);
  if (params.has('property')) property.value = params.get('property');
  if (params.get('kind') === 'viewing') kind.value = 'Viewing request';
  else if (params.get('kind') === 'enquiry') kind.value = 'Home enquiry';
  function updateKind() {
    viewing.hidden = kind.value !== 'Viewing request';
  }
  kind.addEventListener('change', updateKind);
  updateKind();
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!form.reportValidity()) return;
    var values = new FormData(form);
    var subject = String(values.get('kind') || 'General question') + (values.get('property') ? ' — ' + values.get('property') : '');
    var body = [
      'Name: ' + values.get('name'),
      'Email: ' + values.get('email'),
      'Phone: ' + (values.get('phone') || 'Not provided'),
      'Property: ' + (values.get('property') || 'General enquiry'),
      'Request: ' + values.get('kind'),
      values.get('date') ? 'Preferred date: ' + values.get('date') : '',
      values.get('time') ? 'Preferred time: ' + values.get('time') : '',
      '',
      'Message: ' + (values.get('message') || 'I would like to learn more.')
    ].filter(Boolean).join('\n');
    var mailto = 'mailto:' + window.DaveScottData.business.email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    success.hidden = false;
    success.scrollIntoView( {
      behavior: 'smooth', block: 'nearest'
    });
    window.location.href = mailto;
  });
}());
