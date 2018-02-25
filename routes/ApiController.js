var express = require('express');
var router = express.Router();
var path = require('path');
var https = require("https");
var recent = [];

router.get('/', function(req, res, next){
    res.sendFile(path.resolve(__dirname, '../views/index.html'));
});

router.get('/search', function(req, res, next){
    var query = req.query.q;
    if(recent.length == 10) {
        recent.splice(9,1);
    }
    recent.unshift({query:query,date:Date()});
    var page = 1;
    if(req.query.page){
        page = req.query.page;
    } 
    https.get('https://www.googleapis.com/customsearch/v1?key=AIzaSyDFE3Wb8AgaBNV4iDxYpAhFkh3l_L7FYZw&cx=017841468666952230708:n0hlq663r-u&q='+query+'&searchType=image&start='+page,response=>{
        response.setEncoding("utf8");
        var resBody = "";
        response.on("data", data => {
            resBody += data;
        });
        response.on("end", () => {
            resBody = JSON.parse(resBody);
            var items = resBody.items;
            var sendData = {};
            var key = 'Results';
            sendData[key] = [];
            for(var i=0; i<10; i++){
                sendData[key].push({title:items[i].title,link:items[i].link, context:items[i].image.contextLink, thumbnail:items[i].image.thumbnailLink});
            }
            res.send(sendData);
        });
    });
});

router.get('/recent', function(req, res, next){
    res.send(recent);
});

module.exports = router;