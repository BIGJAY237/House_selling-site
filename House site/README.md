# Dave Scott Mobile Home for Sale

A static, multi-page site built with HTML, CSS, and vanilla JavaScript. It has no build step or package dependencies and can be opened directly from `index.html`.

## Open the site

Double-click `index.html` or open it in a browser. The shared navigation, property data, filters, galleries, FAQ accordion, saved homes, and enquiry form all use browser-native JavaScript and relative file paths.

The property listings are clearly labeled examples, not verified inventory. The enquiry form prepares a `mailto:` draft addressed to the business email; the visitor reviews and sends it in their own email app. Saved homes are stored in that browser's local storage.

## Publish

Upload the project folder as a static site to GitHub Pages, Netlify, or Vercel. No build command is needed; use the project root as the publish directory. All page and asset links are relative, and the site does not use client-side routing.

Before launch, replace the example listings and photography in `data/properties.js`, review the business details in that file, and replace the placeholder domain in `sitemap.xml` with the chosen public domain. Property photos currently use remote Pexels image URLs and show a local placeholder if an image cannot load. Confirm image suitability and attribution requirements before publishing.

## Project structure

- `index.html`, `properties.html`, `property-details.html`, `about.html`, `contact.html`, `faq.html`: site pages
- `css/`: shared and responsive styles
- `data/properties.js`: business details and sample property records
- `js/`: navigation, property interactions, contact form, and FAQ behavior
- `images/`: logo, favicon, property fallback image, and image directories
- `robots.txt`, `sitemap.xml`: basic search engine files

## Update property data

Edit the `window.DaveScottData` object in `data/properties.js`. Each property has an ID, title, location, transaction type, home type, price, specifications, description, amenities, and an array of image URLs. Use unique IDs. Supported transaction labels are `Sale` and `Rent`; home types are shown from each record's `type` value.
