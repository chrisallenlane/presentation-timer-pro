(function() {
  $(document).ready(function() {
    console.log('settings ready!');

    // XXX: not sure why this is necessary
    $('button').click(function(e) {
      e.preventDefault();
    });

    // bind the event handlers
    $('button#save').click(save);
    $('button#clock-display').click(clockDisplay);
    $('button#reset-timer').click(resetTimer);
  });
})();


/* Resets the timer */
var resetTimer = function(e) {
  console.log('reset timer');
};

/* Saves settings information */
var save = function(e) {
  var settings = {};
  $('#settings form').serializeArray().map(function(item) {
    _.deepSet(settings, item.name, item.value);
  });

  // @todo: stringify and save to localStorage
  console.log(settings);
};

/* Toggles the timer between "Elapsed" and "Remaining" modes */
var clockDisplay = function(e) {
  // buffer and calculate old/new values
  var $button  = $(e.target);
  var value    = $button.html().toLowerCase();
  var newValue = (value === 'remaining') ? 'Elapsed' : 'Remaining' ;

  // @todo: change the timer internal settings

  // write new values
  $('input[name=clock-display]').val(newValue);
  $button.html(newValue);
};
