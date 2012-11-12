// this object handles the client-side form behaviors
var settings_form = {
    
    // cache the HTML for the breakpoint
    breakpoint_html: " <!-- row --> " +
        "<tr>" + 
            "<td> <input type='color' name='breakpoint_color[]'> </td>" + 
            "<td>" + 
                "<input class='small' type='number' maxlength='2' min='0' step='1' name='breakpoint_hours[]' value='0'> :" + 
                "<input class='small' type='number' maxlength='2' min='0' max='59' step='1' name='breakpoint_minutes[]' value='00'> :" + 
                "<input class='small' type='number' maxlength='2' min='0' max='59' step='1' name='breakpoint_seconds[]' value='00'>" + 
            "</td>" + 
            "<td>" + 
                "<select name='breakpoint_action[]' data-mini='true' data-inline='true'>" + 
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
        $('table.settings tr:first').after(this.breakpoint_html);
        $('table.settings').trigger('create');
        app.initColorPickers();
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
        console.log(json);
        alert('Settings saved');
    },
}
