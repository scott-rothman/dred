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
        template_still_exists = $('#dred_reason_template').length;
        if(template_still_exists != 1) {
            $('.dred_reason').first().attr('id','dred_reason_template');
        }
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
        if (dred_data['name'].length > 0) {
            dred_data['date'] = $('#date').val();
            dred_data['reasons'] = {};
            $('.dred_reason').each(function(){
                looping_reason = $(this).find('input[type="text"]').val();
                //Make sure it's not adding blank reasons
                if (looping_reason != '') {
                    dred_data['reasons'][dred_reason_count] = looping_reason;
                    dred_reason_count++;    
                }
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
        } else {
            // if no name was entered, don't submit
            $('#form_err_msg').html('Please enter a name');
        }
        
    }
    this.completeDred = function(id) {
        var ar_dreds = dataman.getDreds();
        var num_of_dreds = ar_dreds.length;
        var x = 0;
        while (x < num_of_dreds) {
            console.log(ar_dreds[x]['id']);
            console.log(ar_dreds[x])
            if (ar_dreds[x]['id'] == id) {
                ar_dreds[x]['completed'] = true;
            }
            x++;
        }
        $('#empty_completed_list').removeClass('active');
        str_dreds = JSON.stringify(ar_dreds);
        localStorage['dreds'] = str_dreds;
        dataman.pageRefresh();
        navman.displayScreen('finished');
    }
    this.setDredRating = function(rating) {
        $('.dred_rate').data('rating',rating);
    }
    this.submitDredRating = function(id,rating) {
        var ar_dreds = dataman.getDreds();
        var num_of_dreds = ar_dreds.length;
        var x = 0;
        while (x < num_of_dreds) {
            console.log(ar_dreds[x]['id']);
            console.log(ar_dreds[x])
            if (ar_dreds[x]['id'] == id) {
                ar_dreds[x]['dred_rating'] = rating;
            }
            x++;
        }
        str_dreds = JSON.stringify(ar_dreds);
        localStorage['dreds'] = str_dreds;
        dataman.pageRefresh();
        navman.displayScreen('completed_list');
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
        } else if (action == 'complete_dred') {
            var id = button.data('dred_id');
            this.completeDred(id);
        } else if (action == 'submit_dred_rating') {
            var id = button.data('dred_id');
            var rating = button.data('rating');
            this.submitDredRating(id, rating);
        } else if (action == 'set_dred_rating') {
            var rating = button.val();
            this.setDredRating(rating);
        }

    };

}