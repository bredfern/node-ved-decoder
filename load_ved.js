var base64 = require('base-64');
var fs = require('fs');

function ved_decode(ved) {
    var keys = { t: 2, r: 6, s: 7, i: 1 }, ret = {}, re, match;
    if (String(ved).match(/^1/)) {
        re = /([a-z]+):([0-9]+)/ig;
        while ((match = re.exec(ved)) !== null)
            ret[keys[match[1]] || match[1]] = parseInt(match[2], 10);
        return ret;
    }
    ved = String(ved).replace(/_/, '+').replace('-', '/');
    ved = base64.decode((ved + "===").slice(1, ved.length + 3 - (ved.length + 2) % 4));
    re  = /([\x80-\xff]*[\x00-\x7f])([\x80-\xff]*[\x00-\x7f])/g;
    while ((match = re.exec(ved)) !== null)
        ret[varint_decode(match[1]) >> 3] = varint_decode(match[2]);
    return ret;
    function varint_decode(vint) {
        var ret = 0, i = 0;
        for (; i < vint.length; ++i) ret += (vint.charCodeAt(i) & 0x7f) << (i * 7);
        return ret;
    }
}

fs.readFile('ved_codes.txt', function(err, data) {
    if(err) throw err;
    var array = data.toString().split("\n");
    for(i in array) {
	    console.log("line number: " + i);
	    console.log(ved_decode(array[i]));
    }
});
