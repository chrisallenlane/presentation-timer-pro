// this is a lightweight class to manage the nav controls
nav = {
    // handle the Android back button
    doBackButton: function(){
        // from timer: exit application
        if($.mobile.activePage.is('#page-timer')){ navigator.app.exitApp(); }

        // from menu: return to timer
        else if($.mobile.activePage.is('#page-menu')){ window.location = '#page-timer'; }

        // from settings page
        else if($.mobile.activePage.is('#page-settings')){
            // hide the color picker if it is being displayed
            if($('div.simpleColorChooser').is(':visible')){
                // I've inspected the color chooser plugin's code, and the cancel
                // button seems to do little more than this, fortunately
                $('div.simpleColorChooser').hide();
            }
            
            // otherwise, return to the menu page
            else {
                window.location = '#page-menu';
            }
        }

        // from other pages: return to menu
        else { window.location = '#page-menu'; }
    },

    // handle the Android menu button
    doMenuButton: function(){
        window.location = '#page-menu';
    }
}
