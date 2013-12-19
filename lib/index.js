'use strict';

/**
 * @file Helper for pdf2htmlEX file processing
 * For more information about Pdf2htmlex :
 * https://github.com/coolwanglu/pdf2htmlEX.git
 */

var fs = require('fs');
var async = require('async');
var shellExec = require('child_process').exec;
var crypto = require('crypto');

/**
 * Extract the content in html of the specified pdf
 *
 * @param {string} path Path of the specified file
 * @param {string} document to hydrate
 * @param {function} cb Callback, first parameter, is the error if any, then the processed data
 */
module.exports = function(path, document, cb) {

  async.waterfall([
    
    function(cb) {
      var outFile = crypto.randomBytes(20).toString('hex');

      var options = [
        '--printing 0', // DIsable printing optimization, only for display
        '-l 7', // Generate 10 pages at most
      ];

      shellExec('pdf2htmlEX ' + options.join(' ') + ' --data-dir ' + __dirname + '/../config/pdf2htmlEX --dest-dir /tmp ' + path + ' ' + outFile, function(err) {
        cb(err, '/tmp/' + outFile);
      });
    },
    function(outPath, cb) {
      fs.readFile(outPath, function(err, data) {
        cb(err, outPath, data);
      });
    },
    function(outPath, data, cb) {
      document.datas.html = data.toString();
      document.document_type = "document";
      cb(null, outPath);
    },
    function(outPath, cb) {
      fs.unlink(outPath, cb);
    },
  ], function(err) {
    cb(err, document);
  });
};