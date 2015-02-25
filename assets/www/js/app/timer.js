(function() {

  // listen for tick events
  document.addEventListener('clock-tick', function(e) {
    render();
  });

  // buffer the DOM elements
  var $timer   = $('#timer');
  var $display = $('#timer tr td');

  // bind the click event
  $timer.click(function() {
    clock.toggle();
    render();
  });

  // render the timer
  var render = function() {
    if (clock.running) {
      $display.html(clock.count);
    } else {
      $display.html('Paused');
    }
  };

})();
