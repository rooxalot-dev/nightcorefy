import { keyInYNStrict, keyInSelect } from 'readline-sync';

const youtubeResultPickerRobot = {
	ordernateResults: async function (data) {
		if (keyInYNStrict('Do you want to order the results by views?')) {
			data.searchResults.sort(
				(resultA, resultB) => resultB.viewsCount - resultA.viewsCount
			);
		}
	},

	pickResult: async function (data) {
		const results = data.searchResults.map((result) => {
			return `Title: ${
				result.videoTitle
			} | time: ${result.videoTime.trim().replace('/n', '')} | views: ${
				result.viewsCount
			}`;
		});

		const index = keyInSelect(results, 'Pick the result you want to use: ');
		if (index >= 0) {
			data.pickedResult = data.searchResults[index];
			console.log(results[index] + ' has been picked!');
		}
	},

	run: async function (data) {
		await this.ordernateResults(data);
		await this.pickResult(data);
	},
};

export default youtubeResultPickerRobot;
