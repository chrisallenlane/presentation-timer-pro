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
        document.addEventListener('deviceready', this.onDeviceReady, false);
        // @todo: remember to delete this in production
        // @todo: find a better shim here and blog about it
        this.onDeviceReady();
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
        //navigator.notification.alert(device.phonegap, this.receivedEvent, 'My Rad Notification', 'My Button');

        // simulate a touch event every 30 seconds
        var keep_alive_timer = new Interval(function(){ $('a.keep_alive').click() , 30 * 1000);
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    },
};
