import fs from 'fs';

const stateFile = 'state.json';

const stateManager = {
	save: function (state) {
		try {
			const stringState = JSON.stringify(state, null, 2);
			fs.writeFileSync(stateFile, stringState, { encoding: 'utf-8' });
		} catch (error) {
			console.log('Error saving state', error);
		}
	},
	load: function () {
		try {
			const stringState = fs.readFileSync(stateFile, { encoding: 'utf-8' });
			const state = JSON.parse(stringState);

			return state;
		} catch (error) {
			//console.log('Error loading state', error);
			return {};
		}
	},
	clear: function () {
		fs.writeFileSync(stateFile, '', { encoding: 'utf-8' });
	},
};

export default stateManager;
