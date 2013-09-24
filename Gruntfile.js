module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json')

		, shell: {
			options: {
				stdout: true
				, stderr: true
			}
			, preview: {
				command: 'DISABLE_ONLINE_SERVICES=1 ./node_modules/.bin/wintersmith preview'
			}
		}
	});

	grunt.loadNpmTasks('grunt-shell');

	grunt.registerTask('default', [
		'shell:preview'
	]);
};