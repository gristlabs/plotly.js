/**
* Copyright 2012-2019, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

'use strict';

var Lib = require('../lib');

/*
* substantial portions of this code from FileSaver.js
* https://github.com/eligrey/FileSaver.js
* License: https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md
* FileSaver.js
* A saveAs() FileSaver implementation.
* 1.1.20160328
*
* By Eli Grey, http://eligrey.com
* License: MIT
*   See https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md
*/
function fileSaver(url, name, format) {
    var saveLink = document.createElement('a');
    var canUseSaveLink = 'download' in saveLink;

    var promise = new Promise(function(resolve, reject) {
        var blob;
        var objectUrl;

        if(isIE9orBelow()) {
            reject(new Error('IE < 10 unsupported'));
        }

        // Safari doesn't allow downloading of blob urls
        if(Lib.isSafari()) {
            document.location.href = 'data:application/octet-stream' + url;
            return resolve();
        }

        // IE 10+ (native saveAs)
        if(Lib.isIE()) {
            // At this point we are only dealing with a decoded SVG as
            // a data URL (since IE only supports SVG)
            blob = createBlob(url, format);
            window.navigator.msSaveBlob(blob, name);
            blob = null;
            return resolve(name);
        }

        if(canUseSaveLink) {
            blob = createBlob(url, format);
            objectUrl = window.URL.createObjectURL(blob);

            saveLink.href = objectUrl;
            saveLink.download = name;
            document.body.appendChild(saveLink);
            saveLink.click();

            document.body.removeChild(saveLink);
            window.URL.revokeObjectURL(objectUrl);
            blob = null;

            return resolve(name);
        }

        reject(new Error('download error'));
    });

    return promise;
}

function isIE9orBelow() {
    return (
        Lib.isIE() &&
        typeof window.navigator !== 'undefined' &&
        /MSIE [1-9]\./.test(window.navigator.userAgent)
    );
}

// Taken from https://bl.ocks.org/nolanlawson/0eac306e4dac2114c752
function fixBinary(b) {
    var len = b.length;
    var buf = new ArrayBuffer(len);
    var arr = new Uint8Array(buf);
    for(var i = 0; i < len; i++) {
        arr[i] = b.charCodeAt(i);
    }
    return buf;
}

function createBlob(url, format) {
    if(format === 'svg') {
        return new window.Blob([url]);
    } else {
        var binary = fixBinary(window.atob(url));
        return new window.Blob([binary], {type: 'image/' + format});
    }
}

module.exports = fileSaver;
