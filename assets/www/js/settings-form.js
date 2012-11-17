// this object handles the client-side form behaviors
var settings_form = {
    errors: [],
    form_values: {},
    breakpoint_number: 0,
    breakpoint_colors: [ '#ff0000', '#ffa500', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#ee82ee', ],

    // adds another breakpoint to the settings page
    add_breakpoint: function(data){
        console.log(data);
        // initialize the placeholder variables
        hours       = minutes     = seconds    = '00';
        op_none_sel = op_beep_sel = op_vib_sel = op_both_sel = '';
        color       = this.breakpoint_colors[this.breakpoint_number];
        
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
            "<td> <input data-theme='a' type='color' name='breakpoints[" + this.breakpoint_number + "].color'> </td>" + 
            "<td>" + 
                "<input data-theme='a' class='small' type='number' maxlength='2' step='1' min='0' name='breakpoints[" + this.breakpoint_number + "].hours' value='" + hours + "'> :" + 
                "<input data-theme='a' class='small' type='number' maxlength='2' step='1' min='0' max='59' name='breakpoints[" + this.breakpoint_number + "].minutes' value='" + minutes + "'> :" + 
                "<input data-theme='a' class='small' type='number' maxlength='2' step='1' min='0' max='59' name='breakpoints[" + this.breakpoint_number + "].seconds' value='" + seconds + "'>" + 
            "</td>" + 
            "<td>" + 
                "<select data-theme='a' name='breakpoints[" + this.breakpoint_number + "].action' data-mini='true' data-inline='true'>" + 
                    "<option value='none' "    + op_none_sel + ">(Do nothing)</option>" + 
                    "<option value='beep' "    + op_beep_sel + ">Beep</option>" + 
                    "<option value='vibrate' " + op_vib_sel  + ">Vibrate</option>" + 
                    "<option value='both' "    + op_both_sel + ">Beep and Vibrate</option>" + 
                "</select>" + 
            "</td>" + 
            "<td> <button data-theme='a' onclick='javascript:return settings_form.remove_breakpoint(this)' " +
                  "data-mini='true' data-icon='delete' data-iconpos='notext'>Delete</button> </td>" + 
        "</tr>";

        // insert and render the breakpoint HTML
        $('table.settings tr:last').before(html);
        $('table.settings').trigger('create');

        // initialize the new color picker
        $('tr.breakpoint_number_' + this.breakpoint_number + ' input[type=color]').spectrum({
            color: color,
            palette: this.breakpoint_colors,
            showPaletteOnly: true,
            showPalette: true,
            showSelectionPalette: false,
            change: function(){ console.log('color changed');},
        });

        // increment the breakpoint number
        this.breakpoint_number++;
        return false;
    },

    // removes a breakpoint
    remove_breakpoint: function(obj){
        $(obj).parents('tr').fadeOut('slow', function(){ $(this).remove(); });
        return false;
    },

    // converts a H:MM:SS to seconds
    hmmss_to_seconds: function(obj){
        var elapsed  = (obj.seconds);
            elapsed += (obj.minutes * 60);
            elapsed += (obj.hours   * 3600);
        return elapsed;
    },

    // captures the form data
    get_form_data: function(){
        // serialize the form data
        objects = $('form#app_settings').serializeArray();

        // capture and strip out the non-breakpoint data
        this.form_values.hours             = objects[0].value;
        this.form_values.minutes           = objects[1].value;
        this.form_values.seconds           = objects[2].value;
        this.form_values.elapsed_remaining = objects[3].value;
        this.form_values.breakpoints       = [];
        objects = objects.slice(4, objects.length);

        // the H:MM:SS time ultimately needs to be converted into seconds,
        // so do that here
        var hmmss = {
            hours   : this.form_values.hours,
            minutes : this.form_values.hours,
            seconds : this.form_values.seconds,
        }
        this.form_values.elapsed = this.hmmss_to_seconds(hmmss);

        // iterative over the breakpoint data
        // @note: I was hoping there would be a much cleaner way to do this,
        // but I'm not finding it. Oh well - @kludge on.
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

        // now convert each breakpoint's h:mm:ss time to seconds
        $(breaks).each(function(index, obj){
            var hmmss = {
                hours:   obj.hours,
                minutes: obj.minutes,
                seconds: obj.seconds,
            }
            breaks[index].elapsed = settings_form.hmmss_to_seconds(hmmss);
        });

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

        // draw the breakpoints (bottom half of form)
        $(settings.save_data.breakpoints).each(function(index, obj){
            settings_form.add_breakpoint(obj);
        });
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
        
        // returns false if the form is invalid
        settings_form: function(){
            // track whether an error has occurred
            var is_valid = true;

            // validate presentation time data
            // @note: `this` won't point to the global settings_form object from
            // inside a sub-object, so I'm using settings_form instead
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

            // validate breakpoint data
            var breakpoints_are_valid = true;
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
            });

            // @note: I'm not going to bother validating the <select> boxes,
            // because you'd truly have to TRY to inject non-standard data 
            // into them, and if you really want to sabotage your own app so 
            // badly, who am I to stop you?

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
        // if valid, save the new settings 
        settings.save(this.form_values);
        alert('Settings saved');
        return true;
    },
}
