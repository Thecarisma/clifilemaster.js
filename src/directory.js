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

//internal test
function ls(dirPath, row, opts, cb) {
	if (typeof opts === 'function' && !cb) {
		cb = opts;
		opts = {};
	} 
	
	//cb = cb || function () {};
	opts = opts || {};
	
	return new Promise(async function(resolve, reject) {
		await dirContent(dirPath, async function(err, result) {
			if (err) {
				if (cb) cb(err);
				return reject(err);
			}
			
			var ret ;
			await contentPrettyStr(result, row, function(_err, _result) {
				if (_err) {
					if (cb) cb(_err);
					return reject(_err);
				}
				ret = _result;
			});
			
			
			if (cb) cb(undefined, ret);
			return resolve(ret);
		});
	});	
	
}

//internal test
function lsSync(dirPath, row, opts, cb) {
	if (typeof opts === 'function' && !cb) {
		cb = opts;
		opts = {};
	} 
	
	//cb = cb || function () {};
	opts = opts || {};
	var result;
	var ret;
	
	try {
		ret = dirContentSync(dirPath, opts);
		result = contentPrettyStrSync(ret, row);
	} catch (err) {
		throw err;
		return;
	}
	return result;
}

function contentPrettyStr(content, row, cb) {
	return new Promise(async function(resolve, reject) {
		var _ret = contentPrettyStrSync(content, row);
		if (cb) cb(undefined, _ret);
		return resolve(_ret);
	});
}

function contentPrettyStrSync(content, row) {
	var conLen = content.length;
	var _ret = (conLen > 0 ? content[0].parent_path + ":\n" : "");
	var rowDelimeter = (conLen/row) | 0 - 1;
	var x = 0, y = 0; 
	if (!row) row = 1;
	for (; y < row; y++) {
		var limit = y * rowDelimeter;
		for (; x < conLen; x++) {
			_ret += ("[" + (x+1) + "] " 
					+ "[" + (content[x].is_dir === true ? "D" : "F") + "] " 
					+ content[x].name + "\n");
			if (x===rowDelimeter) {
				break;
			}
		}
		
	}
	
	_ret += "\n";
	_ret += ("[" + ".." + "] Go up a directory");
	return _ret;
}

module.exports = {
    dirContent,
	dirContentSync,
	ls,
	lsSync,
	contentPrettyStr,
	contentPrettyStrSync
};