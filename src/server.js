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
  const pathToData = path.resolve(`data/${page}.json`);

  // Set the template and page config to empty versions
  let template = "";
  let pageData = {};

  // if the template file exists at the path then update the template to it
  if (fs.existsSync(pathToTemplate)) {
    template = fs.readFileSync(pathToTemplate, "utf8");
  }

  // if the data file exists at the path then update the page data to it
  if (fs.existsSync(pathToData)) {
    // read the template and page config files
    const rawPageData = fs.readFileSync(pathToData, "utf8");

    // parse the page config and use it to create html from the template
    pageData = JSON.parse(rawPageData);
  }
  const html = templator(template, pageData);
  return html;
}

// add the ability to serve assets from the public directory
app.use(express.static("public"));

// Route for "/"
app.get("/", (req, res) => {
  res.send(getHtml("home"));
});

// Route for "/about"
app.get("/about", (req, res) => {
  res.send(getHtml("about"));
});

// Send a basic 404 route for any route not listed above
app.get("*", (req, res) => {
  res.status(404).send("Page does not exist");
});

// Start the server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
