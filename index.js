var fs, path, months, chalk, moment;

fs = require('fs');
path = require('path');
chalk = require('chalk');
moment = require('moment');
months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function chalkPaint(sidewalkChalks, text) {
	var combinedChalk = chalk;
	for (var i in sidewalkChalks) {
		if (!sidewalkChalks.hasOwnProperty(i)) continue;
		combinedChalk = combinedChalk[sidewalkChalks[i]];
	}
	return combinedChalk(text);
}

function logger(chan, type) {
	var settings = {
		file: false,
		path: '/client/demo.log',
		output: false,
		level: 0,
		wl: []
	}

	var timers = [];

	var	levels = {
		success: ['green'],
		debug: ['magenta', 'gray'],
		info: ['white'],
		warning: ['yellow', 'underline'],
		error: ['red']
	};

	var types = {
		default: ['white'],
		load: ['blue'],
		metric: ['yellow', 'underline', 'bold'],
		add: ['green', 'underline'],
		"create log": ['magenta'],
		del: ['red', 'underline'],
		comp: ['cyan'],
		"level1": ['yellow'],
		"level0": ['blue'],
		"election": ['yellow', 'underline']
	};


	function createLog(level) {
		return function () {
			var args = Array.prototype.slice.call(arguments);
			args.unshift(level);
			log.apply(this, args);
		}
	}

	function startTimer(id) {
		return function () {
			var id = Array.prototype.slice.call(arguments)[0];
			if (id === undefined) return ;
			timers[id] = {
				start: new Date(),
				stop: null
			}
		}
	}

	function stopTimer(id) {
		return function () {
			var id = Array.prototype.slice.call(arguments)[0];
			if (timers[id] !== undefined)
				timers[id].stop = new Date();
		}
	}

	function showTimer(id, type) {
		return function () {
			var args = Array.prototype.slice.call(arguments);
			if (timers[args[0]] === undefined)
				return "unknown id";
			var diff = moment(timers[args[0].stop]) - moment(timers[args[0]].start);
			switch(args[1]) {
				case 'ms':
					return moment(diff).milliseconds();
					break;
				case 'sec':
					return moment(diff).seconds();
					break;
				default:
					return moment(diff).milliseconds();
					break;
			}
		}
	}

	function log() {
		var args = Array.prototype.slice.call(arguments);
		for (var arg in args)
			args[arg] = args[arg].toString();
		var level = args.shift();
		var chan = args.shift();

		if (settings.wl.indexOf(chan) == -1) {
			switch(level) {
				case 'warn':
					if (settings.level < 2) return;
					break;
				case 'warning':
					if (settings.level < 2) return;
					break;
				case 'success':
					if (settings.level < 1) return;
					break;
				case 'error':
					if (settings.level < 1) return;
					break;
					case 'debug':
					if (settings.level < 4) return;
					break;
				case 'info':
					if (settings.level < 3) return;
					break;
				default: return;
			}
		}

		if (level == undefined)
			var level = args.shift();
		if (chan === undefined || types[chan] === undefined) {
			console.log(chan);
			var chan = 'default';
		}
		args.unshift(Array(12 - chan.length - 2).join(' '));
		args.unshift(chalkPaint(types[chan], '[' + chan.toUpperCase() + ']'));
		args.unshift(Array(10 - level.length - 2).join(' '));
		args.unshift(chalkPaint(levels[level], '[' + level.toUpperCase() + ']'));

		for (s in args) {
			args[s] = args[s].replace("{black}", "\033[0;30m")
			.replace("{red}", "\033[0;31m")
			.replace("{green}", "\033[0;32m")
			.replace("{yellow}", "\033[0;33m")
			.replace("{blue}", "\033[0;34m")
			.replace("{magenta}", "\033[0;35m")
			.replace("{cyan}", "\033[0;36m")
			.replace("{white}", "\033[0;37m");
			args[s] = args[s] + "\033[0m";
		}

		if (settings.output)
			console.log.apply(console, args);
		if (settings.file) {
			fs.appendFileSync(settings.path, args.join(' ') + '\n');
			fs.appendFileSync(__dirname + '/' + chan + '.demo', args.join(' ') + '\n');
		}
	}

	return {
		settings: settings,
		timers: timers,
		types: types,
		levels: levels,
		start: startTimer(chan),
		stop: stopTimer(chan),
		get: showTimer(chan, type),
		success: createLog('success'),
		info: createLog('info'),
		debug: createLog('debug'),
		warn: createLog('warning'),
		warning: createLog('warning'),
		error: createLog('error')
	};
}

module.exports = new logger;
