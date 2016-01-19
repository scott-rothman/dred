$( document ).ready(function() {
    init();
});

function init() {
    var dataman = new Dataman;
    var navman = new Navman;
    var formman = new Formman(dataman);
    
    $('.inter_nav').on('click', function(e){
        e.preventDefault();

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
}

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

var Formman = function(dataman){
    this.getFormAction = function(button) {
        var action_to_fire = button.data('action');
        return action_to_fire;
    };
    this.dredReasonsToggle = function(status) {
        if (status == 'toggle_yes') {
            $('.dred_reasons').addClass('active');
            $('#specific_reasons').val('y');
        } else if (status == 'toggle_no') {
            $('.dred_reasons').removeClass('active');
            $('#specific_reasons').val('n');
        }
    }
    this.addDredReason = function() {

        var original_input = $('.dred_reason').last();
        var cloned_input = original_input.clone(true, true);
        var current_reason_num = original_input.data('position');
        var next_reason_num = current_reason_num + 1;
        
        //Change original add button to minus
        original_input.find('button').html('-');
        original_input.find('button').data('action', 'remove_reason')

        original_input.data('position',next_reason_num);
        cloned_input.attr('name','dr'+next_reason_num);
        cloned_input.attr('id','dr'+next_reason_num);
        cloned_input.find('input').val('');
        $(".dred_reasons").append(cloned_input);
    };
    this.removeDredReason = function(button) {
        button.closest('section').remove();
    }
    this.submitDred = function() {
        var dred_data = Array(),
            dred_id = dataman.checkDredCount(),
            dred_reason_count = 0,
            looping_reason = '';

        dred_data[dred_id] = {};
        dred_data[dred_id]['name'] = $('#name').val();
        dred_data[dred_id]['reasons'] = {};
        dred_data[dred_id]['date'] = $('#date').val();
        $('.dred_reason').each(function(){
            looping_reason = $(this).find('input[type="text"]').val();
            dred_data[dred_id]['reasons'][dred_reason_count] = looping_reason;
            dred_reason_count++;
        });
        console.log(dred_data);
        dataman.addDred(dred_data);
    }
    this.fireAction = function(button) {
        var action = button.data('action');
        if (action == 'add_reason') {
            this.addDredReason();
        } else if (action == 'remove_reason') {
            this.removeDredReason(button);
        } else if (action == 'toggle_yes' || action == 'toggle_no') {
            this.dredReasonsToggle(action);
        } else if (action == 'submit_dred') {
            this.submitDred();
        }
    };
}

var Dataman = function() {
    this.getDreds = function() {;
        if (typeof localStorage['dreds'] != 'undefined') {
            var str_dreds = localStorage['dreds'];
            var ar_dreds = JSON.parse(str_dreds);
        } else {
            var ar_dreds = new Array();
        }
        return ar_dreds;
    }
    this.checkDredCount = function() {
        var ar_dreds = this.getDreds();
        var num_of_dreds = ar_dreds.length;
        console.log('dreds so far: '+ num_of_dreds);
        return num_of_dreds;
    }
    this.addDred = function(data) {
        var ar_dreds = this.getDreds();
        var str_dreds = "";
        console.log(ar_dreds);
        //var ar_dreds_length = this.checkDredCount();
        ar_dreds.push(data);
        str_dreds = JSON.stringify(ar_dreds);
        console.log(str_dreds);
        console.log(localStorage);
        localStorage['dreds'] = str_dreds;
        console.log(localStorage);
    }
    this.removeDred = function(id) {
        var ar_dreds = this.getDreds();
        var index = ar_dreds.indexOf(id);
        if(index > -1) {
            ar_dreds.splice(index, 1);
        }
        localStorage['dreds'] = ar_dreds;
    }
    this.editDred = function(id) {

    }
    this.completeDred = function(id) {

    }
 }