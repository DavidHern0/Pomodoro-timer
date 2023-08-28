
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');
const workTimeInput = document.getElementById('workTime');
const breakTimeInput = document.getElementById('breakTime');
const timerDisplay = document.getElementById('timer');
const timeSelected = document.getElementById('timeSelected');
const timeSelectedContainer = document.querySelector('.timeSelected-container');
const pomodoroContainer = document.querySelector('.pomodoro-container');
const savedWorkMinute = parseInt(localStorage.getItem('workMinute')) || 60;
const savedBreakMinute = parseInt(localStorage.getItem('breakMinute')) || 60;
workTimeInput.value = savedWorkMinute;
breakTimeInput.value = savedBreakMinute;
timerDisplay.innerHTML = `${savedWorkMinute.toString().padStart(2, '0')}:00`;
const audio = new Audio('src/timer_sound.mp3');
let interval, minutes, seconds;
let isWorking = true;

function updateStyling(isWorking, backgroundColor) {
    timeSelected.textContent = isWorking ? "Work Time" : "Break Time";
    timeSelectedContainer.style.backgroundColor = backgroundColor;
    timeSelected.classList.remove('hidden');
    timeSelectedContainer.classList.remove('hidden');
}

function disableButtons(boolean) {
    if (boolean) {
        workTimeInput.disabled = true;
        workTimeInput.style.cursor = "not-allowed";
        breakTimeInput.disabled = true;
        breakTimeInput.style.cursor = "not-allowed";
    } else {
        workTimeInput.disabled = false;
        workTimeInput.style.cursor = "auto";
        breakTimeInput.disabled = false;
        breakTimeInput.style.cursor = "auto";
    }

}

function startTimer() {
    clearInterval(interval);
    const workMinutes = Math.min(parseInt(workTimeInput.value) || 1, 999);
    const breakMinutes = Math.min(parseInt(breakTimeInput.value) || 1, 999);
    minutes = isWorking ? workMinutes : breakMinutes;
    seconds = 0;
    interval = setInterval(updateTimer, 1000);

    timerDisplay.classList.toggle('break', !isWorking);

    startButton.classList.add('hidden');
    resetButton.classList.remove('hidden');

    disableButtons(true);

    updateStyling(isWorking, isWorking ? "#FF8585" : "#74E37C");
}

function updateTimer() {
    if (seconds === 0) {
        if (minutes === 0) {
            clearInterval(interval);
            isWorking = !isWorking;
            updateStyling(isWorking, isWorking ? "#FF8585" : "#74E37C");
            startTimer();
            audio.play();
            return;
        }
        minutes--;
        seconds = 59;
    } else {
        seconds--;
    }

    timerDisplay.innerHTML = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

startButton.addEventListener('click', () => {
    if (workTimeInput.value >= 1 && workTimeInput.value <= 999) {
        localStorage.setItem('workMinute', workTimeInput.value);
        localStorage.setItem('breakMinute', breakTimeInput.value);
    }
    startTimer();
});

resetButton.addEventListener('click', () => {
    clearInterval(interval);
    disableButtons(false);
    timerDisplay.innerHTML = `${localStorage.getItem('workMinute').toString().padStart(2, '0')}:00`;
    isWorking = true;
    timerDisplay.classList.remove('break');
    startButton.classList.remove('hidden');
    resetButton.classList.add('hidden');
    timeSelected.classList.add('hidden');
    timeSelectedContainer.classList.add('hidden');
});

workTimeInput.addEventListener('input', () => {
    const workTimeValue = parseInt(workTimeInput.value);
    if (workTimeValue) {
        timerDisplay.innerHTML = `${workTimeValue.toString().padStart(2, '0')}:00`;
    } else {
        timerDisplay.innerHTML = `01:00`;
    }
});