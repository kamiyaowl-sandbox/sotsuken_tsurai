var http = require("http");
var fs = require("fs");

var server = http.createServer(function (req, res) {
    res.writeHead(200, { "Content-Type" : "text/html" });
    var out = fs.readFileSync("./index.html", "utf-8");
    res.end(out);
}).listen(8080);

var io = require("socket.io").listen(server);
