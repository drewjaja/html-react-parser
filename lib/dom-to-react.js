'use strict';

/**
 * Module dependencies.
 */
var React = require('react');
var attributesToProps = require('./attributes-to-props');

/**
 * Convert DOM nodes to React elements.
 *
 * @param  {Array}    nodes              - The DOM nodes.
 * @param  {Object}   [options]          - The additional options.
 * @param  {Function} [options.replace]  - The replace method.
 * @param  {Object}   [additional_props] - Additional props to pass into React element
 * @return {ReactElement|Array}
 */
function domToReact(nodes, options, additional_props) {
    options = options || {};
    additional_props = additional_props || {};

    var result = [];
    var node;
    var isReplacePresent = typeof options.replace === 'function';
    var replacement;
    var props;
    var children;

    for (var i = 0, len = nodes.length; i < len; i++) {
        node = nodes[i];

        // replace with custom React element (if applicable)
        if (isReplacePresent) {
            replacement = options.replace(node);

            if (React.isValidElement(replacement)) {
                var replacement_props = additional_props;

                // specify a "key" prop if element has siblings
                // https://fb.me/react-warning-keys
                if (len > 1) {
                    replacement_props.key = i;
                }

                replacement = React.cloneElement(replacement, replacement_props)
                result.push(replacement);
                continue;
            }
        }

        if (node.type === 'text') {
            result.push(node.data);
            continue;
        }

        // update values
        props = attributesToProps(node.attribs);
        props = Object.assign(props, additional_props);

        children = null;

        // node type for <script> is "script"
        // node type for <style> is "style"
        if (node.type === 'script' || node.type === 'style') {
            // prevent text in <script> or <style> from being escaped
            // https://facebook.github.io/react/tips/dangerously-set-inner-html.html
            if (node.children[0]) {
                props.dangerouslySetInnerHTML = {
                    __html: node.children[0].data
                };
            }

        } else if (node.type === 'tag') {
            // setting textarea value in children is an antipattern in React
            // https://facebook.github.io/react/docs/forms.html#why-textarea-value
            if (node.name === 'textarea' && node.children[0]) {
                props.defaultValue = node.children[0].data;

            // continue recursion of creating React elements (if applicable)
            } else if (node.children && node.children.length) {
                children = domToReact(node.children, options);
            }

        // skip all other cases (e.g., comment)
        } else {
            continue;
        }

        // specify a "key" prop if element has siblings
        // https://fb.me/react-warning-keys
        if (len > 1) {
            props.key = i;
        }

        result.push(
            React.createElement(node.name, props, children)
        );
    }

    if (result.length === 1) {
        return result[0];
    } else {
        return result;
    }
}

/**
 * Export DOM to React parser.
 */
module.exports = domToReact;
