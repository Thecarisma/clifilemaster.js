'use strict'

const fs = require('fs');
const path = require('path');
const cfpfile = require('./file.js');

/**
 * 
 * @param   {string}	dirPath: the directory to list it files and folder
 * @param   {object}	opts: 
 *
 * 						{ boolean } filesOnly: list only files in the directory if true
 *
 * 						{ boolean } folderOnly: list only folders in the directory if true, 
 *									if the filesOnly and folderOnly is true both the 
 *									files and folders in the directory will be listed.
 *
 * 						{ boolean } hidden: when true show hidden files in the folder, false by default
 * 						{ boolean } hideExtension: show the files extension, default is true
 * 						{ list }    extensions: specify the list of text the files and/or folder must match
 *
 * @param   {function}	cb: function(err, result) if specified the callback is invoked with a list that contain 
 *							that contain the detail of the files and/or folders in the specified directory.
 *
 * @returns {promise}	that can be awaited 
 */
function dirContent(dirPath, opts, cb) {
	if (typeof opts === 'function' && !cb) {
		cb = opts;
		opts = {};
	} 
	
	//cb = cb || function () {};
	opts = opts || {};
	
	opts.filesOnly = 'filesOnly' in opts ? !!opts.filesOnly : true;
	opts.folderOnly = 'folderOnly' in opts ? !!opts.folderOnly : true;
	opts.hidden = 'hidden' in opts ? !!opts.hidden : false;
	opts.hideExtension = 'hideExtension' in opts ? !!opts.hideExtension : false;
	opts.extensions = 'extensions' in opts ? opts.extensions : [];	
	
	return new Promise(function(resolve, reject) {
		var returnValue = [] ;
		fs.readdir(dirPath, async (err, files) => {
			for (const file of files) {
				await cfpfile.fileAttr(dirPath + '/' + file, function(err, result) {
					if (err) {
						if (cb) cb(err);
						return reject(err);
					}
					returnValue.push(result);
				});
			}
			if (cb) cb(undefined, returnValue);
			return resolve(returnValue);
		});
	});
	
}

function dirContentSync(dirPath, opts) {
	opts = opts || {};
	
	opts.filesOnly = 'filesOnly' in opts ? !!opts.filesOnly : true;
	opts.folderOnly = 'folderOnly' in opts ? !!opts.folderOnly : true;
	opts.hidden = 'hidden' in opts ? !!opts.hidden : false;
	opts.hideExtension = 'hideExtension' in opts ? !!opts.hideExtension : false;
	opts.extensions = 'extensions' in opts ? opts.extensions : [];	
	
	var returnValue = [] ;
	const files = fs.readdirSync(dirPath);
	for (const file of files) {
		try {
			var result = cfpfile.fileAttrSync(dirPath + '/' + file);
			returnValue.push(result);
		} catch (err) {
			throw err;
			return;
		}
	}
	return returnValue;
	
}

//function lsDir

module.exports = {
    dirContent,
	dirContentSync
};