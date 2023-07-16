/*
	bootstrap-amd.js needs to be patched with:
	replace /loader\(\[([^\]]+)\]/g
	by monkeyPatch($1) && loader([$1]
*/
function monkeyPatch() {
	// It's  bit difficult to determine what's the correct time to load
	// monkey-patch. If loaded before main, startup will fail because AMD
	// loader won't find modules from main.js, if too late, monkey patch won't
	// be able to overrride main window URL.
	// The best approach for now seem to be to load monkey patch immediately
	// after the main.js file is read.
	if (entrypoint !== "vs/code/electron-main/main") {
		return true;
	}

	let fs = nodeRequire('fs');
	let p = nodeRequire('path');
	let readFile = fs.readFile;
	fs.readFile = function (path, options, callback) {
		readFile(path, options, function () {
			if (path.endsWith(p.join('electron-main', 'main.js'))) {
				console.log('Loading monkey-patch');
				try {
					loader(["monkey/main"], function() {}, function(err) { console.log(err); });
				} catch(error) {
					console.log(error);
				}
			}

			callback?.apply(this, arguments);
		});
	}
	

	return true;
}