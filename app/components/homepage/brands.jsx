"use client"
import { getApiUrl } from '@/lib/api-config';

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const API_URL = getApiUrl('/api');

const Brands = () => {
  // Default brands data for initial render
  const [brands, setBrands] = useState([
    {
      name: "Mercedes",
      logo: "/img/Mercedes-Logo.png",
      description: "The epitome of German engineering and luxury, Mercedes-Benz combines performance with sophisticated elegance.",
    },
    {
      name: "Ferrari",
      logo: "/img/ferrarilogo.png",
      description: "The prancing horse represents pure Italian passion, speed, and racing heritage in every curve and line.",
    },
    {
      name: "Lamborghini",
      logo: "/img/lambologo.png",
      description: "No automotive brand is as alluring as Lamborghini. Scissor doors, V10 and V12 engines, howling exhaust notes — their exotic models are the very definition of ostentatious.",
    },
    {
      name: "Cadillac",
      logo: "/img/cadillac.png",
      description: "American luxury redefined with bold design and cutting-edge technology for the modern driver.",
    },
    {
      name: "Bentley",
      logo: "/img/bentley.png",
      description: "British craftsmanship at its finest, where handcrafted luxury meets extraordinary performance.",
    },
  ]);

  const [selectedBrand, setSelectedBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Find the selected brand or default to Lamborghini (index 2)
  const selected = selectedBrand || brands[2];

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/brands`);
        if (!response.ok) {
          throw new Error(`Failed to fetch brands: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();

        // Only update brands if we got data from the server
        if (data && data.length > 0) {
          // Filter active brands
          const activeBrands = data.filter(brand => brand.isActive);
          if (activeBrands.length > 0) {
            setBrands(activeBrands);
            // Set Lamborghini or first brand as default
            const defaultBrand = activeBrands.find(b => b.name.toLowerCase() === 'lamborghini') || activeBrands[0];
            setSelectedBrand(defaultBrand);
          }
        }
      } catch (error) {
        console.error('Error fetching brands:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading brands...</p>
        </div>
      </div>
    );
  }

  if (error) {
    // On error, we'll still show the default brands
    console.log('Using default brands due to error:', error);
  }

  return (
    <div className="relative bg-black">
      <div className="absolute top-10 left-5 ml-10">
        <div className="">
          <h2 className="text-2xl font-bruno tracking-widest ml-10 text-white mb-2">
            POPULAR EXOTIC & LUXURY RENTAL MAKES
          </h2>
        </div>
        <p className="font-bruno text-[14px] text-gray-400 mb-8">
          The finest purveyors of supercars, sports cars, and limos
        </p>
      </div>

      <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center px-6 py-32">
        <div className="max-w-4xl w-full text-center py-14">
          <div className="grid grid-cols-5 gap-7 mb-8 items-center">
            {brands.map((brand) => (
              <motion.div
                key={brand._id || brand.name}
                whileTap={{ scale: 0.95 }}
                animate={{
                  scale: (selectedBrand?._id === brand._id ||
                    (!selectedBrand && brand.name === "Lamborghini")) ? 1.1 : 1
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                onClick={() => setSelectedBrand(brand)}
              >
                <Card
                  className={cn(
                    "flex items-center justify-center p-4 rounded-2xl cursor-pointer border transition-all",
                    (selectedBrand?._id === brand._id ||
                      (!selectedBrand && brand.name === "Lamborghini"))
                      ? "bg-zinc-900 border-yellow-400 scale-105 h-44"
                      : "bg-zinc-800 border-zinc-700 hover:border-yellow-300"
                  )}
                >
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="h-24 object-contain"
                  />
                </Card>
              </motion.div>
            ))}
          </div>

          {selected && (
            <motion.div
              key={selected._id || selected.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <img
                src={selected.logo}
                alt={selected.name}
                className="mx-auto h-24 mb-4"
              />
              <p className="text-gray-400 max-w-xl mx-auto mb-6">
                {selected.description}
              </p>

              <Button className="bg-yellow-400 text-black font-bold hover:bg-yellow-300 rounded-3xl">
                Rent a {selected.name}
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Brands;