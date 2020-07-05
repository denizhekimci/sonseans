const got = require('got');
const cheerio = require('cheerio');
const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: true });
const PROTOCOL = "https:";
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

                    yayinAkisi += saat[i] + ' - ' + adi[i] + '\n';
                } else
                    continue;
            }
        }


        addToAkis(yerliFilmSaati, yerliFilmAdi);
        addToAkis(yabanciFilmSaati, yabanciFilmAdi);


        return yayinAkisi;
    }).catch(function (err) {
        //handle error
        return err;
    });
}

function fetchDescription() {
   return async (req, res) => {
        let ret = [];
        const { search } = req.query;
        try {
            (async () => {
                const browser = await puppeteer.launch()
                const page = await browser.newPage()
                await page.goto(URLTRAltyazi)
                await page.type('#autoFindNew', { search })
                await page.click('#nForm > input[type=submit]:nth-child(14)')
                await page.waitForSelector('#ncontent > div > div.sub-container.nleft > div > div:nth-child(3)')
                const links = await page.$$('div:nth-child(1) > a');
                await links[0].click();
                const movie = await page.$$eval('#ncontent > div > div.sub-container.nleft > div.nm-block.nm-ozet > div', anchors => {
                    return anchors.map(anchor => anchor.textContent.trim()).slice(0, 10)
                })
                console.log(movie)
                await browser.close()
            })()
        }
        catch (err) {
            res.status(500).send(err.message);
        }
    }
};


module.exports = {
    fetch: fetch,
    fetchDescription: fetchDescription
};