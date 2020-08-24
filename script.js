const timer = document.querySelector('#timer');
const startButton = document.querySelector('#start');
const pauseButton = document.querySelector('#pause');
const stopButton = document.querySelector('#stop');
let type = 'Work';
let isClockRunning = false;
let isClockStopped = true;

// 25 mins
let workSessionDuration = 1500;
let currentTimeLeft = 1500;
// 5 mins
let breakSessionDuration = 300;

let timeSpentInCurrentSession = 0;

let currentTaskLabel = document.querySelector('#clock-task');

let updateWorkSessionDuration;
let updateBreakSessionDuration;

let workDurationInput = document.querySelector('#input-work-duration');
let breakDurationInput = document.querySelector('#input-break-duration');

workDurationInput.value = '25';
breakDurationInput.value = '5';

const toggleClock = (reset) => {
    if (reset) {
        stopClock();
    } else {
        if (isClockRunning === true) {
            // Pause timer
            clearInterval(timer)
            isClockRunning = false;
        } else {
            // Start Timer
            isClockRunning = true;
            timer = setInterval(() => {
                stepDown();
                displayCurrentTimeLeft();
            }, 1000)
        }
    }
}

const stepDown = () => {
    if (currentTimeLeft > 0) {
        currentTimeLeft--;
        timeSpentInCurrentSession++;
    } else if (currentTimeLeft === 0) {
        timeSpentInCurrentSession = 0;
        if (type === 'Work') {
            currentTimeLeft = breakSessionDuration;
            displaSessionLog('Work');
            type = 'Break';
            currentTaskLabel.value = 'Break';
            currentTaskLabel.disabled = true;
        } else {
            currentTimeLeft = workSessionDuration;
            type = 'Work';
            if (currentTaskLabel.value === 'Break') {
                currentTaskLabel.value = workSessionLabel;
            }
            currentTaskLabel.disabled = false;
            displaySessionLog('Break');
        }
    }
    displayCurrentTimeLeft();
}

const displayCurrentTimeLeft = () => {
    const secondsLeft = currentTimeLeft;
    let result = '';
    const seconds = secondsLeft % 60;
    const minutes = parseInt(secondsLeft / 60) % 60;
    let hours = parseInt(secondsLeft / 3600);

    function addLeadingZeros(time) {
        return time < 10 ? `0${time}` : time
    }
    if (hours > 0) result += `${hours}:`
    result += `${addLeadingZeros(minutes)}:${addLeadingZeros(seconds)}`
    timer.innerText = result.toString();
}

const displaySessionLog = (type) => {
    const sessionsList = document.querySelector('#sessions');
    const li = document.createElement('li');
    if (type === 'Work') {
        sessionLabel = currentTaskLabel.value ? currentTaskLabel.value : 'Work'
        workSessionLabel = sessionLabel
    } else {
        sessionLabel = 'Break'
    }
    let elapsedTime = parseInt(timeSpentInCurrentSession / 60)
    elapsedTime = elapsedTime > 0 ? elapsedTime : '< 1';

    const text = document.createTextNode(
        `${sessionLabel} : ${elapsedTime} min`
    )
    li.appendChild(text);
    sessionsList.appendChild(li);
}

const stopClock = () => {
    displaySessionLog(type);
    clearInterval(timer);
    isClockRunning = false;
    currentTimeLeft = workSessionDuration;
    displayCurrentTimeLeft();

    type = type === 'Work' ? 'Break' : 'Work';
}

const setUpdateTimers = () => {
    if (type === 'Work') {
        currentTimeLeft = updateWorkSessionDuration ? updateWorkSessionDuration : workSessionDuration
        workSessionDuration = currentTimeLeft
    } else {
        currentTimeLeft = updateBreakSessionDuration ? updateBreakSessionDuration : breakSessionDuration
        breakSessionDuration = currentTimeLeft
    }
}

// Start
startButton.addEventListener('click', () => {
    toggleClock();
})

// Pause
pauseButton.addEventListener('click', () => {
    toggleClock();
})

// Stop
stopButton.addEventListener('click', () => {
    toggleClock(true);
})

workDurationInput.addEventListener('input', () => {
    updateWorkSessionDuration =
        minuteToSeconds(workDurationInput.value)
})

breakDurationInput.addEventListener('input', () => {
    updateBreakSessionDuration =
        minuteToSeconds(breakDurationInput.value)
})

const minuteToSeconds = mins => {
    return mins * 60
}