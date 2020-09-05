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

  // Loop through each spot, replacing it with what the
  // page config says
  spots.forEach(function (spot) {
    const newValue = pageConfig[spot];
    html = html.replace(spot, newValue);
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
  const spots = template.match(tempRegEx);

  // default the returned html as the template
  let html = template;
  // if template spots exist and there is at least 1 then
  // run the replacement on them
  if (spots && spots.length > 0) {
    html = replaceSpots(html, spots, pageConfig);
  }

  return html;
}

module.exports = templator;
