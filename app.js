const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')


axios.get('https://cdn.adimo.co/clients/Adimo/test/index.html')
    .then(function(response) {
        // HTML is inside response.data
        let $ = cheerio.load(response.data)

        const cheese = []
        let count = 0
        let total = 0

        $('div.item').each(function(i, elem){
            title = $(elem).find('h1').text();
            imageUrl = $(elem).find('img').attr('src');
            currentPrice = $(elem).find('span.price').text();
            oldPrice = $(elem).find('span.oldPrice').text();

            cheese.push({
                title, 
                imageUrl, 
                currentPrice, 
                oldPrice
            })

            //count iterations
            count =+ i + 1

            //average price
            total =+ currentPrice
            
            average = total / count;
        })

        // Save to JSON
        // let data = JSON.stringify(cheese);
        // fs.writeFileSync('test.json', data);


        // console.log(cheese);

        console.log(count);

        console.log(currentPrice);
    })
    .catch(function(error) {
        //Print error if any occured
        console.error('Error!: ', error.message)
    })

// Could you please process the html and save out a JSON file with:

// Each product as it's own object containing.
    // title
    // image url
    // price and any discount.
// The total number of items
// The average price of all items.