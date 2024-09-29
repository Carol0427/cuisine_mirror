"use client";
import React, { useState, useEffect } from "react";

const ItemDetails = ({ params }) => {
  const [item, setItem] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [zipCode, setZipCode] = useState(null);
  const [farmerData, setFarmerData] = useState({});
  const [loadingFarmers, setLoadingFarmers] = useState({});

  useEffect(() => {
    const fetchZipCode = async () => {
      try {
        const response = await fetch("/api/GetUser");
        if (response.ok) {
          const data = await response.json();
          if (data && typeof data.zipCode === "number") {
            setZipCode(data.zipCode);
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
          `/api/GetIngredients?title=${encodeURIComponent(
            title
          )}&description=${encodeURIComponent(description)}`
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

    fetchZipCode();
    fetchItemDetails();
  }, [params.id]);

  const findNearestFarm = async (ingredient) => {
    try {
      if (!zipCode) {
        console.error("Zip code is required to find nearest farm");
        return;
      }

      setLoadingFarmers((prev) => ({ ...prev, [ingredient]: true }));

      console.log(
        "Finding farm for ingredient:",
        ingredient,
        "in zip code:",
        zipCode
      );
      const response = await fetch(
        `/api/FindFarmer?zipCode=${zipCode}&ingredient=${encodeURIComponent(
          ingredient
        )}`
      );
      if (response.ok) {
        const data = await response.json();
        console.log("Farmer data:", data);
        if (data.goodName) {
          setFarmerData((prevState) => ({
            ...prevState,
            [ingredient]: data.goodName,
          }));
        } else {
          console.error("Unexpected response format from FindFarmer API");
        }
      } else {
        console.error("Failed to find farmer");
      }
    } catch (error) {
      console.error("Error finding nearest farm:", error);
    } finally {
      setLoadingFarmers((prev) => ({ ...prev, [ingredient]: false }));
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
                  {farmerData[ingredient] ? (
                    <span className="text-[#40C9A2] font-semibold">
                      {farmerData[ingredient]}
                    </span>
                  ) : loadingFarmers[ingredient] ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#40C9A2]"></div>
                      <span className="ml-2 text-[#40C9A2]">Loading...</span>
                    </div>
                  ) : (
                    <button
                      className="bg-[#40C9A2] text-white px-4 py-2 rounded-md text-sm hover:bg-[#02254D] transition duration-300"
                      onClick={() => findNearestFarm(ingredient)}
                    >
                      Find Nearest Farm
                    </button>
                  )}
                </li>
              ))}
            </ul>

            {zipCode && (
              <div className="mt-4 text-center">
                <p>Your Zip Code: {zipCode}</p>
              </div>
            )}
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
