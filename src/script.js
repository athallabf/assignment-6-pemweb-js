// script.js

// Initialize activities and load from local storage
const activities = JSON.parse(localStorage.getItem('activities')) || [
  { name: 'Activity 1', time: 0, isRunning: false, performance: 0 },
  { name: 'Activity 2', time: 0, isRunning: false, performance: 0 },
  { name: 'Activity 3', time: 0, isRunning: false, performance: 0 },
];

// Save activities to local storage
function saveActivities() {
  localStorage.setItem('activities', JSON.stringify(activities));
}

// Update the time for each running activity
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

// Start activity (restart from 0)
function startActivity(index) {
  const activity = activities[index];
  if (!activity.isRunning) {
    activity.time = 0; // Reset time to 0 when starting
    activity.isRunning = true;
    activity.lastStartTime = Date.now();
    saveActivities();
    renderActivities();
  }
}

// Stop activity and log to past activities
function stopActivity(index) {
  const activity = activities[index];
  if (activity.isRunning) {
    const currentTime = Date.now();
    const timeElapsed = currentTime - activity.lastStartTime;
    activity.time += timeElapsed;
    activity.isRunning = false;

    // Log to past activity
    const pastActivityRow = document.createElement('tr');
    pastActivityRow.innerHTML = `
      <td>${activity.name}</td>
      <td>${formatTime(activity.time)}</td>
      <td>${Math.floor(Math.random() * 100)}%</td>
    `;
    document.querySelector('table').appendChild(pastActivityRow);

    saveActivities();
    renderActivities();
  }
}

// Convert time in milliseconds to HH:MM:SS format
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

// Render current activities and keep past activities in the table
function renderActivities() {
  const activitiesContainer = document.querySelector('.activities');

  activitiesContainer.innerHTML = '';

  activities.forEach((activity, index) => {
    // Current Activity
    const activityCard = document.createElement('div');
    activityCard.classList.add('activity-card');
    activityCard.innerHTML = `
      <h3>${activity.name}</h3>
      <p>${formatTime(activity.time)}</p>
      <button class="btn btn-stop">Stop</button>
      <button class="btn btn-start">Start</button>
    `;

    const stopButton = activityCard.querySelector('.btn-stop');
    const startButton = activityCard.querySelector('.btn-start');

    stopButton.addEventListener('click', () => stopActivity(index));
    startButton.addEventListener('click', () => startActivity(index));

    activitiesContainer.appendChild(activityCard);
  });
}

// Start the timer to update activities every second
setInterval(updateActivityTimes, 1000);

// Initial render
renderActivities();
