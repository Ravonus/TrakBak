const mongoose = require('mongoose'),
  uniqueValidator = require("mongoose-unique-validator"),
  autoIncrement = require('mongoose-auto-increment');

  autoIncrement.initialize(mongoose);

var PermissionsSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String
});

PermissionsSchema.plugin(autoIncrement.plugin, {
  model: 'Permissions',
  field: 'bit',
  startAt: 1,
  incrementBy: 1
});




PermissionsSchema.pre('save', function(next) {


  if(this.bit > 2) {
    this.bit= (this.bit -1) * 2;

  }


  
  mongoose.model('IdentityCounter').findOneAndUpdate({model:'Permissions'}, {count:this.bit},
  
    
    {new: true},
    
    // the callback function
    (err, obj) => {
    // Handle any possible database errors
    if (err) return next(err);
    next();
    }
)


 //   next();



 
})





PermissionsSchema.plugin(uniqueValidator);
var Permissions = mongoose.model('Permissions', PermissionsSchema);



module.exports = Permissions;
