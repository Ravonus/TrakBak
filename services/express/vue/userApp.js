'use strict';

var userApp = new Vue({
  el: '#userApp',
  data: {

  },

  watch: {

  },
  methods: {

  },
  mounted: function() {
    Vue.nextTick( function() {



    



    })


  },

  directive: ('$model', {
    bind: function (el, binding, vnode) {
      el.oninput = () => (vnode.context[binding.expression] = el.value);
    }
  }),

  created: () => {
    $("#loader").css("display", "none");

    if($('socketRequest')[0]) {

  
      Vue.nextTick( () => {


        setTimeout(function(){
          console.log("RAN")
          $('.myVideosComments').on('hidden.bs.collapse', function () {
            console.log("RANz");
          })
      }, 0);


        var page = $('socketRequest').data('page');
        var data = $('socketRequest').data('objs');

        if(data.length === 1) 
          userApp.singleObj = true;
          else
          userApp.singleObj = false;
        

        userApp.vueCustom = data;
        userApp.backupArr = data;
        userApp.noCrud = true;
        userApp.nav.page = page;
        userApp.$forceUpdate();
        console.log("SOCKET REQUEST GUI");
        $('socketRequest').remove()
     //   videosGetVideos({query:{}})
      });

    }

  },

  end: {

  }
})