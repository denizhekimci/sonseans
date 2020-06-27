const got       = require('got');
const cheerio   = require('cheerio');
const rp = require('request-promise');
const PROTOCOL = "https:";
const HOST = "https://www.trt.net.tr";

const URL = 'http://www.trt.net.tr/televizyon/akis.aspx?kanal=trt-2&gun=0';

function fetch(){

    return got(URL).then(function(data){

        var $ = cheerio.load(data.body,{decodeEntities:false});

        var yayinAkisi = {
            claim: URL
        }
        let txt = rp(url)
            .then(function (html) {
                let movieTimes = $('#gunlukAkisDIV > p.tur97 > a > span.aks0 ', html).map(function () {
                    return $(this).text();
                }).toArray();

                let movieTitles = [];
                movieTitles = $('#gunlukAkisDIV > p.tur97 > a > span.aks1 ', html).map(function () {
                    return $(this).text();
                }).toArray();

                for (let i = 0; i < movieTitles.length; i++) {
                    yayinAkisi += movieTimes[i] + ' - ' + movieTitles[i] + '\n';
                }
                var resultText = 'TRT2\'de bugünkü filmler:\n' + yayinAkisi

                return resultText;
            }).catch(function (err) {
                //handle error
                return err;
            });


        return yayinAkisi;
    });
}

module.exports = {
    fetch : fetch
};