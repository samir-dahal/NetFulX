let batteryInfo = null;
let player = null;
const playerState = {
  active: "active",
  inactive: "inactive",
  passive: "passive",
};
const playerObserver = new MutationObserver(function (mutations) {
  mutations.forEach((mutation) => {
    if (mutation.target.classList.contains(playerState.active)) {
      updateBatteryInfo(batteryInfo);
    } else {
      hideBatteryInfo();
    }
  });
});
const observer = new MutationObserver(function (mutations_list) {
  mutations_list.forEach(function (mutation) {
    mutation.addedNodes.forEach(function (added_node) {
      if (added_node.dataset.uia === "watch-video-player-view-minimized") {
        observer.disconnect();
        const player = added_node.firstChild;
        playerObserver.observe(player, { attributes: true });
      }
    });
  });
});
observer.observe(document.querySelector("[data-uia='watch-video']"), {
  subtree: false,
  childList: true,
});

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
      showBatteryInfo();
    });
  }
}
