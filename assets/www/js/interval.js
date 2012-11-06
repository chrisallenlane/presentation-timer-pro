// @see: http://stackoverflow.com/questions/3969475/javascript-pause-settimeout
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
