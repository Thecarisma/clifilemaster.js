
const cfp = require('../../');

// Async with callbacks:
cfp.pathAttr('./test_files/empty', function(err, result) {
	if (err) return console.error(err);
	console.log(result);
});

// Async with promises:
cfp.pathAttr('../')
  .then((result) => console.log(result))
  .catch(err => console.error(err))
  
// Sync:
try {
	var pathAttr = cfp.pathAttrSync('./test_files/empty');
	console.log(pathAttr);
} catch (err) {
	console.error(err);
}
  
// Sync:
try {
	var pathAttr = cfp.pathAttrSync('./test_files/empty.one.two.txt');
	console.log(pathAttr);
} catch (err) {
	console.error(err);
}

// Async/Await:
async function getFileAttr() {
	try {
		await cfp.pathAttr('./test_files/empty', function(err, result) {
			if (err) return console.error(err);
			console.log(result);
		});
	} catch (err) {
		console.error(err);
	}
}

getFileAttr();