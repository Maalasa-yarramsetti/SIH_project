import React, { useEffect, useRef, useState } from "react";
import { Viewer } from "@photo-sphere-viewer/core";
import "@photo-sphere-viewer/core/index.css";
// import * as THREE from "three"; // Not used in this component
import "./Panorama360Modal.css";

const Panorama360Modal = ({ isOpen, onClose, image, monasteryName }) => {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen || !image) return;

    setIsLoading(true);
    setError(null);

    // Destroy previous instance
    if (viewerRef.current) {
      viewerRef.current.destroy();
      viewerRef.current = null;
    }

    try {
      console.log("Loading image:", image);
      
      // Check if image exists and is accessible
      const img = new Image();
      img.onload = () => {
        console.log("Image loaded successfully, initializing viewer");
        
        try {
          const viewer = new Viewer({
            container: containerRef.current,
            panorama: image,
            navbar: ["zoom", "autorotate", "fullscreen"],
            loadingImg: undefined,
            loadingTxt: "Loading 360° View...",
            size: {
              width: "100%",
              height: "100%"
            },
            sphereCorrection: {
              pan: 0,
              tilt: 0,
              roll: 0
            },
            fisheye: false,
            minFov: 30,
            maxFov: 90,
            defaultZoomLvl: 0,
            renderer: {
              antialias: true,
              alpha: false
            }
          });

          viewerRef.current = viewer;

          viewer.addEventListener('ready', () => {
            console.log("Panorama loaded successfully");
            viewer.animate({
              zoom: 0,
              speed: 1000
            });
            setIsLoading(false);
          });

          viewer.addEventListener('error', (e) => {
            console.error("Panorama loading error:", e);
            setError("This image is not a valid 360° panorama. Please use a panoramic image.");
            setIsLoading(false);
          });

        } catch (viewerError) {
          console.error("Error creating viewer:", viewerError);
          setError("Failed to initialize 360° viewer");
          setIsLoading(false);
        }
      };
      
      img.onerror = () => {
        console.error("Failed to load image:", image);
        setError("Failed to load image. Please check if the image exists.");
        setIsLoading(false);
      };
      
      img.src = image;

    } catch (error) {
      console.error("Error initializing panorama viewer:", error);
      setError("Failed to initialize 360° viewer");
      setIsLoading(false);
    }

    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, [isOpen, image]);

  if (!isOpen) return null;

  return (
    <div className="panorama-modal-overlay">
      <div className="panorama-modal-container">
        <button
          onClick={onClose}
          className="panorama-close-btn"
        >
          ✕
        </button>
        
        {error && (
          <div className="panorama-error">
            <p>{error}</p>
            <p style={{ fontSize: "14px", marginTop: "10px" }}>
              Image: {image}
            </p>
          </div>
        )}
        
        {isLoading && !error && (
          <div className="panorama-loading">
            <div
              style={{
                width: "40px",
                height: "40px",
                border: "3px solid rgba(255,255,255,0.3)",
                borderTop: "3px solid white",
                borderRadius: "50%",
                margin: "0 auto 20px",
              }}
              className="panorama-spinner"
            />
            <p>Loading 360° View...</p>
          </div>
        )}
        
        <div
          ref={containerRef}
          className="panorama-viewer-container"
        />
      </div>
    </div>
  );
};

export default Panorama360Modal;