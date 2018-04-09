# Yat-Logger
## (Another tiny logger)

I originaly created this simple logger while at an hackaton in 2015 (old-school coding) using chalk and moment.js.

It features:
* scopes
* timers
* levels
* styling levels
* multiple output types

### Usage:

#### Getting started:
```
const logger = require('logger');

logger.info('sample', 'this is a simple log'); //output a log
logger.start('sample_timer'); //start a timer

//do stuff 

logger.stop('sample_timer'); // stop the timer
logger.get('sample', 'ms'); //display the value of the timer (ms by default or sec)
```

#### Basic settings
```
logger.settings = {
	file: false, //file output
	path: '/client/demo.log', //file output path
	output: false, //console output
	level: 0, //define at which level we can write/show the log
	wl: [] // whitelist keywords to bypass level filter
}
```

##### Default levels style
`Chalk style arrays`
```
logger.levels = {
	success: ['green'],
	debug: ['magenta', 'gray'],
	info: ['white'],
	warning: ['yellow', 'underline'],
	error: ['red']
};
```

##### Override style by scope
```
logger.types = {
	default: ['white'],
	sample: ['pink', 'underline']
};
```
