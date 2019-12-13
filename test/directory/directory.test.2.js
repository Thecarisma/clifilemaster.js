
const cfp = require('../../');

cfp.ls('../../../../', 1, {}, function(err, result) {
	if (err) return console.error(err);
	console.log(result);
})