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

		// Defines the file name before being processed and the final file name
		const youtubeFileName = `${videoTitle} (Youtube)${formatExtension}`;
		const finalFileName = `${videoTitle}${formatExtension}`;

		const saveDir = folder;
		const youtubeVideoFile = path.join(saveDir, youtubeFileName);
		const finalFile = path.join(saveDir, finalFileName);

		// Creates the directory in case it doesn't exist
		if (!fs.existsSync(saveDir)) {
			fs.mkdirSync(saveDir, { recursive: true });
		}

		return {
			youtubeFilter,
			youtubeVideoFile,
			finalFile,
		};
	},
	downloadYoutubeFile: async function (data) {
		const { videoLink } = data.pickedResult;
		const { youtubeFilter, youtubeVideoFile } = this.getFileInfos(data);

		await new Promise((resolve, reject) => {
			const youtubeLink = `https://www.youtube.com${videoLink}`;

			ytdl(youtubeLink, { filter: youtubeFilter, quality: 'highest' }).pipe(
				fs
					.createWriteStream(youtubeVideoFile)
					.on('error', (err) => {
						console.log(
							`An error ocurred while saving the file: ${err.message}`
						);
						reject(err.message);
					})
					.on('finish', () => {
						console.log('Youtube download finished');
						resolve(data);
					})
			);
		});
	},
	convertToAudioToMp3: async function (data) {
		const { youtubeVideoFile, finalFile } = this.getFileInfos(data);

		return await new Promise((resolve, reject) => {
			ffmpeg(youtubeVideoFile)
				.withAudioCodec('libmp3lame')
				.toFormat(data.formatExtension.replace('.', ''))
				.save(finalFile)
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
					console.log('Processing finished!');

					data.processedFilePath = finalFile;
					resolve(data);
				});
		});
	},

	run: async function (data) {
		if (data.pickedResult) {
			this.getFormatInput(data);
			await this.downloadYoutubeFile(data);

			if (data.songFormat !== 'audio') return;

			await this.convertToAudioToMp3(data);
		} else {
			console.log(`There's no result to download!`);
		}
	},
};

export default youtubeDownloadRobot;
