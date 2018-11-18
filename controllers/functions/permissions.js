module.exports = (num) => {
  // console.log('wtf',isSet);
  return promise = {

    promise: (userObj, policies, type) => {

      if (!type) {
        type = 'api';
      }

      //  console.log('cry??' + isSet);
      return new Promise((response, reject) => {

        if (policies && policies[type] && policies.permissions && policies.permissions > 0 || policies && policies[Object.keys(policies)].permissions && policies[Object.keys(policies)].permissions > 0 && userObj && userObj.permissions && policies[Object.keys(policies)][type]) {

          var weight = 0;
          var permission;

          if (!policies[type] && typeof policies[Object.keys(policies)].permissions === 'object') {
            weight = policies[Object.keys(policies)].permissions.weight;
            permission = policies[Object.keys(policies)].permissions.value;
          } else {

            if (policies[type] !== undefined) {

              permission = policies.permissions;
            } else {
              permission = policies[Object.keys(policies)].permissions;
            }
          }

          function getBinary(num) {

            var binaries = num.toString(2);

            var binaryArray = {}
            for (i = 1; i <= binaries.length; i++) {

              var binary = binaries.substr(binaries.length - i);
              var boolean = !!+binary.charAt(0);
              if (boolean) {

                var number = '1'.padEnd(i, '0');

                binaryArray[parseInt(number, 2)] = true;

              }

              if (i === binaries.length) {
                //    console.log(binaryArray);
                //   response(binaryArray);

                return binaryArray;

              }
            }
          }
          var userPerms = getBinary(num);

          var policyPerms = getBinary(permission);

          var promises = [];
          var foundGroup = false;
          var foundPerm = false;
          Object.keys(policyPerms).forEach((key, index) => {

            if (policies[type] === undefined && policies[Object.keys(policies)].match && policies[Object.keys(policies)].match.length > 0) {

              if (policies[Object.keys(policies)].match) {
                var compare = policies[Object.keys(policies)].match;
              } else {
                var compare = policies[Object.keys(policies)].groups
                compare.push(policies[Object.keys(policies)].permissions)
              }

              var userGroups = userObj.groups;
              var i;
              var arr = [userPerms];
              var addArr = [...userObj.groups, ...[userObj.permissions]];
              for (i = 0; i < addArr.length; i++) {



                if (typeof addArr[i] === 'object' && addArr[i].name && compare.includes(addArr[i].name)) {

                  foundGroup = true;
                  promisePush(userPerms[key]);
                  i = addArr[i].length + 1;

                } else if (typeof addArr[i] !== 'object' && typeof addArr[i] === 'number') {

                  if (compare.length > 1) {
                    var str = `${compare.toString()},`;

                    var match = str.match(/,\d+,/g);

                  }
                  match.forEach((num) => {
                    num = Number(num.replace(/,/g, ''));
                    var binary = getBinary(num);

                    Object.keys(binary).forEach((check, index) => {
                      if (userPerms[check]) {
                        foundPerm = true;
                      }

                      if (index === Object.keys(binary).length - 1) {

                        if (foundPerm) {
                          i = addArr[i].length + 1;
                          response('match perms')
                        } else {
                          reject('failed Matchzz')
                        }
                      }

                    })
                  })

                } else {

                  if (i === addArr.length - 1) {
 
                    if (foundPerm || foundGroup) {
                      response('Found Match')
                    } else {
                      reject('failed Matchz')
                    }

                  }

                }
              }
            } else {

              promisePush(userPerms[key])
            }

            function promisePush(perms) {

              promises.push(new Promise((response, reject) => {

                if (perms) {

                  response('done')
                } else {

                  reject('fucc');
                }

              }));
            }

            if (index >= Object.keys(policyPerms).length - 1) {

              promise(promises);
            }
          })

          function promise(promises) {

            Promise.all(promises)
              .then(data => {
                response('true')
              }).catch(err => {

                reject('fucc')
              })
          }

        } else {
          response('no perms');
        }
      })

    },

    pf: (done) => {
      if (promise.promise()) {

        return promise.promise().then((data) => {
          return done(null, data)
        }).catch(err => {

          done(err);
        })
      }
    }

  }

}