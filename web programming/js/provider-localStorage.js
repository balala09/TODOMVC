(function () {
  var model = window.model;
  var storage = window.localStorage;

  Object.assign(model, {
    init: function (callback) {
      var title = storage.getItem(model.TOKEN_title);
      var start = storage.getItem(model.TOKEN_starttime);
      var end = storage.getItem(model.TOKEN_endtime);
      var place = storage.getItem(model.TOKEN_place);
      var total_todo = storage.getItem(model.TOKEN_totaltodo);
      var checked = storage.getItem(model.TOKEN_checked);
      var complete_item = storage.getItem(model.TOKEN_complete);
      try {
        if (title) model.data.titles = title.toString().split(',');
        if (start) model.data.start_time = start.toString().split(',');
        if (end) model.data.end_time = end.toString().split(',');
        if (place) model.data.places = place.toString().split(',');
        if (total_todo) model.data.total_todo = total_todo.toString().split(',');
        if (checked) model.data.whetherchecked = checked.toString().split(',');
        if (complete_item) model.data.complete_item = complete_item.toString().split(',');
      } catch (e) {
        storage.setItem(model.TOKEN_title, '');
        storage.setItem(model.TOKEN_starttime, '');
        storage.setItem(model.TOKEN_endtime, '');
        storage.setItem(model.TOKEN_place, '');
        console.error(e);
      }

      if (callback) callback();
    },
    set_checked: function (callback) {
      try {
        storage.setItem(model.TOKEN_checked, model.data.whetherchecked);
      } catch (e) {
        console.error(e);
      }
      if (callback) callback();
    },
    set_complete: function (callback) {
      try {
        storage.setItem(model.TOKEN_complete, model.data.complete_item);
      } catch (e) {
        console.error(e);
      }
      if (callback) callback();
    },
    set_place: function (callback) {
      try {
        storage.setItem(model.TOKEN_place, model.data.places);
      } catch (e) {
        console.error(e);
      }
      if (callback) callback();
    },
    set_total: function (callback) {
      try {
        storage.setItem(model.TOKEN_totaltodo, model.data.total_todo);
      } catch (e) {
        console.error(e);
      }
      if (callback) callback();
    },
    set_start: function (callback) {
      try {
        storage.setItem(model.TOKEN_starttime, model.data.start_time);
      } catch (e) {
        console.error(e);
      }
      if (callback) callback();
    },
    set_end: function (callback) {
      try {
        storage.setItem(model.TOKEN_endtime, model.data.end_time);
      } catch (e) {
        console.error(e);
      }
      if (callback) callback();
    },
    set_title: function (callback) {
      try {
        storage.setItem(model.TOKEN_title, model.data.titles);
      } catch (e) {
        console.error(e);
      }
      if (callback) callback();
    }

  });
})();