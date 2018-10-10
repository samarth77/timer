var hoursElem = document.getElementById("hours");
var minutesElem = document.getElementById("minutes");
var secondsElem = document.getElementById("seconds");
var startbtnElem = document.getElementById("start");
var lockElem = document.getElementById("lock");
var funcCntdwn = document.getElementById("countdown");
var curState = 1;
var startTime = -1; //for stopwatch
var endTime = -1; //for countdown
var pauseTime = -1;
var updateDisplayInterval;
var updateMs = 100;




$(document).ready(function () {

    $(document).on('click', '.closePopupOftimer', function () {
        setSeentimerNow();
    });
    
        $('#today-quote .close').click(function () {
        $('#today-quote').modal('hide');
        $("#backgroud-quote").remove();
         
    });


//bind git time ;
    getTimeNow();

    $('.timer-check-integer').keyup(function () {
        this.value = this.value.replace(/[^0-9\.]/g, '');
    });


    $(".timer-check-integer").on("change", function () {
        verfSeconds();
        verfMinutes();
        verfHours();
        //update times if curStatus is running
        if (curState > 2) {
            if (curState % 2) {
                //countdown
                endTime = Date.now() + getAmntTimeInMs();
            }
            else {
                startTime = Date.now() - getAmntTimeInMs();
            }
        }
    });

    $("#lock").click(function () {
        if (curState != 1 && curState != 2) {
            changeLock(lockElem.checked);
        }
    });


//states
//1 - not running, countdown
//2 - not running, stopwatch
//3 - running, countdown
//4 - running, stopwatch
//5 - paused, countdown
//6 - paused, stopwatch

    $("#start").click(function () {
        $('.msg-timer').html("");
        if (curState == 1) {
            //start countdown
            verfSeconds();
            verfMinutes();
            verfHours();
            if (secondsElem.value == "0" && secondsElem.value == minutesElem.value && minutesElem.value == hoursElem.value) {
//                $('.msg-timer').html("");
//                $('.msg-timer').html("Set Time Please!");
                //toastr.error("Set Time Please!");
                return 0;//end
            } else {

                changeLock(lockElem.checked);
                startbtnElem.innerHTML = "<i class='fa fa-pause'></i>Pause"; //input button, value
                curState = 3;
                endTime = Date.now() + getAmntTimeInMs();
                updateDisplayInterval = window.setInterval(updateDisplay, updateMs);

                startTimeNow();

            }
        }
        else if (curState == 3) {
            //pause countdown
            pauseTime = Date.now();
            window.clearInterval(updateDisplayInterval);
            startbtnElem.innerHTML = '<i class="fa fa-play"></i>Play';
            curState = 5;
            pauseTimeNow();


        }

        else if (curState == 5) {
            //resume countdown
            endTime += Date.now() - pauseTime;
            updateDisplayInterval = window.setInterval(updateDisplay, updateMs);
            startbtnElem.innerHTML = '<i class="fa fa-pause"></i>Pause';
            curState = 3;
            resumeTime();

        }

    });

    $("#edit-timer").on('click', function () {
        $(".msg-of-time-finish").hide();
        $("#user-timer").addClass("edit-mode");
        $("#hours").prop('disabled', false);
        $("#minutes").prop('disabled', false);
        stopTimeNow("Edit");
        $(this).hide();
        $('#save-timer').show();
        $("#reset").hide();
        $("#start").hide();




    })

    $('#save-timer').on('click', function () {

        setTimeInDataBase();
    })

    $("#reset").click(stopTimeNow);



});



function toNum(val) {
    return Number(val) == NaN ? 0 : Math.floor(Number(val));
}

