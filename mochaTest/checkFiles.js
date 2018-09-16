const fs = require('fs'),
      chai = require('chai');

describe('Check Files', () =>  {

  describe('Check custom.js file', () =>  {

    describe('Check if custom.js is within template folder', () =>  {
      it('Should return true', (done) =>  {

        chai.expect(fs.existsSync('./templates/custom.js')).to.be.true;
        done();

      });
    });

    describe('Check if custom.js moved to public js file.', () =>  {
      it('Should return true', (done) =>  {

        chai.expect(fs.existsSync('./webServer/public/js/custom.js')).to.be.true;
        done();

      });
    });

    describe('Check if custom.js varibles were changed', () =>  {
      it('Should not return error', (done) =>  {

        var readFile = () => {

          fs.readFile('./webServer/public/js/custom.js', 'utf8', (err, data) => {

            if (err) {
              throw err;
            }
            var regex = / = '{{(\w+}}';)/g;
            if (data.match(regex)) {
              var strings = [];
              data.match(regex).forEach((match) => {
                var str = match.substr(0, match.length-2);
   
                str = str.substr(4);
                strings.push(str);

              });
              throw new TypeError('Found varible within file custom.js. Varibles: '+ JSON.stringify(strings));
            } else {

              done();
            }

          })

        }
        chai.expect(readFile).to.not.throw();

      });
    });
  });

  describe('Check customSocket.js file', () =>  {

    describe('Check if customSocket.js is within template folder', () =>  {
      it('Should return true', (done) =>  {

        chai.expect(fs.existsSync('./templates/customSocket.js')).to.be.true;
        done();

      });
    });

    describe('Check if customSocket.js moved to public js file.', () =>  {
      it('Should return true', (done) =>  {

        chai.expect(fs.existsSync('./webServer/public/js/customSocket.js')).to.be.true;
        done();

      });
    });

    describe('Check if customSocket.js varibles were changed', () =>  {
      it('Should not return error', (done) =>  {

        var readFile = () => {

          try {

          } catch (e) {

          }

          fs.readFile('./webServer/public/js/customSocket.js', 'utf8', (err, data) => {

            if (err) {
              throw err;
            }
            var regex = / = '{{(\w+}}';)/g;
            if (data.match(regex)) {
              throw new TypeError('Found varible within file customSocket.js');
            } else {

              done();
            }

          })

        }
        chai.expect(readFile).to.not.throw();

      });
    });
  });
});


