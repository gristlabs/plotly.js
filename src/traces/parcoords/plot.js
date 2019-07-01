/**
* Copyright 2012-2019, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

'use strict';

var parcoords = require('./parcoords');
var prepareRegl = require('../../lib/prepare_regl');

module.exports = function plot(gd, cdModule) {
    var fullLayout = gd._fullLayout;

    var success = prepareRegl(gd);
    if(!success) return;

    var currentDims = {};
    var initialDims = {};
    var fullIndices = {};
    var inputIndices = {};

    var size = fullLayout._size;

    cdModule.forEach(function(d, i) {
        var trace = d[0].trace;
        fullIndices[i] = trace.index;
        var iIn = inputIndices[i] = trace._fullInput.index;
        currentDims[i] = gd.data[iIn].dimensions;
        initialDims[i] = gd.data[iIn].dimensions.slice();
    });

    var hover = function(eventData) {
        gd.emit('plotly_hover', eventData);
    };

    var unhover = function(eventData) {
        gd.emit('plotly_unhover', eventData);
    };

    parcoords(
        gd,
        cdModule,
        { // layout
            width: size.w,
            height: size.h,
            margin: {
                t: size.t,
                r: size.r,
                b: size.b,
                l: size.l
            }
        },
        { // callbacks
            hover: hover,
            unhover: unhover
        }
    );
};
