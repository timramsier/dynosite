const fs = require("fs");
const path = require("path");

/**
 * This function takes an html template, an array of insertions
 * where there are {{}} replacements needed and a page data
 * with what they should be replaced with
 * @param {String} template the untransformed template string
 * @param {Array<String>} insertions an array of insertions that need replaced
 * @param {Object} pageData a dictionary of what the insertions should be replaced with
 */
function replaceInsertions(template, pageData) {
  // default the returned html as the template
  let html = template;

  // a regular expression that returns all locations of insertions
  const insertionsRegEx = new RegExp(/{{[^{{}}]*}}/g);
  // a regular expression that looks for {} brackets only
  const insertionBracketsRegEx = new RegExp(/[{}]/g);

  // collect all of the insertion requests or default to an empty array if none exist
  const insertions = html.match(insertionsRegEx) || [];
  // Loop through each insertion, replacing it with what the page data says
  insertions.forEach(function (insertion) {
    // remove the {{}} brackets from the insertion name (makes for cleaner json)
    const unbrackettedInsertion = insertion.replace(insertionBracketsRegEx, "");
    const newValue = pageData[unbrackettedInsertion];
    if (newValue) {
      html = html.replace(insertion, newValue);
    }
  });

  return html;
}

/**
 * This function replaces any {[]} bracketed partial with the .partial.html
 * equivalent content
 * @param {String} template the untransformed template string
 * @param {Array<String>} partials an array of partial templates to request
 */
function replacePartials(template) {
  // default the returned html as the template
  let html = template;

  // a regular expression that returns all locations of partials
  const partialRegEx = new RegExp(/{\[[^\[\]]*\]}/g);
  // a regular expression that looks for {}[] brackets only
  const partialBracketsRegEx = new RegExp(/[{\[\]}]/g);

  // collect all of the partials requests or default to an empty array if none exist
  const partials = html.match(partialRegEx) || [];
  partials.forEach(function (partial) {
    // remove the {[]} brackets from the partial name
    const fileName = partial.replace(partialBracketsRegEx, "");
    const filePath = path.resolve("templates/" + fileName + ".partial.html");
    const dataPath = path.resolve("data/" + fileName + ".partial.json");

    // read the partial to insert (let it through an error if it doesn't)
    const insertion = fs.readFileSync(filePath, "utf8");

    // optionally allow for the partial to have data file
    let partialData = {};
    if (fs.existsSync(dataPath)) {
      const rawData = fs.readFileSync(dataPath, "utf8");
      partialData = JSON.parse(rawData);
    }

    html = html.replace(partial, templator(insertion, partialData));
  });
  return html;
}

/**
 * This is the main function to transform a template into the correct html
 * @param {String} template the untransformed template string
 * @param {Object} pageData a dictionary of what the insertions should be replaced with
 */
function templator(template, pageData = {}) {
  // default the returned html as the template
  let html = template;

  // replace any partial request first
  html = replacePartials(html);

  // replace any insertion request
  html = replaceInsertions(html, pageData);

  // by calling replacePartials after insertions are complete it allows
  // for insertions to include partial requests
  html = replacePartials(html);

  return html;
}

module.exports = templator;
