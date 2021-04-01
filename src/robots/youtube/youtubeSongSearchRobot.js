import puppeteer from 'puppeteer';

const youtubeSongSearchRobots = {
	getWebPage: async function () {
		const browser = await puppeteer.launch();

		const page = await browser.newPage();
		await page.goto('https://www.youtube.com/');

		return { browser, page };
	},

	sendPageSearch: async function (page, data) {
		// Get youtube inputs
		const youtubeSearchInput = await page.$('input#search');
		const youtubeSearchButton = await page.$('button#search-icon-legacy');

		// Send the search term
		await youtubeSearchInput.type(data.searchTerm || '');
		await youtubeSearchButton.click();

		await page.waitForNavigation({ waitUntil: 'networkidle0' });
	},

	getSearchResults: async function (page) {
		// Get data from the results
		const youtubeResults = await page.evaluate(() => {
			const searchResults = document.querySelectorAll(
				'#container.style-scope.ytd-search #contents #dismissible'
			);

			return Array.from(searchResults).map((element) => {
				const metadataElement = element.querySelector('#meta #video-title');
				const timeSpanElement = element.querySelector(
					'span.ytd-thumbnail-overlay-time-status-renderer'
				);

				const videoTitle = metadataElement.getAttribute('title');
				const videoLink = metadataElement.getAttribute('href');
				const videoStringMetadata = metadataElement.getAttribute('aria-label');
				const videoTime = timeSpanElement.innerText;

				return {
					videoTitle,
					videoTime,
					videoLink,
					videoStringMetadata,
				};
			});
		});

		return youtubeResults;
	},

	run: async function (data) {
		const { browser, page } = await this.getWebPage();
		await this.sendPageSearch(page, data);

		data.searchResults = await this.getSearchResults(page);

		await browser.close();

		return data.searchResults;
	},
};

export default youtubeSongSearchRobots;
