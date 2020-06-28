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

        var yerliFilmSaati = [];
        $chunk('p.tur96 > a > span.aks0').each(function (i, elem) {
            console.log(yerliFilmSaati);

            yerliFilmSaati.push({});
            yerliFilmSaati[i] = $(this).text().trim();
        });

        var yerliFilmAdi = [];
        $chunk('p.tur96 > a > span.aks1').each(function (i, elem) {
            console.log(yerliFilmAdi);

            yerliFilmAdi.push({});
            yerliFilmAdi[i] = $(this).text().trim();
        });

        var yabanciFilmSaati = [];
        $chunk('p.tur97 > a > span.aks0').each(function (i, elem) {
            console.log(yabanciFilmSaati);

            yabanciFilmSaati.push({});
            yabanciFilmSaati[i] = $(this).text().trim();
        });

        var yabanciFilmAdi = [];
        $chunk('p.tur97 > a > span.aks1').each(function (i, elem) {
            console.log(yabanciFilmAdi);

            yabanciFilmAdi.push({});
            yabanciFilmAdi[i] = $(this).text().trim();
        });

        for(i = 0; i < yerliFilmAdi.length; i++){
            yerliFilmSaati[i] = yerliFilmSaati[i].toString();

            yerliFilmAdi[i] = yerliFilmAdi[i].toString();
            yayinAkisi += yerliFilmSaati[i] + ' - ' + yerliFilmAdi[i] + '\n';
        }

        for(i = 0; i < yabanciFilmAdi.length; i++){
            yabanciFilmSaati[i] = yabanciFilmSaati[i].toString();

            yabanciFilmAdi[i] = yabanciFilmAdi[i].toString();
            yayinAkisi += yabanciFilmSaati[i] + ' - ' + yabanciFilmAdi[i] + '\n';
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