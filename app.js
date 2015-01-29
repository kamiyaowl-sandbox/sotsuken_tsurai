var http = require("http");
var fs = require("fs");

console.log("wake up sotsuken tsurai");

var server = http.createServer(function (req, res) {
    res.writeHead(200, { "Content-Type" : "text/html" });
    var out = fs.readFileSync("./index.html", "utf-8");
    res.end(out);
}).listen(8080);

var tsurasa_count = 0;
var tsurasa_path = "tsurasa.txt";
var shinitai_count = 0;
var yokou_date = new Date(2015, 1, 23, 17, 0, 0, 0);
var happyou_date = new Date(2015, 1, 27, 8, 50, 0, 0);
var backup_interval = 60000;

fs.readFile(tsurasa_path, function (err, tsurasou) {
    if (err) return;
    var tsura = parseInt(tsurasou.toString());
    console.log("#tsurasou", tsura);
    tsurasa_count = tsura;
});

setInterval(function () {
    console.log("@shinitasa backup@", tsurasa_count)
    fs.writeFile(tsurasa_path, tsurasa_count, function (err) { if(err) console.log(err); });
}, backup_interval);



var io = require("socket.io").listen(server);

io.sockets.on("connection", function (socket) {
    shinitai_count++;
    console.log("#connection", shinitai_count);
    io.sockets.emit("shinitai", shinitai_count);
    
    socket.on("sugoku", function (data) {
        tsurasa_count++;
        console.log("#sugoku", tsurasa_count);
        io.sockets.emit("tsurai", tsurasa_count);
    });
    socket.on("mou", function (data) {
        console.log("#mou");
        var return_data = {};
        if (data.yokou) {
            console.log("##yokou", yokou_date);
            return_data.yokou = yokou_date;
        }
        if (data.happyou) {
            console.log("##happyou", happyou_date);
            return_data.happyou = happyou_date;
        }
        if (data.tsurasa) {
            console.log("##tsurasa", tsurasa_count);
            return_data.tsurasa = tsurasa_count;
        }
        if (data.shinitai) {
            console.log("##shinitai", shinitai_count);
            return_data.shinitai = shinitai_count;
        }
        socket.emit("yada", return_data);
    });
    
    socket.on("disconnect", function () {
        shinitai_count--;
        console.log("#disconnect", shinitai_count);
        io.sockets.emit("shinitai", shinitai_count);
    });
});