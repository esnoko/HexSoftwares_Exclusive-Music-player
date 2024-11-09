"use strict";

// all music information
const musicData = [
  {
    backgroundImage: "./assets/images/fera.png",
    posterUrl: "./assets/images/fera.png",
    title: "3 (Exclusive)",
    album: "Unreleased",
    year: 2024,
    artist: "Fera",
    musicPath: "./assets/music/3.mp3",
  },
  {
    backgroundImage: "./assets/images/fera.png",
    posterUrl: "./assets/images/fera.png",
    title: "4 (Exclusive)",
    album: "Unreleased",
    year: 2024,
    artist: "Fera",
    musicPath: "./assets/music/4.mp3",
  },
  {
    backgroundImage: "./assets/images/fera.png",
    posterUrl: "./assets/images/fera.png",
    title: "5 (Exclusive)",
    album: "Unreleased",
    year: 2024,
    artist: "Fera",
    musicPath: "./assets/music/5.mp3",
  },
  {
    backgroundImage: "./assets/images/fera.png",
    posterUrl: "./assets/images/fera.png",
    title: "6 (Exclusive)",
    album: "Unreleased",
    year: 2024,
    artist: "Fera",
    musicPath: "./assets/music/6.mp3",
  },
  {
    backgroundImage: "./assets/images/fera.png",
    posterUrl: "./assets/images/fera.png",
    title: "7 (Exclusive)",
    album: "Unreleased",
    year: 2024,
    artist: "Fera",
    musicPath: "./assets/music/7.mp3",
  },
];

// add event on multiple elements
const addEventOnElements = function (elements, eventType, callback) {
  for (let i = 0, len = elements.length; i < len; i++) {
    elements[i].addEventListener(eventType, callback);
  }
};

// music list
const musicList = document.querySelector("[data-music-list]");

for (let i = 0; i < musicData.length; i++) {
  musicList.innerHTML += `
    <li>
      <button
        class="music-item ${i === 0 ? "playing" : ""}"
        data-playlist-toggler
        data-playlist-item="${i}"
      >
        <img
          src="${musicData[i].posterUrl}"
          width="800"
          height="800"
          alt="${musicData[i].title} Poster"
          class="img-cover"
        />

        <div class="item-icon">
          <span class="material-symbols-rounded">equalizer</span>
        </div>

        <span class="title">${musicData[i].title}</span>
      </button>
    </li>
  `;
}

// playlist side modal
const playlistSideModal = document.querySelector("[data-playlist]");
const playlistTogglers = document.querySelectorAll("[data-playlist-toggle]");
const overlay = document.querySelector("[data-overlay]");

const togglerPlaylist = function () {
  playlistSideModal.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.classList.toggle("modalActive");
};

// Add event listeners to all playlist togglers
addEventOnElements(playlistTogglers, "click", togglerPlaylist);

const playlistItem = document.querySelectorAll("[data-playlist-item]");

let currentMusic = 0;
let lastPlayedMusic = 0;

const changePlaylistItem = function () {
  playlistItem[lastPlayedMusic].classList.remove("playing");
  playlistItem[currentMusic].classList.add("playing");
};

addEventOnElements(playlistItem, "click", function () {
  lastPlayedMusic = currentMusic;
  currentMusic = Number(this.dataset.playlistItem);
  changePlaylistItem();

  // Close the playlist sidebar after selecting a song
  togglerPlaylist();
});

const playerBanner = document.querySelector("[data-music-banner]");
const playerTitle = document.querySelector("[data-music-title]");
const playerAlbum = document.querySelector("[data-music-album]");
const playerYear = document.querySelector("[data-year]");
const playerArtist = document.querySelector("[data-artist]");

const audioSource = new Audio(musicData[currentMusic].musicPath);

const changePlayerDetails = function () {
  playerBanner.src = musicData[currentMusic].posterUrl;
  playerBanner.setAttribute("alt", `${musicData[currentMusic].title} Poster`);
  document.body.style.backgroundImage = `url(${musicData[currentMusic].backgroundImage})`;

  playerTitle.textContent = musicData[currentMusic].title;
  document.querySelector("[data-album]").textContent =
    musicData[currentMusic].album;
  document.querySelector("[data-year]").textContent =
    musicData[currentMusic].year;
  playerArtist.textContent = musicData[currentMusic].artist;

  audioSource.src = musicData[currentMusic].musicPath;

  audioSource.addEventListener("loadeddata", updateDuration);
  playPauseAudio();
};

// change player details when a song is selected
addEventOnElements(playlistItem, "click", changePlayerDetails);

// player duration and seek range
const playerDuration = document.querySelector("[data-duration]");
const playerSeekRange = document.querySelector("[data-seek]");

// get timecode
const getTimecode = function (time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.ceil(time - minutes * 60);
  const timeCode = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  return timeCode;
};

// update duration
const updateDuration = function () {
  playerSeekRange.max = Math.ceil(audioSource.duration);
  playerDuration.textContent = getTimecode(Number(playerSeekRange.max));
};

// update duration when the audio is loaded
audioSource.addEventListener("loadeddata", updateDuration);

