// UI Buttons
const muteBtn = document.createElement('button');
const videoBtn = document.createElement('button');
const speakerBtn = document.createElement('button');
const incomingDiv = document.getElementById("incoming-popup");
const callerIdSpan = document.getElementById("caller-id");
const acceptBtn = document.getElementById("accept-btn");
const rejectBtn = document.getElementById("reject-btn")

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
// Incoming call answered
acceptBtn.onclick = () => {
    stopRingtone();
    logCall("incoming", incomingCall.peer);
    answerCall(incomingCall);
};

// Missed call
incomingCall.on('close', () => {
    if (!callAnswered) {
        logCall("missed", incomingCall.peer);
    }
});

// Outgoing call
function makeCall(peerId) {
    logCall("outgoing", peerId);
    // continue...
}

<!-- Inside logs.html -->
<ul id="logList"></ul>

<script>
const logs = JSON.parse(localStorage.getItem("callLogs") || "[]");
const logList = document.getElementById("logList");

logs.reverse().forEach(log => {
    const li = document.createElement("li");
    li.textContent = `${log.type.toUpperCase()} - ${log.peerId} - ${log.time}`;
    logList.appendChild(li);
});
</script>

//Function to handle the popup and buttons
function showIncomingPopup(peerId, onAccept, onReject) {
    callerIdSpan.textContent = peerId;
    incomingDiv.style.display = 'flex'; // show popup (set display: none by default in CSS)

    acceptBtn.onclick = () => {
        incomingDiv.style.display = 'none';
        onAccept();
    };

    rejectBtn.onclick = () => {
        incomingDiv.style.display = 'none';
        onReject();
    };
}



