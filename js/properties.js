(function () {
  'use strict';
  var data = window.DaveScottData;
  var ui = window.DaveScottUI;

  function inquiryUrl(property, kind) {
    return 'contact.html?property=' + encodeURIComponent(property.title) + '&kind=' + (kind || 'enquiry');
  }

  function facts(property) {
    var items = [];
    if (property.bedrooms) items.push('<span>' + ui.svg('bed', 17) + property.bedrooms + ' bedrooms</span>');
    if (property.bathrooms) items.push('<span>' + ui.svg('bath', 17) + property.bathrooms + ' bathrooms</span>');
    return items.length ? '<div class="card-specs">' + items.join('') + '</div>' : '';
  }

  function card(property) {
    var saved = ui.getFavorites().indexOf(property.id) >= 0;
    var type = property.type ? '<span class="card-type">' + property.type + '</span>' : '';
    return '<article class="property-card">' +
      '<a class="card-image-link" href="property-details.html?id=' + encodeURIComponent(property.id) + '" aria-label="View ' + property.title + '">' + ui.photo(property.images[0], 'card-image') + (property.photoNote ? '<span class="photo-note">' + property.photoNote + '</span>' : '') + '</a>' +
      '<button class="favorite-button ' + (saved ? 'is-saved' : '') + '" type="button" data-favorite="' + property.id + '" aria-label="' + (saved ? 'Remove saved home' : 'Save home') + '" aria-pressed="' + saved + '">' + ui.svg('heart', 19) + '</button>' +
      '<div class="card-body">' + type + '<h3><a href="property-details.html?id=' + encodeURIComponent(property.id) + '">' + property.title + '</a></h3>' +
      '<p class="property-card-description">' + property.description + '</p>' + facts(property) +
      '<div class="property-card-actions"><a class="button button-primary" href="' + inquiryUrl(property, 'enquiry') + '">Enquire about this home</a>' +
      '<a class="button button-secondary" href="property-details.html?id=' + encodeURIComponent(property.id) + '">View details</a></div></div></article>';
  }

  function bindFavorites(root) {
    root.querySelectorAll('[data-favorite]').forEach(function (button) {
      button.addEventListener('click', function () {
        var id = button.getAttribute('data-favorite');
        ui.toggleFavorite(id);
        var saved = ui.getFavorites().indexOf(id) >= 0;
        button.classList.toggle('is-saved', saved);
        button.setAttribute('aria-pressed', String(saved));
        button.setAttribute('aria-label', saved ? 'Remove saved home' : 'Save home');
      });
    });
  }

  function initHome() {
    var grid = document.getElementById('featured-grid');
    var form = document.getElementById('home-search');
    if (grid) {
      grid.innerHTML = data.properties.slice(0, 3).map(card).join('');
      bindFavorites(grid);
    }
    if (form) form.addEventListener('submit', function (event) {
      event.preventDefault();
      var query = new URLSearchParams(new FormData(form));
      window.location.href = 'properties.html?' + query.toString();
    });
  }

  function initBrowse() {
    var form = document.getElementById('property-filters');
    var grid = document.getElementById('property-grid');
    if (!form || !grid) return;
    var params = new URLSearchParams(window.location.search);
    ['q', 'type', 'bedrooms', 'bathrooms'].forEach(function (name) {
      var input = form.elements[name];
      if (input && params.has(name)) input.value = params.get(name);
    });
    var sort = document.getElementById('sort-properties');
    var count = document.getElementById('results-count');
    var empty = document.getElementById('no-results');
    function render() {
      var values = new FormData(form);
      var q = String(values.get('q') || '').trim().toLowerCase();
      var type = values.get('type');
      var beds = Number(values.get('bedrooms') || 0);
      var baths = Number(values.get('bathrooms') || 0);
      var matches = data.properties.filter(function (property) {
        var text = [property.title, property.type || '', property.description].join(' ').toLowerCase();
        return (!q || text.includes(q)) && (!type || property.type === type) &&
          (!beds || (property.bedrooms && property.bedrooms >= beds)) &&
          (!baths || (property.bathrooms && property.bathrooms >= baths));
      });
      matches.sort(function (a, b) {
        var order = a.title.localeCompare(b.title);
        return sort.value === 'title-desc' ? -order : order;
      });
      count.textContent = matches.length + (matches.length === 1 ? ' home to explore' : ' homes to explore');
      grid.innerHTML = matches.map(card).join('');
      empty.hidden = matches.length !== 0;
      grid.hidden = matches.length === 0;
      bindFavorites(grid);
    }
    form.addEventListener('input', render);
    form.addEventListener('change', render);
    sort.addEventListener('change', render);
    function reset() { form.reset(); sort.value = 'title-asc'; render(); }
    document.getElementById('clear-filters').addEventListener('click', reset);
    document.getElementById('empty-reset').addEventListener('click', reset);
    render();
  }

  function initDetails() {
    var target = document.getElementById('property-detail');
    if (!target) return;
    var id = new URLSearchParams(window.location.search).get('id');
    var property = data.properties.find(function (item) { return item.id === id; });
    if (!property) {
      target.innerHTML = '<div class="detail-not-found"><span class="eyebrow">HOME NOT FOUND</span><h1>We couldn’t find that home.</h1><p>Check the property link or browse the available homes.</p><a class="button button-primary" href="properties.html">Browse homes <span>→</span></a></div>';
      return;
    }
    document.title = property.title + ' | Dave Scott Mobile Home for Sale';
    var saved = ui.getFavorites().indexOf(property.id) >= 0;
    var specs = [];
    if (property.bedrooms) specs.push('<div>' + ui.svg('bed') + '<b>' + property.bedrooms + '</b><span>Bedrooms</span></div>');
    if (property.bathrooms) specs.push('<div>' + ui.svg('bath') + '<b>' + property.bathrooms + '</b><span>Bathrooms</span></div>');
    if (property.type) specs.push('<div>' + ui.svg('home') + '<b>' + property.type + '</b><span>Home type</span></div>');
    var specStrip = specs.length ? '<div class="spec-strip detail-spec-strip">' + specs.join('') + '</div>' : '';
    var features = property.features && property.features.length
      ? '<section class="detail-section"><h2>Home features</h2><ul class="amenities-list">' + property.features.map(function (item) { return '<li><span>✓</span>' + item + '</li>'; }).join('') + '</ul></section>'
      : '';
    var gallery = property.images.map(function (image, index) {
      return '<button type="button" class="gallery-thumb ' + (index === 0 ? 'active' : '') + '" data-gallery-index="' + index + '" aria-label="Show photo ' + (index + 1) + '" aria-pressed="' + (index === 0) + '">' + ui.photo(image, '') + '</button>';
    }).join('');
    var params = 'property=' + encodeURIComponent(property.title);
    target.innerHTML = '<a class="back-link" href="properties.html">← Back to homes</a>' +
      '<div class="detail-heading"><div><span class="eyebrow">PROPERTY DETAILS</span><h1>' + property.title + '</h1>' + (property.type ? '<p class="detail-type">' + property.type + '</p>' : '') + '</div></div>' +
      '<div class="detail-gallery"><div class="gallery-stage">' + ui.photo(property.images[0], 'gallery-main-image') + (property.photoNote ? '<span class="photo-note detail-photo-note">' + property.photoNote + '</span>' : '') + '<button class="gallery-arrow gallery-prev" type="button" aria-label="Previous photo">←</button><button class="gallery-arrow gallery-next" type="button" aria-label="Next photo">→</button><span class="gallery-count" aria-live="polite">1 / ' + property.images.length + '</span></div><div class="gallery-thumbs">' + gallery + '</div></div>' +
      '<div class="details-columns"><div class="details-main">' + specStrip + '<section class="detail-section"><h2>About this home</h2><p>' + property.description + '</p></section>' + features + '</div>' +
      '<aside class="enquiry-card"><span class="eyebrow">INTERESTED IN THIS HOME?</span><h2>Let’s talk about it.</h2><p>Contact us to learn more or request a viewing.</p><a class="button button-primary button-wide" href="contact.html?' + params + '&kind=enquiry">Enquire about this home <span>→</span></a><a class="button button-secondary button-wide" href="contact.html?' + params + '&kind=viewing">Request a viewing</a><a class="plain-action" href="mailto:' + data.business.email + '?subject=' + encodeURIComponent('Question about ' + property.title) + '">' + ui.svg('mail', 17) + 'Email the business</a><button type="button" class="plain-action" id="share-property">' + ui.svg('share', 17) + '<span>Share property</span></button><button type="button" class="plain-action favorite-detail ' + (saved ? 'is-saved' : '') + '" id="favorite-detail" aria-pressed="' + saved + '">' + ui.svg('heart', 17) + '<span>' + (saved ? 'Saved on this device' : 'Save this home') + '</span></button></aside></div>' +
      '<section class="similar-homes"><div class="section-heading"><div><span class="eyebrow">MORE TO EXPLORE</span><h2>More homes</h2></div><a class="text-link" href="properties.html">Browse all homes <span>→</span></a></div><div class="property-grid">' + data.properties.filter(function (item) { return item.id !== property.id; }).slice(0, 3).map(card).join('') + '</div></section>';

    var thumbs = Array.prototype.slice.call(target.querySelectorAll('[data-gallery-index]'));
    var current = 0;
    var main = target.querySelector('.gallery-main-image');
    var count = target.querySelector('.gallery-count');
    function show(index) {
      current = (index + property.images.length) % property.images.length;
      var image = property.images[current];
      main.src = image.src;
      main.alt = image.alt;
      count.textContent = (current + 1) + ' / ' + property.images.length;
      thumbs.forEach(function (button, i) {
        button.classList.toggle('active', i === current);
        button.setAttribute('aria-pressed', String(i === current));
      });
    }
    thumbs.forEach(function (button) { button.addEventListener('click', function () { show(Number(button.getAttribute('data-gallery-index'))); }); });
    target.querySelector('.gallery-prev').addEventListener('click', function () { show(current - 1); });
    target.querySelector('.gallery-next').addEventListener('click', function () { show(current + 1); });
    var favoriteButton = document.getElementById('favorite-detail');
    favoriteButton.addEventListener('click', function () {
      ui.toggleFavorite(property.id);
      var isSaved = ui.getFavorites().indexOf(property.id) >= 0;
      favoriteButton.classList.toggle('is-saved', isSaved);
      favoriteButton.setAttribute('aria-pressed', String(isSaved));
      favoriteButton.querySelector('span').textContent = isSaved ? 'Saved on this device' : 'Save this home';
    });
    document.getElementById('share-property').addEventListener('click', function (event) {
      var url = window.location.href;
      if (navigator.share) navigator.share({ title: property.title, url: url }).catch(function () {});
      else if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(function () { event.currentTarget.querySelector('span').textContent = 'Link copied'; }).catch(function () { window.prompt('Copy this property link:', url); });
      else window.prompt('Copy this property link:', url);
    });
    bindFavorites(target);
  }

  function init() { initHome(); initBrowse(); initDetails(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
}());
