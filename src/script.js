const activities = JSON.parse(localStorage.getItem('activities')) || [
  {
    name: 'Activity 1',
    time: 0,
    isRunning: false,
    performance: 0,
    targetTime: 0,
  },
  {
    name: 'Activity 2',
    time: 0,
    isRunning: false,
    performance: 0,
    targetTime: 0,
  },
  {
    name: 'Activity 3',
    time: 0,
    isRunning: false,
    performance: 0,
    targetTime: 0,
  },
];

// Save activities to local storage
function saveActivities() {
  localStorage.setItem('activities', JSON.stringify(activities));
}

function updateActivityTimes() {
  const currentTime = Date.now();

  activities.forEach((activity) => {
    if (activity.isRunning) {
      const timeElapsed = currentTime - activity.lastStartTime;
      activity.time += timeElapsed;
      activity.lastStartTime = currentTime;
    }
  });

  saveActivities();
  renderActivities();
}

function startActivity(index) {
  const activity = activities[index];
  if (!activity.isRunning) {
    activity.time = 0;
    activity.isRunning = true;
    activity.lastStartTime = Date.now();
    saveActivities();
    renderActivities();
  }
}

function stopActivity(index) {
  const activity = activities[index];
  if (activity.isRunning) {
    const currentTime = Date.now();
    const timeElapsed = currentTime - activity.lastStartTime;
    activity.time += timeElapsed;
    activity.isRunning = false;

    const performance =
      activity.targetTime > 0
        ? Math.min(
            100,
            Math.floor((activity.time / (activity.targetTime * 60000)) * 100)
          )
        : Math.floor(Math.random() * 100);

    const pastActivityRow = document.createElement('tr');
    pastActivityRow.innerHTML = `
      <td>${activity.name}</td>
      <td>${formatTime(activity.time)}</td>
      <td>${performance}%</td>
    `;
    document.querySelector('table tbody').appendChild(pastActivityRow);

    saveActivities();
    renderActivities();
  }
}

function formatTime(timeInMillis) {
  const timeInSeconds = Math.floor(timeInMillis / 1000);
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = timeInSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
    2,
    '0'
  )}:${String(seconds).padStart(2, '0')}`;
}

function updateTargetTime(index, targetTime) {
  activities[index].targetTime = targetTime;
  saveActivities();
}

function renderActivities() {
  const activitiesContainer = document.querySelector('.activities');

  activitiesContainer.innerHTML = '';

  activities.forEach((activity, index) => {
    const activityCard = document.createElement('div');
    activityCard.classList.add('activity-card');
    activityCard.innerHTML = `
      <h3>${activity.name}</h3>
      <p>Current: ${formatTime(activity.time)}</p>
      <label for="target-time-${index}">Target Time (minutes):</label>
      <input type="number" id="target-time-${index}" value="${
      activity.targetTime
    }" min="0">
      <button class="btn btn-stop">Stop</button>
      <button class="btn btn-start">Start</button>
    `;

    const stopButton = activityCard.querySelector('.btn-stop');
    const startButton = activityCard.querySelector('.btn-start');
    const targetTimeInput = activityCard.querySelector(`#target-time-${index}`);

    stopButton.addEventListener('click', () => stopActivity(index));
    startButton.addEventListener('click', () => startActivity(index));
    targetTimeInput.addEventListener('change', (e) =>
      updateTargetTime(index, Number.parseInt(e.target.value, 10))
    );

    activitiesContainer.appendChild(activityCard);
  });
}

setInterval(updateActivityTimes, 1000);

renderActivities();
