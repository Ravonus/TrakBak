const mongoose = require('mongoose'),
  uniqueValidator = require("mongoose-unique-validator"),
  autoIncrement = require('mongoose-auto-increment');

  let count = 1;

  autoIncrement.initialize(mongoose);

var GroupsSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  user: [{ type: mongoose.Schema.ObjectId, ref:'User' }],
  permission: Number,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
});

GroupsSchema.plugin(autoIncrement.plugin, {
  model: 'Groups',
  field: 'groupId',
  startAt: 1,
  incrementBy: 1
});




GroupsSchema.pre('save', function(next) {

 

  // console.log(autoIncrement.plugin);
  // console.log(this.groupId);

  // console.log('mATH', (this.groupId -1) * 2)

  if(this.groupId > 2) {
    this.groupId = (this.groupId -1) * 2;

  }


  
  mongoose.model('IdentityCounter').findOneAndUpdate({model:'Groups'}, {count:this.groupId},
  
    
    // an option that asks mongoose to return the updated version 
    // of the document instead of the pre-updated one.
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





GroupsSchema.plugin(uniqueValidator);
var Groups = mongoose.model('Groups', GroupsSchema);











module.exports = Groups;
