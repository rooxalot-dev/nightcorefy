import path from 'path';

const audiosPath = path.join(__dirname, '..', '..', 'public', 'audios');
const videosPath = path.join(__dirname, '..', '..', 'public', 'videos');
const reverbAuxPath = path.join(__dirname, '..', 'assets', 'reverb.wav');

export default {
	audiosPath,
	videosPath,
	reverbAuxPath,
};
