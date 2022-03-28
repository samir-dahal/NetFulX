let batteryInfo = null;
let player = null;
let currentUrl = null;
let time = null;
const playerState = {
  active: "active",
  inactive: "inactive",
  passive: "passive",
};
const locationObserver = new MutationObserver(function (mutations) {
  const url = location.href;
  if (url !== currentUrl) {
    currentUrl = url;
    playerObserver.disconnect();
    observeVideoPlayerView();
  }
});
locationObserver.observe(document, { subtree: true, childList: true });
const playerObserver = new MutationObserver(function (mutations) {
  mutations.forEach((mutation) => {
    if (mutation.target.classList.contains(playerState.active)) {
      updateBatteryInfo(batteryInfo);
      updateTime(time);
    } else {
      hideBatteryInfo();
      hideTime();
    }
  });
});
const videoPlayerViewObserver = new MutationObserver(function (mutations_list) {
  mutations_list.forEach(function (mutation) {
    mutation.addedNodes.forEach(function (added_node) {
      if (added_node.dataset.uia === "watch-video-player-view-minimized") {
        videoPlayerViewObserver.disconnect();
        const player = added_node.firstChild;
        playerObserver.observe(player, { attributes: true });
      }
    });
  });
});
function observeVideoPlayerView() {
  const videoPlayerView = document.querySelector("[data-uia='watch-video']");
  videoPlayerView &&
    videoPlayerViewObserver.observe(videoPlayerView, {
      subtree: false,
      childList: true,
    });
}
window.onload = observeVideoPlayerView;
["", "webkit", "moz", "ms"].forEach((prefix) =>
  document.addEventListener(prefix + "fullscreenchange", checkFullScreen, false)
);
function checkFullScreen(event) {
  player = document.fullscreenElement;
  if (player) {
    addBatteryInfo(player);
    addTime(player);
  } else {
    removeBatteryInfo();
    removeTime();
  }
}
function addTime(player) {
  time = document.createElement("p");
  time.style.margin = 0;
  time.style.padding = 0;
  time.style.position = "fixed";
  time.style.top = 0;
  time.style.left = 0;
  time.style.fontSize = "16px";
  time.style.color = "white";
  player.appendChild(time);
  updateTime(time);
}
function removeTime() {
  time && time.remove();
}
function addBatteryInfo(player) {
  batteryInfo = document.createElement("p");
  batteryInfo.style.margin = 0;
  batteryInfo.style.padding = 0;
  batteryInfo.style.position = "fixed";
  batteryInfo.style.top = 0;
  batteryInfo.style.right = 0;
  batteryInfo.style.fontSize = "16px";
  batteryInfo.style.color = "white";
  player.appendChild(batteryInfo);
  updateBatteryInfo(batteryInfo);
}
function removeBatteryInfo() {
  batteryInfo && batteryInfo.remove();
}
function showBatteryInfo() {
  if (batteryInfo) {
    batteryInfo.style.opacity = 1;
  }
}
function hideBatteryInfo() {
  if (batteryInfo) {
    batteryInfo.style.opacity = 0;
  }
}
function showTime() {
  if (time) {
    time.style.opacity = 1;
  }
}
function hideTime() {
  if (time) {
    time.style.opacity = 0;
  }
}
function updateBatteryInfo(batteryInfo) {
  if (batteryInfo) {
    navigator.getBattery().then((battery) => {
      batteryInfo.textContent = (battery.level * 100).toFixed() + "%";
      batteryInfo.textContent += battery.charging ? "⚡️" : "";
      batteryInfo.style.color =
        (battery.level * 100).toFixed() < 50 ? "red" : "white";
      showBatteryInfo();
    });
  }
}
function updateTime(time) {
  if (time) {
    time.textContent = formatAMPM(new Date());
    showTime();
  }
}
function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  return strTime.toUpperCase();
}
