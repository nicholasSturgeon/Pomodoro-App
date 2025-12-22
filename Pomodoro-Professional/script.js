let workTime = 25;
let breakTime = 5;
let longBreakTime = 15;
let currentTime = workTime * 60;
let totalTime = currentTime;
let isRunning = false;
let isWorkSession = true;
let sessionCount = 0;
let completedSessions = 0;
let totalMinutes = 0;
let currentStreak = 0;
let timer = null;

const timeDisplay = document.getElementById('timeDisplay');
const sessionType = document.getElementById('sessionType');
const progress = document.getElementById('progress');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const skipBtn = document.getElementById('skipBtn');
const notification = document.getElementById('notification');
const notificationText = document.getElementById('notificationText');

const workTimeDisplay = document.getElementById('workTime');
const breakTimeDisplay = document.getElementById('breakTime');
const longBreakTimeDisplay = document.getElementById('longBreakTime');

const completedDisplay = document.getElementById('completedSessions');
const totalTimeDisplay = document.getElementById('totalTime');
const streakDisplay = document.getElementById('currentStreak');


function updateDisplay() {
    const minutes = Math.floor(currentTime / 60);
    const seconds = currentTime % 60;
    timeDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function updateProgress() {
    const progressValue = 1 - (currentTime / totalTime);
    const circumference = 2 * Math.PI * 145;
    const offset = circumference * (1 - progressValue);
    progress.style.strokeDashoffset = offset;
}

function updateStats() {
    completedDisplay.textContent = completedSessions;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    totalTimeDisplay.textContent = `${hours}h ${minutes}m`;
    streakDisplay.textContent = currentStreak;
}

function showNotification(text) {
    notificationText.textContent = text;
    notification.classList.add('show');
    setTimeout(() => notification.classList.remove('show'), 4000);
}

//function playNotification sound() {}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        startBtn.textContent = 'Running...';
        startBtn.classList.add('pulsing');
        timer = setInterval(() => {
            currentTime--;
            updateDisplay();
            updateProgress();
            if (currentTime <= 0) {
                sessionComplete();
            }
        }, 1000);
    }
}

function pauseTimer() {
    if (isRunning) {
        isRunning = false;
        clearInterval(timer);
        startBtn.textContent = 'Start';
        startBtn.classList.remove('pulsing');
    }
}

function resetTimer() {
    pauseTimer();
    if (isWorkSession) {
        currentTime = workTime * 60;
    } else {
        const isLongBreak = sessionCount % 4 === 0;
        currentTime = isLongBreak ? longBreakTime * 60 : breakTime * 60;
    }
    totalTime = currentTime;
    updateDisplay();
    updateProgress();
}

function skipSession() {
    pauseTimer();
    sessionComplete();
}

function sessionComplete() {
    pauseTimer();
    if (isWorkSession) {
        completedSessions++;
        sessionCount++;
        currentStreak++;
        totalMinutes += workTime;
        showNotification('Work session completed! Time for a break.');
    } else {
        showNotification('Break completed! Ready to work?');
    }

    isWorkSession = !isWorkSession;

    if (isWorkSession) {
        currentTime = workTime * 60;
        progress.classList.remove('break');
        progress.classList.add('work');
        sessionType.textContent = 'Work Session';
    } else {
        const isLongBreak = sessionCount % 4 === 0;
        currentTime = isLongBreak ? longBreakTime * 60 : breakTime * 60;
        progress.classList.remove('work');
        progress.classList.add('break');
        sessionType.textContent = isLongBreak ? 'LongBreak' : 'Short Break';
    }

    totalTime = currentTime;
    updateDisplay();
    updateProgress();
    updateStats();
    //playNotificationSound();
}

function adjustTime(type, delta) {
    if (isRunning) return;

    if (type === 'work') {
        workTime = Math.min(60, Math.max(1, workTime + delta));
        workTimeDisplay.textContent = workTime;
        if (isWorkSession) {
            currentTime = workTime * 60;
            totalTime = currentTime;
        }
    } else if (type === 'break') {
        breakTime = Math.min(30, Math.max(1, breakTime + delta));
        breakTimeDisplay.textContent = breakTime;
        if (!isWorkSession && sessionCount % 4 !== 0) {
            currentTime = breakTime * 60;
            totalTime = currentTime;
        }

    } else if (type === 'longBreak') {
        longBreakTime = Math.min(60, Math.max(5, longBreakTime + delta));
        longBreakTimeDisplay.textContent = longBreakTime;
        if (!isWorkSession && sessionCount % 4 == 0) {
            currentTime = longBreakTime * 60;
            totalTime = currentTime;
        }
    }
    updateDisplay();
    updateProgress();
}


document.addEventListener('DOMContentLoaded', () => {
    updateDisplay();
    updateProgress();

    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    skipBtn.addEventListener('click', skipSession);

    document.getElementById('workPlus').addEventListener('click', () => adjustTime('work', 1));
    document.getElementById('workMinus').addEventListener('click', () => adjustTime('work', -1));
    document.getElementById('breakPlus').addEventListener('click', () => adjustTime('break', 1));
    document.getElementById('breakMinus').addEventListener('click', () => adjustTime('break', -1));
    document.getElementById('longBreakPlus').addEventListener('click', () => adjustTime('longBreak', 1));
    document.getElementById('longBreakMinus').addEventListener('click', () => adjustTime('longBreak', -1));
});