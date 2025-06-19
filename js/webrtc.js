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
