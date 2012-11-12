settings = {

    options: {
        presentation_length: {
            hours   :  0,
            minutes :  0,
            seconds :  0,
        }, 

        clock_display: 'elapsed', 

        breakpoints: {

        }
    },

    init: function(){
        if(localStorage.presentationtimerpro != null){

        }
    }, 

    save: function(){
        console.log('saving options');
    },

    load: function(){
        console.log('loading options');
    },
}
