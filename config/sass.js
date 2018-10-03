const sass = require('node-sass');

let scss_filename = '/webServer/scss/mdb.scss';
let scss_content = '/webServer/shared/css'

console.log(sass.info);

// var result = sass.renderSync({
//   file: './webServer/scss/mdb.scss',
//   outFile: './webServer/shared/css/',
//   sourceMap: true, // or an absolute or relative (to outFile) path
//   importer: function(url, prev, done) {
//     // url is the path in import as is, which LibSass encountered.
//     // prev is the previously resolved path.
//     // done is an optional callback, either consume it or return value synchronously.
//     // this.options contains this options hash
//     someAsyncFunction(url, prev, function(result){
//       done({
//         file: result.path, // only one of them is required, see section Special Behaviours.
//         contents: result.data
//       });
//     });
//     // OR
//     var result = someSyncFunction(url, prev);
//     return {file: result.path, contents: result.data};
//   }
// });





// console.log(result.css);