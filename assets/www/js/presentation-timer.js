presentation_timer = {

    // presentation_timer constructor
    initialize: function() {
        // draw the timer initially
        presentation_timer.set_color({ primary: '#0f0', secondary: '#000' })
        $('#timer').html('Start');
        this.draw();

        // initialize the time
        this.hours        = 0;
        this.minutes      = 0;
        this.seconds      = 0;
        this.elapsed      = 0; // seconds that don't wrap to minutes
        this.over_time    = false;
        this.has_begun    = false;
        this.is_playing   = false;

        // store intervals in an array
        this.intervals = [];
        // first multiplicand is in minutes
        // @todo: eventually make these configurable via GUI options screen
        this.intervals[0] = { seconds: 5  * 60, action: function(){ presentation_timer.set_color({ primary: '#ff0' }) } }; //yellow
        this.intervals[1] = { seconds: 8  * 60, action: function(){ presentation_timer.set_color({ primary: '#f00' }) } }; //red
        this.intervals[2] = { seconds: 12 * 60, action: function(){ presentation_timer.over_time = true } };               //critical
        this.next_interval_index = 0;

        // this can prevent a visual flicker
        this.paused_time  = '';
    },

    // plays and pauses the timer
    play_pause: function(){
        // if the timer has not yet been started
        if(!this.has_begun){
            // start
            this.interval   = new Interval(function(){ presentation_timer.tick() }, 1000);
            this.has_begun  = true;
            this.is_playing = true;

            // eliminate visual lag
            $('#timer').html('0:00');
            console.log('start');
        }

        // if the timer has previously been started
        else {
            // pause
            if(this.is_playing){
                this.is_playing = false;
                this.interval.pause();
                console.log('pause');
                
                // record the paused time
                this.paused_time = $('#timer').html();
                $('#timer').html('Paused');
            }
            //resume
            else {
                // this prevents a visual flicker
                $('#timer').html(this.paused_time);

                // resume the clocks
                this.is_playing = true;
                this.interval.resume();
                console.log('resume');
            }
        }
    },

    // displays the main pop-up menu
    display_menu: function(){
        console.log('display_menu()');
        //$('#page-menu').popup();
        window.location = '#page-menu';
    },

    // prompts the user to reset the clock, and optionally does so
    prompt_reset: function(){
        if(confirm('Reset timer?')){
            // stop and destroy the timer
            console.log('reset');
            this.interval.pause();
            this.interval            = null;

            // initialize the time
            this.hours               = 0;
            this.minutes             = 0;
            this.seconds             = 0;
            this.over_time           = false;
            this.has_begun           = false;
            this.is_playing          = false;
            this.next_interval_index = 0;
            this.paused_time         = '';

            // re-draw the timer
            presentation_timer.set_color({ primary: '#0f0', secondary: '#000' })
            $('#timer').html('Start');
        }
    },

    // re-draw the timer (invoked on init and when orientation changes
    draw: function(){
        // manage aesthetics
        window_height = $(window).height() - 43;
        window_width  = $(window).width();

        body_padding  = Math.floor(parseInt(window_height) * .05);
        timer_height  = Math.floor(parseInt(window_height) * .9);
        timer_width   = window_width - (2 * body_padding);
        timer_padding = (window_width - timer_width) / 2;
        font_size     = (timer_width > timer_height) ? (timer_width / 4) : (timer_height / 8) ;

        // set the timer dimensions and draw the timer
        $('#timer_backdrop').css('height' , window_height + 'px');
        $('#timer_backdrop').css('width'  , window_width  + 'px');
        $('#timer').css('font-size'       , font_size     + 'px');
        $('#timer').css('line-height'     , timer_height  + 'px');
        $('#timer').css('margin-top'      , body_padding  + 'px');
        $('#timer').css('margin-left'     , timer_padding + 'px');
        $('#timer').css('width'           , timer_width   + 'px');
        $('#timer').css('display'         , 'block');
    },

    // operate the clock
    tick: function(){
        // tick a second
        ++this.seconds;
        ++this.elapsed;

        // initialize
        sec = min = 0;

        // seconds
        if(this.seconds % 60 == 0){ this.seconds = 0; ++this.minutes; }
        sec = (this.seconds < 10) ? '0' + this.seconds : this.seconds ;

        // minutes
        if((this.minutes > 0) && (this.minutes % 60 == 0)){ this.minutes = 0; ++this.hours; }
        //min = (this.minutes < 10) ? '0' + this.minutes : this.minutes ;
        min = this.minutes;

        // hours
        if(this.hours == 24){ this.hours = 0; this.minutes = 0; this.seconds = 0; }

        // format the time
        if(this.hours > 0){ time_formatted = this.hours + ':' + min + ':' + sec; }
        else { time_formatted = min + ':' + sec; }

        // determine if the current second should trigger a new interval
        if(
            this.intervals.length > this.next_interval_index &&
            this.elapsed == this.intervals[this.next_interval_index].seconds
        ){
            this.intervals[this.next_interval_index].action();
            this.next_interval_index++;
        }

        // this is tightly-coupled and inelegant, but it prevents screen-tearing
        if(this.over_time){ time_formatted = this.critical_blink(time_formatted); }

        // display
        $('#timer').html(time_formatted);
    },

    // set the timer colors
    set_color: function(json){
        // set the primary color
        $('#timer_backdrop').css('background-color' , json.primary);
        $('#timer').css('color'                     , json.primary);

        // set the secondary color, if specified
        if(json.secondary != null){
            $('#timer').css('background-color', json.secondary);
        }
    },

    // blink when running critically long
    critical_blink: function(time_formatted){
        if($('#timer').html() === 'OVER'){
            this.set_color({ primary: '#f00', secondary: '#000' });
            return time_formatted;
        } else {
            this.set_color({ primary: '#000', secondary: '#f00' });
            return 'OVER';
        }
    }
};

