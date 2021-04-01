import { question, keyInYN } from 'readline-sync';

const inputRobot = {
	getSongInput: async function (data) {
		data.songName = question('Tell me the name of the song you thinking: ');
	},
	getBandInput: async function (data) {
		if (keyInYN('Do you want to mention the band name?')) {
			data.bandName = question('Tell me the band name: ');
		}
	},

	run: async function (data) {
		await this.getSongInput(data);
		await this.getBandInput(data);

		const { songName, bandName } = data;
		let returnMessage = '';

		if (!!songName || !!bandName) {
			data.searchTerm = songName;
			returnMessage = `Ok! Let's search for ${songName}`;

			if (bandName) {
				data.searchTerm += ` ${bandName}`;
				returnMessage += ` from the band ${bandName}`;
			}

			console.log(returnMessage);
		}
	},
};

export default inputRobot;
