import { useRef, useState, useEffect, useCallback } from "react";
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
  const containerRef = useRef(null);
  const viewed = useRef(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const formatTime = (time = 0) =>
    `${String(Math.floor(time / 60)).padStart(2, "0")}:${String(
      Math.floor(time % 60)
    ).padStart(2, "0")}`;

  const togglePlay = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;

    if (vid.paused) {
      vid
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    } else {
      vid.pause();
      setIsPlaying(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;

    vid.muted = !vid.muted;
    setIsMuted(vid.muted);
  }, []);

  const handleVolume = useCallback((e) => {
    const newVolume = parseFloat(e.target.value);
    const vid = videoRef.current;
    if (!vid) return;

    vid.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  }, []);

  const handleProgress = useCallback((e) => {
    const newTime = parseFloat(e.target.value);
    const vid = videoRef.current;
    if (!vid) return;

    vid.currentTime = newTime;
    setProgress(newTime);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const container = containerRef.current;
    try {
      if (!document.fullscreenElement) {
        await container?.requestFullscreen?.();
        screen.orientation?.lock?.("landscape").catch(() => {});
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen?.();
        screen.orientation?.unlock?.();
        setIsFullscreen(false);
      }
    } catch (e) {
      console.warn("Fullscreen error:", e);
    }
  }, []);

  const seek = useCallback(
    (seconds) => {
      const vid = videoRef.current;
      if (!vid) return;

      const newTime = Math.min(
        Math.max(vid.currentTime + seconds, 0),
        duration
      );
      vid.currentTime = newTime;
      setProgress(newTime);
    },
    [duration]
  );

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    const updateProgress = () => setProgress(vid.currentTime);
    const updateDuration = () => setDuration(vid.duration);

    vid.addEventListener("timeupdate", updateProgress);
    vid.addEventListener("loadedmetadata", updateDuration);

    return () => {
      vid.removeEventListener("timeupdate", updateProgress);
      vid.removeEventListener("loadedmetadata", updateDuration);
    };
  }, []);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    let watchInterval;
    let watchedSeconds = 0;
    let lastTime = 0;

    const trackTime = () => {
      if (Math.abs(vid.currentTime - lastTime) < 1.2) {
        watchedSeconds += 1;
      }
      lastTime = vid.currentTime;

      if (watchedSeconds >= 10 && !viewed.current) {
        viewed.current = true;
        axiosJSON.post(`/videos/track-view/${video._id}`).catch(console.error);
      }
    };

    const handlePlay = () => {
      watchInterval = setInterval(trackTime, 1000);
    };
    const clearWatch = () => clearInterval(watchInterval);

    vid.addEventListener("play", handlePlay);
    vid.addEventListener("pause", clearWatch);
    vid.addEventListener("ended", clearWatch);

    return () => {
      clearInterval(watchInterval);
      vid.removeEventListener("play", handlePlay);
      vid.removeEventListener("pause", clearWatch);
      vid.removeEventListener("ended", clearWatch);
    };
  }, [video._id]);

  useEffect(() => {
    const handleKey = (e) => {
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

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [togglePlay, toggleMute, toggleFullscreen, seek]);

  useEffect(() => {
    let hideControlsTimer;
    if (isPlaying) {
      setShowControls(true);
      hideControlsTimer = setTimeout(() => setShowControls(false), 4000);
    } else {
      setShowControls(true);
    }
    return () => clearTimeout(hideControlsTimer);
  }, [isPlaying]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full mx-auto overflow-hidden bg-black ${
        isFullscreen ? "fixed inset-0 z-50" : "rounded-md shadow-md"
      }`}
      style={{ fontFamily: "'Inter', sans-serif" }}
      onMouseMove={() => {
        if (isPlaying) {
          setShowControls(true);
          clearTimeout(window.__hideControlsTimer);
          window.__hideControlsTimer = setTimeout(
            () => setShowControls(false),
            3000
          );
        }
      }}
    >
      <video
        ref={videoRef}
        className={`w-full h-auto transition-transform bg-black cursor-pointer ${
          isFullscreen
            ? "absolute inset-0 h-full w-full object-contain sm:rotate-0 rotate-90  scale-[1.8] sm:scale-[1]"
            : "sm:h-[85vh]"
        }`}
        src={video.videoFile}
        onClick={togglePlay}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        controls={false}
      />

      {/* Overlay Play Icon when paused */}
      {!isPlaying && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center text-white text-5xl sm:text-6xl bg-black/30 hover:bg-black/50 transition"
        >
          <FaPlay
            className={`${
              isFullscreen ? " sm:rotate-0 rotate-90" : " "
            } drop-shadow`}
          />
        </button>
      )}

      {/* Controls */}
      <div
        className={`absolute transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        } 
      ${
        isFullscreen
          ? " sm:bottom-0 sm:left-0 sm:right-0 right-[40%] bottom-[45%] w-[100vw] sm:rotate-0 rotate-90 sm:scale-[1] scale-[1.2]"
          : " bottom-0 left-0 right-0 scale-[1] "
      }
      bg-gradient-to-t from-black/70 via-black/40 to-transparent px-3 pb-3 pt-2`}
      >
        <input
          type="range"
          min={0}
          max={duration}
          step={0.1}
          value={progress}
          onChange={handleProgress}
          className="w-full h-1 appearance-none rounded bg-gray-300 dark:bg-cyan-700 accent-red-500 cursor-pointer"
        />

        <div className="flex justify-between items-center mt-2 text-white text-sm sm:text-base">
          <div className="flex items-center gap-3">
            <button onClick={togglePlay} className="hover:text-red-500">
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>

            <button onClick={toggleMute} className="hover:text-red-500">
              {isMuted || volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
            </button>

            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={handleVolume}
              className="w-24 h-1 hidden sm:block cursor-pointer accent-red-500"
            />

            <span className="font-mono text-xs sm:text-sm">
              {formatTime(progress)} / {formatTime(duration)}
            </span>
          </div>

          <button onClick={toggleFullscreen} className="hover:text-red-500">
            <FaExpand />
          </button>
        </div>
      </div>
    </div>
  );
}
