(function () {
  'use strict';
  var emailAddress = 'davescottmobilehomes@gmail.com';
  var subject = 'Property Enquiry \u2013 Dave Scott Mobile Home for Sale';
  var body = [
    'Hello Dave Scott,',
    '',
    'I am interested in learning more about your available mobile homes.',
    '',
    'Please provide me with more information.',
    '',
    'Thank you.'
  ].join('\n');
  var composeUrl = 'https://mail.google.com/mail/?view=cm&fs=1' +
    '&to=' + encodeURIComponent(emailAddress) +
    '&su=' + encodeURIComponent(subject) +
    '&body=' + encodeURIComponent(body);
  var button = document.createElement('a');
  button.className = 'floating-email-button';
  button.href = composeUrl;
  button.target = '_blank';
  button.rel = 'noopener noreferrer';
  button.setAttribute('aria-label', 'Write an email to Dave Scott Mobile Home for Sale');
  button.setAttribute('title', 'Email Us');
  button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
    '<rect x="3" y="5" width="18" height="14" rx="2"></rect>' +
    '<path d="m4 7 8 6 8-6"></path>' +
    '</svg><span class="floating-email-tooltip" role="presentation">Email Us</span>';
  document.body.appendChild(button);
}());
