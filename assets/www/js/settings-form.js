// this object handles the client-side form behaviors
var settings_form = {

    breakpoint_number: 0,
    
    // cache the HTML for the breakpoint
    breakpoint_html: " <!-- row --> " +
        "<tr class='breakpoint_number_" + this.breakpoint_number + "'>" + 
            "<td> <input type='color' name='breakpoint_color[" + this.breakpoint_number + "]'> </td>" + 
            "<td>" + 
                "<input class='small' type='number' maxlength='2' min='0' step='1' name='breakpoint_hours[" + this.breakpoint_number + "]' value='0'> :" + 
                "<input class='small' type='number' maxlength='2' min='0' max='59' step='1' name='breakpoint_minutes[" + this.breakpoint_number + "]' value='00'> :" + 
                "<input class='small' type='number' maxlength='2' min='0' max='59' step='1' name='breakpoint_seconds[" + this.breakpoint_number + "]' value='00'>" + 
            "</td>" + 
            "<td>" + 
                "<select name='breakpoint_action[" + this.breakpoint_number + "]' data-mini='true' data-inline='true'>" + 
                    "<option>(Do nothing)</option>" + 
                    "<option>Beep</option>" + 
                    "<option>Vibrate</option>" + 
                    "<option>Beep and Vibrate</option>" + 
                "</select>" + 
            "</td>" + 
            "<td> <button onclick='javascript:return settings_form.remove_breakpoint(this)' " +
                  "data-mini='true' data-icon='delete' data-iconpos='notext'>Delete</button> </td>" + 
        "</tr>"
    ,

    // adds another breakpoint to the settings page
    add_breakpoint: function(){
        // insert and render the breakpoint HTML
        $('table.settings tr:last').before(this.breakpoint_html);
        $('table.settings').trigger('create');

        // initialize the new color picker
        $('tr.breakpoint_number_' + this.breakpoint_number + ' input[type=color]').spectrum({
            color: '#ff0',
            palette: [ 'red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet', ],
            showPaletteOnly: true,
            showPalette: true,
            showSelectionPalette: false,
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

    // captures the form options
    save: function(){
        json = $('form#app_settings').serializeArray();
        console.log('Settings saved');
        console.log(this.breakpoint_number);
        console.log(json);
    },
}
