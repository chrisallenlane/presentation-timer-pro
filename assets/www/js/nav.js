// this is a lightweight class to manage the nav controls
nav = {
    doBackButton: function(){
        // from timer: exit application
        if($.mobile.activePage.is('#page-timer')){ navigator.app.exitApp(); }
        // from menu: return to timer
        else if($.mobile.activePage.is('#page-menu')){ window.location = '#page-timer'; }
        // from other pages: return to menu
        else { window.location = '#page-menu'; }
    },
}
