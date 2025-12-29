"use client";
import { useEffect, useState, useRef } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { X, ChevronLeft, ChevronRight, Maximize, ZoomIn, ZoomOut } from "lucide-react";

export default function GalleryModal({ isOpen, onClose, images, videos = [] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const modalRef = useRef(null);
  
  // Slider with zoom support
  const [sliderRef, slider] = useKeenSlider({
    loop: true,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
      // Reset zoom when changing slides
      setZoomLevel(1);
      setDragPosition({ x: 0, y: 0 });
    },
    dragStart() {
      // Only allow drag for slide change when not zoomed in
      return zoomLevel === 1;
    }
  });

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (zoomLevel > 1) {
          // First Escape press resets zoom
          setZoomLevel(1);
          setDragPosition({ x: 0, y: 0 });
        } else if (isFullscreen) {
          // Second Escape exits fullscreen
          exitFullscreen();
        } else {
          // Third Escape closes modal
          onClose();
        }
      } else if (e.key === "ArrowLeft") {
        slider.current?.prev();
      } else if (e.key === "ArrowRight") {
        slider.current?.next();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, slider, zoomLevel, isFullscreen]);

  // Fullscreen handling
  const enterFullscreen = () => {
    const element = modalRef.current;
    if (element) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
      setIsFullscreen(true);
    }
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
    setIsFullscreen(false);
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        document.fullscreenElement || 
        document.webkitFullscreenElement || 
        document.msFullscreenElement
      );
    };
    
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("msfullscreenchange", handleFullscreenChange);
    
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("msfullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Zoom and pan handling
  const handleZoomIn = () => {
    if (zoomLevel < 3) {
      setZoomLevel(prevZoom => prevZoom + 0.5);
    }
  };

  const handleZoomOut = () => {
    if (zoomLevel > 1) {
      setZoomLevel(prevZoom => Math.max(1, prevZoom - 0.5));
      if (zoomLevel <= 1.5) {
        setDragPosition({ x: 0, y: 0 });
      }
    }
  };

  const handleMouseDown = (e) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      e.preventDefault();
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoomLevel > 1) {
      setDragPosition(prev => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY
      }));
    }
  };

  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, []);

  // Combine images and videos for the gallery
  const galleryItems = [...images, ...videos.map(video => ({ type: 'video', url: video }))];
  
  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setZoomLevel(1);
      setDragPosition({ x: 0, y: 0 });
      setCurrentSlide(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black bg-opacity-90 backdrop-blur-md flex items-center justify-center"
      onClick={onClose}
    >
      <div 
        ref={modalRef}
        className="relative bg-gray-900 rounded-xl max-w-6xl w-full overflow-hidden shadow-2xl border border-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with controls */}
        <div className="flex justify-between items-center px-6 py-3 bg-black border-b border-gray-800">
          <h3 className="text-yellow-500 font-bold">
            {currentSlide + 1} / {galleryItems.length}
          </h3>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleZoomOut}
              disabled={zoomLevel <= 1}
              className={`text-white p-2 rounded-full hover:bg-gray-800 ${zoomLevel <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
              title="Zoom out"
            >
              <ZoomOut size={20} />
            </button>
            <button 
              onClick={handleZoomIn}
              disabled={zoomLevel >= 3}
              className={`text-white p-2 rounded-full hover:bg-gray-800 ${zoomLevel >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}
              title="Zoom in"
            >
              <ZoomIn size={20} />
            </button>
            <button 
              onClick={isFullscreen ? exitFullscreen : enterFullscreen}
              className="text-white p-2 rounded-full hover:bg-gray-800"
              title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              <Maximize size={20} />
            </button>
            <button 
              onClick={onClose}
              className="text-white p-2 rounded-full hover:bg-gray-800 transition-colors"
              title="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Slider */}
        <div
          ref={sliderRef}
          className="keen-slider h-[600px] bg-black"
          onMouseMove={handleMouseMove}
          style={{ cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
        >
          {galleryItems.map((item, idx) => {
            const isVideo = item.type === 'video';
            const src = isVideo ? item.url : item;
            
            return (
              <div 
                key={idx} 
                className="keen-slider__slide flex items-center justify-center bg-black p-4 relative"
                onMouseDown={isVideo ? undefined : handleMouseDown}
              >
                {isVideo ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <video 
                      src={src}
                      className="max-h-full max-w-full"
                      controls
                      controlsList="nodownload"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ) : (
                  <div 
                    className="relative overflow-hidden w-full h-full flex items-center justify-center"
                    style={{ 
                      cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in',
                      transition: isDragging ? 'none' : 'transform 0.2s ease-out'
                    }}
                    onClick={() => zoomLevel === 1 ? handleZoomIn() : setZoomLevel(1)}
                  >
                    <img 
                      src={src} 
                      alt={`slide-${idx}`} 
                      className="max-h-full max-w-full object-contain transition-transform"
                      style={{ 
                        transform: `scale(${zoomLevel}) translate(${dragPosition.x / zoomLevel}px, ${dragPosition.y / zoomLevel}px)`,
                        transition: isDragging ? 'none' : 'transform 0.2s ease-out'
                      }}
                      draggable="false"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Arrows */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            slider.current?.prev();
          }}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            slider.current?.next();
          }}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>

        {/* Dots/Thumbnails */}
        <div className="flex justify-center items-center py-4 px-6 bg-black">
          <div className="flex gap-2 overflow-x-auto py-2 scrollbar-hide max-w-full">
            {galleryItems.map((item, idx) => {
              const isVideo = item.type === 'video';
              const src = isVideo ? item.url : item;
              
              return (
                <button 
                  key={idx} 
                  onClick={() => slider.current?.moveToIdx(idx)}
                  className={`w-16 h-12 rounded border-2 flex-shrink-0 transition-all duration-300 ${
                    currentSlide === idx 
                      ? "border-yellow-500 scale-110" 
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  {isVideo ? (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center rounded">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                        <polygon points="23 7 16 12 23 17 23 7"/>
                        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                      </svg>
                    </div>
                  ) : (
                    <img 
                      src={src} 
                      alt={`thumbnail-${idx}`} 
                      className="w-full h-full object-cover rounded" 
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}