module.exports = (num) => {
  // console.log('wtf',isSet);
  return promise = {

    promise: (userObj, policies) => {

      //  console.log('cry??' + isSet);
      return new Promise((response, rej) => {

        console.log('wtf perms', policies)

        if (policies && policies[Object.keys(policies)].permissions && policies[Object.keys(policies)].permissions > 0 && userObj && userObj.permissions && policies[Object.keys(policies)].active) {

          var weight = 0;
          var permission;
          if (typeof policies[Object.keys(policies)].permissions === 'object') {
            weight = policies[Object.keys(policies)].permissions.weight;
            permission = policies[Object.keys(policies)].permissions.value;
          } else {
            permission = policies[Object.keys(policies)].permissions;
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
          Object.keys(policyPerms).forEach((key, index) => {


            if (policies[Object.keys(policies)].match && policies[Object.keys(policies)].groups && policies[Object.keys(policies)].groups.length > 0) {

              var groups = policies[Object.keys(policies)].groups;
              var userGroups = userObj.groups;
              var i;
              for (i = 0; i < userObj.groups.length; i++) {


                console.log(userGroups[i].name, 'ppppplllease', groups)

                if (groups.includes(userGroups[i].name)) {
                  console.log('cry')
                  promisePush(userPerms[key]);
                  i = userObj.groups.length + 1;
                } else {
                  console.log('mah group ', userGroups[i].name, ' real group ', groups)
                }
              }
            } else {
              promisePush(userPerms[key])
            }

            function promisePush(perms) {

              promises.push(new Promise((response, rej) => {

                if (perms) {

                  response('done')
                } else {

                  rej('fucc');
                }

              }));
            }

            if (index >= Object.keys(policyPerms).length - 1) {

              console.log('be promsies', promises)
              promise(promises);
            }
          })

          function promise(promises) {

            Promise.all(promises)
              .then(data => {
                response('true')
              }).catch(err => {
                console.log('wtd perms')
                rej('fucc')
              })
          }

        } else {
          response('no perms');
        }
      })

    },

    pf: (done) => {
      if (promise.promise()) {

        console.log(promise.promise())
        return promise.promise().then((data) => {
          return done(null, data)
        }).catch(err => {
          console.log('diz err', err)
          done(err);
        })
      }
    }

  }

}