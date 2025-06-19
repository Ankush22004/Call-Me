
document.getElementById("mute-btn").onclick = () => {
  localStream.getAudioTracks()[0].enabled = !localStream.getAudioTracks()[0].enabled;
};
document.getElementById("video-toggle-btn").onclick = () => {
  const videoTrack = localStream.getVideoTracks()[0];
  videoTrack.enabled = !videoTrack.enabled;
};
document.getElementById("speaker-btn").onclick = () => {
  alert("Speaker toggle requested (not all browsers support programmatic speaker selection).");
};
