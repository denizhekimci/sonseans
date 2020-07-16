const got = require('got');
const cheerio = require('cheerio');
const HOST = "https://www.trt.net.tr";

const URL = 'http://www.trt.net.tr/televizyon/akis.aspx?kanal=trt-2&gun=0';
const URLTRAltyazi = 'https://turkcealtyazi.org/index.php';

const puppeteer = require('puppeteer');

function fetch() {

    return got(URL).then(function (data) {

        var $ = cheerio.load(data.body, { decodeEntities: false });

        var $chunk = cheerio.load($('#gunlukAkisDIV').html(), { decodeEntities: false })

        var yayinAkisi = [];
        var yerliFilmSaati = [];
        var yerliFilmAdi = [];
        var yabanciFilmSaati = [];
        var yabanciFilmAdi = [];
        var searchText = "";

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
                if (saat[i] < '22.00' && saat[i] > '20.00') {
                    saat[i] = saat[i].toString();

                    adi[i] = adi[i].toString();
                    searchText  = adi[i].substring(
                        adi[i].lastIndexOf("(") + 1,
                        adi[i].lastIndexOf(")")
                    );

                    yayinAkisi += saat[i] + ' - ' + adi[i] + '\n';
                } else
                    continue;
            }
        }


        addToAkis(yerliFilmSaati, yerliFilmAdi);
        addToAkis(yabanciFilmSaati, yabanciFilmAdi);

        console.log(searchText);
        run(searchText).then(txt=>{
            yayinAkisi += "Film Açıklaması: " + txt;
        }).catch(console.error);


        return yayinAkisi;
    }).catch(function (err) {
        //handle error
        return err;
    });
}

function run (searchText) {
    return new Promise(async (resolve, reject) => {
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(URLTRAltyazi);
            await page.waitForSelector('#autoFindNew');
            await page.type('#autoFindNew', searchText)
            await page.click('#nForm > input[type=submit]:nth-child(14)')
            await page.waitForSelector('#ncontent > div > div.sub-container.nleft > div > div:nth-child(3)')
            await page.click('#ncontent > div > div.sub-container.nleft > div > div:nth-child(3) > div:nth-child(2) > a')
            await page.waitForSelector('#ncontent > div > div.sub-container.nleft > div.nm-block.nm-ozet > div')
            const element = await page.$(".ozet-goster")
            const text = await (await element.getProperty('textContent')).jsonValue();
            browser.close();
            return resolve(text);
        } catch (e) {
            return reject(e);
        }
    })
}



module.exports = {
    fetch: fetch
};