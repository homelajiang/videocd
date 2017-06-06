var request = require('request');
var iconv = require('iconv-lite');
var cheerio = require('cheerio');
var async = require('async');
var FLVCD_URL = 'http://www.flvcd.com/parse.php?flag=one';
var hd_level = ['normal', 'high', 'super', 'real'];
var options = {
    headers: {
        'cache-control': 'no-cache',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8;utf-8',
        'Accept-encoding': 'gzip, deflate, sdch',
        'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6',
        'Connection': 'keep-alive'
    },
    encoding: null,
    gzip: true
}

function parseVideo(url, callback) {
    if (!url) {
        callback('params "url" is null !', null);
        return;
    }
    async.map(hd_level, function (hd, cb) {
        options.url = FLVCD_URL + "&format=" + hd + "&kw=" + url;
        request(options, function (err, res, body) {
            if (!err && res && res.statusCode == 200) {
                var html = iconv.decode(body, 'gb2312').toString();
                var $ = cheerio.load(html, { decodeEntities: false });
                var name = $('input[name="name"]').val();
                var res = $('input[name="inf"]').val();
                if (res) {
                    var videoArry = res.split('|');
                    if (videoArry && videoArry.length > 0 && !videoArry[videoArry.length - 1]) {
                        videoArry.splice(videoArry.length - 1);
                    }
                    cb(null, videoArry);
                } else {
                    cb(null, null);
                }
            } else {
                cb(null, null);
            }
        })
    }, function (err, res) {
        var temp = {};
        for (var i = 0; i < 4; i++) {
            if (res) {
                temp[hd_level[i]] = res[i];
            }
        }
        callback(null, temp);
    })
}

module.exports = parseVideo;
