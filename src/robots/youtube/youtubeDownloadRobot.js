import fs from 'fs';
import path from 'path';
import ytdl from 'ytdl-core';

const youtubeDownloadRobot = {
	run: async function (data) {
		if (data.pickedResult) {
			const { videoTitle, videoLink } = data.pickedResult;
			const { songFormat } = data;

			const format = songFormat === 'Video' ? '.mp4' : '.mp3';
			const filter = songFormat === 'Video' ? 'video' : 'audioonly';
			const folder = songFormat === 'Video' ? 'videos' : 'audios';

			const saveDir = path.join(__dirname, '..', '..', '..', 'public', folder);
			const videoFile = path.join(saveDir, `${videoTitle}${format}`);

			if (!fs.existsSync(saveDir)) {
				fs.mkdirSync(saveDir, { recursive: true });
			}

			await new Promise((resolve) => {
				const youtubeLink = `https://www.youtube.com${videoLink}`;

				ytdl(youtubeLink, { filter }).pipe(
					fs.createWriteStream(videoFile).on('finish', () => {
						data.videoFilePath = videoFile;
						resolve(data);
					})
				);
			});
		} else {
			console.log(`There's no result to download!`);
		}
	},
};

export default youtubeDownloadRobot;
