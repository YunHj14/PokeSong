const ostListEl = document.getElementById("ost-list");
const discEl = document.getElementById("disc");

// 화면 텍스트 요소
const currentNoEl = document.getElementById("current-no");
const currentSeriesEl = document.getElementById("current-series");
const currentTitleEl = document.getElementById("current-title");
const currentTypeEl = document.getElementById("current-type");

// 컨트롤 요소
const playBtn = document.getElementById("play-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const shuffleBtn = document.getElementById("shuffle-btn");
const repeatBtn = document.getElementById("repeat-btn");
const progressBar = document.getElementById("progress-bar");
const currentTimeEl = document.getElementById("current-time");
const durationTimeEl = document.getElementById("duration-time");
const filterBtns = document.querySelectorAll(".filter-btn");

// SVG 아이콘 상수
const PLAY_ICON = `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
const PAUSE_ICON = `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
const REPEAT_ALL_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/></svg>`;
const REPEAT_ONE_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4zm-4-2V9h-1l-2 1v1h1.5v4H13z"/></svg>`;

let filteredList = [...ostList];
let currentTrackId = ostList[0].id;
let isPlaying = false;
let isShuffle = false;
let repeatMode = 0; // 0: 반복 끄기, 1: 현재 리스트 반복, 2: 현재 곡 무한반복

let ytPlayer = null;
let isPlayerReady = false;
let progressTimer = null;

// YouTube IFrame API 준비 완료 시 자동 호출
window.onYouTubeIframeAPIReady = function () {
  const firstTrack = ostList[0];
  ytPlayer = new YT.Player("youtube-player", {
    height: "200",
    width: "200",
    videoId: firstTrack.videoId || "",
    playerVars: {
      autoplay: 0,
      controls: 0,
      rel: 0,
      playsinline: 1
    },
    events: {
      onReady: () => {
        isPlayerReady = true;
        startProgressLoop();
      },
      onStateChange: onPlayerStateChange,
      onError: () => {
        console.warn("외부 재생이 제한된 영상이거나 videoId가 비어 있습니다. 다음 곡으로 이동합니다.");
        if (isPlaying) {
          playNextTrack(true);
        }
      }
    }
  });
};

// 유튜브 플레이어 상태 변화 감지
function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.PLAYING) {
    isPlaying = true;
    playBtn.innerHTML = PAUSE_ICON;
    discEl.classList.add("playing");
  } else if (event.data === YT.PlayerState.PAUSED) {
    isPlaying = false;
    playBtn.innerHTML = PLAY_ICON;
    discEl.classList.remove("playing");
  } else if (event.data === YT.PlayerState.ENDED) {
    handleTrackEnded();
  }
}

// 곡이 끝났을 때 반복 모드에 따른 처리
function handleTrackEnded() {
  if (repeatMode === 2) {
    // 현재 곡 무한반복
    if (isPlayerReady && ytPlayer) {
      ytPlayer.seekTo(0, true);
      ytPlayer.playVideo();
    }
    return;
  }
  playNextTrack(false);
}

// 다음 곡 이동 로직 (isManualClick: 사용자가 직접 다음 버튼을 눌렀는지 여부)
function playNextTrack(isManualClick = false) {
  const activeList = filteredList.length > 0 ? filteredList : ostList;

  // 셔플 모드일 때
  if (isShuffle) {
    if (activeList.length === 1) {
      loadTrackById(activeList[0].id, true);
      return;
    }
    const candidates = activeList.filter((item) => item.id !== currentTrackId);
    const randomTrack = candidates[Math.floor(Math.random() * candidates.length)];
    loadTrackById(randomTrack.id, true);
    return;
  }

  const idx = activeList.findIndex((item) => item.id === currentTrackId);
  const isLastTrack = idx === activeList.length - 1;

  // 자동 종료 시 마지막 곡이고 '반복 끄기(0)' 상태라면 정지
  if (!isManualClick && isLastTrack && repeatMode === 0) {
    pauseAudio();
    if (isPlayerReady && ytPlayer) {
      ytPlayer.seekTo(0, true);
      ytPlayer.pauseVideo();
    }
    progressBar.value = 0;
    currentTimeEl.textContent = "0:00";
    return;
  }

  const nextIdx = idx === -1 ? 0 : (idx + 1) % activeList.length;
  loadTrackById(activeList[nextIdx].id, true);
}

// 초기 실행
function init() {
  renderList(filteredList);
  updateTrackUI(ostList[0]);
}

// 리스트 렌더링
function renderList(list) {
  ostListEl.innerHTML = "";
  list.forEach((item) => {
    const li = document.createElement("li");
    li.className = `ost-item ${item.id === currentTrackId ? "active" : ""}`;
    li.innerHTML = `
      <div class="item-info">
        <span class="item-no">${item.no} · ${item.series}</span>
        <span class="item-title">${item.title}</span>
      </div>
      <span class="item-tag">${item.type}</span>
    `;
    li.addEventListener("click", () => {
      loadTrackById(item.id, true);
    });
    ostListEl.appendChild(li);
  });
}

