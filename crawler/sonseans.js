const got       = require('got');
const cheerio   = require('cheerio');
const Nightmare = require('nightmare');
const nightmare = Nightmare({show: true});
const PROTOCOL = "https:";
const HOST = "https://www.trt.net.tr";

const URL = 'http://www.trt.net.tr/televizyon/akis.aspx?kanal=trt-2&gun=0';
const URLTRAltyazi = 'https://turkcealtyazi.org/index.php';

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

function fetchWithNightmare(){
    let getData = html => {
        data = [];
        const d = cheerio.load(html);
        d('#ncontent > div > div.sub-container.nleft > div:nth-child(1) > div:nth-child(4) > ul > li:nth-child(1) > div.incdiv')
        .each((i, elem) => {
            data.push({
                title: d(elem).text()
            });
        });
        return data;
    }
    return nightmare
        .goto(URLTRAltyazi)
        .wait('body')
        .evaluate(() => document.querySelector('body').innerHTML)
        .end()
        .then(response => {
            console.log(getData(response));
            return getData(response);
        }).catch(err => {
            console.log(err);
            return err;
        });
}

module.exports = {
    fetch : fetch
};