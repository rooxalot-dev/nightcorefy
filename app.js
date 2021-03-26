import robots from './src/robots';

async function orchestrate({ appName }) {
	const data = {};

	const nightcorefyRobots = [
		// robots.inputRobot,
		// robots.youtubeSongRobot,
		// robots.metadataRobot,
		robots.downloadYoutubeRobot,
	];

	try {
		console.log(`Welcome to ${appName}!`);

		for (let index = 0; index < nightcorefyRobots.length; index++) {
			const robot = nightcorefyRobots[index];
			await robot.run(data);
		}

		console.log('Processed data: ', data);
		console.log('Finished!');
	} catch (error) {
		console.log('Error: ', error);
	} finally {
		//process.exit();
	}
}

orchestrate({ appName: 'NIGHTCOREFY' });
