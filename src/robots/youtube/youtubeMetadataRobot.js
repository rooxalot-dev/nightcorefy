const youtubeMetadataRobot = {
	extractMetadata: async function (data) {
		const stringMetadata = data.videoStringMetadata || '';

		// Get the relevant parts from the string metadata
		const [views] = stringMetadata.match(/[\d.]*[\s][visualizações]+$/g);
		const [, postDataAndViews] = stringMetadata.split('há');

		// Get how much time has passed since the video posting
		if (postDataAndViews) {
			let sinceThenPostedDate = postDataAndViews.replace(views, '');
			sinceThenPostedDate = sinceThenPostedDate.trim();
			data.postedSince = sinceThenPostedDate;
		}

		// Get how much views the video have
		if (views) {
			let viewsCount = views.replace('visualizações', '');
			viewsCount = viewsCount.trim();
			viewsCount = viewsCount.replace(/\./g, '');

			const numericViews = parseFloat(viewsCount);
			if (!Number.isNaN(numericViews)) data.viewsCount = numericViews;
		}
	},

	getListMetadata: async function (searchResults) {
		await searchResults.forEach(async (result) => {
			await this.extractMetadata(result);
		});
	},

	run: async function (data) {
		await this.getListMetadata(data.searchResults);
	},
};

export default youtubeMetadataRobot;
