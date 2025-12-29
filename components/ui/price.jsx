"use client"

import { useId, useState, useEffect } from "react"
import { ChevronRight, DollarSign, Filter } from "lucide-react"

import { useSliderWithInput } from "@/hooks/use-slider-with-input"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

// Custom Badge component since @/components/ui/badge is not available
const Badge = ({ children, className = "", variant = "default", onClick }) => {
  const variantClasses = {
    default: "bg-black text-amber-400 hover:bg-black/90",
    secondary: "bg-gray-800 text-amber-400 hover:bg-gray-700",
    outline: "border border-amber-400 bg-black/50 text-amber-400 hover:bg-black hover:text-amber-300",
    gold: "bg-gradient-to-r from-amber-500 to-yellow-500 text-black hover:from-amber-600 hover:to-yellow-600"
  }
  
  return (
    <div 
      className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${variantClasses[variant] || ""} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

const items = [
  { id: 1, price: 80 },
  { id: 2, price: 95 },
  { id: 3, price: 110 },
  { id: 4, price: 125 },
  { id: 5, price: 130 },
  { id: 6, price: 140 },
  { id: 7, price: 145 },
  { id: 8, price: 150 },
  { id: 9, price: 155 },
  { id: 10, price: 165 },
  { id: 11, price: 175 },
  { id: 12, price: 185 },
  { id: 13, price: 195 },
  { id: 14, price: 205 },
  { id: 15, price: 215 },
  { id: 16, price: 225 },
  { id: 17, price: 235 },
  { id: 18, price: 245 },
  { id: 19, price: 255 },
  { id: 20, price: 260 },
  { id: 21, price: 265 },
  { id: 22, price: 270 },
  { id: 23, price: 275 },
  { id: 24, price: 280 },
  { id: 25, price: 285 },
  { id: 26, price: 290 },
  { id: 27, price: 290 },
  { id: 28, price: 295 },
  { id: 29, price: 295 },
  { id: 30, price: 295 },
  { id: 31, price: 298 },
  { id: 32, price: 299 },
  { id: 33, price: 300 },
  { id: 34, price: 305 },
  { id: 35, price: 310 },
  { id: 36, price: 315 },
  { id: 37, price: 320 },
  { id: 38, price: 325 },
  { id: 39, price: 330 },
  { id: 40, price: 335 },
  { id: 41, price: 340 },
  { id: 42, price: 345 },
  { id: 43, price: 350 },
  { id: 44, price: 355 },
  { id: 45, price: 360 },
  { id: 46, price: 365 },
  { id: 47, price: 365 },
  { id: 48, price: 375 },
  { id: 49, price: 380 },
  { id: 50, price: 385 },
  { id: 51, price: 390 },
  { id: 52, price: 395 },
  { id: 53, price: 400 },
  { id: 54, price: 405 },
  { id: 55, price: 410 },
  { id: 56, price: 415 },
  { id: 57, price: 420 },
  { id: 58, price: 425 },
  { id: 59, price: 430 },
  { id: 60, price: 435 },
  { id: 61, price: 440 },
  { id: 62, price: 445 },
  { id: 63, price: 450 },
  { id: 64, price: 455 },
  { id: 65, price: 460 },
  { id: 66, price: 465 },
  { id: 67, price: 470 },
  { id: 68, price: 475 },
  { id: 69, price: 480 },
  { id: 70, price: 485 },
  { id: 71, price: 490 },
  { id: 72, price: 495 },
  { id: 73, price: 495 },
  { id: 74, price: 498 },
  { id: 75, price: 499 },
  { id: 76, price: 500 },
  { id: 77, price: 500 },
  { id: 78, price: 500 },
  { id: 79, price: 515 },
  { id: 80, price: 530 },
  { id: 81, price: 545 },
  { id: 82, price: 560 },
  { id: 83, price: 575 },
  { id: 84, price: 590 },
  { id: 85, price: 605 },
  { id: 86, price: 620 },
  { id: 87, price: 635 },
  { id: 88, price: 650 },
  { id: 89, price: 655 },
  { id: 90, price: 660 },
  { id: 91, price: 665 },
  { id: 92, price: 670 },
  { id: 93, price: 675 },
  { id: 94, price: 680 },
  { id: 95, price: 685 },
  { id: 96, price: 690 },
  { id: 97, price: 695 },
  { id: 98, price: 700 },
  { id: 99, price: 700 },
  { id: 100, price: 700 },
  { id: 101, price: 700 },
  { id: 102, price: 700 },
  { id: 103, price: 700 },
  { id: 104, price: 725 },
  { id: 105, price: 750 },
  { id: 106, price: 775 },
  { id: 107, price: 800 },
  { id: 108, price: 815 },
  { id: 109, price: 830 },
  { id: 110, price: 845 },
  { id: 111, price: 845 },
  { id: 112, price: 845 },
  { id: 113, price: 870 },
  { id: 114, price: 875 },
  { id: 115, price: 880 },
  { id: 116, price: 885 },
  { id: 117, price: 890 },
  { id: 118, price: 895 },
  { id: 119, price: 898 },
  { id: 120, price: 900 },
]

export default function PremiumPriceSlider() {
  const id = useId()
  const [isAnimating, setIsAnimating] = useState(false)
  const [priceRanges, setPriceRanges] = useState([])
  const [showFilters, setShowFilters] = useState(false)

  // Define the number of ticks
  const tick_count = 50
  // Find the min and max values across all items
  const minValue = Math.min(...items.map((item) => item.price))
  const maxValue = Math.max(...items.map((item) => item.price))

  const {
    sliderValue,
    inputValues,
    validateAndUpdateValue,
    handleInputChange,
    handleSliderChange,
  } = useSliderWithInput({ minValue, maxValue, initialValue: [minValue, maxValue] })

  // Calculate the price step based on the min and max prices
  const priceStep = (maxValue - minValue) / tick_count

  // Calculate item counts for each price range
  const itemCounts = Array(tick_count)
    .fill(0)
    .map((_, tick) => {
      const rangeMin = minValue + tick * priceStep
      const rangeMax = minValue + (tick + 1) * priceStep
      return items.filter((item) => item.price >= rangeMin && item.price < rangeMax).length
    })

  // Find maximum count for scaling
  const maxCount = Math.max(...itemCounts)

  const handleSliderValueChange = (values) => {
    setIsAnimating(true)
    handleSliderChange(values)
    
    // Stop animation after 600ms
    setTimeout(() => {
      setIsAnimating(false)
    }, 600)
  }

  // Function to count items in the selected range
  const countItemsInRange = (min, max) => {
    return items.filter((item) => item.price >= min && item.price <= max).length
  }

  const isBarInSelectedRange = (index, minValue, priceStep, sliderValue) => {
    const rangeMin = minValue + index * priceStep
    const rangeMax = minValue + (index + 1) * priceStep
    return (
      countItemsInRange(sliderValue[0], sliderValue[1]) > 0 &&
      rangeMin <= sliderValue[1] &&
      rangeMax >= sliderValue[0]
    )
  }

  // Generate common price ranges
  useEffect(() => {
    const ranges = [
      { min: minValue, max: 200, label: "Budget" },
      { min: 201, max: 400, label: "Mid-range" },
      { min: 401, max: 700, label: "Premium" },
      { min: 701, max: maxValue, label: "Luxury" }
    ]
    setPriceRanges(ranges)
  }, [minValue, maxValue])

  // Format price with commas for thousands
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US').format(price)
  }

  return (
    <div className="bg-black rounded-2xl p-6 shadow-lg border border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-amber-400">Price Range</h3>
        <Badge 
          variant="outline" 
          className="cursor-pointer px-3 py-1"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4 mr-1" />
          Filters
        </Badge>
      </div>

      {showFilters && (
        <div className="grid grid-cols-2 gap-2 mb-6 sm:grid-cols-4">
          {priceRanges.map((range, idx) => (
            <Button
              key={idx}
              variant="outline"
              size="sm"
              className="bg-gray-900 hover:bg-gray-800 border-amber-500 text-amber-400 hover:text-amber-300 rounded-lg"
              onClick={() => handleSliderValueChange([range.min, range.max])}
            >
              {range.label}
            </Button>
          ))}
        </div>
      )}

      <div>
        {/* Histogram bars with gradient */}
        <div 
          className="flex h-16 w-full items-end mb-3 relative gap-x-[1px]"
          aria-hidden="true"
        >
          <div className="absolute -top-6 right-0 text-sm text-amber-400">
            {countItemsInRange(sliderValue[0], sliderValue[1])} items in range
          </div>
          {itemCounts.map((count, i) => (
            <div
              key={i}
              className={`flex flex-1 justify-center overflow-hidden transition-all duration-300 ease-out rounded-t ${isAnimating ? 'scale-y-105' : ''}`}
              style={{
                height: count === 0 ? '4px' : `${(count / maxCount) * 100}%`,
                margin: 0,
              }}
            >
              <div
                data-selected={isBarInSelectedRange(i, minValue, priceStep, sliderValue)}
                className={`size-full ${
                  isBarInSelectedRange(i, minValue, priceStep, sliderValue)
                    ? 'bg-gradient-to-b from-amber-400 to-amber-600'
                    : 'bg-gradient-to-b from-gray-700 to-gray-800'
                } transition-colors duration-300`}
              ></div>
            </div>
          ))}
        </div>

        {/* Slider with custom styling */}
        <div className="px-1 py-2">
          <Slider
            value={sliderValue}
            onValueChange={handleSliderValueChange}
            min={minValue}
            max={maxValue}
            step={1}
            className="cursor-pointer [&>span]:bg-amber-500 [&>span]:border-amber-500 [&>span]:hover:bg-amber-400"
            aria-label="Price range"
          />
        </div>
      </div>

      {/* Inputs with enhanced styling */}
      <div className="flex items-center justify-between gap-4 mt-8">
        <div className="w-full">
          <Label 
            htmlFor={`${id}-min`}
            className="text-sm font-medium text-amber-400 mb-1 block"
          >
            Minimum
          </Label>
          <div className="relative">
            <Input
              id={`${id}-min`}
              className="peer w-full rounded-lg bg-gray-900 border-amber-500 pl-8 pr-4 py-2 text-amber-400 shadow-md focus:border-amber-400 focus:ring focus:ring-amber-500 focus:ring-opacity-30"
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
              aria-label="Enter minimum price"
            />
            <DollarSign className="text-amber-500 pointer-events-none absolute top-1/2 transform -translate-y-1/2 left-2 h-4 w-4 peer-disabled:opacity-50" />
          </div>
        </div>

        <div className="flex items-center justify-center pt-6">
          <div className="w-4 h-0.5 bg-amber-700"></div>
        </div>

        <div className="w-full">
          <Label 
            htmlFor={`${id}-max`}
            className="text-sm font-medium text-amber-400 mb-1 block"
          >
            Maximum
          </Label>
          <div className="relative">
            <Input
              id={`${id}-max`}
              className="peer w-full rounded-lg bg-gray-900 border-amber-500 pl-8 pr-4 py-2 text-amber-400 shadow-md focus:border-amber-400 focus:ring focus:ring-amber-500 focus:ring-opacity-30"
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
              aria-label="Enter maximum price"
            />
            <DollarSign className="text-amber-500 pointer-events-none absolute top-1/2 transform -translate-y-1/2 left-2 h-4 w-4 peer-disabled:opacity-50" />
          </div>
        </div>
      </div>

      {/* Price range summary */}
      <div className="mt-6 bg-gray-900 p-4 rounded-lg border border-gray-800">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-400">Selected range</p>
            <p className="text-lg font-medium text-amber-400">
              ${formatPrice(sliderValue[0])} — ${formatPrice(sliderValue[1])}
            </p>
          </div>
          <Badge variant="gold" className="px-3 py-1">
            {countItemsInRange(sliderValue[0], sliderValue[1])} items
          </Badge>
        </div>
      </div>

      {/* Button with enhanced styling */}
      <Button 
        className="w-full mt-6 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black rounded-lg py-3 font-medium shadow-lg shadow-amber-900/20 transition-all duration-200 flex items-center justify-center gap-2"
      >
        Apply Filter
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}