function verfSeconds() {
    secondsElem.value = toNum(secondsElem.value);
    if (secondsElem.value > 59) {
        minutesElem.value = toNum(minutesElem.value) + ((secondsElem.value - (secondsElem.value % 60)) / 60);
        secondsElem.value = secondsElem.value % 60;
        if ($("#seconds").val() < 10) {
            secondsElem.value = "0" + secondsElem.value;
        }
    }
    secondsElem.value = secondsElem.value >= 0 ? secondsElem.value : 00;
}
function verfMinutes() {
    minutesElem.value = toNum(minutesElem.value);
    if (minutesElem.value > 59) {
        hoursElem.value = toNum(hoursElem.value) + ((minutesElem.value - (minutesElem.value % 60)) / 60);
        minutesElem.value = minutesElem.value % 60;
        if ($("#minutes").val() < 10) {
            minutesElem.value = "0" + minutesElem.value;
        }
    }
    minutesElem.value = minutesElem.value >= 0 ? minutesElem.value : 00;

}
function verfHours() {
    hoursElem.value = toNum(hoursElem.value);
    hoursElem.value = hoursElem.value >= 0 ? hoursElem.value : 00;
    if ($("#hours").val() < 10) {
        hoursElem.value = "0" + hoursElem.value;
    }
}


function getAmntTimeInMs() {
    return (toNum(hoursElem.value) * 60 * 60 * 1000 + toNum(minutesElem.value) * 60 * 1000 + toNum(secondsElem.value) * 1000);
}

function changeLock(onOff) {
    hoursElem.disabled = onOff;
    minutesElem.disabled = onOff;
    secondsElem.disabled = true;
    funcCntdwn.disabled = onOff;
    lockElem.disabled = onOff;
    //lock buttons?
}



function startTimeWithoutsave() {

    $('.msg-timer').html("");
    if (curState == 1) {
        //start countdown
        verfSeconds();
        verfMinutes();
        verfHours();
        if (secondsElem.value == "0" && secondsElem.value == minutesElem.value && minutesElem.value == hoursElem.value) {
           // toastr.error("Set Time Please!");
            return 0;//end
        } else {
            changeLock(lockElem.checked);
            startbtnElem.innerHTML = "<i class='fa fa-pause'></i>Pause"; //input button, value
            curState = 3;
            endTime = Date.now() + getAmntTimeInMs();
            updateDisplayInterval = window.setInterval(updateDisplay, updateMs);

        }
    }
    else if (curState == 3) {
        //pause countdown
        pauseTime = Date.now();
        window.clearInterval(updateDisplayInterval);
        startbtnElem.innerHTML = '<i class="fa fa-play"></i>Play';
        curState = 5;
        pauseTimeNow();


    }

    else if (curState == 5) {
        //resume countdown
        endTime += Date.now() - pauseTime;
        updateDisplayInterval = window.setInterval(updateDisplay, updateMs);
        startbtnElem.innerHTML = '<i class="fa fa-pause"></i>Pause';
        curState = 3;
        resumeTime();

    }
    //App.unblockUI('.user-timer');

}


//requestAnimationFrame to update display - todo
//setTimeout for timer (actual) - not implementing
function updateDisplay() { //dont call too much
    var diff = 0;
    if (curState % 2) {
        diff = endTime - Date.now();
        if (diff <= 0) {
            secondsElem.value = 0;
            minutesElem.value = 0;
            hoursElem.value = 0;
            return finishTime();
        }
    }
    else {
        diff = Date.now() - startTime;
    }
    diff = Math.ceil(diff / 1000);
    if (hoursElem.value != Math.floor(diff / 3600)) {
        hoursElem.value = Math.floor(diff / 3600);
        if ($("#hours").val() < 10) {
            hoursElem.value = "0" + hoursElem.value;
        }
    }
    diff -= Math.floor(diff / 3600) * 3600;
    if (minutesElem.value != Math.floor(diff / 60)) {
        minutesElem.value = Math.floor(diff / 60)
        if ($("#minutes").val() < 10) {
            minutesElem.value = "0" + minutesElem.value;
        }
    }
    diff -= Math.floor(diff / 60) * 60;
    if (secondsElem.value != diff) {
        secondsElem.value = diff;
        if ($("#seconds").val() < 10) {
            secondsElem.value = "0" + secondsElem.value;
        }
    }
}


