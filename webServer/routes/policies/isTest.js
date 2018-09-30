

let isTest = (done) => {

  setTimeout(function(){ return done('fuc dis err'); }, 1000);

}

module.exports = isTest;
