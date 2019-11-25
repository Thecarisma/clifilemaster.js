
const fs = require('fs');
const path = require('path');


function fileAttr(filePath, cb) {
	//cb = cb || function (x,y) {};
	filePath = path.resolve(filePath);
	
	return new Promise(function(resolve, reject) {
		fs.lstat(filePath, (err, stats) => {
			if(err) {
				cb(err);
				return reject(err);
			}
			stats.is_blk_dev = stats.isBlockDevice();
			stats.is_c_dev = stats.isCharacterDevice();
			stats.is_dir = stats.isDirectory();
			stats.is_fifo = stats.isFIFO();
			stats.is_file = stats.isFile();
			stats.is_socket = stats.isSocket();
			stats.is_syslink = stats.isSymbolicLink();
			
			pathAttr(filePath, function(err, result) {
				if (err) {
					if (cb) cb(err);
					return reject(err);
				}
				for (var key of Object.keys(result)) {
					stats[key] = result[key];
				}
				if (cb) cb(undefined, stats);
				return resolve(stats);
			});
		});
	});
}


function fileAttrSync(filePath) {
	filePath = path.resolve(filePath);
	try {
		var pathAttr;
		var stats = fs.lstatSync(filePath);	
		stats.is_blk_dev = stats.isBlockDevice();
		stats.is_c_dev = stats.isCharacterDevice();
		stats.is_dir = stats.isDirectory();
		stats.is_fifo = stats.isFIFO();
		stats.is_file = stats.isFile();
		stats.is_socket = stats.isSocket();
		stats.is_syslink = stats.isSymbolicLink();
		pathAttr = pathAttrSync(filePath);
		for (var key of Object.keys(pathAttr)) {
			stats[key] = pathAttr[key];
		}
		return stats;
	} catch (err) {
		throw err;
		return;
	}
}

function pathAttr(filePath, cb) {
	//cb = cb || function (x,y) {};
	
	return new Promise(function(resolve, reject) {
		try {
			var ret = pathAttrSync(filePath);
			if (cb) cb(undefined, ret);
			return resolve(ret);
		} catch (err) {
			if (cb) cb(err);
			return reject(err);
		}
		
	});
}

function pathAttrSync(filePath) {
	const ret = {};
	filePath = path.resolve(filePath);
	var sepIndex = filePath.lastIndexOf(path.sep) + 1;
	var extIndex = (filePath.indexOf('.') > -1 ? filePath.lastIndexOf('.') + 1 : filePath.length);
	while (extIndex < sepIndex) {
		extIndex = (filePath.indexOf('.', extIndex) > -1 ? filePath.indexOf('.', extIndex) + 1 : filePath.length);
	}
	
	ret.name = filePath.substring(sepIndex);
	ret.path_ext = filePath.substring(extIndex);
	ret.name_only = ret.name.substring(0, ret.name.length - (ret.path_ext.length > 0 ? ret.path_ext.length + 1 : 0));
	ret.device_path = filePath.substring(0, filePath.indexOf(path.sep) + path.sep.length);
	ret.parent_path = filePath.substring(0, filePath.length - ret.name.length);
	ret.full_path = filePath;
	ret.seperator = path.sep;
	return ret;
}

module.exports = {
    fileAttr,
	fileAttrSync,
	pathAttr,
	pathAttrSync,
};
