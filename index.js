'use strict';

/**
 * Module dependencies.
 */
var domToReact = require('./lib/dom-to-react');
var htmlToDOM = require('html-dom-parser');

// decode HTML entities by default for `htmlparser2`
var domParserOptions = { decodeEntities: true };

/**
 * Convert HTML string to React elements.
 *
 * @param  {String}   html               - The HTML string.
 * @param  {Object}   [options]          - The additional options.
 * @param  {Function} [options.replace]  - The replace method.
 * @param  {Object}   [additional_props] - Additional properties to pass down
 * @return {ReactElement|Array}
 */
function HTMLReactParser(html, options, additional_props) {
    additional_props = additional_props || {};

    if (typeof html !== 'string') {
        throw new TypeError('First argument must be a string');
    }
    return domToReact(htmlToDOM(html, domParserOptions), options, additional_props);
}

/**
 * Export HTML to React parser.
 */
module.exports = HTMLReactParser;
