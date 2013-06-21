var http = require("http"),
	url = require("url"),
	path = require("path"),
	fs = require("fs"),
	mime = require("mime"),
	dateformat = require("dateformat"),
	formidable = require('formidable'),
	util = require("util"),

	port = process.argv[2] || '8888',
	upload_root = path.join(process.cwd(), "upload");

http.createServer(function (request, response) {

	//Route by HTTP verb

	console.log();
	console.log("========" + "HTTP " + request.method + " (" + dateformat(new Date(), "isoDateTime") + ") =========");
	console.log("Remote IP: " + request.connection.remoteAddress);

	if (request.method == 'GET') {
		get_style_page(request, response);
	} else if (request.method == 'POST') {
		console.log("Uploading");
		var form = new formidable.IncomingForm();

		form.parse(request, function (err, fields, files) {
			fs.rename(files.filename.path, path.join(upload_root, files.filename.name));
			response.writeHead(200, { 'content-type': 'text/html' });
			response.end([
				'<html><head><title>Uploaded</title></head><body>',
					'<h1>Success</h1>',
					'<p>Uploaded: ' + files.filename.name + '</p>',
					'<a href="/">(Return)</a>',
				'</body></html>'].join('\n')
			);
		});
	}
	else {
		response.writeHead(500, { "Content-Type": "text/plain" });
		response.write("Unsupported HTTP verb.");
		response.end();
	}
}).listen(parseInt(port, 10));

console.log("Static file server running at\n => http://localhost:" + port + "/\nCTRL + C to shutdown");

//=================== Helper code =========================

//Render a page corresponding to the appropriate HTTP GET URI
//(aka this is basically the app's "routing")
function get_style_page(request, response) {

	var uri = url.parse(request.url).pathname;
	var filename = path.join(upload_root, uri);
	console.log("URI: " + uri);
	console.log("File path: " + filename);

	//If browsing the root, we should be polite and list the
	//contents in such a way that one can click to download it.
	if (uri == "/") {
		root_page(response);
		return;
	}
	else if (uri == "/upload.html") {
		//Generate the upload page
		upload_page(response);
	}
	else {
		fs.exists(filename, function (exists) {
			//If whatever they asked for does not exist, tell them.
			if (!exists) {
				response.writeHead(404, { "Content-Type": "text/plain" });
				response.write("404 Not Found\n");
				response.end();
				return;
			}

			//If it exists, and it's not a DIR listing, they must want to download it. Send it their way!
			fs.readFile(filename, "binary", function (err, file) {
				if (err) {
					response.writeHead(500, { "Content-Type": "text/plain" });
					response.write(err + "\n");
					response.end();
					return;
				}

				response.writeHead(200, { "Content-Type": mime.lookup(filename) });
				response.write(file, "binary");
				response.end();
			});
		});
	}
}

//Render the upload page
function upload_page(response) {
	console.log("Upload page");

	response.write([
	'<html><head><title>Upload Page</title></head><body>',
		'<h1>Upload Page</h1>',
		'<p>Usage: Upload a file, and it will become available for download.</p>',
		'<form name="UploadForm" action="upload.html" method="post" enctype="multipart/form-data">',
			'<div><p>File to upload: </p><input type="file" name="filename" size="120" /></div>',
			'<div><input type="submit" value="Upload this file" /></div>',
		'</form>',
	'</body></html>'].join('\n')
	);

	response.end();
}

//Render the root page
function root_page(response) {

	console.log("Home page");
	response.writeHead(200, { "Content-Type": "text/html" });

	fs.readdir(upload_root, function (err, files) {
		if (err) {
			response.write("<h1>ERROR: Cannot enumerate upload folder.</h1>");
			response.end();
			return;
		}

		response.write("<html><head><title>File Listing</title></head><body>");
		response.write("<h1>Public upload and download repository</h1>");
		response.write('<p>Usage: This page is a public upload and download repository for this server. '
	+ 'Files that have been uploaded will appear as links below. Simply click them to download.</p>');
		response.write('<p>To upload a file, click here. <a href="upload.html">(Upload)</a></p>');
		response.write("<h3>Files:</h3>");

		files.forEach(function (file, index) {
			var html_insert = '<div><a href="' + file + '">' + file + '</a></div>';
			response.write(html_insert);
		});

		response.write("</body></html>\n");
		response.end();
	});
}
