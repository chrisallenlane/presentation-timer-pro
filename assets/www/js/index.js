var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },

    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        // detect whether the application is being run from within a PhoneGap
        // application, or from within a Desktop browser environment
        // @see: http://stackoverflow.com/a/11731277
        if(document.location.protocol == "file:"){
            document.addEventListener('deviceready', this.onDeviceReady, false);
        } else {
            console.log('Desktop environment detected.');
            app.onDeviceReady();
        }
    },

    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');

        // initialize the timer object
        presentation_timer.initialize();

        // bind the application-level events
        document.addEventListener('backbutton', nav.doBackButton, false);
        document.addEventListener('menubutton', nav.doMenuButton, false);
        $(window).bind('resize', function(){ presentation_timer.draw() });
        $('#timer').bind('tap', function(){ presentation_timer.play_pause() });
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    },
};
