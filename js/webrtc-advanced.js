let localStream = null;
let currentCall = null;

const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");
const statusDiv = document.getElementById("status");
const peerIdInput = document.getElementById("peerIdInput");
const callerIdSpan = document.getElementById("caller-id");
const incomingPopup = document.getElementById("incoming-popup");
const acceptBtn = document.getElementById("accept-btn");
const rejectBtn = document.getElementById("reject-btn");

function getCallConstraints() {
  const mode = document.getElementById('callMode')?.value || 'video';
  if (mode === 'audio') {
    return { video: false, audio: true };
  } else if (mode === 'fast') {
    return {
      video: { width: { ideal: 320 }, height: { ideal: 240 } },
      audio: true
    };
  } else if (mode === 'mini') {
    document.getElementById("localVideo").style.width = "120px";
    return {
      video: { width: 160, height: 120 },
      audio: true
    };
  }
  return {
    video: {
      width: { ideal: 1280 },
      height: { ideal: 720 },
      frameRate: { ideal: 30 }
    },
    audio: true
  };
}
  
  
  navigator.mediaDevices.getUserMedia(getCallConstraints())
  .then(stream => {
  localStream = stream;
  localVideo.srcObject = stream;
})
.catch(error => {
  console.error("Media Error:", error);
  alert("Camera/Microphone permission is required.");
});

function makeCall() {
  const peerId = peerIdInput.value.trim();
  if (!peerId) return;

  // 🎯 Always get latest selected stream on Call
  navigator.mediaDevices.getUserMedia(getCallConstraints())
    .then(stream => {
      localStream = stream;
      localVideo.srcObject = stream;

      const call = peer.call(peerId, localStream);
      setupCallEvents(call);
      statusDiv.textContent = "Calling...";
    })
    .catch(error => {
      console.error("Media Error:", error);
      alert("Camera/Microphone permission is required.");
    });
}

peer.on('call', call => {
  callerIdSpan.textContent = call.peer;
  incomingPopup.style.display = "block";
  window.pendingCall = call;
});

acceptBtn.onclick = () => {
  incomingPopup.style.display = "none";
  const call = window.pendingCall;

  navigator.mediaDevices.getUserMedia(getCallConstraints())
    .then(stream => {
      localStream = stream;
      localVideo.srcObject = stream;
      call.answer(localStream);
      setupCallEvents(call);
    })
    .catch(error => {
      console.error("Media Error:", error);
      alert("Camera/Microphone permission is required.");
    });
};

rejectBtn.onclick = () => {
  if (window.pendingCall) window.pendingCall.close();
  incomingPopup.style.display = "none";
};

function setupCallEvents(call) {
  currentCall = call;
  call.on('stream', remoteStream => {
    remoteVideo.srcObject = remoteStream;
    statusDiv.textContent = "Connected";

    // ✅ Try to improve bitrate
    const sender = call.peerConnection.getSenders().find(s => s.track.kind === "video");
    if (sender && sender.setParameters) {
      sender.setParameters({ encodings: [{ maxBitrate: 1500000 }] }).catch(console.warn);
    }
  });

  call.on('close', () => {
    statusDiv.textContent = "Call Ended";
    remoteVideo.srcObject = null;
  });
}

function endCall() {
  if (currentCall) {
    currentCall.close();
    currentCall = null;
  }
  statusDiv.textContent = "Call Ended";
  remoteVideo.srcObject = null;
}
