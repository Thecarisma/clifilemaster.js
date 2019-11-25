
const cfp = require('../../');

// Async with callbacks:
cfp.dirContent('./', function(err, result) {
	if (err) return console.error(err);
	console.log(result);
});

// Async with promises:
cfp.dirContent('./')
  .then((result) => console.log(result))
  .catch(err => console.error(err))
  
// Sync:
try {
	var content = cfp.dirContentSync('./');
	console.log(content);
} catch (err) {
	console.error(err);
}

// Async/Await:
async function getDirContent() {
	try {
		await cfp.dirContent('./', function(err, result) {
			if (err) return console.error(err);
			console.log(result);
		});
	} catch (err) {
		console.error(err);
	}
}

getDirContent();