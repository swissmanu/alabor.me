var join = require('path').join
	, fs = require('fs')
	, buildDirectoryPath = join(__dirname, 'build');

/** File: Gruntfile.js
 * This Grunt task configuration file provides two main tasks:
 *
 * grunt preview:
 * Starts the wintersmith preview server locally. Ensures that no online
 * services like Google Analytics or Disqus are enabled.
 * If you just run "grunt", this task is executed automatically.
 *
 * grunt publish:
 * Publishs a latest build of the site to the remote staging repository. The
 * remote will most probably automatically push these changes to the live
 * repo.
 * Ensure to add a "alabor.me" alias to your ~/.ssh/config like the one below
 * since the grunt task does not include any ssh user information when cloning
 * the staging repo.
 *
 *  > host alabor.me
 *  > hostname alabor.me
 *  > user superfancygituser
 */

/** Function: recursiveDirectoryCleaner
 * Cleans a given directory from all subdirectories and files.
 * If an ignore argument (String or Array) is passed, files/directories matching
 * any of passed names are ignored.
 *
 * Parameters:
 *     (String) path - Directory to clean
 *     (String|Array) ignore - File/Directory names to ignore
 */
function recursiveDirectoryCleaner(path, ignore) {
	var files = fs.readdirSync(path);

	if(!ignore) {
		ignore = [];
	}
	if(ignore instanceof String) {
		ignore = [ignore];
	}

	files.forEach(function(file) {
		if(ignore.indexOf(file) === -1) {
			var filePath = join(path, file)
				, stats = fs.lstatSync(filePath);

			if(!stats.isDirectory()) {
				fs.unlinkSync(filePath);
			} else {
				recursiveDirectoryCleaner(filePath);
				fs.rmdirSync(filePath);
			}
		}
	});
}

module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-shell');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json')

		, shell: {
			options: {
				stdout: true
				, stderr: true
			}

			/** Task: shell:preview
			 * Sets the DISABLE_ONLINE_SERVICES environment variable and starts
			 * the wintersmith preview server locally.
			 */
			, preview: {
				command: 'DISABLE_ONLINE_SERVICES=1 ./node_modules/.bin/wintersmith preview'
			}

			/** Task: shell:build
			 * Triggers a wintersmith build
			 */
			, build: {
				command: './node_modules/.bin/wintersmith build'
			}


			/** Task: shell:cloneFromStaging
			 * Executes a "git clone" command on the remote staging directory.
			 */
			, cloneFromStaging: {
				command: 'git clone alabor.me:/home/git/alabor.me-staging.git build'
			}

			/** Task: shell:commitToStaging
			 * Commits the latest changes in the "build" directory to the remote
			 * staging repo.
			 */
			, commitToStaging: {
				command: [
					'cd build'
					, 'git add -A'
					, 'git commit -m "grunt publish at ' + grunt.template.date(new Date(), 'yyyy-mm-dd HH:MM:ss') + '"'
					, 'git push'
				].join('&&')
			}
		}

		, gitclone: {
			stagingRepository: {
				options: {
					repository: 'root@maximus:/home/www/alabor.me/staging'
					, directory: 'build'
				}
			}
		}

	});

	/** Task: cloneBuildFromStaging
	 * Clone the remote staging git repository as "build".
	 */
	grunt.registerTask('cloneBuildFromStaging', function() {
		if(grunt.file.isDir(join(buildDirectoryPath))) {
			grunt.file.delete(buildDirectoryPath);
		}

		grunt.task.run('shell:cloneFromStaging');
	});

	/** Task: cleanBuildDirectory
	 * Cleans the "build" directory from everything except than the subdirectory
	 * ".git/" and the ".gitignore" file.
	 */
	grunt.registerTask('cleanBuildDirectory', function() {
		recursiveDirectoryCleaner(buildDirectoryPath, ['.git', '.gitignore']);
	});

	/** Task: preview
	 * Starts the wintersmith preview server locally. The DISABLE_ONLINE_SERVICES
	 * environment variable is set to ensure that no services like disqus or
	 * Google Analytics are embedded. This prevents confusion if these services
	 * get in contact with "localhost"-URLs.
	 */
	grunt.registerTask('preview', ['shell:preview']);

	/** Task: publish
	 * Clones the remote staging git repository, cleans it and triggers a
	 * wintersmith build. Afterwards the build is committed and pushed to the
	 * staging repository. The hook over there will probably push the latest
	 * changes further into live automatically.
	 */
	grunt.registerTask('publish', [
		'cloneBuildFromStaging'
		, 'cleanBuildDirectory'
		, 'shell:build'
		, 'shell:commitToStaging'
	]);

	/** Task: default
	 * An alias for the task "preview". Runned automatically on just calling
	 * "grunt" from cli.
	 */
	grunt.registerTask('default', ['preview']);
};