/**
 * save the diffrent time of the user
 * @returns {undefined}
 */

function setTimeInDataBase() {
    //App.blockUI({
    //    target: '.user-timer',
    //    animate: true
   // });

    //var link = Routing.generate('user_set_time');
    var link = 'actions.php?action=save_time_counter';
    $.ajax({
        url: link,
        type: "post",
		dataType: 'json',
        data: {
            'hours': $("#hours").val(),
            'mints': $("#minutes").val(),
            'seconds': $("#seconds").val()
        },
        success: function (response) {
            if (response.success == 'true') {

                //toastr.success(response.message);

                $("#user-timer").removeClass("edit-mode");
                $("#hours").prop('disabled', true);
                $("#minutes").prop('disabled', true);

           
                $('#save-timer').hide();
                $('#edit-timer').show();
                $("#reset").show();
                $("#start").show();
                $("#user-timer").addClass("after-set").removeClass("edit-mode").removeClass("b4set");
                curState = curState % 2 ? 1 : 2;
                startbtnElem.innerHTML = '<i class="fa fa-play"></i>Play';

                //TrackIntercomEvent(window.intercomEvents.timer_save_time);
            } else {
                //toastr.error(response.message);
            }
            //App.unblockUI('.user-timer');
        }
    });
}

/**
 * play action 
 * 
 * @returns {undefined}
 */

function startTimeNow() {
//    App.blockUI({
//        target: '.user-timer',
//        animate: true
//    });

    //var link = Routing.generate('user_start_time');
    var link = 'actions.php?action=start_time_counter';
	
    $.ajax({
        url: link,
        type: "POST",
		dataType: 'json',
        data: '',
        success: function (response) {
            if (response.success == 'true') {
                // TrackIntercomEvent(window.intercomEvents.timer_start_time);
            }
            //  App.unblockUI('.user-timer');
        }
    });


}
/**
 * pause time
 * @returns {undefined}
 */
function  pauseTimeNow() {
    //App.blockUI({
    //    target: '.user-timer',
    //    animate: true
    //});

    //var link = Routing.generate('user_pause_time');
	var link = 'actions.php?action=pause_time_counter';
    $.ajax({
        url: link,
        type: "post",
		dataType: 'json',
        data: {'hours': $("#hours").val(),
            'mints': $("#minutes").val(),
            'seconds': $("#seconds").val()},
        success: function (response) {
            if (response.success == 'true') {
             //TrackIntercomEvent(window.intercomEvents.timer_pause_time);
                curState = 5;
            }
            //App.unblockUI('.user-timer');
        }
    });

}


/**
 * stop time
 * @returns {undefined}
 */

function stopTimeNow(from) {
    from = from ? from : "";
//    App.blockUI({
//        target: '.user-timer',
//        animate: true
//    });

    //var link = Routing.generate('user_stop_time');
	var link = 'actions.php?action=stop_time_counter';
    $.ajax({
        url: link,
        type: "get",
		dataType: 'json',
        data: '',
        success: function (response) {
            if (response.success == 'true') {
                //destroy timers/requestAnimationFrame thing
                if (updateDisplayInterval) {
                    window.clearInterval(updateDisplayInterval);
                }
                curState = curState % 2 ? 1 : 2;
                secondsElem.value = response.second;
                minutesElem.value = response.mint;
                hoursElem.value = response.hours;
                changeLock(false);
                startbtnElem.innerHTML = '<i class="fa fa-play"></i>Play';
               
               // TrackIntercomEvent(window.intercomEvents.timer_reset_time);
            }
            if (response.success == 'false') {
                var hours = $("#hours").val();
                var minutes = $("#minutes").val();
                var seconds = $("#seconds").val();
                if ((hours == "00") && (minutes == "00") && (seconds == "00") && (from !== "Edit")) {
                    //toastr.error("Set Time Please!");
                }
            }
            // App.unblockUI('.user-timer');
        }
    });


}


