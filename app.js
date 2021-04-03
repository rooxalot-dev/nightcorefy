import robots from './src/robots';
import stateManager from './src/utils/stateManager';

async function orchestrate({ appName, clearState }) {
	let data = {};

	const appRobots = [
		robots.inputRobot,
		robots.youtubeSongSearchRobot,
		robots.youtubeMetadataRobot,
		robots.youtubeResultPickerRobot,
		robots.youtubeDownloadRobot,
		robots.mixAudioRobot,
		robots.pinterestImageRobot,
	];

	if (clearState) {
		stateManager.clear();
	}

	try {
		console.log(`Welcome to ${appName}!`);

		for (let index = 0; index < appRobots.length; index++) {
			data = stateManager.load();

			const robot = appRobots[index];
			await robot.run(data);

			stateManager.save(data);
		}
		console.log('Finished!');
	} catch (error) {
		console.log('Error: ', error);
	} finally {
		process.exit();
	}
}

orchestrate({ appName: 'YouTwoBe', clearState: false });
