import React, { useState } from "react";

type MovieCardProps = {
  id: string;
  title: string;
  year?: number;
  poster: string;
  videoUrl?: string;
  isFavorite?: boolean;
  onPlay?: (payload: any) => void;
  onToggleFavorite?: () => void;
  onOpenDetail?: () => void; // new: only image/title opens detail
};

export default function MovieCard({
  id,
  title,
  year,
  poster,
  videoUrl,
  isFavorite = false,
  onPlay,
  onToggleFavorite,
  onOpenDetail,
}: MovieCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        ...cardStyles.container,
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? "0 12px 24px rgba(0,0,0,0.3)" : "0 4px 12px rgba(0,0,0,0.2)",
        transition: "all 0.18s ease-in-out",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* image clickable only */}
      <div style={{ cursor: onOpenDetail ? "pointer" : "default" }} onClick={(e) => { e.stopPropagation(); onOpenDetail && onOpenDetail(); }}>
        <img src={poster} alt={title} style={cardStyles.poster} />
      </div>

      <div style={cardStyles.info}>
        <h3
          style={{ ...cardStyles.title, cursor: onOpenDetail ? "pointer" : "default" }}
          onClick={(e) => { e.stopPropagation(); onOpenDetail && onOpenDetail(); }}
        >
          {title}
        </h3>
        {year && <p style={cardStyles.year}>{year}</p>}
      </div>

      <div style={cardStyles.spacer} />

      <div style={cardStyles.buttons}>
        <button
          style={cardStyles.playButton}
          onClick={(e) => {
            e.stopPropagation();
            onPlay && onPlay({ id, videoUrl });
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1e40af")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
        >
          Reproducir
        </button>

        <button
          style={{
            ...cardStyles.favoriteButton,
            backgroundColor: isFavorite ? "#ef4444" : "#f97316",
          }}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite && onToggleFavorite();
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = isFavorite ? "#dc2626" : "#fb923c")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = isFavorite ? "#ef4444" : "#f97316")
          }
        >
          {isFavorite ? "Favorito" : "Agregar"}
        </button>
      </div>
    </div>
  );
}

const cardStyles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%", // important so grid alignItems: 'stretch' makes all same height
    backgroundColor: "#1e293b",
    borderRadius: 16,
    padding: 12,
    overflow: "hidden",
    cursor: "default",
  },
  poster: {
    width: "100%",
    height: 320,
    borderRadius: 12,
    objectFit: "cover",
    display: "block",
  },
  info: {
    marginTop: 12,
  },
  title: {
    margin: 0,
    fontSize: "1.05rem",
    color: "#f8fafc",
  },
  year: {
    margin: 0,
    fontSize: "0.9rem",
    color: "#94a3b8",
  },
  spacer: {
    flexGrow: 1,
  },
  buttons: {
    display: "flex",
    gap: 8,
  },
  playButton: {
    flex: 1,
    padding: "8px 12px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    backgroundColor: "#2563eb",
    color: "#fff",
    fontWeight: 600,
  },
  favoriteButton: {
    flex: 1,
    padding: "8px 12px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    color: "#fff",
    fontWeight: 600,
  },
};
