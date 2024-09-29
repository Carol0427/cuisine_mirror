"use client";
import React, { useState, useEffect } from "react";

const ItemDetails = ({ params }) => {
  const [item, setItem] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [zipCode, setZipCode] = useState(null);
  const [farmerData, setFarmerData] = useState(null); // To store farmer data

  useEffect(() => {
    const fetchZipCode = async () => {
      try {
        const response = await fetch("/api/GetUser");
        if (response.ok) {
          const data = await response.json();
          if (data && typeof data.zipCode === "number") {
            setZipCode(data.zipCode); // Save zip code
            console.log("Zip code:", data.zipCode);
          } else {
            console.error("Invalid zip code format");
          }
        } else {
          console.error("Failed to fetch zip code");
        }
      } catch (error) {
        console.error("Error fetching zip code:", error);
      }
    };

    const fetchItemDetails = async () => {
      try {
        const itemID = params.id;
        console.log("Fetching item with ID:", itemID);
        const response = await fetch(`/api/GetItemDetails?id=${itemID}`);
        if (response.ok) {
          const data = await response.json();
          setItem(data);
          console.log("Item data:", data);

          if (data.title && data.description) {
            await fetchIngredients(data.title, data.description);
          }
        } else {
          console.error("Item not found");
        }
      } catch (error) {
        console.error("Error fetching item:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchIngredients = async (title, description) => {
      try {
        const response = await fetch(
          `/api/GetIngredients?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`
        );
        if (response.ok) {
          const ingredientsData = await response.json();
          console.log("Ingredients data:", ingredientsData);
          if (typeof ingredientsData.ingredients === "string") {
            const parsedIngredients = ingredientsData.ingredients
              .split(";")
              .map((ingredient) => ingredient.trim())
              .filter((ingredient) => ingredient !== "");
            console.log("Parsed ingredients:", parsedIngredients);
            setIngredients(parsedIngredients);
          } else {
            setIngredients(ingredientsData.ingredients || []);
          }
        } else {
          console.error("Ingredients not found");
        }
      } catch (error) {
        console.error("Error fetching ingredients:", error);
      }
    };

    fetchZipCode(); // Fetch zip code when component mounts
    fetchItemDetails();
  }, [params.itemID]);

  const findNearestFarm = async (ingredient) => {
    try {
      if (!zipCode) {
        console.error("Zip code is required to find nearest farm");
        return;
      }

      console.log("Finding farm for ingredient:", ingredient, "in zip code:", zipCode);
      const response = await fetch(`/api/FindFarmer?zipCode=${zipCode}&ingredient=${encodeURIComponent(ingredient)}`);
      if (response.ok) {
        const farmerData = await response.json();
        console.log("Farmer data:", farmerData);
        setFarmerData(farmerData.goodName); // Save farmer data
        console.log(farmerData);
      } else {
        console.error("Failed to find farmer");
      }
    } catch (error) {
      console.error("Error finding nearest farm:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#E5F9E0] flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg max-w-md w-full p-8">
        <h1 className="text-3xl font-bold text-center text-[#02254D] mb-6">
          Item Details
        </h1>

        {loading ? (
          <p className="text-center mt-6 text-[#02254D]">Loading...</p>
        ) : item ? (
          <div className="mt-6">
            <h2 className="text-2xl font-bold text-center text-[#02254D] mb-4">
              {item.title}
            </h2>
            <p className="text-center text-[#02254D] mb-4">
              {item.description}
            </p>
            <h3 className="text-xl font-semibold text-[#02254D] mb-3">
              Ingredients:
            </h3>
            <ul className="space-y-2">
              {ingredients.map((ingredient, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center p-2 border border-[#40C9A2] rounded-md"
                >
                  <span className="text-[#02254D]">{ingredient}</span>
                  <button
                    className="bg-[#40C9A2] text-white px-4 py-2 rounded-md text-sm hover:bg-[#02254D] transition duration-300"
                    onClick={() => findNearestFarm(ingredient)} // Call API on click
                  >
                    Find Nearest Farm
                  </button>
                </li>
              ))}
            </ul>

            {zipCode && (
              <div className="mt-4 text-center">
                <p>Your Zip Code: {zipCode}</p>
              </div>
            )}

          
              <div className="mt-4 text-center">
                <h3 className="text-xl font-semibold text-[#02254D] mb-3">
                  Nearest Farm for Ingredient:
                </h3>
                <p>{farmerData}</p>
              </div>
          </div>
        ) : (
          <p className="text-center mt-6 text-[#02254D]">
            No item details found. Please check the URL parameters.
          </p>
        )}
      </div>
    </div>
  );
};

export default ItemDetails;
