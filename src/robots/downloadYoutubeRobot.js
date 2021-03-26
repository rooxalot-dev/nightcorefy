import fs from 'fs';
import path from 'path';
import ytdl from 'ytdl-core';

const downloadYoutubeRobot = {
	run: async function (data) {
		const videosDir = path.join(__dirname, '..', '..', 'public', 'videos');
		const videoFile = path.join(videosDir, 'video.mp4');

		if (!fs.existsSync(videosDir)) {
			fs.mkdirSync(videosDir, { recursive: true });
		}

		await new Promise((resolve) => {
			ytdl('https://www.youtube.com/watch?v=TAqZb52sgpU').pipe(
				fs.createWriteStream(videoFile).on('finish', () => {
					data.videoFilePath = videoFile;
				})
			);
		});
	},
};

export default downloadYoutubeRobot;
