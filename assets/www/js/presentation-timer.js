// this is the application's main class
var presentation_timer = {

    // presentation_timer constructor
    initialize: function() {
        // draw the timer initially
        presentation_timer.set_color({ primary: '#0f0', secondary: '#000' })
        $('#timer').html('Start');
        this.draw();

        // initialize the save data
        settings.init();

        // draw the settings form
        settings_form.draw();

        // initialize the time
        this.hours        = 0;
        this.minutes      = 0;
        this.seconds      = 0;
        this.elapsed      = 0; // seconds that don't wrap to minutes
        this.over_time    = false;
        this.has_begun    = false;
        this.is_playing   = false;

        // store breakpoints in an array
        this.breakpoints = settings.save_data.breakpoints;
        this.breakpoints.push({
            color   : '#000000', // not used
            hours   : settings.save_data.hours,
            minutes : settings.save_data.minutes,
            seconds : settings.save_data.seconds,
            elapsed : settings.save_data.elapsed,
            action  : 'final',
        });

        // tracks progress through breakpoints
        this.next_breakpoint_index = 0;

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
        if(confirm('Reset timer?')){ this.reset(); }
    },

    // resets the timer
    reset: function(){
        // stop and destroy the timer (if it has been initialized)
        if(this.interval != null){
            this.interval.pause();
        }
        this.interval              = null;

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

        // reload the settings in permanent storage
        settings.init();

        // reload the breakpoints (because form settings may have been changed)
        // @todo @note @bug: THESE BREAKPOINTS NEED TO BE SORTED INTO CHRONOLOGICAL ORDER.
        // OTHERWISE, THE FINAL EVENT WILL NEVER FIRE.
        // @todo: make it possible to set the start color
        // @todo: make it possible to specify action for presentation end
        // @todo: validate non-empty fields
        // @todo: write a README
        // @todo: publish the repo before Demo Night
        // @todo: see if settings are being reloaded when saved to device. Not sure if they are.
        // @todo: make sure two breakpoints don't share a congruent time
        // @todo: make sure breakpoints aren't set at zero elapsed
        // @todo: restructure breakpoints form to lay out better on smaller screens. Stack vertically.
        // @todo: support elapsed/remaining
        
        this.breakpoints = settings.save_data.breakpoints;
        this.breakpoints.push({
            color   : '#000000', // not used
            hours   : settings.save_data.hours,
            minutes : settings.save_data.minutes,
            seconds : settings.save_data.seconds,
            elapsed : settings.save_data.elapsed,
            action  : 'final',
        });
        
        // re-draw the timer
        presentation_timer.set_color({ primary: '#0f0', secondary: '#000' })
        $('#timer').html('Start');
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








        // determine if the current second should trigger a new breakpoint
        if(
            !this.over_time &&   // don't trigger breakpoints after the presentation ends
            this.breakpoints.length > this.next_breakpoint_index &&
            this.elapsed == this.breakpoints[this.next_breakpoint_index].elapsed
        ){
            // set a flag on the last breakpoint
            if(this.breakpoints[this.next_breakpoint_index].action == 'final'){
                this.over_time = true;
            }

            // handle normal breakpoints
            else {
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

                // vibrate if appropriate
                if(
                    this.breakpoints[this.next_breakpoint_index].action == 'vibrate' ||
                    this.breakpoints[this.next_breakpoint_index].action == 'both'
                ){
                    console.log('vibrate');
                    navigator.notification.vibrate(1000);
                }

                // track the next breakpoint
                this.next_breakpoint_index++;
            }
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

