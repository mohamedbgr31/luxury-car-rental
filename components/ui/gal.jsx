"use client";
import { useEffect, useState, useRef } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

export default function GalleryModal({ isOpen, onClose, images, videos = [] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, slider] = useKeenSlider({
    loop: true,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
  });
  
  // Combine images and videos for the gallery
  const galleryItems = [...images, ...videos.map(video => ({ type: 'video', url: video }))];

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-xl max-w-5xl w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl text-gray-800 hover:text-red-500"
        >
          ✖
        </button>

        {/* Slider */}
        <div ref={sliderRef} className="keen-slider h-[550px] bg-black">
          {galleryItems.map((item, idx) => {
            const isVideo = item.type === 'video';
            const src = isVideo ? item.url : item;
            
            return (
              <div
                key={idx}
                className="keen-slider__slide flex items-center justify-center bg-black p-4"
              >
                {isVideo ? (
                  <video 
                    src={src}
                    className="max-h-full max-w-full"
                    controls
                    controlsList="nodownload"
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    src={src}
                    alt={`slide-${idx}`}
                    className="max-h-full max-w-full object-contain"
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Arrows */}
        <button
          onClick={() => slider.current?.prev()}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow hover:bg-gray-100"
        >
          ←
        </button>
        <button
          onClick={() => slider.current?.next()}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow hover:bg-gray-100"
        >
          →
        </button>

        {/* Dots */}
        <div className="flex justify-center mt-4 mb-6 gap-2">
          {galleryItems.map((item, idx) => {
            const isVideo = item.type === 'video';
            
            return (
              <button
                key={idx}
                onClick={() => slider.current?.moveToIdx(idx)}
                className={`w-3 h-3 rounded-full ${
                  currentSlide === idx ? "bg-yellow-500" : "bg-gray-300"
                } ${isVideo ? "ring-1 ring-white" : ""}`}
                title={isVideo ? "Video" : "Image"}
              ></button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

<GalleryModal 
                 isOpen={showGallery}
                 onClose={() => setShowGallery(false)}
                 images={car.images}
                />
