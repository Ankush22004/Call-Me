// UI Buttons
const muteBtn = document.createElement('button');
const videoBtn = document.createElement('button');
const speakerBtn = document.createElement('button');

let isMuted = false;
let isVideoOn = true;
let ringtone = new Audio('media/ringtone.mp3');
ringtone.loop = true;

// Append buttons
const callSection = document.querySelector('.call-section');
muteBtn.textContent = "🔇 Mute";
videoBtn.textContent = "🎥 Video Off";
speakerBtn.textContent = "🔈 Speaker";
callSection.appendChild(muteBtn);
callSection.appendChild(videoBtn);
callSection.appendChild(speakerBtn);

// Mute/Unmute
muteBtn.onclick = () => {
  if (!localStream) return;
  isMuted = !isMuted;
  localStream.getAudioTracks().forEach(track => track.enabled = !isMuted);
  muteBtn.textContent = isMuted ? "🔈 Unmute" : "🔇 Mute";
};

// Video toggle
videoBtn.onclick = () => {
  if (!localStream) return;
  isVideoOn = !isVideoOn;
  localStream.getVideoTracks().forEach(track => track.enabled = isVideoOn);
  videoBtn.textContent = isVideoOn ? "🎥 Video Off" : "🎥 Video On";
};

// Speaker control
speakerBtn.onclick = () => {
  if (!HTMLMediaElement.prototype.setSinkId) {
    alert("🔇 Speaker switching not supported in this browser.");
    return;
  }
if (!HTMLMediaElement.prototype.setSinkId) {
  speakerBtn.style.display = "none"; // Hide button if unsupported
}
  const deviceId = prompt("🎧 Enter audio output device ID (or use default):", "default");
  remoteVideo.setSinkId(deviceId)
    .then(() => alert("✅ Speaker changed!"))
    .catch(err => console.error("Speaker change error:", err));
};

// Inside webrtc-advanced.js

const ringtone = new Audio("assets/ringtone.mp3");
ringtone.loop = true;

function playRingtone() {
    ringtone.play().catch((err) => console.log("Ringtone error: ", err));
}

function stopRingtone() {
    ringtone.pause();
    ringtone.currentTime = 0;
}
function logCall(type, peerId) {
    const logs = JSON.parse(localStorage.getItem("callLogs") || "[]");
    logs.push({
        type: type, // 'incoming', 'missed', 'outgoing'
        peerId: peerId,
        time: new Date().toLocaleString()
    });
    localStorage.setItem("callLogs", JSON.stringify(logs));
}
