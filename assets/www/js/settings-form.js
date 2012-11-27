// this object handles the client-side form behaviors
var settings_form = {

    breakpoint_number : 0,
    color_cell_size   : 25,
    errors            : [],
    form_values       : {},
    
    // adds another breakpoint to the settings page
    add_breakpoint: function(data){
        // initialize the placeholder variables
        hours       = minutes     = seconds    = '0';
        op_none_sel = op_beep_sel = op_vib_sel = op_both_sel = '';
        
        // map data to local variables, if data is set
        if(data != null){
            hours   = data.hours;
            minutes = data.minutes;
            seconds = data.seconds;
            color   = data.color;
            // set the 'selected' attribute on the appropriate <selects>
            op_none_sel = (data.action == 'none')    ? 'selected' : '' ;
            op_beep_sel = (data.action == 'beep')    ? 'selected' : '' ;
            op_vib_sel  = (data.action == 'vibrate') ? 'selected' : '' ;
            op_both_sel = (data.action == 'both')    ? 'selected' : '' ;
        }
        
        // assemble the HTML
        var html = " <!-- row --> " +
        "<tr class='breakpoint_number_" + this.breakpoint_number + "' data-theme='b'>" + 
            "<td> <input data-theme='a' type='color' name='breakpoints[" + this.breakpoint_number + "].color' value='" + color + "'> </td>" + 
            "<td>" + 
                "<label>HR: <input data-theme='a' class='inline' type='number' maxlength='2' step='1' min='0' max='99' name='breakpoints[" + this.breakpoint_number + "].hours' value='" + hours + "'></label><br>" + 
                "<label>MM: <input data-theme='a' class='inline' type='number' maxlength='2' step='1' min='0' max='59' name='breakpoints[" + this.breakpoint_number + "].minutes' value='" + minutes + "'></label><br>" + 
                "<label>SS: <input data-theme='a' class='inline' type='number' maxlength='2' step='1' min='0' max='59' name='breakpoints[" + this.breakpoint_number + "].seconds' value='" + seconds + "'></label>" + 
            "</td>" + 
            "<td>" + 
                "<select data-theme='a' name='breakpoints[" + this.breakpoint_number + "].action' data-inline='true'>" + 
                    "<option value='none' "    + op_none_sel + ">None</option>" + 
                    "<option value='beep' "    + op_beep_sel + ">Beep</option>" + 
                    "<option value='vibrate' " + op_vib_sel  + ">Vibrate</option>" + 
                    "<option value='both' "    + op_both_sel + ">Both</option>" + 
                "</select>" + 
            "</td>" + 
            "<td> <button data-theme='a' onclick='javascript:return settings_form.remove_breakpoint(this)' " +
                  "data-mini='true' data-icon='delete' data-iconpos='notext'>Delete</button> </td>" + 
        "</tr>";

        // insert and render the breakpoint HTML
        $('table.settings tr:last').prev().before(html);
        $('table.settings').trigger('create');

        // initialize the color-picker polyfill
        $('tr.breakpoint_number_' + this.breakpoint_number + ' input[type=color]').simpleColor({
            boxHeight: '30px',
            boxWidth: '50px',
            cellWidth: this.color_cell_size,
            cellHeight: this.color_cell_size,
            border: '1px solid #333333',
        });

        // center the color picker when launched
        $('tr.breakpoint_number_' + this.breakpoint_number + ' div.simpleColorDisplay').bind('click', function(){
            settings_form.center_color_chooser();
        });

        // increment the breakpoint number
        this.breakpoint_number++;
        return false;
    },

    // centers the color chooser
    center_color_chooser: function(){
        // @note: I have to anticipate the size of div.simpleColorChooser, because
        // it's not likely to be drawn by now. This is an unfortunate (but tolerable)
        // race-condition that's a result of the color chooser plugin not having
        // a built-in callback hook. I'm sort of having to bolt one on here 
        // myself.

        // the +2 accounts for the borders
        var width = (this.color_cell_size + 2) * 16;
        var height = (this.color_cell_size + 2) * 14;

        // capture the screen dimensions
        var win_width = $(window).innerWidth();
        var win_height = $(window).innerHeight();
        var margin_top  = (win_height - height) / 2;
        var margin_left = (win_width - width) / 2;

        // position accordingly
        $('div.simpleColorContainer div.simpleColorChooser').css('top', margin_top);
        $('div.simpleColorContainer div.simpleColorChooser').css('left', margin_left);
    },

    // redraws the breakpoints
    draw_breakpoints: function(){
        // hide the settings table
        $('table.settings').fadeOut(function(){
            // un-draw the breakpoints
            $('table.settings tr').slice(2, -2).remove();

            // unset the final breakpoint that represents the end of the 
            // presentation
            breakpoints = settings.save_data.breakpoints;
            breakpoints = breakpoints.slice(0, -1);

            // re-draw the breakpoints
            $(breakpoints).each(function(index, obj){
                settings_form.add_breakpoint(obj);
            });
            // reveal the redrawn table
            $('table.settings').fadeIn();
        });
    },

    // removes a breakpoint
    remove_breakpoint: function(obj){
        $(obj).parents('tr').fadeOut('slow', function(){ $(this).remove(); });
        return false;
    },

    // converts a H:MM:SS to seconds
    hmmss_to_seconds: function(obj){
        // we need parseInt() here to cast to an Integer so we don't 
        // concatenate these values as strings
        var elapsed  = parseInt(obj.seconds);
            elapsed += parseInt(obj.minutes * 60);
            elapsed += parseInt(obj.hours   * 3600);
        return elapsed;
    },

    // captures the form data
    get_form_data: function(){
        // serialize the form data
        objects = $('form#app_settings').serializeArray();

        // capture and strip out the non-breakpoint data
        this.form_values.hours                      = objects[0].value;
        this.form_values.minutes                    = objects[1].value;
        this.form_values.seconds                    = objects[2].value;
        this.form_values.elapsed_remaining          = objects[3].value;
        this.form_values.breakpoint_initial_color   = objects[4].value;
        this.form_values.breakpoint_terminal_color  = objects[(objects.length - 2)].value;
        this.form_values.breakpoint_terminal_action = objects[objects.length - 1].value;

        this.form_values.breakpoints                = [];
        objects = objects.slice(5, (objects.length - 2));

        // the H:MM:SS time ultimately needs to be converted into seconds,
        // so do that here
        var hmmss = {
            hours   : this.form_values.hours,
            minutes : this.form_values.minutes,
            seconds : this.form_values.seconds,
        }
        this.form_values.elapsed = this.hmmss_to_seconds(hmmss);

        // iterate over the breakpoint data
        breaks = [];
        $(objects).each(function(index, obj){
            // extract the breakpoint number and field
            var bp_num = obj.name.match(/[0-9]+/g);
            var dotpos = obj.name.indexOf('.');
            var field  = obj.name.substring(dotpos + 1);

            // vivify objects
            if(breaks[bp_num] == undefined){ breaks[bp_num] = {}; }

            // map values
            breaks[bp_num][field] = obj.value;
        });
        
        // remove empty elements from the breaks array
        breaks = breaks.filter(function(o){ return (o == null) ? false : true ; });

        // now convert each breakpoint's h:mm:ss time to seconds
        $(breaks).each(function(index, obj){
            var hmmss = {
                hours:   obj.hours,
                minutes: obj.minutes,
                seconds: obj.seconds,
            }
            breaks[index].elapsed = settings_form.hmmss_to_seconds(hmmss);
        });

        // lastly, sort the breakpoints by elapsed time
        breaks.sort(function(a, b){ return a.elapsed - b.elapsed; });
        this.form_values.breakpoints = breaks;
    },

    // draws the top of the settings form
    draw: function(){
        // draw the checked state of elapsed_remaining
        elapsed_checked   = (settings.save_data.elapsed_remaining == 'elapsed')   ? 'selected' : '' ;
        remaining_checked = (settings.save_data.elapsed_remaining == 'remaining') ? 'selected' : '' ;

        // draw the top half of the form
        var html = "" +
            "<h2>Presentation Length</h2>" + 
            "<input type='number' maxlength='2' min='0' step='1' name='hours' value='" + settings.save_data.hours + "'> :" + 
            "<input type='number' maxlength='2' min='0' max='59' step='1' name='minutes' value='" + settings.save_data.minutes + "'> :" + 
            "<input type='number' maxlength='2' min='0' max='59' step='1' name='seconds' value='" + settings.save_data.seconds + "'>" + 

            "<h2>Clock Display</h2>" + 
            "<span class='elapsed_remaining'> " + 
                "<label for='elapsed_remaining' class='ui-hidden-accessible'>Elapsed/Remaining</label>" + 
                "<select name='elapsed_remaining' id='elapsed_remaining' data-role='slider'>" + 
                    "<option value='elapsed' " + elapsed_checked + ">Elapsed</option>" + 
                    "<option value='remaining' " + remaining_checked + ">Remaining</option>" + 
                "</select> " + 
            "</span>"; 

        // draw
        $('div.settings_main').html(html);

        // draw the initial breakpoint
        var color = settings.save_data.breakpoint_initial_color;
        var html = " <!-- row --> " +
        "<tr class='breakpoint_initial' data-theme='b'>" + 
            "<td> <input data-theme='a' type='color' name='breakpoint_initial_color' value='" + color + "'> </td>" + 
            "<td> Start </td>" + 
            "<td> N/A </td>" + 
        "</tr>";
        $('table.settings tr:first').after(html);

        // draw the terminal breakpoint
        var color = settings.save_data.breakpoint_terminal_color;
        terminal_action = settings.save_data.breakpoint_terminal_action;
        op_none_sel      =  (terminal_action ==  'none')        ? 'selected' : '' ;
        op_beep_sel      =  (terminal_action ==  'beep')        ? 'selected' : '' ;
        op_trip_beep_sel =  (terminal_action ==  'triple-beep') ? 'selected' : '' ;
        op_vib_sel       =  (terminal_action ==  'vibrate')     ? 'selected' : '' ;
        op_both_sel      =  (terminal_action ==  'both')        ? 'selected' : '' ;

        var html = " <!-- row --> " +
        "<tr class='breakpoint_terminal' data-theme='b'>" + 
            "<td> <input data-theme='a' type='color' name='breakpoint_terminal_color' value='" + color + "'> </td>" + 
            "<td> End </td>" + 
            "<td>" + 
                "<select data-theme='a' name='breakpoints_terminal_action' data-inline='true'>" + 
                    "<option value='none' "        + op_none_sel      + ">None</option>"    +
                    "<option value='beep' "        + op_beep_sel      + ">Beep</option>"    +
                    "<option value='triple-beep' " + op_trip_beep_sel + ">3x Beep</option>" +
                    "<option value='vibrate' "     + op_vib_sel       + ">Vibrate</option>" +
                    "<option value='both' "        + op_both_sel      + ">Both</option>"    +
                "</select>" + 
            "</td>" + 
        "</tr>";
        $('table.settings tr:last').before(html);

        // apply the color-picker polyfill to the initial and terminal breakpoints
        $('tr.breakpoint_initial input[type=color], tr.breakpoint_terminal input[type=color]').simpleColor({
            boxHeight: '30px',
            boxWidth: '50px',
            cellWidth: this.color_cell_size,
            cellHeight: this.color_cell_size,
            border: '1px solid #333333',
        });
        // center the color picker when launched
        $('tr.breakpoint_initial div.simpleColorDisplay, tr.breakpoint_terminal div.simpleColorDisplay').bind('click', function(){
            settings_form.center_color_chooser();
        });

        // draw the interleaving breakpoints
        settings_form.draw_breakpoints();
    },

    // validates methods
    validate: {
        // returns false if val is not an integer
        is_int: function(val){
            // this is naive, but good enough for our purposes
            return (val.indexOf('.') === -1);
        },

        // returns false if val is not a positive integer
        is_positive_integer: function(val){
            return ((!this.is_int(val)) || val < 0) ? false : true ;
        },
        
        // returns false if val < 0 or > 59
        is_integer: function(val){
            return ((!this.is_int(val)) || val < 0 || val > 59) ? false : true ;
        },

        // returns false if a breakpoint's elapsed time is <= 0
        elapsed_is_greater_than_zero: function(val){
            return (val <= 0) ? false : true ;
        },
        
        // returns false if a breakpoint's elapsed time is >= presentation length
        elapsed_is_less_than_presentation_length: function(val){
            return (val >= settings_form.form_values.elapsed) ? false : true ;
        },

        // returns false if the form is invalid
        settings_form: function(){
            // clear out the previous error messages
            settings_form.errors = [];
        
            // track whether an error has occurred
            var is_valid = true;

            // validate presentation time data
            if(!settings_form.validate.is_positive_integer(settings_form.form_values.hours)){
                settings_form.errors.push("Hours must be a positive number.\n");
                is_valid = false;
            }
            if(!settings_form.validate.is_integer(settings_form.form_values.minutes)) {
                settings_form.errors.push("Minutes must be a number between 0 and 59.\n");
                is_valid = false;
            }
            if(!settings_form.validate.is_integer(settings_form.form_values.seconds)) {
                settings_form.errors.push("Seconds must be a number between 0 and 59.\n");
                is_valid = false;
            }

            // flag to track breakpoint errors
            var breakpoints_are_valid = true;

            // track breakpoint elapsed times to make sure that each is unique
            var breakpoint_times      = [];

            // validate the breakpoints
            $(settings_form.form_values.breakpoints).each(function(index, object){
                // hours 
                if(!settings_form.validate.is_positive_integer(object.hours)) {
                    settings_form.errors.push("Breakpoint hours must be a positive number.\n");
                    breakpoints_are_valid = false;
                }
                // minutes 
                if(!settings_form.validate.is_integer(object.minutes)) {
                    settings_form.errors.push("Breakpoint minutes must be a number between 0 and 59.\n");
                    breakpoints_are_valid = false;
                }
                // seconds 
                if(!settings_form.validate.is_integer(object.seconds)) {
                    settings_form.errors.push("Breakpoint seconds must be a number between 0 and 59.\n");
                    breakpoints_are_valid = false;
                }
                // elapsed > 0
                if(!settings_form.validate.elapsed_is_greater_than_zero(object.elapsed)){
                    settings_form.errors.push("A breakpoint may not have a trigger time of 0:00:00.");
                    breakpoints_are_valid = false;
                }
                // elapsed < presentation length
                if(!settings_form.validate.elapsed_is_less_than_presentation_length(object.elapsed)){
                    settings_form.errors.push("All breakpoints be scheduled before the end of your presentation.");
                    breakpoints_are_valid = false;
                }
                // verify uniqueness
                if(breakpoint_times[object.elapsed] != null){
                    settings_form.errors.push(
                        "Some of your breakpoints are configured to occur at " +
                        "the same moment. Each breakpoint must be configured to " +
                        "fire at a unique moment."
                    );
                    breakpoints_are_valid = false;
                }
                // register the breakpoint time
                breakpoint_times[object.elapsed] = true;
            });

            // @note: I'm not going to bother validating the <select> boxes,
            // because you'd truly have to TRY to inject bad data in there
            // in order to cause problems.

            // return true if valid, false otherwise
            return (is_valid && breakpoints_are_valid);
        },
    },

    // saves form data
    save: function(){
        // capture the form data
        this.get_form_data();

        // validate the settings
        // if invalid, notify the user
        if(!this.validate.settings_form()){
            alert(this.errors.join());
            return false;
        }
        // notify the user if the timer is currently running
        if(
            presentation_timer.has_begun &&
            !confirm("Changing settings will reset your timer. Continue?")
        ){ return false; }

        // save and re-load the settings (must load to take effect)
        settings.save(this.form_values);

        // re-draw the breakpoints to guarantee that they appear within the UI
        // in chronological order
        settings_form.draw_breakpoints();

        // reset the timer
        presentation_timer.initialize();

        // notify the user
        alert('Settings saved');
        return true;
    },
}
