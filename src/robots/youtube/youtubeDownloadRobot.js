import fs from 'fs';
import path from 'path';
import ytdl from 'ytdl-core';
import ffmpeg from 'fluent-ffmpeg';
import { keyInSelect } from 'readline-sync';

import pathUtils from '../../utils/pathsUtils';

const youtubeDownloadRobot = {
	getFormatInput: function (data) {
		const formats = ['audio', 'video'];
		const songFormatIndex = keyInSelect(
			formats,
			'Which format you want to download the music?'
		);

		if (songFormatIndex >= 0) {
			data.songFormat = formats[songFormatIndex];
		} else {
			data.songFormat = 'audio';
		}
	},
	getConfigurationByFormat: function (data) {
		const { songFormat } = data;
		const { audiosPath, videosPath } = pathUtils;

		const formatExtension = songFormat === 'video' ? '.mp4' : '.mp3';
		const youtubeFilter = songFormat === 'video' ? 'video' : 'audioonly';
		const folder = songFormat === 'video' ? videosPath : audiosPath;

		data.formatExtension = formatExtension;

		return {
			formatExtension,
			youtubeFilter,
			folder,
		};
	},
	getFileInfos: function (data) {
		let { videoTitle } = data.pickedResult;
		videoTitle = videoTitle.replace(/[^\w\s]/gi, '');
		const {
			formatExtension,
			youtubeFilter,
			folder,
		} = this.getConfigurationByFormat(data);

		// Defines the file name before being processed
		const rawFileName = `${videoTitle} (RAW)${formatExtension}`;
		data.rawFileName = rawFileName;

		const saveDir = folder;
		const rawFilePath = path.join(saveDir, rawFileName);

		// Creates the directory in case it doesn't exist
		if (!fs.existsSync(saveDir)) {
			fs.mkdirSync(saveDir, { recursive: true });
		}

		return {
			youtubeFilter,
			rawFileName,
			rawFilePath,
		};
	},
	downloadYoutubeFile: async function (data) {
		const { videoLink } = data.pickedResult;
		const { youtubeFilter, rawFileName, rawFilePath } = this.getFileInfos(data);

		await new Promise((resolve, reject) => {
			const youtubeLink = `https://www.youtube.com${videoLink}`;

			ytdl(youtubeLink, { filter: youtubeFilter, quality: 'highest' }).pipe(
				fs
					.createWriteStream(rawFilePath)
					.on('error', (err) => {
						console.log(
							`An error ocurred while saving the file: ${err.message}`
						);
						reject(err.message);
					})
					.on('finish', () => {
						console.log('Youtube download finished');
						data.rawFileName = rawFileName;
						data.rawFilePath = rawFilePath;
						resolve(data);
					})
			);
		});
	},

	run: async function (data) {
		if (data.pickedResult) {
			this.getFormatInput(data);
			await this.downloadYoutubeFile(data);
		} else {
			console.log(`There's no result to download!`);
		}
	},
};

export default youtubeDownloadRobot;
