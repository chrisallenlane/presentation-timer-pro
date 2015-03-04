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

    // clock has been reset
    if (clock.count === 0) {
      $display.html('Start');
    }
    
    // clock is running
    else if (clock.running) {
      // @todo: format with moment
      $display.html(clock.count);
    }
    
    // clock is paused
    else {
      $display.html('Paused');
    }
  };

})();
