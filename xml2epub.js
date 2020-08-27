"use strict"

const fs = require('fs');
const path = require('path')
const process = require('process')
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const inFile = process.argv[2]
const fileName = path.basename(inFile, '.xml');
const xml = fs.readFileSync(inFile, 'utf8')

// Parse XML doc
const xmlDom = new JSDOM(xml, {
  contentType: "text/xml",
});
const xmlDoc = xmlDom.window.document

// Read in and parse html template
const template = fs.readFileSync('./template.html', 'utf8')
var htmlDom = new JSDOM(template, {
  contentType: "text/html"
});

// Setup pretend browser environment with template as document
global.document = htmlDom.window.document

// Polyfill for missing (but unused by us) browser feature
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  global.localStorage = new LocalStorage('./scratch');
}
// Suppress errors for missing values
global.Version = "0.0"
global.path = "none"
global.host = "none"
// Setup running of onload hooks
global.window = {}
global.window.addEventListener = function (e, func) { func() }
// Try to load tooltips library -- this doesn't work
// const popper = require('./lib/popper.min.js')
// const tippy = require('./lib/tippy-bundle.umd.js')
global.tippy = function () {}
global.tippy.setDefaultProps = function () {}

// Now we are ready to pretend to be a browser

// Load conversion code
const fileDisplay = require('./lib/file-display.js');
// Do not add parse links to words
fileDisplay.stopLinks()
// Convert to html
fileDisplay.xml2html(xmlDoc)

// Postprocess the html to suit epub conversion
var doc = htmlDom.window.document
// Fix the title of the document
var title = doc.getElementById('main').firstChild.textContent
console.log('Converting: ', title)
doc.title = title
// Get rid of the link to show raw XML
var xmlLink = doc.getElementsByClassName('xmlLink')[0]
xmlLink.parentNode.removeChild(xmlLink)
// Make all h1 headings get picked up as "chapters" by auto ToC
var h = doc.getElementsByTagName('h1')
var i
for (i = 0; i < h.length; i++) {
  h[i].className = "chapter"
}

// Write the output
const html = htmlDom.serialize()
fs.writeFileSync('./output/'+fileName+'.html', html)
