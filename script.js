function createPlayer(beforeSrc, afterSrc) {
  const container = document.getElementById("playersContainer");

  const player = document.createElement("div");
  player.className = "player";

  const beforeAudio = new Audio(beforeSrc);
  const afterAudio = new Audio(afterSrc);

  let currentTrack = "before";
const playPauseBtn = document.createElement("button");

playPauseBtn.className = "playPause";

const playIcon = `<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`;

const pauseIcon = `<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6zm8-14v14h4V5h-4z"/></svg>`;

playPauseBtn.innerHTML = playIcon;

  const toggleBtn = document.createElement("button");
  toggleBtn.className = "toggleTrackBtn before";
  toggleBtn.innerText = "Before";

  const progress = document.createElement("input");
  progress.type = "range";
  progress.className = "progress";
  progress.value = 0;
  progress.min = 0;
  progress.max = 100;

  const timestamp = document.createElement("div");
  timestamp.className = "timestamp";
  timestamp.textContent = "0:00";

  const volumeSlider = document.createElement("input");
  volumeSlider.type = "range";
  volumeSlider.className = "volume";
  volumeSlider.min = 0;
  volumeSlider.max = 1;
  volumeSlider.step = 0.01;
  volumeSlider.value = 1;

  const timeline = document.createElement("div");
  timeline.className = "timeline";
  timeline.appendChild(progress);
  timeline.appendChild(timestamp);

  const volumeContainer = document.createElement("div");
  volumeContainer.className = "volume-container";
  volumeContainer.appendChild(volumeSlider);

  player.append(playPauseBtn, toggleBtn, timeline, volumeContainer);
  container.appendChild(player);

  // Sync volumes
  beforeAudio.volume = volumeSlider.value;
  afterAudio.volume = volumeSlider.value;

volumeSlider.addEventListener("input", () => {
  beforeAudio.volume = afterAudio.volume = volumeSlider.value;
  volumeSlider.style.setProperty('--val', `${volumeSlider.value * 100}%`);
});
volumeSlider.style.setProperty('--val', `${volumeSlider.value * 100}%`);


// Play/Pause toggle
playPauseBtn.addEventListener("click", () => {
  const currentAudio = currentTrack === "before" ? beforeAudio : afterAudio;
  const otherAudio = currentTrack === "before" ? afterAudio : beforeAudio;

  if (currentAudio.paused) {
    otherAudio.pause(); // ensure other track is paused
    currentAudio.play();
    playPauseBtn.innerHTML = pauseIcon;
  } else {
    currentAudio.pause();
    playPauseBtn.innerHTML = playIcon;
  }
});

// Toggle track view
toggleBtn.addEventListener("click", () => {
  const fromAudio = currentTrack === "before" ? beforeAudio : afterAudio;
  const toAudio = currentTrack === "before" ? afterAudio : beforeAudio;

  const wasPlaying = !fromAudio.paused;
  const currentTime = fromAudio.currentTime;

  fromAudio.pause();
  toAudio.currentTime = currentTime;
  if (wasPlaying) {
    toAudio.play();
  }

  currentTrack = currentTrack === "before" ? "after" : "before";
  toggleBtn.classList.toggle("before");
  toggleBtn.classList.toggle("after");
  toggleBtn.innerText = currentTrack.charAt(0).toUpperCase() + currentTrack.slice(1);
  player.classList.toggle("after");

  playPauseBtn.innerHTML = toAudio.paused ? playIcon : pauseIcon;
});


  // Progress bar update
  function updateProgress() {
    const audio = currentTrack === "before" ? beforeAudio : afterAudio;
const percent = (audio.currentTime / audio.duration) * 100;
progress.value = percent || 0;
progress.style.background = `linear-gradient(to right, #ffffff ${percent}%, #333 ${percent}%)`;

    requestAnimationFrame(updateProgress);
  }
  requestAnimationFrame(updateProgress);

  // Seek
  progress.addEventListener("input", () => {
    const seekTime = (progress.value / 100) * beforeAudio.duration;
    beforeAudio.currentTime = seekTime;
    afterAudio.currentTime = seekTime;
  });

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  }
}

// 🎧 Your audio files
createPlayer("https://henyx.github.io/codepen-audio/ShineBefore.mp3", "https://henyx.github.io/codepen-audio/ShineAfter.mp3");
