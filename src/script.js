const activities = JSON.parse(localStorage.getItem('activities')) || [
  {
    name: 'Activity 1',
    time: 0,
    isRunning: false,
    performance: 0,
    targetTime: 60000,
  },
  {
    name: 'Activity 2',
    time: 0,
    isRunning: false,
    performance: 0,
    targetTime: 180000,
  },
  {
    name: 'Activity 3',
    time: 0,
    isRunning: false,
    performance: 0,
    targetTime: 300000,
  },
];

function saveActivities() {
  localStorage.setItem('activities', JSON.stringify(activities));
}

function updateActivityTimes() {
  const currentTime = Date.now();

  activities.forEach((activity, index) => {
    if (activity.isRunning) {
      const timeElapsed = currentTime - activity.lastStartTime;
      activity.time += timeElapsed;
      activity.lastStartTime = currentTime;

      const timeDisplay = document.querySelector(
        `.activity-card[data-index="${index}"] .current-time`
      );
      if (timeDisplay) {
        timeDisplay.textContent = formatTime(activity.time);
      }
    }
  });

  saveActivities();
}

function startActivity(index) {
  const activity = activities[index];
  if (!activity.isRunning) {
    activity.time = 0;
    activity.isRunning = true;
    activity.lastStartTime = Date.now();
    saveActivities();
  }
}

function stopActivity(index) {
  const activity = activities[index];
  if (activity.isRunning) {
    const currentTime = Date.now();
    const timeElapsed = currentTime - activity.lastStartTime;
    activity.time += timeElapsed;
    activity.isRunning = false;

    const performance = Math.min(
      100,
      Math.round((activity.time / activity.targetTime) * 100)
    );

    const pastActivityRow = document.createElement('tr');
    pastActivityRow.innerHTML = `
      <td>${activity.name}</td>
      <td>${formatTime(activity.time)}</td>
      <td>${performance}%</td>
    `;
    document.querySelector('table').appendChild(pastActivityRow);

    activity.time = 0;
    const timeDisplay = document.querySelector(
      `.activity-card[data-index="${index}"] .current-time`
    );
    if (timeDisplay) {
      timeDisplay.textContent = formatTime(0);
    }

    saveActivities();
  }
}

function formatTime(timeInMillis) {
  const timeInSeconds = Math.floor(timeInMillis / 1000);
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  const centiseconds = Math.floor((timeInMillis % 1000) / 10);

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
    2,
    '0'
  )}:${String(centiseconds).padStart(2, '0')}`;
}

function convertInputToMilliseconds(minutes, seconds, centiseconds) {
  const mins = Number.parseInt(minutes) || 0;
  const secs = Number.parseInt(seconds) || 0;
  const cs = Number.parseInt(centiseconds) || 0;

  return mins * 60 * 1000 + secs * 1000 + cs * 10;
}

function setTargetTime(index) {
  const activityCard = document.querySelector(
    `.activity-card[data-index="${index}"]`
  );
  const minutes = activityCard.querySelector('.minutes').value;
  const seconds = activityCard.querySelector('.seconds').value;
  const centiseconds = activityCard.querySelector('.centiseconds').value;

  const targetTime = convertInputToMilliseconds(minutes, seconds, centiseconds);

  if (targetTime > 0) {
    activities[index].targetTime = targetTime;
    activityCard.querySelector(
      '.target-time'
    ).textContent = `Target: ${formatTime(targetTime)}`;
    saveActivities();
  } else {
    alert('Please enter a valid target time');
  }
}

function initializePage() {
  activities.forEach((activity, index) => {
    const activityCard = document.querySelector(
      `.activity-card[data-index="${index}"]`
    );

    activityCard
      .querySelector('.btn-start')
      .addEventListener('click', () => startActivity(index));
    activityCard
      .querySelector('.btn-stop')
      .addEventListener('click', () => stopActivity(index));
    activityCard
      .querySelector('.btn-set-time')
      .addEventListener('click', () => setTargetTime(index));

    activityCard.querySelector(
      '.target-time'
    ).textContent = `Target: ${formatTime(activity.targetTime)}`;

    const targetMinutes = Math.floor(activity.targetTime / (60 * 1000));
    const targetSeconds = Math.floor(
      (activity.targetTime % (60 * 1000)) / 1000
    );
    const targetCentiseconds = Math.floor((activity.targetTime % 1000) / 10);

    activityCard.querySelector('.minutes').value = targetMinutes;
    activityCard.querySelector('.seconds').value = targetSeconds;
    activityCard.querySelector('.centiseconds').value = targetCentiseconds;
  });
}

setInterval(updateActivityTimes, 100);

// Initialize the page when the DOM is loaded
document.addEventListener('DOMContentLoaded', initializePage);
