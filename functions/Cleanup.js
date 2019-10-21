'use strict';

// Object to capture process exits and call app specific cleanup function

function noOp() {};

function Cleanup(callback) {
  // attach user callback to the process event emitter
  // if no callback, it will still exit gracefully on Ctrl-C
  callback = callback || noOp;
  process.on('cleanup',callback);
  // do app specific cleaning before exiting
  process.on('exit', function () {
    logWrite.then( () => {
       dspExec.forEach(exec => {
        exec.kill();
      })
      process.emit('cleanup');


    })
  });

  // catch ctrl+c event and exit normally
  process.on('SIGINT', function () {
    logWrite.then(() => {
         process.exit(2);
    });
  });

  //catch uncaught exceptions, trace, then exit normally
  process.on('uncaughtException', function(e) {
    process.exit(99);
  });
};

module.exports = Cleanup;