const got       = require('got');
const cheerio   = require('cheerio');
const rp = require('request-promise');
const PROTOCOL = "https:";
const HOST = "https://www.trt.net.tr";

const URL = 'http://www.trt.net.tr/televizyon/akis.aspx?kanal=trt-2&gun=0';

function fetch(){

    return got(URL).then(function(data){

        var $ = cheerio.load(data.body,{decodeEntities:false});

        var $chunk = cheerio.load($('#gunlukAkisDIV').html(), {decodeEntities:false})

        var yayinAkisi = {
            claim: URL
        }

        $chunk('p.tur97 > a > span.aks0').each(function (i, elem) {
            var movieTimes = elem.attribs.href;
            movieTimes = movieTimes.replace(/\n/g, "").replace(/\t/g, "");
            yayinAkisi.movieTimes = movieTimes;
        });

        $chunk('p.tur97 > a > span.aks1').each(function (i, elem) {
            var movieTitles = elem.attribs.href;
            movieTitles = movieTitles.replace(/\n/g, "").replace(/\t/g, "");
            yayinAkisi.movieTitles = movieTitles;
        });

        return yayinAkisi;
    });
}

module.exports = {
    fetch : fetch
};