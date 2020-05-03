const path = require('path');
const getStack = require('./getStack');

module.exports = config => {
	if(!config.routes || !config.routes.directory) {
		throw new Error('config.routes.directory is required');
	}

	const callFile = getStack()[0].getFileName();
	const perkSrcDir = path.dirname(callFile);
	const rootDir = path.join(perkSrcDir, '..', '..', '..');

	if(!path.isAbsolute(config.routes.directory)) {
		config.routes.directory = path.join(rootDir, config.routes.directory);
	}

	if(config.public && config.public.directory && !path.isAbsolute(config.routes.directory)) {
		config.public.directory = path.join(rootDir, config.public.directory);
	}

	if(config.database) {
		if(!config.database.migrations || !config.database.migrations.directory) {
			throw new Error('config.database.migrations.directory is required');
		}

		if(!path.isAbsolute(config.database.migrations.directory)) {
			config.database.migrations.directory = path.join(
				rootDir,
				config.database.migrations.directory
			);
		}

		if(!config.database.migrations.stub) {
			config.database.migrations.stub = path.join(perkSrcDir, 'migrationTemplate.js');
		}
	}
	if(config.server) {
		if(config.server.https) {
			if(config.server.https.keyFilePath && !path.isAbsolute(config.server.https.keyFilePath)) {
				config.server.https.keyFilePath = path.join(rootDir, config.server.https.keyFilePath);
			}
			if(config.server.https.certFilePath && !path.isAbsolute(config.server.https.certFilePath)) {
				config.server.https.certFilePath = path.join(rootDir, config.server.https.certFilePath);
			}
		}
		if(!config.server.http && !config.server.https) {
			config.server.http = { port: config.server.port || 3000 };
		}
	}
	return config;
};
