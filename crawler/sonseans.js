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
        var yerliFilmAdi = [];
        var yabanciFilmSaati = [];
        var yabanciFilmAdi = [];

        const yabanciFilmSaatTag = 'p.tur96 > a > span.aks0';
        const yabanciFilmAdiTag = 'p.tur96 > a > span.aks1';
        const yerliFilmSaatTag = 'p.tur97 > a > span.aks0';
        const yerliFilmAdiTag = 'p.tur97 > a > span.aks1';

        function addMovieInfo(htmlTag, info) {
            $chunk(htmlTag).each(function (i, elem) {
                console.log(info);

                info.push({});
                info[i] = $(this).text().trim();
            });
        }

        addMovieInfo(yabanciFilmSaatTag, yabanciFilmSaati);
        addMovieInfo(yabanciFilmAdiTag, yabanciFilmAdi);
        addMovieInfo(yerliFilmSaatTag, yerliFilmSaati);
        addMovieInfo(yerliFilmAdiTag, yerliFilmAdi);

        /*var yerliFilmAdi = [];
        $chunk('p.tur96 > a > span.aks1').each(function (i, elem) {
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
        });*/

        /*for(i = 0; i < yerliFilmAdi.length; i++){
            yerliFilmSaati[i] = yerliFilmSaati[i].toString();

            yerliFilmAdi[i] = yerliFilmAdi[i].toString();
            yayinAkisi += yerliFilmSaati[i] + ' - ' + yerliFilmAdi[i] + '\n';
        }*/

        function addToAkis(saat, adi) {
            for (var i = 0; i < adi.length; i++) {
                if (saat[i] < '22.00' && saat[i] > '20.00'){
                    saat[i] = saat[i].toString();

                    adi[i] = adi[i].toString();

                    yayinAkisi += saat[i] + ' - ' + adi[i] + '\n';
                }else
                    continue;
            }
        }


        addToAkis(yerliFilmSaati, yerliFilmAdi);
        addToAkis(yabanciFilmSaati, yabanciFilmAdi);


        return yayinAkisi;
    }).catch(function(err){
        //handle error
        return err;
    });
}

module.exports = {
    fetch : fetch
};