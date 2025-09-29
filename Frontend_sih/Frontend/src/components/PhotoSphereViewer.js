import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Viewer } from "@photo-sphere-viewer/core";
import "@photo-sphere-viewer/core/index.css";
import PhotoSphereModal from "./PhotoSphereModal";

const PhotoSphereViewer = ({ image }) => {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !image) return;

    // Destroy old instance if re-rendered
    if (viewerRef.current) {
      viewerRef.current.destroy();
      viewerRef.current = null;
    }

    const viewer = new Viewer({
      container: containerRef.current,
      panorama: "https://tripxl.com/blog/wp-content/uploads/2024/08/Tashiding-Monastery-OG-Photo.jpg",
      navbar: ["zoom", "autorotate", "fullscreen"],
    });

    viewerRef.current = viewer;

    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, [image]);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "500px", background: "#000" }}
    />
  );
};
export default PhotoSphereViewer;