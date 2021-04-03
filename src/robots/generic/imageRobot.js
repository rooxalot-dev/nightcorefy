import puppeteer from 'puppeteer';

const inputRobot = {
	getWebPage: async function (data) {
		let pressetImageSearch = '';
		const { songPressetMix } = data;
		switch (songPressetMix) {
			case 'slowed':
				pressetImageSearch = 'anime aesthetic gif beach';
				break;
			case 'nightcore':
				pressetImageSearch = 'anime aesthetic nightcore wallpaper';
				break;
			default:
				break;
		}

		const pageURL = `https://www.google.com/search?q=${pressetImageSearch}&source=lnms&tbm=isch&sa=X&ved=2ahUKEwjzgOrT8N3vAhWhGbkGHdXuBHUQ_AUoAXoECAEQAw`;

		const browser = await puppeteer.launch({ headless: false });
		const page = await browser.newPage();
		await page.goto(pageURL);

		return { browser, page };
	},
	sendPageSearch: async function (page, data) {
		// // Get youtube inputs
		// const googleSearchInput = await page.$('input[title=Pesquisar]');
		// const googleSearchButtons = await page.$$(
		// 	'div:not([jscontroller]) input[aria-label="Pesquisa Google"]'
		// );
		// // Send the search term
		// await googleSearchInput.type(pressetImageSearch);
		// await googleSearchButtons.forEach(async (e) => {
		// 	try {
		// 		await e.click();
		// 	} catch (error) {
		// 		console.log('Button not found in DOM');
		// 	}
		// });
		// await page.waitForNavigation({ waitUntil: 'networkidle0' });
	},

	run: async function (data) {
		const { browser, page } = await this.getWebPage(data);
		await this.sendPageSearch(page, data);

		//data.searchResults = await this.getSearchResults(page);

		//await browser.close();
	},
};

export default inputRobot;
