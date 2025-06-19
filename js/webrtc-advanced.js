let localStream = null;
let currentCall = null;

const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");
const statusDiv = document.getElementById("status");
const peerIdInput = document.getElementById("peerIdInput");

const peer = new Peer();

peer.on("open", id => {
  document.getElementById("myId").textContent = id;
});

// Call someone
function makeCall() {
  const peerId = peerIdInput.value.trim();
  if (!peerId) return;

  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
      localStream = stream;
      localVideo.srcObject = stream;

      const call = peer.call(peerId, stream);
      setupCallEvents(call);
      statusDiv.textContent = "Calling...";
    })
    .catch(err => {
      console.error("Permission Error:", err);
      alert("Please allow camera/mic access.");
    });
}

// Receive a call
peer.on("call", call => {
  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
      localStream = stream;
      localVideo.srcObject = stream;
      call.answer(stream);
      setupCallEvents(call);
    })
    .catch(err => {
      console.error("Permission Error:", err);
      alert("Camera/Mic access is required.");
    });
});

function setupCallEvents(call) {
  currentCall = call;
  call.on("stream", remoteStream => {
    remoteVideo.srcObject = remoteStream;
    statusDiv.textContent = "Connected ✅";
  });

  call.on("close", () => {
    statusDiv.textContent = "Call Ended ❌";
    remoteVideo.srcObject = null;
  });
}

function endCall() {
  if (currentCall) {
    currentCall.close();
    currentCall = null;
    statusDiv.textContent = "Call Ended ❌";
    remoteVideo.srcObject = null;
  }
}

function copyMyId() {
  const id = document.getElementById("myId").textContent;
  navigator.clipboard.writeText(id).then(() => {
    alert("ID copied!");
  });
}
