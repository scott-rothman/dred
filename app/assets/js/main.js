$( document ).ready(function() {
    init();
});

function init() {
    window.navman = new Navman;
    window.dataman = new Dataman;
    window.formman = new Formman;
    dataman.calculateDatas();
    $('.inter_nav').on('click', function(e){
        e.preventDefault();
        dataman.pageRefresh();
        var active_button = $(this);
        var next_screen = '';
        
        next_screen = navman.getScreenTarget(active_button);
        console.log($(this));
        console.log(next_screen);
        if (next_screen == 'form') {
            $('.form_back').data('target','home');
        }
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
    $('.delete_all').on('click', function(e){
        $(this).addClass('hidden');
        $('.really_delete_all').removeClass('hidden');
    });
    $('.really_delete_all').on('click', function(e){
        $(this).addClass('hidden');
        $('.delete_all').removeClass('hidden');
        localStorage.clear();
        dataman.pageRefresh();
        navman.displayScreen('home');
    });
}