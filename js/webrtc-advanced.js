// Elements assumed to be present in HTML:
const muteBtn = document.createElement('button');
const videoBtn = document.createElement('button');
const speakerBtn = document.createElement('button');

let isMuted = false;
let isVideoOn = true;
let ringtone = new Audio('media/ringtone.mp3');
ringtone.loop = true;

// Append buttons to call-section
const callSection = document.querySelector('.call-section');
muteBtn.textContent = "🔇 Mute";
videoBtn.textContent = "🎥 Video Off";
speakerBtn.textContent = "🔈 Speaker";
callSection.appendChild(muteBtn);
callSection.appendChild(videoBtn);
callSection.appendChild(speakerBtn);

// Mute/Unmute Mic
muteBtn.onclick = () => {
  if (!localStream) return;
  isMuted = !isMuted;
  localStream.getAudioTracks().forEach(track => track.enabled = !isMuted);
  muteBtn.textContent = isMuted ? "🔈 Unmute" : "🔇 Mute";
};

// Toggle Video
videoBtn.onclick = () => {
  if (!localStream) return;
  isVideoOn = !isVideoOn;
  localStream.getVideoTracks().forEach(track => track.enabled = isVideoOn);
  videoBtn.textContent = isVideoOn ? "🎥 Video Off" : "🎥 Video On";
};

// Speaker Control (browser support needed)
speakerBtn.onclick = () => {
  if (!HTMLMediaElement.prototype.setSinkId) {
    alert("❌ Speaker switching not supported in this browser.");
    return;
  }

  const deviceId = prompt("🔊 Enter audio output device ID (or use default):", "default");
  remoteVideo.setSinkId(deviceId)
    .then(() => alert("✅ Speaker changed!"))
    .catch(err => console.error("Speaker change error:", err));
};

// Hook into existing incoming call from main JS
function playRingtone() {
  ringtone.play().catch(err => console.warn("Ringtone play blocked:", err));
}

function stopRingtone() {
  ringtone.pause();
  ringtone.currentTime = 0;
}

// Overwrite or hook into the call handler (in main JS)
const originalHandleCall = window.handleCall;
window.handleCall = function(call) {
  stopRingtone(); // stop if playing
  originalHandleCall(call); // call existing logic
};

const originalOnCall = peer.on;
peer.on = function (event, handler) {
  if (event === 'call') {
    originalOnCall.call(peer, 'call', call => {
      playRingtone();
      handler(call);
    });
  } else {
    originalOnCall.call(peer, event, handler);
  }
};
