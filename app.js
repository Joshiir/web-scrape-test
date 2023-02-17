const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')


axios.get('https://cdn.adimo.co/clients/Adimo/test/index.html')
    .then(function(response) {
        // HTML is inside response.data
        let $ = cheerio.load(response.data)

        const cheese = []
        let items = 0
        let total = 0

        $('div.item').each(function(i, elem){
            title = $(elem).find('h1').text();
            imageUrl = $(elem).find('img').attr('src');
            currentPrice = $(elem).find('span.price').text().replace('£', '');
            oldPrice = $(elem).find('span.oldPrice').text().replace('£', '');

            cheese.push({
                title,
                imageUrl,
                currentPrice,
                oldPrice
            });

            //count iterations to find total number of items
            items =+ i + 1

            //average price
            total = total + parseFloat(currentPrice)
            average = total / items;
        });

        cheese.push({
            items,
            average
        });

        // Save to JSON
        let data = JSON.stringify(cheese);
        fs.writeFileSync('cheese_output.json', data);

    })
    .catch(function(error) {
        //Print error if any occured
        console.error('Error!: ', error.message)
    })