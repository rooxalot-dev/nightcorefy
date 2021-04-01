import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import { keyInSelect } from 'readline-sync';
import pathUtils from '../../utils/pathsUtils';

const mixAudioRobot = {
	askMixPresset: function (data) {
		const pressets = ['normal', 'slowed', 'nightcore'];
		const songFormatIndex = keyInSelect(
			pressets,
			'Which presset you want to choose?'
		);

		if (songFormatIndex >= 0) {
			data.songPressetMix = pressets[songFormatIndex];
		} else {
			data.songPressetMix = 'normal';
		}
	},
	getPressetMix: function (data) {
		const { songPressetMix } = data;

		switch (songPressetMix) {
			case 'normal':
				return [];
			case 'slowed':
				return ['asetrate=44100*0.9', 'atempo=1/0.95'];
			case 'nightcore':
				return ['asetrate=44100*1.30', 'atempo=1.07'];
			default:
				break;
		}
	},
	mixFile: async function (data) {
		const { audiosPath } = pathUtils;
		const { finalFileName, processedFilePath, songPressetMix } = data;
		const presetMixArray = this.getPressetMix(data);

		const pressetFinalFileName = path.join(
			audiosPath,
			finalFileName.replace('(Processed)', `(${songPressetMix})`)
		);

		console.log(
			`File ${processedFilePath} will be processed with the ${songPressetMix} presset`
		);

		return await new Promise((resolve, reject) => {
			ffmpeg(processedFilePath)
				.audioFilters(presetMixArray)
				.toFormat('mp3')
				.save(pressetFinalFileName)
				.on('error', (err) => {
					console.log(
						`An error ocurred while formating the file: ${err.message}`
					);
					reject(err.message);
				})
				.on('progress', (progress) => {
					console.log(
						`Processing the file: ${progress.targetSize} KB converted`
					);
				})
				.on('end', () => {
					data.mixedFileName = pressetFinalFileName;
					resolve(data);
				});
		});
	},

	run: async function (data) {
		this.askMixPresset(data);
		await this.mixFile(data);
	},
};

export default mixAudioRobot;
