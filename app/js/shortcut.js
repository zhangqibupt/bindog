var Mousetrap = require('mousetrap');
Mousetrap.bind('command+f', function () {
  $('#search-input > input').select()
});

Mousetrap.bind('command+r', function () {
  $('#clear').click()
});

