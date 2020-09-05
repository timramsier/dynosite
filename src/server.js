const express = require("express");
const fs = require("fs");
const templator = require("./templator");
const path = require("path");
const app = express();
const port = 3000;

/**
 * This function loads the external index template file, a json page
 * config file and updates the html based on the page config
 * @param {String} page the name of the page you want to load
 */
function getHtml(page) {
  // get the path to the template and page config
  const pathToTemplate = path.resolve("templates/index.template.html");
  const pathToPage = path.resolve(`pages/${page}.json`);

  // read the template and page config files
  const template = fs.readFileSync(pathToTemplate, "utf8");
  const rawPageConfig = fs.readFileSync(pathToPage, "utf8");

  // parse the page config and use it to create html from the
  // template
  const pageConfig = JSON.parse(rawPageConfig);
  const html = templator(template, pageConfig);
  return html;
}

// Route for "/"
app.get("/", (req, res) => {
  res.send(getHtml("home"));
});

// Route for "/about"
app.get("/about", (req, res) => {
  res.send(getHtml("about"));
});

// Start the server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
