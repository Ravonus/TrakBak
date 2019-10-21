schema.methods.validPassword = function (password, cb) {
  if (password)

      bcrypt.compare(password, this.passwordHash, (e, data) => {
          if (!data) {
              return cb(false);
          } else {
              return cb(true);
          }
      });
};

schema.virtual("password").set(function (value) {
  if (value)
      this.passwordHash = bcrypt.hashSync(value, bcrypt.genSaltSync(12));
});