"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Globe, MapPin } from "lucide-react";

const NewUser = () => {
  const [restaurantUrl, setRestaurantUrl] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("/api/NewUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ restaurantUrl, zipCode }),
      });
      if (response.ok) {
        router.push("/Dashboard");
      } else {
        console.error("Submission failed");
      }
    } catch (error) {
      console.error("Error in post request:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E5F9E0] flex items-center justify-center relative">
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#40C9A2] mx-auto"></div>
            <span className="block mt-4 text-xl text-[#40C9A2]">Loading...</span>
          </div>
        </div>
      )}
      <div className="bg-white shadow-lg rounded-lg max-w-md w-full p-8">
        <h1 className="text-3xl font-bold text-center text-[#02254D] mb-6">
          New Restaurant Information
        </h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="restaurantUrl"
              className="block mb-2 font-medium text-[#02254D]"
            >
              <Globe className="inline-block w-5 h-5 mr-2" />
              Restaurant URL
            </label>
            <input
              id="restaurantUrl"
              type="url"
              required
              className="w-full p-3 border border-[#40C9A2] text-[#02254D] rounded-md focus:ring-[#40C9A2] focus:border-[#40C9A2]"
              placeholder="https://yourrestaurant.com"
              value={restaurantUrl}
              onChange={(e) => setRestaurantUrl(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="zipCode"
              className="block mb-2 font-medium text-[#02254D]"
            >
              <MapPin className="inline-block w-5 h-5 mr-2" />
              ZIP Code
            </label>
            <input
              id="zipCode"
              type="text"
              required
              className="w-full p-3 border border-[#40C9A2] text-[#02254D] rounded-md focus:ring-[#40C9A2] focus:border-[#40C9A2]"
              placeholder="12345"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#40C9A2] text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-[#02254D] transition duration-300"
            disabled={isLoading}
          >
            <Globe className="inline-block w-5 h-5 mr-2" />
            {isLoading ? "Loading..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewUser;