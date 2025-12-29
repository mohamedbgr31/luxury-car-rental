"use client"

import { useId, useEffect, useState } from "react"

import { useSliderWithInput } from "@/hooks/use-slider-with-input"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

export default function PriceSlider({ onFilterChange, initialRange = [200, 780], cars = [], hideRangeDisplay = false }) {
  const id = useId()
  const [isInitialMount, setIsInitialMount] = useState(true)
  const [selectedCount, setSelectedCount] = useState(0)

  // Dynamically generate items from cars prop
  const items = (cars && cars.length > 0)
    ? cars.map((car, idx) => ({ id: car._id || car.id || idx, price: Number(car.price || car.pricing?.daily || 0) }))
    : [];

  // Get unique prices for dynamic bars
  const uniquePrices = Array.from(new Set(items.map(item => item.price))).sort((a, b) => a - b);
  const minValue = 0;
  const maxValue = 10000;

  const {
    sliderValue,
    inputValues,
    validateAndUpdateValue,
    handleInputChange,
    handleSliderChange,
  } = useSliderWithInput({ minValue, maxValue, initialValue: [minValue, maxValue] })

  // Decorative histogram: always show 10 beautiful bars, not based on data
  const decorativeHeights = [60, 90, 40, 80, 55, 100, 70, 50, 85, 65]; // heights in px for design
  let histogramBars = null;
  histogramBars = (
    <div className="flex h-24 w-full items-end px-1 gap-1" aria-hidden="true">
      {decorativeHeights.map((height, i) => {
        // Calculate the price range for this bar
        const barMin = minValue + i * ((maxValue - minValue) / decorativeHeights.length);
        const barMax = minValue + (i + 1) * ((maxValue - minValue) / decorativeHeights.length);
        // Is this bar inside the selected slider range?
        const inRange = barMax > sliderValue[0] && barMin < sliderValue[1];
        return (
          <div key={i} className="flex-1 flex justify-center">
            <span
              className={
                `block w-4 rounded-t-xl border border-amber-300 shadow-lg transition-all duration-300 ` +
                (inRange
                  ? 'bg-gradient-to-t from-amber-500 to-yellow-300 opacity-100'
                  : 'bg-gradient-to-t from-gray-700 to-gray-400 opacity-40 grayscale')
              }
              style={{ height: `${height}px` }}
            ></span>
          </div>
        );
      })}
    </div>
  );

  // Format price with commas
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Update the selected count when slider values change
  useEffect(() => {
    setSelectedCount(items.filter((item) => item.price >= sliderValue[0] && item.price <= sliderValue[1]).length);
  }, [sliderValue]);

  // Notify parent component when slider value changes
  useEffect(() => {
    if (isInitialMount) {
      setIsInitialMount(false);
      return;
    }
    const handler = setTimeout(() => {
      if (onFilterChange) {
        onFilterChange(true, sliderValue);
      }
    }, 100);
    return () => {
      clearTimeout(handler);
    };
  }, [sliderValue, onFilterChange, isInitialMount]);

  const handleSliderValueChange = (values) => {
    handleSliderChange(values);
  };

  return (
    <div className="bg-black p-6 rounded-2xl shadow-2xl border border-amber-400/30">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Label className="text-amber-300 font-semibold text-lg">Price Range</Label>
          <span className="text-amber-200 text-sm">
            {selectedCount} items found
          </span>
        </div>
        
        {/* Histogram bars */}
        <div className="mt-2">
          {items.length === 0 ? (
            <div className="text-center text-amber-400 py-8">No data to display</div>
          ) : (
            histogramBars
          )}
          
          {/* Custom Slider Styling */}
          <div className="pt-4 pb-2 px-1">
            <Slider
              value={sliderValue}
              onValueChange={handleSliderValueChange}
              min={minValue}
              max={maxValue}
              step={1}
              aria-label="Price range"
              className="relative flex items-center select-none touch-none w-full h-10"
              // Use a class name for styles to avoid hydration issues
              data-slider="true"
            />
          </div>
        </div>
        
        {/* Inputs */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <div className="w-full space-y-2">
            <Label htmlFor={`${id}-min`} className="text-amber-300">Minimum</Label>
            <div className="relative">
              <Input
                id={`${id}-min`}
                className="peer w-full pl-8 pr-3 py-3 bg-gray-900 border-amber-500/50 rounded-xl text-white focus:border-amber-400 focus:ring focus:ring-amber-400/20 transition-all"
                type="text"
                inputMode="decimal"
                value={inputValues[0]}
                onChange={(e) => handleInputChange(e, 0)}
                onBlur={() => validateAndUpdateValue(inputValues[0], 0)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    validateAndUpdateValue(inputValues[0], 0)
                  }
                }}
                aria-label="Enter minimum price" />
              <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-amber-400 font-semibold text-sm">
                $
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-center py-2 px-4">
            <div className="w-8 h-px bg-amber-500/30"></div>
          </div>
          
          <div className="w-full space-y-2">
            <Label htmlFor={`${id}-max`} className="text-amber-300">Maximum</Label>
            <div className="relative">
              <Input
                id={`${id}-max`}
                className="peer w-full pl-8 pr-3 py-3 bg-gray-900 border-amber-500/50 rounded-xl text-white focus:border-amber-400 focus:ring focus:ring-amber-400/20 transition-all"
                type="text"
                inputMode="decimal"
                value={inputValues[1]}
                onChange={(e) => handleInputChange(e, 1)}
                onBlur={() => validateAndUpdateValue(inputValues[1], 1)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    validateAndUpdateValue(inputValues[1], 1)
                  }
                }}
                aria-label="Enter maximum price" />
              <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-amber-400 font-semibold text-sm">
                $
              </span>
            </div>
          </div>
        </div>
        
        {/* Price summary - conditionally rendered */}
        {!hideRangeDisplay && (
          <div className="bg-gray-900/70 rounded-lg p-3 border border-amber-500/20">
            <div className="flex justify-between items-center">
              <div className="text-gray-300 text-sm">Price range:</div>
              <div className="text-amber-300 font-medium">
                ${formatPrice(sliderValue[0])} — ${formatPrice(sliderValue[1])}
              </div>
            </div>
          </div>
        )}
        
        {/* Button */}
        <Button 
          onClick={() => onFilterChange && onFilterChange(true, sliderValue)}
          className="w-full py-5 bg-gradient-to-r from-amber-700 via-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-600 text-black font-semibold rounded-xl border border-amber-300/20 shadow-lg transition-all duration-300 hover:shadow-amber-500/20 hover:scale-[1.01]"
        >
          Show {selectedCount} Items
        </Button>
      </div>
    </div>
  );
}