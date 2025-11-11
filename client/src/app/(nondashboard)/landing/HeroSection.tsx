"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";

function HeroSection() {
  return (
    <div className="relative h-full">
      <Image
        src="/landing-splash.jpg"
        alt="Landing Splash"
        fill
        className="object-cover object-center"
        priority
      />
      <div className="relative h-full w-full">
        <div className="absolute inset-0 bg-black/50" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2 text-center px-4 sm:px-8"
        >
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 sm:mb-6">
              Start your journey to finding the perfect place to call home
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-6 sm:mb-8 px-2">
              Explore our wide range of rental properties tailored to fit your
              lifestyle, comfort, and unique needs — anywhere, anytime.
            </p>

            <div className="flex justify-center">
              <Input
                type="text"
                // value={searchQuery}
                // onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by city, neighborhood or address"
                className="w-full max-w-lg rounded-none rounded-l-xl border-none bg-white h-12"
              />
              <Button
                // onClick={handleLocationSearch}
                className="bg-secondary-500 text-white rounded-none rounded-r-xl border-none hover:bg-secondary-600 h-12"
              >
                Search
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default HeroSection;