// 좌측 화면 텍스트만 갱신
function updateTrackUI(track) {
  currentTrackId = track.id;
  currentNoEl.textContent = track.no;
  currentSeriesEl.textContent = track.series;
  currentTitleEl.textContent = track.title;
  currentTypeEl.textContent = track.type;
  progressBar.value = 0;
  currentTimeEl.textContent = "0:00";
  durationTimeEl.textContent = "0:00";
  renderList(filteredList);
}

// 고유 ID로 곡 로드 및 재생
function loadTrackById(id, autoPlay = true) {
  const track = ostList.find((item) => item.id === id);
  if (!track) return;

  updateTrackUI(track);

  if (!isPlayerReady || !ytPlayer) return;

  if (!track.videoId) {
    console.warn(`[${track.title}]의 videoId가 아직 입력되지 않았습니다.`);
    pauseAudio();
    return;
  }

  if (autoPlay) {
    ytPlayer.loadVideoById(track.videoId);
    isPlaying = true;
    playBtn.innerHTML = PAUSE_ICON;
    discEl.classList.add("playing");
  } else {
    ytPlayer.cueVideoById(track.videoId);
    pauseAudio();
  }
}

function playAudio() {
  if (!isPlayerReady || !ytPlayer) return;
  const track = ostList.find((item) => item.id === currentTrackId);
  if (!track || !track.videoId) return;

  ytPlayer.playVideo();
  isPlaying = true;
  playBtn.innerHTML = PAUSE_ICON;
  discEl.classList.add("playing");
}

function pauseAudio() {
  if (isPlayerReady && ytPlayer && typeof ytPlayer.pauseVideo === "function") {
    ytPlayer.pauseVideo();
  }
  isPlaying = false;
  playBtn.innerHTML = PLAY_ICON;
  discEl.classList.remove("playing");
}

// 재생/일시정지 토글
playBtn.addEventListener("click", () => {
  isPlaying ? pauseAudio() : playAudio();
});

// 셔플 버튼 토글
shuffleBtn.addEventListener("click", () => {
  isShuffle = !isShuffle;
  shuffleBtn.classList.toggle("active", isShuffle);
  shuffleBtn.title = isShuffle ? "셔플 재생: 켜짐" : "셔플 재생: 꺼짐";
});

// 반복 버튼 3단계 순환 (0: 끄기 -> 1: 리스트 반복 -> 2: 현재 곡 무한반복)
repeatBtn.addEventListener("click", () => {
  repeatMode = (repeatMode + 1) % 3;

  if (repeatMode === 0) {
    repeatBtn.classList.remove("active");
    repeatBtn.innerHTML = REPEAT_ALL_ICON;
    repeatBtn.title = "반복: 끄기";
  } else if (repeatMode === 1) {
    repeatBtn.classList.add("active");
    repeatBtn.innerHTML = REPEAT_ALL_ICON;
    repeatBtn.title = "반복: 현재 리스트 전체 반복";
  } else {
    repeatBtn.classList.add("active");
    repeatBtn.innerHTML = REPEAT_ONE_ICON;
    repeatBtn.title = "반복: 현재 곡 무한반복";
  }
});

// 이전/다음 곡 버튼
prevBtn.addEventListener("click", () => {
  const activeList = filteredList.length > 0 ? filteredList : ostList;
  const idx = activeList.findIndex((item) => item.id === currentTrackId);
  const prevIdx = idx === -1 ? 0 : (idx - 1 + activeList.length) % activeList.length;
  loadTrackById(activeList[prevIdx].id, true);
});

nextBtn.addEventListener("click", () => {
  playNextTrack(true);
});

// 0.5초마다 재생 시간 & 프로그레스 바 동기화
function startProgressLoop() {
  if (progressTimer) clearInterval(progressTimer);
  progressTimer = setInterval(() => {
    if (isPlayerReady && ytPlayer && isPlaying && typeof ytPlayer.getCurrentTime === "function") {
      const current = ytPlayer.getCurrentTime() || 0;
      const duration = ytPlayer.getDuration() || 0;
      if (duration > 0) {
        progressBar.value = (current / duration) * 100;
        currentTimeEl.textContent = formatTime(current);
        durationTimeEl.textContent = formatTime(duration);
      }
    }
  }, 500);
}

// 프로그레스 바 탐색
progressBar.addEventListener("input", () => {
  if (isPlayerReady && ytPlayer && typeof ytPlayer.getDuration === "function") {
    const duration = ytPlayer.getDuration() || 0;
    if (duration > 0) {
      ytPlayer.seekTo((progressBar.value / 100) * duration, true);
    }
  }
});

// 시리즈 필터 버튼 (현재 재생 곡 유지)
filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const series = btn.dataset.series;
    filteredList = series === "ALL"
      ? [...ostList]
      : ostList.filter((item) => item.series === series);

    renderList(filteredList);
  });
});

function formatTime(sec) {
  const min = Math.floor(sec / 60);
  const remSec = Math.floor(sec % 60);
  return `${min}:${remSec < 10 ? "0" : ""}${remSec}`;
}

init();
