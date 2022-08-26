var minutes = 25;
var seconds = '00';
var total_count = 0; 
var minutes_interval;
var seconds_interval;
var short_clicked = false;
var long_clicked = false; 
var num_of_work_intervals = 0; // keep track of how many work intervals user has completed to enable long break 

var pomodoro_clicked = false;
var paused = false;
var ring = new Audio('bell.mp3');
var pomodoro = document.getElementById('pomodoro');
var shortBreak = document.getElementById('short_break');
var longBreak = document.getElementById('long_break');

function start() {
    document.getElementById('total_count').innerHTML = total_count;
    document.getElementById('minutes').innerHTML = minutes;
    document.getElementById('seconds').innerHTML = seconds;

    shortBreak.disabled = true; 
    longBreak.disabled = true; // disable by default so user cannot jump around from break to pomodoro and vice versa
}

shortBreak.addEventListener('click', function handleShortClick() {
    short_clicked = true;
    if (long_clicked || pomodoro_clicked) {
        if (long_clicked) {
            clearInterval(minutes_interval);
            clearInterval(seconds_interval);
            long_clicked = false;
            longBreak.disabled = false;
        }
        if (pomodoro_clicked) {
            clearInterval(minutes_interval);
            clearInterval(seconds_interval);
            pomodoro_clicked = false;
            pomodoro.disabled = false;
        }
    }
    break_time(4, 59);
});

longBreak.addEventListener('click', function handleLongClick() {
    long_clicked = true;
    if (short_clicked || pomodoro_clicked) {
        if (short_clicked) {
            clearInterval(minutes_interval);
            clearInterval(seconds_interval);
            short_clicked = false;
            shortBreak.disabled = false;
        }
        if (pomodoro_clicked) {
            clearInterval(minutes_interval);
            clearInterval(seconds_interval);
            pomodoro_clicked = false;
            pomodoro.disabled = false;
        }
    }
    break_time(9, 59)
});

function break_time(x, y) {
    if (long_clicked || short_clicked) { 
        longBreak.disabled = true;
        shortBreak.disabled = true; 
    }
    /* 
    if (long_clicked) 
        longBreak.disabled = true;  
    if (short_clicked) 
        shortBreak.disabled = true; 
    */ 
    minutes = x;
    seconds = y;

    document.getElementById('minutes').innerHTML = minutes;
    document.getElementById('seconds').innerHTML = seconds;

    minutes_interval = setInterval(minutesTimer, 60000);
    seconds_interval = setInterval(secondsTimer, 1000);

    function minutesTimer() {
        minutes = minutes - 1;
        if(minutes < 10) { 
            minutes = '0' + minutes;
        }
        document.getElementById('minutes').innerHTML = minutes;
    }

    function secondsTimer() {
        seconds = seconds - 1;
        if(seconds < 10) { 
            seconds = '0' + seconds;
        }
        document.getElementById('seconds').innerHTML = seconds;

        if (seconds <= 0) {
            if (minutes <= 0) {
                clearInterval(minutes_interval);
                clearInterval(seconds_interval);
                document.getElementById('minutes').innerHTML = '00';
                document.getElementById('seconds').innerHTML = '00';

                document.getElementById('done').innerHTML =
                    'Break time is over! Click \'Pomodoro\' to start a new study session!';

                document.getElementById('total_count').innerHTML = total_count;
                document.getElementById('done').classList.add('show_message');

                /* 
                if (long_clicked) {
                    longBreak.disabled = false;
                } else if (short_clicked) {
                    shortBreak.disabled = false;
                }
                */
                longBreak.disabled = false; 
                shortBreak.disabled = false; 
                ring.play();
            }
            seconds = 60;
        }
    }
}

function pomodoro_start() {
    if (long_clicked || short_clicked) {
        if (long_clicked) {
            clearInterval(minutes_interval);
            clearInterval(seconds_interval);
            long_clicked = false;
            longBreak.disabled = false;
        }
        if (short_clicked) {
            clearInterval(minutes_interval);
            clearInterval(seconds_interval);
            short_clicked = false;
            shortBreak.disabled = false;
        }
    }
   
    //document.getElementById('pomodoro').innerHTML = 'Pause'; // turn pomodoro button to pause (for pause/resume feature)
    pomodoro.disabled = true; // prevents users from spamming the pomodoro button, which would mess up the countdown
    shortBreak.disabled = true; 
    
    minutes = 1;    // default values: minutes = 24, seconds = 59 (add buttons to change this default)
    seconds = 59;

    document.getElementById('minutes').innerHTML = minutes;
    document.getElementById('seconds').innerHTML = seconds;

    /*
    * interval is in milliseconds 
    * 1 minute = 60,000 milliseconds 
    * 1 second = 1,000 milliseconds 
    */
    total_count = total_count + minutes + 1;
    minutes_interval = setInterval(minutesTimer, 60000);
    seconds_interval = setInterval(secondsTimer, 1000);

    function minutesTimer() {
        minutes = minutes - 1;
        if(minutes < 10) {
            minutes = '0' + minutes;
        }
        document.getElementById('minutes').innerHTML = minutes;
    }

    function secondsTimer() {
        seconds = seconds - 1;
        if(seconds < 10) { 
            seconds = '0' + seconds;
        }
        document.getElementById('seconds').innerHTML = seconds;

        if (seconds <= 0) {
            if (minutes <= 0) {
                clearInterval(minutes_interval);
                clearInterval(seconds_interval);

                document.getElementById('done').innerHTML =
                    'Session completed! Great job, and take a break.';

                document.getElementById('total_count').innerHTML = total_count;
                document.getElementById('done').classList.add('show_message');
                
                setTimeout(removeMessage, 10000);

                function removeMessage() { 
                    document.getElementById('done').classList.remove('show_message');
                    document.getElementById('done').innerHTML ='';
                }

                pomodoro.disabled = false;
                shortBreak.disabled = false;
                num_of_work_intervals += 1; // +1 everytime a work interval is completed 

                if (num_of_work_intervals == 4) { 
                    longBreak.disabled = false; 
                    num_of_work_intervals = 0; 
                }
                ring.play();
            }
            seconds = 60;
        }
    }
}

/*
pomodoro.addEventListener('click', function handlePauseClick() { 
    if(document.getElementById('pomodoro').innerHTML == 'Pause' && pomodoro_clicked) { 
        paused = true; 
        clearInterval(minutes_interval);
        clearInterval(seconds_interval); 
    }
});
*/