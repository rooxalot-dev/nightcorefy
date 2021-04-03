import puppeteer from 'puppeteer';

const pinterestImageRobot = {
	getWebPage: async function (data) {
		let pressetImageSearch = '';
		const { songPressetMix } = data;
		switch (songPressetMix) {
			case 'slowed':
				pressetImageSearch = 'retro anime aesthetic gif';
				break;
			case 'nightcore':
				pressetImageSearch = 'anime aesthetic nightcore';
				break;
			default:
				break;
		}

		data.pressetImageSearch = pressetImageSearch;

		const pageURL = `https://br.pinterest.com/search/pins/?q=${pressetImageSearch}&rs=typed`;

		const browser = await puppeteer.launch({ headless: false });
		const page = await browser.newPage();
		await page.goto(pageURL, { waitUntil: 'networkidle0' });

		return { browser, page };
	},

	getSearchResults: async function (page) {
		await page.waitForTimeout(3000);

		// Get data from the results
		const imageSearchResults = await page.evaluate(() => {
			let imageSrcSet = Array.from(
				document.querySelectorAll('div.Collection img')
			);

			return imageSrcSet.map((i) => {
				let src = '';
				if (i.srcset && i.srcset.includes('originals')) {
					const splitedSrc = i.srcset.split(', ');
					src = splitedSrc.find((src) => src.includes('originals'));
				} else {
					src = i.currentSrc;
				}

				return src;
			});
		});

		return imageSearchResults;
	},

	run: async function (data) {
		const { browser, page } = await this.getWebPage(data);
		data.imageSearchResults = await this.getSearchResults(page);
		//await browser.close();
	},
};

export default pinterestImageRobot;
