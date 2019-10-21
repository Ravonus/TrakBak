var fs = require('fs'),
  path = require('path'),
  util = require('util'),
  prettyBytes = require('pretty-bytes'),
  Stream = require('stream').Stream;
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;


var ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffmpegPath);
var command = ffmpeg();
let lastTime;
let sizeCount = 0;

module.exports = resumable = function (temporaryFolder) {

  var $ = this;
  $.temporaryFolder = temporaryFolder;

  $.maxFileSize = null;
  $.fileParameterName = 'file';

  try {
    fs.mkdirSync($.temporaryFolder);
  } catch (e) {}


  var cleanIdentifier = function (identifier) {
    return identifier.replace(/^0-9A-Za-z_-/img, '');
  }

  var getChunkFilename = function (chunkNumber, identifier) {
    // Clean up the identifier
    identifier = cleanIdentifier(identifier);
    // What would the file name be?
    return path.join($.temporaryFolder, './resumable-' + identifier + '.' + chunkNumber);
  }

  var validateRequest = function (chunkNumber, chunkSize, totalSize, identifier, filename, fileSize) {
    // Clean up the identifier
    identifier = cleanIdentifier(identifier);

    // Check if the request is sane
    if (chunkNumber == 0 || chunkSize == 0 || totalSize == 0 || identifier.length == 0 || filename.length == 0) {
      return 'non_resumable_request';
    }
    var numberOfChunks = Math.max(Math.floor(totalSize / (chunkSize * 1.0)), 1);
    if (chunkNumber > numberOfChunks) {
      return 'invalid_resumable_request1';
    }

    // Is the file too big?
    if ($.maxFileSize && totalSize > $.maxFileSize) {
      return 'invalid_resumable_request2';
    }

    if (typeof (fileSize) != 'undefined') {
      if (chunkNumber < numberOfChunks && fileSize != chunkSize) {
        // The chunk in the POST request isn't the correct size
        return 'invalid_resumable_request3';
      }
      if (numberOfChunks > 1 && chunkNumber == numberOfChunks && fileSize != ((totalSize % chunkSize) + chunkSize)) {
        // The chunks in the POST is the last one, and the fil is not the correct size
        return 'invalid_resumable_request4';
      }
      if (numberOfChunks == 1 && fileSize != totalSize) {
        // The file is only a single chunk, and the data size does not fit
        return 'invalid_resumable_request5';
      }
    }

    return 'valid';
  }

  //'found', filename, original_filename, identifier
  //'not_found', null, null, null
  $.get = function (req, callback) {
    var chunkNumber = req.param('resumableChunkNumber', 0);
    var chunkSize = req.param('resumableChunkSize', 0);
    var totalSize = req.param('resumableTotalSize', 0);
    var identifier = req.param('resumableIdentifier', "");
    var filename = req.param('resumableFilename', "");


    if (validateRequest(chunkNumber, chunkSize, totalSize, identifier, filename) == 'valid') {
      var chunkFilename = getChunkFilename(chunkNumber, identifier);
      fs.exists(chunkFilename, function (exists) {
        if (exists) {
          callback('found', chunkFilename, filename, identifier);
        } else {
          callback('not_found', null, null, null);
        }
      });
    } else {
      callback('not_found', null, null, null);
    }
  }

  //'partly_done', filename, original_filename, identifier
  //'done', filename, original_filename, identifier
  //'invalid_resumable_request', null, null, null
  //'non_resumable_request', null, null, null
  $.post = function (req, callback) {

    var fields = req.body;
    var files = req.files;


    var chunkNumber = fields['resumableChunkNumber'];
    var chunkSize = fields['resumableChunkSize'];
    var totalSize = fields['resumableTotalSize'];
    var identifier = cleanIdentifier(fields['resumableIdentifier']);
    var filename = fields['resumableFilename'];
    var filenameNoExt = filename.split('.').slice(0, -1).join('.');

    var original_filename = fields['resumableIdentifier'];

    var stream = fs.createWriteStream("./Video/" + filename);
    stream.write('', files);

    if (!files[$.fileParameterName] || !files[$.fileParameterName].size) {
      callback('invalid_resumable_request', null, null, null);
      return;
    }
    var validation = validateRequest(chunkNumber, chunkSize, totalSize, identifier, files[$.fileParameterName].size);
    if (validation == 'valid') {
      var chunkFilename = getChunkFilename(chunkNumber, identifier);

      // Save the chunk (TODO: OVERWRITE)
      fs.rename(files[$.fileParameterName].path, chunkFilename, function () {

        // Do we have all the chunks?
        var currentTestChunk = 1;
        var numberOfChunks = Math.max(Math.floor(totalSize / (chunkSize * 1.0)), 1);
        var testChunkExists = function () {
          fs.exists(getChunkFilename(currentTestChunk, identifier), async function (exists) {
            if (exists) {
              currentTestChunk++;

              if (currentTestChunk > numberOfChunks) {

                if (Number(chunkNumber) === Number(numberOfChunks)) {

                  await $.write(identifier, stream, {
                    onDone: cb,
                    end: true
                  });


                  let name = filename.split('.')[0];
                  var command = ffmpeg(`Video/${filename}`);
                  function cb() {
                    if (!filename.includes('.mp4')) {
                      command
                      .addOptions(['-vprofile high', '-threads 0', '-movflags faststart'])
                      .save(`Video/${filenameNoExt}.mp4`)
                      .on('start', function (info) {

                        _sockets.broadcast('send', {
                          script: "socketInterpretation",
                          room: "video_mods"
                        }, {
                          filename: filenameNoExt,
                          type: "mp4Convert",
                          info,
                          on: 'start'
                        });


                      })
                      .on('progress', function (info) {

                        _sockets.broadcast('send', {
                          script: "socketInterpretation",
                          room: "video_mods"
                        }, {
                          filename: filenameNoExt,
                          type: "mp4Convert",
                          info,
                          on: 'progress'
                        });


                      })
                      .on('end', function (info) {
                        _sockets.broadcast('send', {
                          script: "socketInterpretation",
                          room: "video_mods"
                        }, {
                          filename: filenameNoExt,
                          type: "mp4Convert",
                          info,
                          on: 'end'
                        });
                        command = ffmpeg(`Video/${filenameNoExt}.mp4`)
                          .screenshots({
                            timestamps: [10],
                            filename: `${filenameNoExt}.mp4.png`,
                            size: "781x521",
                            folder: 'Video/thumbnails'
                          });

                        fs.unlinkSync(`Video/${filename}`);
                      })
                      .on('error', function (error) {
                        console.log(error);
                      }); 


                 

                      // try {
                      //   command.format('mp4')
                      // } catch (e) {
                      //   console.log('asd', e);
                      // }







                    } else {

                      command.screenshots({
                        timestamps: ['02:30.000'],
                        filename: `${filenameNoExt}.mp4.png`,
                        size: "781x521",
                        folder: 'Video/thumbnails'
                      });

                    }

                  }


                } else {

                  $.write(identifier, stream);
                }

                callback('done', filename, original_filename, identifier);


              } else {
                // Recursion
                testChunkExists();
              }
            } else {
              callback('partly_done', filename, original_filename, identifier);
            }
          });
        };
        testChunkExists();
      });
    } else {

      callback(validation, filename, original_filename, identifier);
    }
  }
  // var r = fs.createWriteStream("./Video/" + filename);

  // // Pipe chunks directly in to an existsing WritableStream
  //   r.write(identifier, response);
  //   r.write(identifier, response, {end:false});

  $.write = function (identifier, writableStream, options) {

    console.log(identifier, options)


    options = options || {};
    options.end = (typeof options['end'] == 'undefined' ? true : options['end']);

    // Iterate over each chunk
    var pipeChunk = function (number) {



      var chunkFilename = getChunkFilename(number, identifier);

      fs.exists(chunkFilename, function (exists) {

        if (exists) {
          // If the chunk with the current number exists,
          // then create a ReadStream from the file
          // and pipe it to the specified writableStream.
          var sourceStream = fs.createReadStream(chunkFilename);
          sourceStream.pipe(writableStream, {
            end: false
          });
          sourceStream.on('end', function () {
            // When the chunk is fully streamed,
            // jump to the next one

            pipeChunk(number + 1);
          });
        } else {

          // When all the chunks have been piped, end the stream
          if (options.end) writableStream.end();
          if (options.onDone) options.onDone();
        }
      });
    }
    pipeChunk(1);
  }


  $.clean = function (identifier, options) {

    options = options || {};

    // Iterate over each chunk
    var pipeChunkRm = function (number) {

      var chunkFilename = getChunkFilename(number, identifier);

      //console.log('removing pipeChunkRm ', number, 'chunkFilename', chunkFilename);
      fs.exists(chunkFilename, function (exists) {
        if (exists) {

          fs.unlink(chunkFilename, function (err) {
            if (err && options.onError) options.onError(err);
          });

          pipeChunkRm(number + 1);

        } else {

          if (options.onDone) options.onDone();

        }
      });
    }
    pipeChunkRm(1);
  }

  return $;
}
