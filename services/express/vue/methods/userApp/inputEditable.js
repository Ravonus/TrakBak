object = {
  focusOn: function (value) {
    app.$forceUpdate();
    app.lastValue = value;


  },

  focusOut: function (watch, newValue, target) {
    let id = $(target).parents()[1].id.substring(4);
    if (app.lastValue !== newValue) {
      jQPost('/dspPost', { table: app.dspTableName, body: { [watch.row]: newValue }, id: { [watch.idName]: id } })
    }

    watch.edit = false;
    app.$forceUpdate();

  },

  externalIp: function () {

    ipPost('/dspPost', { rows: Object.keys(app.dspTable), type: 'external' });

  },

  internalIp: function () {

    ipPost('/dspPost', { rows: Object.keys(app.dspTable), type: 'internal' });

  },

  localHostIp: function () {

    ipPost('/dspPost', { rows: Object.keys(app.dspTable), type: 'local' });

  },
  logSelect: function (log) {
    lGet('/logs?type=' + log.target.value);
  },
  isOdd: function (num) {
    return num % 2;
  },

  updateConf: function (input) {
    if ($(input).data('last').toString() !== input.value.toString()) {

      var obj = { key: $(input).parents()[1].textContent, value: input.value, file: app.confFile };
      confPost('/dspConfPost', obj)

    }

  },
  remSession: function (value) {
    if (app.firstAsk) {
      app.reRun = app.remSession;
      app.reRunValue = value;
      app.firstAsk = false;
      $('#areYouSure').modal('show');
    } else {
      deleteItem('/dspDelete', { model: app.dspTableName, where: { accid: app.reRunValue } })
      $('#areYouSure').modal('hide');
    }

  },
  statisticSelect: function (exec) {
    dLGet('/dspstatistics?name=' + exec.target.value);
  }

}