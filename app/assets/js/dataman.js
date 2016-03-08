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
        var x = 0, num_of_active_dreds = 0;
        while (x < num_of_dreds) {
            if (ar_dreds[x]['completed'] !== true) {
                num_of_active_dreds++;
            }
            x++;
        }
        //console.log('dreds so far: '+ num_of_dreds);
        return num_of_active_dreds;
    }
    this.checkCompletedDredCount = function() {
        var ar_dreds = this.getDreds();
        var num_of_dreds = ar_dreds.length;
        var x = 0, num_of_active_dreds = 0;
        while (x < num_of_dreds) {
            if (ar_dreds[x]['completed'] === true) {
                num_of_active_dreds++;
            }
            x++;
        }
        //console.log('dreds so far: '+ num_of_dreds);
        return num_of_active_dreds;   
    }
    this.addDred = function(data) {
        var ar_dreds = this.getDreds();
        var str_dreds = "";
        //var ar_dreds_length = this.checkDredCount();
        ar_dreds.push(data);
        str_dreds = JSON.stringify(ar_dreds);
        localStorage['dreds'] = str_dreds;
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
        var ar_dreds = this.getDreds();
        var dred_to_edit = ar_dreds[id];
        var dred_reasons = Object.keys(dred_to_edit['reasons']).length;
        var x = 0, z = 0;
        var reason_text = '';
        navman.displayScreen('form');
        $('.dred_complete').data('dred_id',dred_to_edit['id']);
        $('#id').val(dred_to_edit['id']);
        $('#name').val(dred_to_edit['name']);
        $('#date').val(dred_to_edit['date']);
        $('.dred_reason').each(function(){
            if ($(this).attr('id') != 'dred_reason_template') {
                $(this).remove(); 
            }
        });
        if (dred_reasons > 0) {
            while (x < dred_reasons) {
                formman.addDredReason();
                x++;
            }
            while (z < dred_reasons) {
                reason_text = dred_to_edit['reasons'][z];
                $('.dred_reason input').eq(z).val(reason_text);
                z++;
            }
            formman.dredReasonsToggle('toggle_yes');
        } 
        //if ($('.dred_reasons').length == 0) {
            //If no dreds exist, need to ensure at least one dred reason line gets added
        //   formman.addDredReason();
        //}

        //Hide control buttons on dreds that have already been completed
        //Adjust back button to send user to correct list
        if(dred_to_edit['completed'] === true) {
            $('.form_buttons').removeClass('active');
            $('.complete_button').removeClass('active');
            $('.reasons_header').removeClass('active');
            $('#screen_form input').attr('readonly','readonly');
            $('.form_back').data('target','completed_list');
            $('.form_back').html('dreds overcome');
        } else {
            $('.form_buttons').addClass('active');
            $('.complete_button').addClass('active');
            $('.reasons_header').addClass('active');
            $('#screen_form input').removeAttr('readonly');
            $('.form_back').data('target','list');
            $('.form_back').html('dreds active');
        }
        $('.dred_reason').last().find('button').data('action','add_reason');
        $('.dred_reason').last().find('button').html('+');
    }
    this.saveDred = function(pos,data) {
        var ar_dreds = this.getDreds();
        ar_dreds[pos]['id'] = data['id'];
        ar_dreds[pos]['name'] = data['name'];
        ar_dreds[pos]['date'] = data['date'];
        ar_dreds[pos]['completed'] = false;
        ar_dreds[pos]['reasons'] = data['reasons'];
        str_dreds = JSON.stringify(ar_dreds);
        localStorage['dreds'] = str_dreds;
        this.pageRefresh();
        navman.displayScreen('list');
    }
    this.pageRefresh = function() {
        var ar_dreds = this.getDreds();
        //Not sure if there is a better way to maintain scope of the fuction for later call
        var proxy_dataman = this;
        //console.log(ar_dreds);
        var total_dreds = ar_dreds.length,
            x = 0,
            cur_dred = '',
            cur_dred_name = '',
            cur_dred_date = '',
            dreds_container = $('#dred_list'),
            completed_dreds_container = $('#completed_list')
            total_active_dreds = 0;
            total_completed_dreds = 0;
        dreds_container.html('');
        completed_dreds_container.html('');
        if(total_dreds > 0) {
            while (x < total_dreds) {
                cur_dred = ar_dreds[x];
                cur_dred_name = cur_dred["name"];
                cur_dred_date = cur_dred["date"];
                dred_link = '<li><a href="#" class="inter_list" data-id="'+x+'" data-date="'+ cur_dred_date +'">' + cur_dred_name;
                if (cur_dred_date.length > 0) {
                    dred_link += ' : ' + cur_dred_date + '</a></li>';
                } else {
                    dred_link += '</a></li>';
                }
                if (cur_dred['completed'] !== true) {
                    dreds_container.append(dred_link);
                    total_completed_dreds++;
                } else {
                    completed_dreds_container.append(dred_link);
                }
                x++;
            }
            $('.inter_list').on('click', function(e){
                var id_to_edit = $(this).data('id');
                console.log('clicked:'+id_to_edit);
                proxy_dataman.editDred(id_to_edit);
                //This call ^^^
            });
            
        } else {
            $('#empty_list').addClass('active');
        }


        total_active_dreds = this.checkDredCount();
        total_completed_dreds = this.checkCompletedDredCount();

        //Hide and show empty list messages
        if (total_completed_dreds > 0) {
            $('#empty_completed_list').removeClass('active');
        } else {
            $('#empty_completed_list').addClass('active');
        }
        
        if (total_active_dreds > 0) {
            $('#empty_list').removeClass('active');            
        } else {
            $('#empty_list').addClass('active');
        }

        $('#dred_add')[0].reset();

        //set number of dreds on home screen
        $('#dred_num').html(total_active_dreds);

        //reset dreds reasons
        formman.dredReasonsToggle('toggle_no');

        //reshow any hidden buttons
        $('.form_buttons').addClass('active');

        //reshow dred reasons toggle
        $('.reasons_header').addClass('active');

        //reset list nav to home
        //$('.form_back').data('target','home');
        //^^^ Not sure if this reset is needed.  It was breaking edit back button, no issues so far
        $('.form_back').html('back home');
        $('#screen_form input').removeAttr('readonly');
        //reset dred err msgs
        $('#form_err_msg').html('');

        //set id for next dred
        $('#id').attr('value',total_dreds);
    }
    
 }