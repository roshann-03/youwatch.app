import { useRef, useState, useEffect } from "react";
import axios from "axios";
import {
  FaPlay,
  FaPause,
  FaVolumeMute,
  FaVolumeUp,
  FaExpand,
} from "react-icons/fa";

export default function CustomVideoPlayer({ video }) {
  const videoRef = useRef(null);
  const viewed = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    const vid = videoRef.current;
    if (vid.paused) {
      vid.play();
      setIsPlaying(true);
    } else {
      vid.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const vid = videoRef.current;
    vid.muted = !vid.muted;
    setIsMuted(vid.muted);
  };

  const handleVolume = (e) => {
    const newVolume = parseFloat(e.target.value);
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const handleProgress = (e) => {
    const newTime = parseFloat(e.target.value);
    videoRef.current.currentTime = newTime;
    setProgress(newTime);
  };

  const toggleFullscreen = () => {
    const player = videoRef.current.parentElement;
    if (!document.fullscreenElement) {
      player.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const seek = (seconds) => {
    const vid = videoRef.current;
    vid.currentTime = Math.min(
      Math.max(vid.currentTime + seconds, 0),
      duration
    );
  };

  useEffect(() => {
    const vid = videoRef.current;
    const updateTime = () => setProgress(vid.currentTime);
    const updateDuration = () => setDuration(vid.duration);

    // Keyboard shortcuts
    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT") return;
      switch (e.key.toLowerCase()) {
        case " ":
          e.preventDefault();
          togglePlay();
          break;
        case "m":
          toggleMute();
          break;
        case "f":
          toggleFullscreen();
          break;
        case "arrowleft":
          seek(-10);
          break;
        case "arrowright":
          seek(10);
          break;
        default:
          break;
      }
    };

    vid.addEventListener("timeupdate", updateTime);
    vid.addEventListener("loadedmetadata", updateDuration);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      vid.removeEventListener("timeupdate", updateTime);
      vid.removeEventListener("loadedmetadata", updateDuration);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [duration]);

  // 📈 View Tracking Effect (10s play threshold)
  useEffect(() => {
    const vid = videoRef.current;
    let timeout;
    const handleTimeUpdate = async () => {
      if (viewed.current) return;

      const percentageWatched = (vid.currentTime / vid.duration) * 100;

      if (vid.currentTime >= 10 || percentageWatched >= 80) {
        viewed.current = true;
        try {
          await axios.post(`/api/video/track-view/${video._id}`);
        } catch (err) {
          console.error("Error tracking view:", err);
        }
      }
    };

    vid.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      vid.removeEventListener("timeupdate", handleTimeUpdate);
      clearTimeout(timeout);
    };
  }, [video._id]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="video-container relative w-full max-w-4xl mx-auto bg-black  overflow-hidden shadow-lg">
      <video
        ref={videoRef}
        className="w-full h-auto bg-black"
        src={video.videoFile}
        onClick={togglePlay}
        controls={false} // hide default controls
      />

      {/* Custom Controls */}
      <div className="absolute bottom-0 w-full bg-black/60 backdrop-blur-md text-white p-4 flex flex-col gap-2">
        {/* Progress Bar */}
        <input
          type="range"
          min={0}
          max={duration}
          step={0.1}
          value={progress}
          onChange={handleProgress}
          className="w-full  h-1  accent-gray-200"
        />

        {/* Buttons */}
        <div className="flex justify-between items-center gap-4">
          <div className="flex gap-4 items-center">
            <button onClick={togglePlay} className="text-xl">
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
            <button onClick={toggleMute} className="text-xl">
              {isMuted || volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={handleVolume}
              className="volume-slider w-32 h-1 rounded-full bg-gray-500/30 accent-gray-200"
            />
            <div className="flex justify-between text-xs text-white/80 px-1">
              <span>{formatTime(progress)}</span>{" "}
              <span className="px-1"> / </span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <button onClick={toggleFullscreen} className="text-xl">
            <FaExpand />
          </button>
        </div>
      </div>
    </div>
  );
}
