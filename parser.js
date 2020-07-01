/*FILE FOR WEB SCRAPPING */

//require nightmare for web scrapping
const nightmare = require('nightmare')();

checkPrice();

//function to check price from amazon
async function checkPrice() {
	//get price and store in variable
	const priceString = await nightmare
		//go to the url and dwnload info from page
		.goto("https://www.amazon.com/dp/B07V7VH9RZ")
		//wait until priceblock id selector is rendered on page
		.wait("#priceblock_ourprice")
		//use evaluate to have access to the Front End of the application
		//get text inside of priceblock span
		.evaluate(() => document.getElementById('priceblock_ourprice').innerText)
		//end evaluation
		.end();

	//get rid of dollar sign
	const priceNumber = parseFloat(priceString.replace('$', ''));

	//check if price is low
	if (priceNumber < 9) {
		console.log("CHEEEAP");
	} else {
		console.log('STILL EXPENSIVE');
	}
}