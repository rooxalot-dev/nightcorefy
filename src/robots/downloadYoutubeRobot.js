import fs from 'fs';
import path from 'path';
import ytdl from 'ytdl-core';

const downloadYoutubeRobot = {
	run: async function (data) {
		if (data.pickedResult) {
			const { videoTitle, videoLink } = data.pickedResult;
			const videosDir = path.join(__dirname, '..', '..', 'public', 'videos');
			const videoFile = path.join(videosDir, `${videoTitle}.mp4`);

			if (!fs.existsSync(videosDir)) {
				fs.mkdirSync(videosDir, { recursive: true });
			}

			await new Promise((resolve) => {
				const youtubeLink = `https://www.youtube.com${videoLink}`;

				ytdl(youtubeLink).pipe(
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

export default downloadYoutubeRobot;
