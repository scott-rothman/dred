$( document ).ready(function() {
    init();
});

function init() {
    window.navman = new Navman;
    window.dataman = new Dataman;
    window.formman = new Formman;
    var total_dreds = dataman.checkDredCount();
    $('#dred_num').html(total_dreds);
    $('.inter_nav').on('click', function(e){
        e.preventDefault();
        dataman.pageRefresh();
        var active_button = $(this);
        var next_screen = '';
        
        next_screen = navman.getScreenTarget(active_button);
        navman.displayScreen(next_screen);
    });
    $('.inter_form').on('click', function(e){
        if($(this).is('button')) {
            e.preventDefault();    
        }
        var active_button = $(this);
        var next_action = '';
        
        //next_action = formman.getFormAction(active_button);
        formman.fireAction(active_button);
    });
    $('.debug').on('click', function(e){
        localStorage.clear();
    });
}