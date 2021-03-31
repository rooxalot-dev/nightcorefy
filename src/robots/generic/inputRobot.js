import { question, keyInSelect, keyInYN } from 'readline-sync';

const inputRobot = {
	getSongInput: async function (data) {
		data.songName = question('Tell me the name of the song you thinking: ');
	},
	getBandInput: async function (data) {
		if (keyInYN('Do you want to mention the band name?')) {
			data.bandName = question('Tell me the band name: ');
		}
	},
	getFormatInput: async function (data) {
		const formats = ['Audio', 'Video'];
		const songFormatIndex = keyInSelect(
			formats,
			'Which format you want to download the music?',
			{ defaultInput: 'Video' }
		);

		if (songFormatIndex >= 0) {
			data.songFormat = formats[songFormatIndex];
		} else {
			data.songFormat = 'Video';
		}
	},

	run: async function (data) {
		await this.getSongInput(data);
		await this.getBandInput(data);
		await this.getFormatInput(data);

		const { songName, bandName, songFormat } = data;
		let returnMessage = '';

		if (!!songName || !!bandName) {
			data.searchTerm = songName;
			returnMessage = `Ok! Let's search for ${songName}`;

			if (bandName) {
				data.searchTerm += ` ${bandName}`;
				returnMessage += ` from the band ${bandName}`;
			}

			returnMessage += ` in the ${songFormat} format`;

			console.log(returnMessage);
		}
	},
};

export default inputRobot;
