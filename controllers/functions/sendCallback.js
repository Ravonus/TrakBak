module.exports = (mongoose, done) => {
  if (mongoose && mongoose.length > 0) {
    done(null, mongoose);
  } else {
    done('fucc')
  }
};