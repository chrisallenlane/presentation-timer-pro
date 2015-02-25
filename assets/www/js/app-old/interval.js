// this constructs the timers that drive the application's clocks
function Interval(callback, delay){
    var timerId;

    this.pause = function(){
        window.clearTimeout(timerId);
    };

    this.resume = function(){
        timerId = window.setInterval(callback, delay);
    };

    this.resume();
}
