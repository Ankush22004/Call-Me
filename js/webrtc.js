const peer = new Peer();
const myIdSpan = document.getElementById('myId');

peer.on('open', id => {
  myIdSpan.textContent = id;
});

function copyMyId() {
  navigator.clipboard.writeText(myIdSpan.textContent)
    .then(() => alert("Copied ID!"))
    .catch(err => console.error("Copy failed:", err));
}
// Prompt for media access on load (optional)
window.addEventListener("load", () => {
  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
      localStream = stream;
      localVideo.srcObject = stream;
      console.log("✅ Stream ready on load");
    })
    .catch(err => {
      console.warn("🔒 Permission denied or error:", err);
      alert("Please allow camera/mic access to start the call.");
    });
});
