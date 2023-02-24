const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')

const search = 'beer'
const mainUrl = 'https://www.thewhiskyexchange.com/search?q=' + search
const wine = []
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

                //Find total of all current prices
                total = total + parseFloat(currentPrice)
            });

        let link = url.slice(0, url.lastIndexOf('/'))

        // concatenate the url to show more pages
        if ($('.paging__button--next').attr('href') != '#') {
            show_more = link + $('.paging__button--next').attr('href')
            getWine(show_more);
        } else {
            // The length of the array
            items = wine.length;

            // Average price
            numAverage = total / items;
            fixedAverage = numAverage.toFixed(2);
            average = parseFloat(fixedAverage);

            wine.push({
                items,
                average
            });

            // Save to JSON
            let data = JSON.stringify(wine);
            fs.writeFileSync('challenge2_output.json', data);

        }
    }

    catch(error) {
        //Print error if any occured
        console.error('Error!: ', error.message);
    }
};

getWine(mainUrl);