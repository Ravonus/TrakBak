'use strict';

const fs = require('fs');
const sharp = require('sharp');

module.exports = async function resize(path, format, options) {
  const readStream = fs.createReadStream(path);
  let transform = sharp();

  if (format) {
    transform = transform.toFormat(format);
  }

  if (options.w || options.h) {
    transform = transform.resize(options.w, options.h, options.crop ? undefined :{fit: sharp.fit.outside,
      withoutEnlargement: true});
  }

  fs.writeFileSync(path, await readStream.pipe(transform).toBuffer(), 'utf-8');

  return readStream.pipe(transform);
}