var clock = {
  count    : 0,
  running  : false,
  interval : null,

  // @todo: count up / count down
  // @todo: track over time
  // @todo: emit event when breakpoints are reached

  // starts the timer
  start    : function() {
    clock.running  = true;
    clock.interval = setInterval(clock.tick, 1000);
  },

  // stops the timer
  stop     : function() {
    clock.running = false;
    clearInterval(clock.interval);
  },

  // toggles the timer run state
  toggle   : function() {
    clock.running ? clock.stop() : clock.start() ;
  },

  // advances the timer
  tick     : function() {
    clock.count++;
    document.dispatchEvent(new CustomEvent('clock-tick'));
    // @todo: handle breakpoints
  },

  // resets the clock
  reset    : function() {
    clock.count = 0;
  },
};
