const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')

const search = 'beer'
const mainUrl = 'https://www.thewhiskyexchange.com/search?q='
const fullUrl = '${mainUrl}${search}'
const wine = []
let items = 0
let total = 0

async function getWine(url) {
    try {
        const response = await axios.get(url)
        const $ = cheerio.load(response.data)

            $('li.product-grid__item').each(function(i, elem){
                title = $(elem).find('p.product-card__name').text().trim();
                imageUrl = $(elem).find('img.product-card__image').attr('src');
                currentPrice = $(elem).find('p.product-card__price').text().replace('£', '').trim();

                wine.push({
                    title,
                    imageUrl,
                    currentPrice,
                });

                    // concatenate the url to show more pages
                    if ($('div.pagination-bar__section.pagination-bar__section--paging.js-pagination-bar__section--paging nav a').attr('href') != '#') {
                        show_more = url + $('div.pagination-bar__section.pagination-bar__section--paging.js-pagination-bar__section--paging nav a').attr('href')
                        getWine(show_more);
                    };

                    //average price
                    total = total + parseFloat(currentPrice)
                    average = total / items
                });

            items = wine.length;

            wine.push({
                items,
                average
            });

            // Save to JSON
            let data = JSON.stringify(wine);
            fs.writeFileSync('challenge1_output.json', data);

        }
    catch(error) {
        console.error(error);
    }
};

getWine(fullUrl);