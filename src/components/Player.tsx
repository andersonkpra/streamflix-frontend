import { useRef, useEffect, type CSSProperties, type MouseEvent } from "react";
import { API_BASE } from "../services/api";

type PlayerProps = {
  videoUrl: string;
  movieId: string;
  onClose: () => void;
};

/**
 * Player component renders an overlayed modal video player and persists playback state.
 */
export default function Player({ videoUrl, movieId, onClose }: PlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lastPositionRef = useRef(0);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
    lastPositionRef.current = 0;
    // Reload the media element to ensure the new source starts fresh.
    try {
      v.load();
    } catch (e) {
      console.warn("Unable to reload video element", e);
    }
  }, [videoUrl]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => {
      lastPositionRef.current = v.currentTime || 0;
    };
    v.addEventListener("timeupdate", onTime);
    return () => v.removeEventListener("timeupdate", onTime);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  async function postPlayback(path: string, pos = 0) {
    try {
      await fetch(`${API_BASE}/playback/${path}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("sf_token") || ""}`,
        },
        body: JSON.stringify({ movieId, position: pos }),
      });
    } catch (e) {
      console.error("Playback save error", e);
    }
  }

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const handlePlay = () => postPlayback("start", v.currentTime || 0);
    const handlePause = () => postPlayback("pause", v.currentTime || 0);
    const handleEnded = () => {
      lastPositionRef.current = 0;
      postPlayback("stop", 0);
    };
    v.addEventListener("play", handlePlay);
    v.addEventListener("pause", handlePause);
    v.addEventListener("ended", handleEnded);
    return () => {
      v.removeEventListener("play", handlePlay);
      v.removeEventListener("pause", handlePause);
      v.removeEventListener("ended", handleEnded);
    };
  }, []);

  async function handleClose() {
    const v = videoRef.current;
    if (v) {
      v.pause();
      const currentPos = v.currentTime || lastPositionRef.current || 0;
      await postPlayback("stop", Math.floor(currentPos));
      v.currentTime = 0;
      lastPositionRef.current = 0;
    }
    onClose();
  }

  function handleOverlayClick(e: MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) {
      void handleClose();
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Video player"
      style={overlayStyles}
      onClick={handleOverlayClick}
    >
      <div style={containerStyles} onClick={(e) => e.stopPropagation()}>
        <button onClick={handleClose} aria-label="Cerrar reproductor" style={closeButton} type="button">
          ✕
        </button>
        {videoUrl ? (
          <video
            key={videoUrl}
            ref={videoRef}
            src={videoUrl}
            controls
            playsInline
            preload="metadata"
            style={videoStyles}
            aria-label="Video content"
          />
        ) : (
          <div style={emptyStyles}>
            <p>No encontramos un trailer disponible para esta película.</p>
          </div>
        )}
      </div>
    </div>
  );
}

const overlayStyles: CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(3,6,20,0.82)",
  backdropFilter: "blur(10px)",
  display: "grid",
  placeItems: "center",
  padding: "clamp(16px, 6vw, 48px)",
  zIndex: 1000,
  overflowY: "auto",
};

const containerStyles: CSSProperties = {
  position: "relative",
  width: "min(960px, 88vw)",
  maxHeight: "90vh",
  background: "rgba(15,23,42,0.94)",
  borderRadius: 18,
  boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
  padding: "28px",
  display: "flex",
  flexDirection: "column",
  gap: 18,
  alignItems: "center",
  margin: "auto",
};

const closeButton: CSSProperties = {
  position: "absolute",
  top: 16,
  right: 16,
  border: "none",
  background: "rgba(255,255,255,0.08)",
  color: "#fff",
  borderRadius: "50%",
  width: 36,
  height: 36,
  cursor: "pointer",
  fontSize: 18,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const videoStyles: CSSProperties = {
  width: "100%",
  height: "auto",
  maxHeight: "70vh",
  borderRadius: 16,
  backgroundColor: "#000",
};

const emptyStyles: CSSProperties = {
  width: "100%",
  minHeight: 240,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#e2e8f0",
  background: "rgba(15,23,42,0.65)",
  borderRadius: 16,
  border: "1px solid rgba(148,163,184,0.15)",
  textAlign: "center",
  padding: "32px",
};
