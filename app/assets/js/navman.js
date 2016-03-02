var Navman = function(){
    this.getScreenTarget = function(button) {
        var screen_next = button.data('target');
        return screen_next;
    };
    this.displayScreen = function(screen) {
        $('.screen').each(function(){
            $(this).removeClass('active');
            $('#screen_'+screen).addClass('active');
        });
    };
}