function getTimeNow() {

    //App.blockUI({
     //   target: '.user-timer',
     //   animate: true
    //});

    //	var link = Routing.generate('user_get_time');
	var link = 'actions.php?action=get_time_counter';
    $.ajax({
        url: link,
        type: "get",
		dataType: 'json',
        data: '',
        success: function (response) {
            if (response.success == 'true') {

                //destroy timers/requestAnimationFrame thing
                if (updateDisplayInterval) {
                    window.clearInterval(updateDisplayInterval);
                }
                curState = curState % 2 ? 1 : 2;

                secondsElem.value = response.second;
                minutesElem.value = response.mint;
                hoursElem.value = response.hours;


                $("#reset").show();
                $("#start").show();


                startbtnElem.innerHTML = '<i class="fa fa-play"></i>Play';
                if (response.pause == false) {
                    startTimeWithoutsave();

                }

            } else {

                var hours = $("#hours").val();
                var minutes = $("#minutes").val();
                var seconds = $("#seconds").val();
                if ((hours == "00") && (minutes == "00") && (seconds == "00")) {
                    $("#user-timer").addClass("b4set").removeClass("edit-mode").removeClass("after-set");
                }
            }
            //App.unblockUI('.user-timer');
        }
    });


}
function setSeentimerNow() {

    //App.blockUI({
    //    target: '.user-timer',
    //    animate: true
    //});

    //var link = Routing.generate('user_set_seen');
	var link = 'actions.php?action=set_seen_time_counter';
    $.ajax({
        url: link,
		dataType: 'json',
        type: "POST",
        data: '',
        success: function (response) {
            if (response.success == 'true') {
                $("#time-alert").hide();
            }
            //App.unblockUI('.user-timer');
        }
    });


}


function finishTime() {
    clearInterval(updateDisplayInterval);
    //App.blockUI({
    //    target: '.user-timer',
    //    animate: true
    //});

    //var link = Routing.generate('user_finish_time');
	var link = 'actions.php?action=finish_time_counter';
    $.ajax({
        url: link,
		dataType: 'json',
        type: "POST",
        data: '',
        success: function (response) {
            if (response.success == 'true') {
                $(".msg-of-time-finish").show();
                $(".msg-finish-user-timer").html("");
                $(".msg-finish-user-timer-front-end").html(response.message);
                $("#reset").hide();
                $("#start").hide();
                $("#user-timer").addClass("b4set").removeClass("edit-mode").removeClass("after-set");
                $("#time-alert").show();
                playSound();
                $("#seconds").val("00");
                $("#minutes").val("00");
                $("#hours").val("00");
               // TrackIntercomEvent(window.intercomEvents.timer_finish_time);

            } else {
                updateDisplayInterval = window.setInterval(updateDisplay, updateMs);
            }
            //App.unblockUI('.user-timer');
        }
    });

}




function resumeTime() {
    //App.blockUI({
    //    target: '.user-timer',
    ///    animate: true
    //});

    //var link = Routing.generate('user_resume_time');
	var link = 'actions.php?action=resume_time_counter';
    $.ajax({
        url: link,
		dataType: 'json',
        type: "post",
        data: {'hours': $("#hours").val(),
            'mints': $("#minutes").val(),
            'seconds': $("#seconds").val()},
        success: function (response) {
            if (response.success == 'true') {
             //TrackIntercomEvent(window.intercomEvents.timer_resume_time);
            }
            //App.unblockUI('.user-timer');
        }
    });
}


function playSound() {
    var sound1 = $("#user-timer").data("sound1");
    var sound2 = $("#user-timer").data("sound2");
    document.getElementById("sound").innerHTML =
            '<audio autoplay="autoplay"><source src="' + sound1 + '" type="audio/mpeg" /><source src="' + sound2 + '" type="audio/ogg" /><embed hidden="true" autostart="true" loop="false" src="the-calling.mp3" /></audio>';
}