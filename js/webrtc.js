let localStream, peer, currentCall, callStartTime, callTimer;

const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const myIdSpan = document.getElementById('myId');
const peerIdInput = document.getElementById('peerIdInput');
const statusDiv = document.getElementById('status');
const incomingDiv = document.getElementById('incoming');
const callerIdSpan = document.getElementById('callerId');
const acceptBtn = document.getElementById("accept-btn");
const rejectBtn = document.getElementById("reject-btn");

// ✅ Initialize Peer with working server
peer = new Peer({
  host: '0.peerjs.com',
  port: 443,
  path: '/',
  secure: true
});

peer.on('open', id => {
  console.log("✅ Your Peer ID is:", id);
  myIdSpan.textContent = id;
});

peer.on('error', err => {
  console.error("❌ PeerJS Error:", err);
});

// ✅ Get local media stream
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  .then(stream => {
    localStream = stream;
    localVideo.srcObject = stream;

    // ✅ Incoming call listener
    peer.on('call', call => {
      playRingtone();  // from webrtc-advanced.js
      updateStatus(`📞 Incoming call from ${call.peer}`, 'yellow');

      showIncomingPopup(call.peer, () => {
        stopRingtone();
        call.answer(localStream);
        currentCall = call;
        handleCall(call);
      }, () => {
        stopRingtone();
        call.close();
        updateStatus('❌ Call Rejected', 'red');
      });
    });
  })
  .catch(err => {
    alert('⚠️ Error accessing camera/microphone.');
    console.error(err);
  });
