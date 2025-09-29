import React, { useEffect, useRef } from "react";
import { Viewer } from "@photo-sphere-viewer/core";
import "@photo-sphere-viewer/core/index.css";
import * as THREE from "three";

const PhotoSphereModal = ({ isOpen, onClose, image }) => {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !image) return;

    // Destroy previous instance if exists
    if (viewerRef.current) {
      viewerRef.current.destroy();
      viewerRef.current = null;
    }

    // Create new viewer
    const viewer = new Viewer({
      container: containerRef.current,
      panorama: image,
      navbar: ["zoom", "autorotate", "fullscreen"],
    });

    viewerRef.current = viewer;

    return () => {
      viewer.destroy();
    };
  }, [isOpen, image]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.95)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        backdropFilter: "blur(5px)",
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          background: "rgba(255, 255, 255, 0.9)",
          border: "none",
          padding: "8px 12px",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "16px",
          zIndex: 10000,
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.target.style.background = "rgba(255, 255, 255, 1)";
          e.target.style.transform = "scale(1.1)";
        }}
        onMouseLeave={(e) => {
          e.target.style.background = "rgba(255, 255, 255, 0.9)";
          e.target.style.transform = "scale(1)";
        }}
      >
        ✕
      </button>
      <div
        ref={containerRef}
        style={{ 
          width: "95%", 
          height: "95%", 
          background: "#000",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)"
        }}
      />
    </div>
  );
};

export default PhotoSphereModal;