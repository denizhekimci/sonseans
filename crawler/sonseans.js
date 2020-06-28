const got       = require('got');
const cheerio   = require('cheerio');
const PROTOCOL = "https:";
const HOST = "https://www.trt.net.tr";

const URL = 'http://www.trt.net.tr/televizyon/akis.aspx?kanal=trt-2&gun=0';

function fetch(){

    return got(URL).then(function(data){

        var $ = cheerio.load(data.body,{decodeEntities:false});

        var $chunk = cheerio.load($('#gunlukAkisDIV').html(), {decodeEntities:false})

        var yayinAkisi = [];

        var movieTimes = [];
        $chunk('p.tur97 > a > span.aks0').each(function (i, elem) {
            console.log(movieTimes);

            movieTimes.push({});
            movieTimes[i] = $(this).text().trim();
        });

        var movieTitles = [];
        $chunk('p.tur97 > a > span.aks1').each(function (i, elem) {
            console.log(movieTitles);

            movieTitles.push({});
            movieTitles[i] = $(this).text().trim();
        });

        for(i = 0; i < movieTitles.length; i++){
            movieTimes[i] = movieTimes[i].toString();

            movieTitles[i] = movieTitles[i].toString();
            yayinAkisi += movieTimes[i] + ' - ' + movieTitles[i] + '\n';
        }

        return yayinAkisi;
    }).catch(function(err){
        //handle error
        return err;
    });
}

module.exports = {
    fetch : fetch
};