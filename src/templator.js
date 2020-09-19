const fs = require("fs");
const path = require("path");

/**
 * This function takes an html template, an array of spots
 * where there are {{}} replacements needed and a page config
 * with what they should be replaced with
 * @param {String} template the untransformed template string
 * @param {Array[String]} spots an array of spots that need replaced
 * @param {Object} pageConfig a dictionary of what the spots should be replaced with
 */
function replaceSpots(template, spots, pageConfig) {
  let html = template;

  // a regular expression that looks for {} brackets only
  const spotsBracketsRegEx = new RegExp(/[{}]/g);

  // Loop through each spot, replacing it with what the
  // page config says
  spots.forEach(function (spot) {
    const unbracketedSpot = spot.replace(spotsBracketsRegEx, "");
    const newValue = pageConfig[unbracketedSpot];
    html = html.replace(spot, newValue);
  });

  return html;
}

function replacePartials(template, pageConfig) {
  let html = template;
  const partialRegEx = new RegExp(/{\[[^\[\]]*\]}/g);
  const partialBracketsRegEx = new RegExp(/[[\]{\}]/g);

  const partials = html.match(partialRegEx) || [];

  partials.forEach(function (partial) {
    const partialName = partial.replace(partialBracketsRegEx, "");

    const partialPath = path.resolve('templates', partialName + '.partial.html');
    const partialHtml = fs.readFileSync(partialPath, "utf8");

    html = html.replace(partial, templator(partialHtml, pageConfig));
  });

  return html;
}

/**
 * This is the main function to transform a template into the correct html
 * @param {String} template the untransformed template string
 * @param {Object} pageConfig a dictionary of what the spots should be replaced with
 */
function templator(template, pageConfig = {}) {
  // a regular expression that returns all loca
  const tempRegEx = new RegExp("{{.*}}", "g");

  // get all template spots of {{}}
  const spots = template.match(tempRegEx) || [];

  // default the returned html as the template
  let html = template;

  html = replaceSpots(html, spots, pageConfig);

  html = replacePartials(html, pageConfig);

  return html;
}

module.exports = templator;
