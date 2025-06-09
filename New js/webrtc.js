let peer;
let localStream;
let currentCall;

async function init() {
  try {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    document.getElementById("localVideo").srcObject = localStream;

    peer = new Peer();

    peer.on('open', id => {
      document.getElementById("myId").textContent = id;
    });

    peer.on('call', call => {
      call.answer(localStream);
      call.on('stream', remoteStream => {
        document.getElementById("remoteVideo").srcObject = remoteStream;
      });
      currentCall = call;
    });

  } catch (err) {
    alert("Camera/Mic access denied or not supported.");
    console.error(err);
  }
}

function makeCall() {
  const peerId = document.getElementById("peerId").value.trim();
  if (!peerId) return alert("Enter a valid Peer ID!");

  const call = peer.call(peerId, localStream);
  call.on('stream', remoteStream => {
    document.getElementById("remoteVideo").srcObject = remoteStream;
  });
  currentCall = call;
}

function endCall() {
  if (currentCall) {
    currentCall.close();
    currentCall = null;
  }
  document.getElementById("remoteVideo").srcObject = null;
}

window.onload = init;
