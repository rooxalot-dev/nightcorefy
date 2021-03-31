import fs from 'fs';
import path from 'path';
import ytdl from 'ytdl-core';
import ffmpeg from 'fluent-ffmpeg';

const youtubeDownloadRobot = {
	run: async function (data) {
		if (data.pickedResult) {
			const { videoTitle, videoLink } = data.pickedResult;
			const { songFormat } = data;

			const format = songFormat === 'Video' ? '.mp4' : '.mp3';
			const filter = songFormat === 'Video' ? 'video' : 'audioonly';
			const folder = songFormat === 'Video' ? 'videos' : 'audios';

			const youtubeFileName = `${videoTitle} (Youtube)${format}`;
			const finalFileName = `${videoTitle}${format}`;

			const saveDir = path.join(__dirname, '..', '..', '..', 'public', folder);
			const youtubeVideoFile = path.join(saveDir, youtubeFileName);
			const finalFile = path.join(saveDir, finalFileName);

			if (!fs.existsSync(saveDir)) {
				fs.mkdirSync(saveDir, { recursive: true });
			}

			await new Promise((resolve) => {
				const youtubeLink = `https://www.youtube.com${videoLink}`;

				ytdl(youtubeLink, { filter }).pipe(
					fs.createWriteStream(youtubeVideoFile).on('finish', () => {
						ffmpeg(youtubeVideoFile)
							.withAudioCodec('libmp3lame')
							//.audioBitrate(320)
							.toFormat('mp3')
							.save(finalFile)
							.on('error', (err) => {
								console.log('An error occurred: ' + err.message);
							})
							.on('progress', (progress) => {
								console.log(
									'Processing: ' + progress.targetSize + ' KB converted'
								);
							})
							.on('end', () => {
								data.videoFilePath = finalFile;
								console.log('Processing finished !');
								resolve(data);
							});
					})
				);
			});
		} else {
			console.log(`There's no result to download!`);
		}
	},
};

export default youtubeDownloadRobot;
