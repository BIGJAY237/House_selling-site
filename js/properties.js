(function () {
  'use strict';
  var data = window.DaveScottData;
  var ui = window.DaveScottUI;
  function card(property) {
    var saved = ui.getFavorites().indexOf(property.id) >= 0;
    var amount = ui.money(property);
    var priceSuffix = property.transaction === 'Rent' ? '<small> / month</small>' : '';
    var image = property.images[0];
    return '<article class="property-card"><a class="card-image-link" href="property-details.html?id=' + encodeURIComponent(property.id) + '" aria-label="View ' + property.title + '">' + ui.photo(image, 'card-image') + '</a><span class="card-demo-tag">Sample home</span><span class="card-status">For ' + property.transaction.toLowerCase() + '</span><button class="favorite-button ' + (saved ? 'is-saved' : '') + '" type="button" data-favorite="' + property.id + '" aria-label="' + (saved ? 'Remove saved home' : 'Save home') + '" aria-pressed="' + saved + '">' + ui.svg('heart', 19) + '</button><div class="card-body"><span class="card-type">' + property.type + '</span><h3><a href="property-details.html?id=' + encodeURIComponent(property.id) + '">' + property.title + '</a></h3><p class="card-location">' + ui.svg('pin', 16) + property.location + '</p><div class="card-specs"><span>' + ui.svg('bed', 17) + property.bedrooms + ' beds</span><span>' + ui.svg('bath', 17) + property.bathrooms + ' baths</span><span>' + property.size.toLocaleString() + ' sq ft</span></div><div class="card-bottom"><strong>' + amount + priceSuffix + '</strong><a class="circle-link" href="property-details.html?id=' + encodeURIComponent(property.id) + '" aria-label="View details for ' + property.title + '">' + ui.svg('arrow', 18) + '</a></div></div></article>';
  }
  function bindFavorites(root) {
    root.querySelectorAll('[data-favorite]').forEach(function (button) {
      button.addEventListener('click', function () {
        ui.toggleFavorite(button.getAttribute('data-favorite'));
        var isSaved = ui.getFavorites().indexOf(button.getAttribute('data-favorite')) >= 0;
        button.classList.toggle('is-saved', isSaved);
        button.setAttribute('aria-pressed', String(isSaved));
        button.setAttribute('aria-label', isSaved ? 'Remove saved home' : 'Save home');
      });
    });
  }
  function initHome() {
    var grid = document.getElementById('featured-grid');
    var form = document.getElementById('home-search');
    if (grid) {
      grid.innerHTML = data.properties.filter(function (property) {
        return property.featured;
      }).slice(0, 3).map(card).join('');
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
    ['q', 'location', 'type', 'transaction', 'bedrooms', 'bathrooms', 'min', 'max'].forEach(function (name) {
      var input = form.elements[name];
      if (input && params.has(name)) input.value = params.get(name);
    });
    var sort = document.getElementById('sort-properties');
    var count = document.getElementById('results-count');
    var empty = document.getElementById('no-results');
    function render() {
      var values = new FormData(form);
      var q = String(values.get('q') || '').trim().toLowerCase();
      var place = String(values.get('location') || '').trim().toLowerCase();
      var type = values.get('type');
      var transaction = values.get('transaction');
      var beds = Number(values.get('bedrooms') || 0);
      var baths = Number(values.get('bathrooms') || 0);
      var min = Number(values.get('min') || 0);
      var max = Number(values.get('max') || 0);
      var matches = data.properties.filter(function (property) {
        return (!q || property.title.toLowerCase().includes(q)) &&
        (!place || property.location.toLowerCase().includes(place)) &&
        (!type || property.type === type) &&
        (!transaction || property.transaction === transaction) &&
        (!beds || property.bedrooms >= beds) && (!baths || property.bathrooms >= baths) &&
        (!min || property.price >= min) && (!max || property.price <= max);
      });
      if (sort.value === 'low') matches.sort(function (a, b) {
        return a.price - b.price;
      });
      else if (sort.value === 'high') matches.sort(function (a, b) {
        return b.price - a.price;
      });
      else matches.sort(function (a, b) {
        return new Date(b.listedAt) - new Date(a.listedAt);
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
    function reset() {
      form.reset(); sort.value = 'newest'; render();
    }
    document.getElementById('clear-filters').addEventListener('click', reset);
    document.getElementById('empty-reset').addEventListener('click', reset);
    render();
  }
  function initDetails() {
    var target = document.getElementById('property-detail');
    if (!target) return;
    var id = new URLSearchParams(window.location.search).get('id');
    var property = data.properties.find(function (item) {
      return item.id === id;
    });
    if (!property) {
      target.innerHTML = '<div class="detail-not-found"><span class="eyebrow">HOME NOT FOUND</span><h1>That sample listing isn’t here.</h1><p>Check the property link or browse all of the demonstration homes.</p><a class="button button-primary" href="properties.html">Browse homes <span>→</span></a></div>';
      return;
    }
    document.title = property.title + ' | Dave Scott Mobile Home for Sale';
    var isSaved = ui.getFavorites().indexOf(property.id) >= 0;
    var monthly = property.transaction === 'Rent' ? '<span class="rent-period">per month</span>' : '';
    var amenities = property.amenities.map(function (item) {
      return '<li><span>✓</span>' + item + '</li>';
    }).join('');
    var gallery = property.images.map(function (image, index) {
      return '<button type="button" class="gallery-thumb ' + (index === 0 ? 'active' : '') + '" data-gallery-index="' + index + '" aria-label="Show photo ' + (index + 1) + '" aria-pressed="' + (index === 0) + '">' + ui.photo(image, '') + '</button>';
    }).join('');
    var mainImage = ui.photo(property.images[0], 'gallery-main-image');
    var params = 'property=' + encodeURIComponent(property.title);
    target.innerHTML = '<a class="back-link" href="properties.html">← Back to homes</a><div class="detail-heading"><div><span class="eyebrow">DEMONSTRATION LISTING · FOR ' + property.transaction.toUpperCase() + '</span><h1>' + property.title + '</h1><p class="card-location">' + ui.svg('pin', 17) + property.location + '</p></div><div class="detail-price"><strong>' + ui.money(property) + '</strong>' + monthly + '</div></div><div class="detail-gallery"><div class="gallery-stage">' + mainImage + '<span class="card-demo-tag">Sample home</span><button class="gallery-arrow gallery-prev" type="button" aria-label="Previous photo">←</button><button class="gallery-arrow gallery-next" type="button" aria-label="Next photo">→</button><span class="gallery-count" aria-live="polite">1 / ' + property.images.length + '</span></div><div class="gallery-thumbs">' + gallery + '</div></div><div class="details-columns"><div class="details-main"><div class="spec-strip"><div>' + ui.svg('bed') + '<b>' + property.bedrooms + '</b><span>Bedrooms</span></div><div>' + ui.svg('bath') + '<b>' + property.bathrooms + '</b><span>Bathrooms</span></div><div>' + ui.svg('home') + '<b>' + property.size.toLocaleString() + '</b><span>Square feet</span></div><div>' + ui.svg('home', 20) + '<b>' + property.type + '</b><span>Home type</span></div></div><section class="detail-section"><h2>About this home</h2><p>' + property.description + '</p><p class="detail-disclaimer">This is a demonstration listing. The home, price, location, photographs and availability are examples; they do not represent a verified property for sale or rent.</p></section><section class="detail-section"><h2>Home details</h2><dl class="detail-facts"><div><dt>Home type</dt><dd>' + property.type + '</dd></div><div><dt>Listing type</dt><dd>For ' + property.transaction.toLowerCase() + '</dd></div><div><dt>Dimensions</dt><dd>' + (property.dimensions || 'Not provided') + '</dd></div><div><dt>Condition</dt><dd>' + property.condition + '</dd></div><div><dt>Availability</dt><dd>' + property.availability + '</dd></div></dl></section><section class="detail-section"><h2>Features &amp; amenities</h2><ul class="amenities-list">' + amenities + '</ul></section></div><aside class="enquiry-card"><span class="eyebrow">INTERESTED IN THIS HOME?</span><h2>Let’s talk about it.</h2><p>Send a question or request a viewing. Your email app opens so you can review and send your message.</p><a class="button button-primary button-wide" href="contact.html?' + params + '&kind=enquiry">Enquire about this home <span>→</span></a><a class="button button-secondary button-wide" href="contact.html?' + params + '&kind=viewing">Request a viewing</a><a class="plain-action" href="mailto:' + data.business.email + '?subject=' + encodeURIComponent('Question about ' + property.title) + '">' + ui.svg('mail', 17) + 'Email the business</a><button type="button" class="plain-action" id="share-property">' + ui.svg('share', 17) + '<span>Share property</span></button><button type="button" class="plain-action favorite-detail ' + (isSaved ? 'is-saved' : '') + '" id="favorite-detail" aria-pressed="' + isSaved + '">' + ui.svg('heart', 17) + '<span>' + (isSaved ? 'Saved on this device' : 'Save this home') + '</span></button><small>Email is sent only when you choose Send in your email app.</small></aside></div><section class="similar-homes"><div class="section-heading"><div><span class="eyebrow">MORE TO EXPLORE</span><h2>Similar sample homes</h2></div><a class="text-link" href="properties.html">All homes <span>→</span></a></div><div class="property-grid">' + data.properties.filter(function (item) {
      return item.id !== property.id;
    }).slice(0, 3).map(card).join('') + '</div></section>';
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
        button.classList.toggle('active', i === current); button.setAttribute('aria-pressed', String(i === current));
      });
    }
    thumbs.forEach(function (button) {
      button.addEventListener('click', function () {
        show(Number(button.getAttribute('data-gallery-index')));
      });
    });
    target.querySelector('.gallery-prev').addEventListener('click', function () {
      show(current - 1);
    });
    target.querySelector('.gallery-next').addEventListener('click', function () {
      show(current + 1);
    });
    var favoriteButton = document.getElementById('favorite-detail');
    favoriteButton.addEventListener('click', function () {
      ui.toggleFavorite(property.id);
      var saved = ui.getFavorites().indexOf(property.id) >= 0;
      favoriteButton.classList.toggle('is-saved', saved);
      favoriteButton.setAttribute('aria-pressed', String(saved));
      favoriteButton.querySelector('span').textContent = saved ? 'Saved on this device' : 'Save this home';
    });
    document.getElementById('share-property').addEventListener('click', function (event) {
      var url = window.location.href;
      if (navigator.share) navigator.share( {
        title: property.title, url: url
      }).catch(function () {
      });
      else if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(function () {
        event.currentTarget.querySelector('span').textContent = 'Link copied';
      }).catch(function () {
        window.prompt('Copy this property link:', url);
      });
      else window.prompt('Copy this property link:', url);
    });
  }
  function init() {
    initHome();
    initBrowse();
    initDetails();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
}());
