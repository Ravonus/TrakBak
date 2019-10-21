object = {

  closeVideoComments:(id) => {

    var arr = $('#vcomments-'+id).attr('class').split(" ");

    if(arr.length === 3 && arr[2] === 'show') {
      console.log("CLICK")
    $('#vcomments-'+id).siblings()[4].click();

    }
  },

  createCommentScript: (name, count) => {

    if (!count) count = 0;

    if ($('#vcomments-' + name)[0]) {
      var el = $('#vcomments-' + name);
      var card = $(el.parents()[2]);


      if (!$._data( el[0], "events" )) {
        //execute it
        $('#vcomments-' + name).on('hide.bs.collapse', function () {

          var height = card.height() - el.height();
          
          card.css('cssText', 'height: ' + height + 'px !important;');


        });

        $('#vcomments-' + name).on('show.bs.collapse', function () {

          var height = card.height() + el.height();

          card.css('cssText', 'height: ' + height + 'px !important;');
          console.log("HOW");
        });


      }

    }

    else if (count < 100)

      setTimeout(function () {
        count++;
        userApp.createCommentScript(name, count);
      }, 0);




    return;

  },

  videoCommentSize: (e) => {




    // if (!userApp.growVideo) {
    //   var el = $(e.target);

    //   userApp.growVideo = true;

    //   var card = $(el.parents()[2]);

    //   var comments = $(el.data('target'));

    //   var commentClasses = comments.attr("class").split(" ");

    //   var height = commentClasses.length === 4 && commentClasses[3] === 'show' ? card.height() - el.height() : card.height() + el.height();

    //   card.css('cssText', 'height: ' + height + 'px !important;');

    // }



  },

  videoClick: (e) => {

    e.preventDefault();

    var text = e.target.innerText;

    if (Array.isArray(userApp.vueCustom)) {

      userApp.backupArr = userApp.vueCustom;

      userApp.vueCustom.forEach(obj => {

        if (obj.name === text) {

          userApp.vueCustom = [obj];
          userApp.singleObj = true;

          window.history.pushState('watch/' + text, text, '/watch/' + text);

        }

      });

    }


  },

  checkVideo: (id) => {
    if ($(`#${id}`)[0]) return false;
    return true;
  },
  videoDoc: (id) => {
    userApp.files = $(`#${id}`)[0].files[0];
    if (userApp.docs.data.videos.create.groups && userApp.docs.data.videos.create.groups.length === 0) delete userApp.docs.data.videos.create.groups;
    userApp.filePush = jQuery.param(userApp.docs.data.videos.create);
    r.addFile($(`#${id}`)[0].files[0]);
  },
  videoUrl: () => {

    console.log(userApp.docs.data.videos.create);

    if ($('#selectVideo').val() === 'Vimeo') userApp.docs.data.videos.create = Object.assign(userApp.docs.data.videos.create, {
      services: {
        type: {
          web: 'Vimeo'
        }
      }
    });

    if ($('#selectVideo').val() === 'YouTube') {

      if (userApp.docs.data.videos.create.url)

        userApp.docs.data.videos.create = Object.assign(userApp.docs.data.videos.create, {
          services: {
            type: {
              web: 'YouTube'
            }
          }
        });


    }

    userApp.crud('POST', `/videos/all`, {
      type: 'docCreate',
      name: 'videos',
      modal: 'createVideos'
    }, JSON.stringify(userApp.docs.data.videos.create));


  },
  playTick: (id) => {
    Vue.nextTick(function () {
      $(`#${id}`).on("click play", function () {
        playFile.call(this);
      });

    });

  }
}