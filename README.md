# Dave Scott Mobile Home for Sale

A static, multi-page website built with HTML, CSS, and vanilla JavaScript. Open `index.html` directly or publish the project root as a static site; no build step or package installation is required.

## Pages and features

- Home page with property search and featured homes
- Browse page with name, home type, bedroom, and bathroom filters
- Individual property pages with each home's own photo gallery
- About, FAQ, and contact pages
- Viewing and enquiry forms that prepare an email draft for review and sending
- Saved homes, responsive navigation, and a floating email button
- Facebook link in the site footer and contact page

## Property content

The seven property records are in `data/properties.js`. Their photographs and five supplied descriptions are in the corresponding `images/house1` through `images/house7` folders. House 5 and House 6 use descriptions limited to what their photographs show. House 4 currently has interior photos only in its folder; its gallery uses those photos and does not borrow an exterior from another house.

Prices and locations are not stored or displayed. Add new property information in the `window.DaveScottData.properties` array, and use relative paths to that property's own image folder. Only add factual details when they have been supplied and verified.

## Publish

Upload the project folder to GitHub Pages, Netlify, or Vercel as a static site with the project root as the publish directory and no build command. Before publishing, replace the placeholder domain in `sitemap.xml` with the public site domain.

## Project structure

- `index.html`, `properties.html`, `property-details.html`, `about.html`, `contact.html`, `faq.html`: site pages
- `css/`: shared and responsive styling
- `data/properties.js`: business details and seven property records
- `js/`: navigation, property search and galleries, enquiry form, FAQ behavior, floating email button
- `images/house1`–`images/house7`: property photographs and supplied descriptions
- `images/logo/`: brand mark and favicon
