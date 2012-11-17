// this object manages settings data in persistent storage
var settings = {
    
    // save_data is what gets saved into persistent storage
    save_data: {
        hours   :  0,
        minutes :  10,
        seconds :  00,
        elapsed : 36000,
        elapsed_remaining : 'elapsed' ,
        breakpoints: [
            {hours: 0, minutes: 5, seconds: 00, elapsed: 300, color: '#ffff00', action: 'none'},
            {hours: 0, minutes: 8, seconds: 00, elapsed: 480, color: '#ff0000', action: 'none'},
        ],
    },

    // initialize the persistent storage
    init: function(){
        // if a save file exists, load it
        if(localStorage.presentationtimerpro != null){ this.load(); }
        // otherwise, save initialized defaults
        else { this.save(this.save_data); }
    }, 

    // saves settings_data to persistent storage
    save: function(data){
        // map the objects to persistent storage
        this.save_data = data;
        // write to disk
        localStorage.presentationtimerpro = JSON.stringify(this.save_data);
    },

    // loads settings_data from persistent storage
    load: function(){
        this.save_data = JSON.parse(localStorage.presentationtimerpro);
    },
}
