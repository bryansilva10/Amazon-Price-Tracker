/*FILE FOR WEB SCRAPPING */

//Load all env vars
require('dotenv').config();
//require sendgrid
const sgMail = require('@sendgrid/mail');
//set api key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

//require nightmare for web scrapping
const nightmare = require('nightmare')();

//get arguments for dynamic url and price
//get whats after node parser.js
const args = process.argv.slice(2);
//url
const url = args[0];
//minimum price
const minPrice = args[1];

//Execute function to check price
checkPrice();

//function to check price from amazon
async function checkPrice() {
	//try to check the price and send email
	try {
		//get price and store in variable
		const priceString = await nightmare
			//go to the url and dwnload info from page
			.goto(url)
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
		if (priceNumber < minPrice) {
			//send email
			sendEmail('LOW PRICE ALERT', `The price or ${url} is lower than ${minPrice}. Hurry up to buy it!`)
		}
	} catch (err) {
		//send email with error message
		sendEmail('Checking Price Failed', `This is the error: <br> ${err.message}`);
		//throw error
		throw err;
	}
}

//function to send email with price update
function sendEmail(subject, body) {
	//define an email object
	const email = {
		to: 'jejav39006@trysubj.com',
		from: 'pricechecker@example.com',
		subject: subject,
		text: body,
		html: body
	}

	//return the email using sendgrid (returns a promise)
	return sgMail.send(email);
}