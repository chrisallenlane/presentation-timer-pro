// this is the application's main class
var presentation_timer = {

    // presentation_timer constructor
    initialize: function() {

        // stop and destroy the timer (if it has been initialized)
        if(this.interval != null){
            this.interval.pause();
            this.interval = null;
        }

        // initialize the save data
        settings.init();

        // initialize the time
        this.hours                 = 0;
        this.minutes               = 0;
        this.seconds               = 0;
        this.elapsed               = 0;
        this.over_time             = false;
        this.has_begun             = false;
        this.is_playing            = false;
        this.next_breakpoint_index = 0;
        this.paused_time           = '';

        // store breakpoints in an array
        this.breakpoints = settings.save_data.breakpoints;
        this.breakpoints.push({
            color   : settings.save_data.breakpoint_terminal_color,
            hours   : settings.save_data.hours,
            minutes : settings.save_data.minutes,
            seconds : settings.save_data.seconds,
            elapsed : settings.save_data.elapsed,
            action  : settings.save_data.breakpoint_terminal_action,
            final   : true,
        });

        // draw the timer initially
        presentation_timer.set_color({
            primary: settings.save_data.breakpoint_initial_color,
            secondary: '#000' }
        );
        $('#timer').html('Start');
    },

    // plays and pauses the timer
    play_pause: function(){
        // if the timer has not yet been started
        if(!this.has_begun){
            // start
            this.interval   = new Interval(function(){ presentation_timer.tick() }, 1000);
            this.has_begun  = true;
            this.is_playing = true;

            // show either elapsed or remaining time, per the settings
            var last_elapsed   =  this.breakpoints[this.breakpoints.length - 1].elapsed;
            var seconds        =  (settings.save_data.elapsed_remaining ==  'elapsed') ? this.elapsed : (last_elapsed - this.elapsed) ;

            // buffer and display the output
            var time_formatted = this.format_time(seconds);
            $('#timer').html(time_formatted);
        }

        // if the timer has previously been started
        else {
            // pause
            if(this.is_playing){
                this.is_playing = false;
                this.interval.pause();
                
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
            }
        }
    },

    // displays the main pop-up menu
    display_menu: function(){
        window.location = '#page-menu';
    },

    // prompts the user to reset the timer
    prompt_reset: function(){
        if(confirm('Reset timer?')){ this.initialize(); }
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

    // formats elapsed seconds as h:mm:ss
    format_time: function(secs){
        // don't display negative time
        var sign = '';
        if(secs < 0){
            secs    *= -1;
            var sign = '-';
        }

        // Thanks for taking some of the thinking out of this:
        // http://stackoverflow.com/a/1322798/461108
        this.hours   = Math.floor(secs / 3600);
        secs        %= 3600;

        // if hours < 0, don't pad the minutes with a leading zero. Otherwise, do.
        m = Math.floor(secs / 60);
        if(this.hours >= 1){
            m = (m < 10) ? '0' + m : m ;
        }
        this.minutes = m;

        // format :s as :ss if s < 10
        s = Math.floor(secs % 60);
        s = (s < 10) ? '0' + s : s ;
        this.seconds = s;

        // prettify
        if(this.hours > 0){
            var time_formatted = sign + this.hours + ':' + this.minutes + ':' + this.seconds;
        } else {
            var time_formatted = sign + this.minutes + ':' + this.seconds;
        }

        // return the formatted time string
        return time_formatted;
    },

    // operate the clock
    tick: function(){
        // tick a second
        ++this.elapsed;

        // show either elapsed or remaining time, per the settings
        var last_elapsed   =  this.breakpoints[this.breakpoints.length - 1].elapsed;
        var seconds        =  (settings.save_data.elapsed_remaining ==  'elapsed') ? this.elapsed : (last_elapsed - this.elapsed) ;

        // buffer the output
        var time_formatted = this.format_time(seconds);

        // determine if the current second should trigger a new breakpoint
        if(
            !this.over_time &&   // don't trigger breakpoints after the presentation ends
            this.breakpoints.length > this.next_breakpoint_index &&
            this.elapsed == this.breakpoints[this.next_breakpoint_index].elapsed
        ){
            // set a flag on the last breakpoint
            if(this.breakpoints[this.next_breakpoint_index].final === true){
                this.over_time = true;
            }

            // set the new color
            presentation_timer.set_color({
                primary: this.breakpoints[this.next_breakpoint_index].color,
                secondary: '#000'
            })

            // beep if appropriate
            if(
                this.breakpoints[this.next_breakpoint_index].action == 'beep' ||
                this.breakpoints[this.next_breakpoint_index].action == 'both'
            ){
                navigator.notification.beep(1); 
            }

            // triple beep if appropriate (final breakpoint only)
            if(this.breakpoints[this.next_breakpoint_index].action == 'triple-beep'){
                navigator.notification.beep(3); 
            }

            // vibrate if appropriate
            if(
                this.breakpoints[this.next_breakpoint_index].action == 'vibrate' ||
                this.breakpoints[this.next_breakpoint_index].action == 'both'
            ){
                navigator.notification.vibrate(1000);
            }

            // track the next breakpoint
            this.next_breakpoint_index++;
            
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
            this.set_color({
                primary: settings.save_data.breakpoint_terminal_color, 
                secondary: '#000'
            });
            return time_formatted;
        } else {
            this.set_color({
                primary: '#000',
                secondary: settings.save_data.breakpoint_terminal_color, 
            });
            return 'OVER';
        }
    }
};

