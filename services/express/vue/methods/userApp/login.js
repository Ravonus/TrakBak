object = {

  registration: (page) => {

    userApp.regPage = page;
    Vue.nextTick(function () {
      // container IS finished rendering to the DOM
      var input = document.getElementById(userApp.regPageSelect[page]);
      input.focus();
      input.select();
    });

  },
  loginPageSwap: (page) => {
    userApp.loginPage = page;
    if(page === 'register')  Vue.nextTick(function () {
      // container IS finished rendering to the DOM
      var input = document.getElementById('accountSelect');
      input.focus();
      input.select();
    });

  }

}