var express = require('express');
var router = express.Router();
var path = require('path');
var https = require("https");

router.get('/', function(req, res, next){
    res.sendFile(path.resolve(__dirname, '../views/index.html'));
});

router.get('/search', function(req, res, next){
    var query = req.query.q;
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
            res.send(resBody);
        });
    });
});

module.exports = router;