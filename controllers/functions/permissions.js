module.exports = (num) => {
  // console.log('wtf',isSet);
  return promise = {

    promise: (userObj, policies, type) => {

      if(!type) {
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
           
            if(policies[type] !== undefined){
           
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
          Object.keys(policyPerms).forEach((key, index) => {

           
            if (policies[type] === undefined && policies[Object.keys(policies)].match && policies[Object.keys(policies)].match.length > 0) {
 

              var compare = policies[Object.keys(policies)].match;
              var userGroups = userObj.groups;
              var i;

              for (i = 0; i < userGroups.length; i++) {
                console.log('compare', compare[i])
                if (typeof compare[i] === 'string' && compare.includes(userGroups[i].name)) {

                  promisePush(userPerms[key]);
                 i = userObj.groups.length + 1;
                } else if(typeof compare[i] === 'number') {
                  console.log('mah group W00t compare numbers?', userGroups[i].name, ' real group ', groups)
                } else {
                  console.log('fuccc me', typeof compare[i])
                  promises.push(new Promise((response, reject) => { 
                    reject('failed Match')
                  }))
                }
              }
            } else {
              console.log('USERPERMS', userPerms, policies[type], 'KEY', key)
              promisePush(userPerms[key])
            }

            function promisePush(perms) {

              console.log('mah perms', perms)

              promises.push(new Promise((response, reject) => {

                if (perms) {
         

                  response('done')
                } else {

               
                  reject('fucc');
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