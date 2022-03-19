let batteryInfo = null;
let player = null;
let currentUrl = null;
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
    } else {
      hideBatteryInfo();
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
  } else {
    removeBatteryInfo(player);
  }
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
function removeBatteryInfo(player) {
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
