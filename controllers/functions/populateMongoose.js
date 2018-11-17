
module.exports = async (User) => {

var populate = '';

await Object.keys(User.schema.obj).forEach(function (key) {
  var val = User.schema.obj[key];
  //  console.log(key)
  if (typeof val === 'object' && val[0] && val[0].ref) {
    // console.log(key, typeof val, val[0]);
    populate += ` ${val[0].ref.toLowerCase()}`

  }
});

return populate;

}