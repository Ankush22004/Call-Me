// ========== ELEMENT REFERENCES ==========
const muteBtn = document.createElement('button');
const videoBtn = document.createElement('button');
const speakerBtn = document.createElement('button');
const callSection = document.querySelector('.call-section');

const incomingDiv = document.getElementById("incoming-popup");
const callerIdSpan = document.getElementById("caller-id");
const acceptBtn = document.getElementById("accept-btn");
const rejectBtn = document.getElementById("reject-btn");
const remoteVideo = document.getElementById("remoteVideo");

let isMuted = false;
let isVideoOn = true;
let localStream;
let incomingCall = null;
let callAnswered = false;

// ========== RINGTONE SETUP ==========
const ringtone = new Audio("media/ringtone.mp3");
ringtone.loop = true;

function playRingtone() {
    ringtone.play().catch((err) => console.log("🔇 Ringtone error:", err));
}

function stopRingtone() {
    ringtone.pause();
    ringtone.currentTime = 0;
}

// ========== CALL LOGGING ==========
function logCall(type, peerId) {
    const logs = JSON.parse(localStorage.getItem("callLogs") || "[]");
    logs.push({
        type: type,
        peerId: peerId,
        time: new Date().toLocaleString()
    });
    localStorage.setItem("callLogs", JSON.stringify(logs));
}

// ========== CALL CONTROLS SETUP ==========
muteBtn.textContent = "🔇 Mute";
videoBtn.textContent = "🎥 Video Off";
speakerBtn.textContent = "🔈 Speaker";

callSection.appendChild(muteBtn);
callSection.appendChild(videoBtn);
callSection.appendChild(speakerBtn);

// Mute Toggle
muteBtn.onclick = () => {
    if (!localStream) return;
    isMuted = !isMuted;
    localStream.getAudioTracks().forEach(track => track.enabled = !isMuted);
    muteBtn.textContent = isMuted ? "🔈 Unmute" : "🔇 Mute";
};

// Video Toggle
videoBtn.onclick = () => {
    if (!localStream) return;
    isVideoOn = !isVideoOn;
    localStream.getVideoTracks().forEach(track => track.enabled = isVideoOn);
    videoBtn.textContent = isVideoOn ? "🎥 Video Off" : "🎥 Video On";
};

// Speaker Output Change
speakerBtn.onclick = () => {
    if (!HTMLMediaElement.prototype.setSinkId) {
        alert("🔇 Speaker switching not supported in this browser.");
        speakerBtn.style.display = "none";
        return;
    }
    const deviceId = prompt("🎧 Enter output device ID:", "default");
    remoteVideo.setSinkId(deviceId)
        .then(() => alert("✅ Speaker changed!"))
        .catch(err => console.error("Speaker change error:", err));
};

// ========== INCOMING CALL POPUP ==========
function showIncomingPopup(peerId, onAccept, onReject) {
    callerIdSpan.textContent = peerId;
    incomingDiv.style.display = 'flex';
    playRingtone();

    acceptBtn.onclick = () => {
        stopRingtone();
        incomingDiv.style.display = 'none';
        onAccept();
    };

    rejectBtn.onclick = () => {
        stopRingtone();
        incomingDiv.style.display = 'none';
        onReject();
    };
}

// ========== INCOMING CALL HANDLER ==========
peer.on('call', call => {
    incomingCall = call;
    callAnswered = false;

    showIncomingPopup(call.peer, () => {
        logCall("incoming", call.peer);
        answerCall(call);
        callAnswered = true;
    }, () => {
        call.close();
        logCall("missed", call.peer);
    });

    // Missed call log if closed without answering
    call.on('close', () => {
        if (!callAnswered) {
            logCall("missed", call.peer);
        }
    });
});

// ========== OUTGOING CALL INIT ==========
function makeCall(peerId) {
    logCall("outgoing", peerId);
    // Your existing call logic (peer.call, etc.)
}
