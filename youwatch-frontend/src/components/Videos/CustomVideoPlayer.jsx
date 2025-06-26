import { useRef, useState, useEffect } from "react";
import {
  FaPlay,
  FaPause,
  FaVolumeMute,
  FaVolumeUp,
  FaExpand,
} from "react-icons/fa";
import { axiosJSON } from "../../api/axiosInstances";

export default function CustomVideoPlayer({ video }) {
  const videoRef = useRef(null);
  const viewed = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    const attemptPlay = async () => {
      try {
        await vid.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    };
    attemptPlay();
  }, []);

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

  useEffect(() => {
    const vid = videoRef.current;
    let watchedTime = 0;
    let lastTime = 0;
    let interval;

    const trackWatchTime = () => {
      const currentTime = vid.currentTime;
      if (Math.abs(currentTime - lastTime) < 1.2) {
        watchedTime += 1;
      }
      lastTime = currentTime;

      if (watchedTime >= 10 && !viewed.current) {
        viewed.current = true;
        axiosJSON
          .post(`/videos/track-view/${video._id}`)
          .catch((err) => console.error("Error tracking view:", err));
      }
    };

    const handlePlay = () => {
      interval = setInterval(trackWatchTime, 1000);
    };

    const handlePause = () => {
      clearInterval(interval);
    };

    vid.addEventListener("play", handlePlay);
    vid.addEventListener("pause", handlePause);
    vid.addEventListener("ended", handlePause);

    return () => {
      clearInterval(interval);
      vid.removeEventListener("play", handlePlay);
      vid.removeEventListener("pause", handlePause);
      vid.removeEventListener("ended", handlePause);
    };
  }, [video._id]);

  const formatTime = (time = 0) => {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div
      className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-xl
        bg-white shadow-lg dark:bg-[#0b0f1c] dark:shadow-[0_0_20px_#00fff7]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <video
        ref={videoRef}
        className="w-full h-auto cursor-pointer bg-black"
        src={video.videoFile}
        onClick={togglePlay}
        onPause={() => setIsPlaying(false)}
        controls={false}
      />

      <div
        className="absolute bottom-0 w-full backdrop-blur-md p-4
        bg-white/70  dark:bg-black/60 border-t
        border-gray-200 dark:border-cyan-500 text-gray-800 dark:text-cyan-300"
      >
        {/* Progress Bar */}
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={progress}
          onChange={handleProgress}
          className="w-full h-1 rounded-lg appearance-none cursor-pointer accent-indigo-400
            bg-gradient-to-r from-indigo-300 to-purple-300 dark:bg-cyan-800 dark:accent-cyan-300"
        />

        <div className="flex justify-between items-center mt-3">
          {/* Left Controls */}
          <div className="flex gap-4 items-center">
            <button
              onClick={togglePlay}
              className="text-xl p-2 rounded-full transition hover:bg-indigo-100 dark:hover:bg-cyan-900"
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>

            <button
              onClick={toggleMute}
              className="text-xl p-2 rounded-full transition hover:bg-indigo-100 dark:hover:bg-cyan-900"
            >
              {isMuted || volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
            </button>

            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={handleVolume}
              className="w-24 h-1 rounded-lg appearance-none accent-indigo-400 bg-gray-300 dark:bg-cyan-800"
            />

            <div className="text-sm text-gray-600 dark:text-cyan-200 font-mono select-none">
              {formatTime(progress)} / {formatTime(duration)}
            </div>
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="text-xl p-2 rounded-full transition hover:bg-indigo-100 dark:hover:bg-cyan-900"
          >
            <FaExpand />
          </button>
        </div>
      </div>
    </div>
  );
}
