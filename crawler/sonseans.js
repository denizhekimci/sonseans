const got       = require('got');
const cheerio   = require('cheerio');
const PROTOCOL = "https:";
const HOST = "https://www.trt.net.tr";

const URL = 'https://www.trtizle.com/yayin-akisi';
const puppeteer = require('puppeteer');


function fetch(){

    return got(URL).then(function(data){

        var $ = cheerio.load(data.body,{decodeEntities:false});

        var $chunk = cheerio.load($('#__layout').html(), {decodeEntities:false})
        

        var yayinAkisi = [];
        var yerliFilmSaati = [];
        var yerliFilmAdi = [];
        var yabanciFilmSaati = [];
        var yabanciFilmAdi = [];
        var searchText = '';

        const yabanciFilmSaatTag = 'p.tur96 > a > span.aks0';
        const yabanciFilmAdiTag = 'p.tur96 > a > span.aks1';
        const yerliFilmSaatTag = 'p.tur97 > a > span.aks0';
        const yerliFilmAdiTag = 'p.tur97 > a > span.aks1';

        function addMovieInfo(htmlTag, info) {
            $chunk(htmlTag).each(function (i, elem) {
                info.push({});
                info[i] = $(this).text().trim();
            });
        }

        addMovieInfo(yabanciFilmSaatTag, yabanciFilmSaati);
        addMovieInfo(yabanciFilmAdiTag, yabanciFilmAdi);
        addMovieInfo(yerliFilmSaatTag, yerliFilmSaati);
        addMovieInfo(yerliFilmAdiTag, yerliFilmAdi);


        function addToAkis(saat, adi) {
            for (var i = 0; i < adi.length; i++) {
                if ((saat[i] < '23.59' && saat[i] > '20.00') && adi[i].includes('Sinema')){
                    saat[i] = saat[i].toString();

                    adi[i] = adi[i].toString();

                    yayinAkisi += saat[i] + ' - ' + adi[i] + '\n';
                    searchText = adi[i].substring(
                        str.lastIndexOf("(") + 1, 
                        str.lastIndexOf(")")
                    );
                    
                }else
                    continue;
            }
        }


        addToAkis(yerliFilmSaati, yerliFilmAdi);
        addToAkis(yabanciFilmSaati, yabanciFilmAdi);

       
       
       /* run(searchText).then(result =>{
            yayinAkisi += '\nFilm Açıklaması: ' + result;
        })*/
        
        return yayinAkisi;
    }).catch(function(err){
        //handle error
        return err;
    });
}



module.exports = {
    fetch : fetch
};
