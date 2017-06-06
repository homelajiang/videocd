var videocd = require('./videocd.js');

videocd("http://www.acfun.cn/v/ac3739136", function (err, res) {
    if (err) {
        console.log(err);
    } else {
        console.log(JSON.stringify(res));
    }
});