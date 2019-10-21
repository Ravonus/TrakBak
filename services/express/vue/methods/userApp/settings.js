object = {
  settings: (type) => {
    if (type === 'video') {

      userApp.crud('GET', 'vimeo/grab', {
        type: 'vueObject',
        name: 'vimeoAPI'
      });

    }
  },
  settingsSaveCheck: (e, name, vueObj) => {
    let value = e.target.value;
    if (userApp[vueObj][name] !== value) {
      if (!userApp.push[vueObj]) userApp.push[vueObj] = {};
      userApp.push[vueObj][name] = value;
    } else if (userApp.push[vueObj] && userApp.push[vueObj][name]) {
      delete userApp.push[vueObj][name];
    }

    let found = false;
    let push = userApp.push;
    let pushArray = Object.keys(push);

    pushArray.forEach((docs) => {
      console.log(Object.keys(push[docs]).length);
      if (docs !== 'showButton' && Object.keys(push[docs]).length > 0) found = true;

    });

    if (found) {
      push.showButton = true;
    } else push.showButton = false;

  },
  saveSettings: () => {

    if(userApp.push && userApp.push.vimeoAPI && Object.keys(userApp.push.vimeoAPI).length > 0) userApp.crud('POST', 'vimeo/setup', {
      type: 'vueObject',
      name: 'vimeoAPI'
    }, JSON.stringify(Object.assign(userApp.vimeoAPI, userApp.push.vimeoAPI)));
  }
}