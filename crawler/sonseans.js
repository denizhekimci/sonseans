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
        /*

        $chunk('p.tur97 > a > span.aks0').each(function (i, elem) {
            var movieTimes = elem.children[0].data;
            console.log(movieTimes);
            movieTimes = (!isNaN(movieTimes)) ? movieTimes.replace(/\n/g, "").replace(/\t/g, "") : null;
            yayinAkisi.movieTimes = movieTimes;
        });

        $chunk('p.tur97 > a > span.aks1').each(function (i, elem) {
            var movieTitles = elem.children[0].data;
            movieTitles = (!isNaN(movieTitles)) ? movieTitles.replace(/\n/g, "").replace(/\t/g, "") : null;
            yayinAkisi.movieTitles = movieTitles;
        });*/

        let movieTimes = [];
        movieTimes = $('#gunlukAkisDIV > p.tur97 > a > span.aks0 ', data).map(function() {
            return $(this).text();
        }).toArray();

        let movieTitles = [];
        movieTitles = $('#gunlukAkisDIV > p.tur97 > a > span.aks1 ', data).map(function() {
            return $(this).text();
        }).toArray();

        for(i = 0; i < movieTitles.length; i++){
            yayinAkisi += movieTimes[i] + ' - ' + movieTitles[i] + '\n';
        }
        console.log('Yayın Akışı' + yayinAkisi);

        yayinAkisi = yayinAkisi.toString()
            .replace(/_/g, "\\_")
            .replace(/\*/g, "\\*")
            .replace(/\[/g, "\\[")
            .replace(/`/g, "\\`");
        return yayinAkisi;
    }).catch(function(err){
        //handle error
        return err;
    });
}

module.exports = {
    fetch : fetch
};