// play pause/play audio
const playBtn = document.querySelector("[data-play-btn]");
let playInterval;
const playPauseAudio = function () {
  if (audioSource.paused){
    audioSource.play();
    playBtn.classList.add("active");
    playInterval = setInterval(updateRunningTime, 500);
  } else {
    audioSource.pause();
    playBtn.classList.remove("active");
    clearInterval(playInterval);
  }
};
// play pause audio when the play button is clicked
playBtn.addEventListener("click", playPauseAudio);

// Add error handling for audio loading
audioSource.addEventListener('error', function(e) {
  console.error("Error loading audio file:", e);
  // Handle the error (e.g., show a message to the user)
});

// update running time
const playerRunningTime = document.querySelector("[data-running-time]");
const updateRunningTime = function () {
  playerSeekRange.value = audioSource.currentTime;
  playerRunningTime.textContent = getTimecode(audioSource.currentTime);

  updateRangeFill();
  isMusicEnd();
};

// update range fill
const ranges = document.querySelectorAll("[data-range]");
const rangeFill = document.querySelector("[data-range-fill]");

const updateRangeFill = function () {
  let element = this || ranges[0];

  const rangeValue = (element.value / element.max) * 100;
  element.nextElementSibling.style.width = `${rangeValue}%`;
};

addEventOnElements(ranges, "input", updateRangeFill);

// seek to the selected time
const seekTo = function () {
  audioSource.currentTime = playerSeekRange.value;
  playerRunningTime.textContent = getTimecode(playerSeekRange.value);
};

playerSeekRange.addEventListener("input", seekTo);

// check if the music is ended
const isMusicEnd = function(){
  if (audioSource.ended){
    if (isRepeated) {
      // If repeat is active, play the same song again
      audioSource.currentTime = 0;
      audioSource.play();
      playBtn.classList.add("active");
    } else {
      // If repeat is not active, play next song
      playBtn.classList.remove("active");
      audioSource.currentTime = 0;
      playerSeekRange.value = audioSource.currentTime;
      playerRunningTime.textContent = getTimecode(audioSource.currentTime);
      updateRangeFill();
      skipNext(); // Play the next song
    }
  }
}

// skip to next song
const playerSkipNext = document.querySelector("[data-skip-next]");
const skipNext = function () {
  lastPlayedMusic = currentMusic;
  if (isShuffled) {
    // Get random song if shuffle is active
    let randomNum;
    do {
      randomNum = getRandomNumber(0, musicData.length - 1);
    } while (randomNum === currentMusic);
    currentMusic = randomNum;
  } else {
    // Normal sequential play
    currentMusic = (currentMusic + 1) % musicData.length;
  }
  changePlaylistItem();
  changePlayerDetails();
};

playerSkipNext.addEventListener("click", skipNext);

// skip to previous song
const playerSkipPrevious = document.querySelector("[data-skip-previous]");
const skipPrevious = function () {
  lastPlayedMusic = currentMusic;
  if (isShuffled) {
    // Get random song if shuffle is active
    let randomNum;
    do {
      randomNum = getRandomNumber(0, musicData.length - 1);
    } while (randomNum === currentMusic);
    currentMusic = randomNum;
  } else {
    // Normal sequential play
    currentMusic = (currentMusic - 1 + musicData.length) % musicData.length;
  }
  changePlaylistItem();
  changePlayerDetails();
};

playerSkipPrevious.addEventListener("click", skipPrevious);

// shuffle music
const playerShuffle = document.querySelector("[data-shuffle]");
let isShuffled = false;

const shuffleMusic = function () {
  isShuffled = !isShuffled; // Toggle shuffle state
  playerShuffle.classList.toggle("active");
};

playerShuffle.addEventListener("click", shuffleMusic);

// Add this helper function at the top with other utility functions
const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// repeat music
const playerRepeat = document.querySelector("[data-repeat]");
let isRepeated = false;

const repeatMusic = function () {
  isRepeated = !isRepeated;
  playerRepeat.classList.toggle("active");
};

playerRepeat.addEventListener("click", repeatMusic);


const playerVolumeBtn = document.querySelector("[data-volume-btn]");
const playerVolumeRange = document.querySelector("[data-volume]");

const updateVolume = function () {
  audioSource.volume = playerVolumeRange.value;
  
  // Update volume button icon based on volume level
  if (audioSource.muted || audioSource.volume === 0) {
    playerVolumeBtn.querySelector(".material-symbols-rounded").textContent = "volume_off";
  } else if (audioSource.volume < 0.5) {
    playerVolumeBtn.querySelector(".material-symbols-rounded").textContent = "volume_down";
  } else {
    playerVolumeBtn.querySelector(".material-symbols-rounded").textContent = "volume_up";
  }
};

const muteVolume = function(){
  if(!audioSource.muted){
    audioSource.muted = true;
    playerVolumeBtn.querySelector(".material-symbols-rounded").textContent = "volume_off";
  } else {
    audioSource.muted = false;
    updateVolume();
  }
};

// Add event listeners
playerVolumeRange.addEventListener("input", updateVolume);
playerVolumeBtn.addEventListener("click", muteVolume);

