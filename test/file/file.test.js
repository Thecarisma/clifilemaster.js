
const cfp = require('../../');

// Async with callbacks:
cfp.fileAttr('./index.js', function(err, result) {
	if (err) return console.error(err);
	console.log(result);
});

// Async with promises:
cfp.fileAttr('./index.js')
  .then((result) => console.log(result))
  .catch(err => console.error(err))
  
// Sync:
try {
	var fileAttr = cfp.fileAttrSync('./index.js');
	console.log(fileAttr);
} catch (err) {
	console.error(err);
}

// Async/Await:
async function getFileAttr() {
	try {
		await cfp.fileAttr('./index.js', function(err, result) {
			if (err) return console.error(err);
			console.log(result);
		});
	} catch (err) {
		console.error(err);
	}
}

getFileAttr();