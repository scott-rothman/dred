var Formman = function(){
    this.getFormAction = function(button) {
        var action_to_fire = button.data('action');
        return action_to_fire;
    };
    this.dredReasonsToggle = function(status) {
        if (status == 'toggle_yes') {
            $('.dred_reasons').addClass('active');
            $('#specific_reasons').val('y');
            $('#radio_yes').prop("checked", true);
        } else if (status == 'toggle_no') {
            $('.dred_reasons').removeClass('active');
            $('#specific_reasons').val('n');
            $('#radio_no').prop("checked", true);
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
        var dred_data = {},
            dred_reason_count = 0,
            counter,
            looping_reason = '',
            dreds = {},
            dred_id,
            was_edited;

        if ($('#id').val() != '') {
            dred_id = $('#id').val();
        } else {
            dred_id = dataman.checkDredCount() + 1;
        }
        dred_data['id'] = dred_id;
        dred_data['name'] = $('#name').val();
        dred_data['date'] = $('#date').val();
        dred_data['reasons'] = {};
        $('.dred_reason').each(function(){
            looping_reason = $(this).find('input[type="text"]').val();
            dred_data['reasons'][dred_reason_count] = looping_reason;
            dred_reason_count++;
        });
        dreds = dataman.getDreds();
        console.log(dred_data);
        console.log(dreds);
        dred_count = dataman.checkDredCount();
        counter = 0;
        if (dreds.length > 0) {
            $.each(dreds, function(index, value) {
                if (index == dred_id ) {
                    cur_dred = value;
                    dataman.saveDred(counter, dred_data);
                    was_edited = 1;
                }
                counter++;
            });
        }
        if (was_edited != 1) {
            dataman.addDred(dred_data);    
        }
        dataman.pageRefresh();
        navman.displayScreen('list');
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