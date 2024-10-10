"use client";
import { useState, useEffect } from "react";

const ItemDetails = ({ params }) => {
  const [ingredients, setIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState(""); // For adding new ingredient
  const [loading, setLoading] = useState(true);
  const [zipCode, setZipCode] = useState(null);
  const [farmerData, setFarmerData] = useState({});
  const [loadingFarmers, setLoadingFarmers] = useState({});
  const [itemID, setItemID] = useState("");
  const [itemTitle, setItemTitle] = useState("");
  const [itemDescription, setItemDescription] = useState("");

  // Fetch item details on mount
  useEffect(() => {
    setItemID(params.slug[0]);
    setItemTitle(decodeURIComponent(params.slug[1]));
    setItemDescription(decodeURIComponent(params.slug[2]));

    const fetchZipCode = async () => {
      try {
        const response = await fetch("/api/GetUser");
        if (response.ok) {
          const data = await response.json();
          if (data && typeof data.zipCode === "number") {
            setZipCode(data.zipCode);
          } else {
            console.error("Invalid zip code format");
          }
        } else {
          console.error("Failed to fetch zip code");
        }
      } catch (error) {
        console.error("Error fetching zip code:", error);
      }
      setLoading(false);
    };

    fetchZipCode();
  }, [params.slug]);

  // Fetch ingredients once itemID is set
  useEffect(() => {
    const fetchIngredients = async (itemID, title, description) => {
      if (!itemID || !title || !description) return;

      try {
        const response = await fetch(
          `/api/GetIngredients?itemid=${itemID}&title=${encodeURIComponent(
            title
          )}&description=${encodeURIComponent(description)}`
        );
        if (response.ok) {
          const ingredientsData = await response.json();
          setIngredients(ingredientsData.stuff);
        } else {
          console.error("Ingredients not found");
        }
      } catch (error) {
        console.error("Error fetching ingredients:", error);
      }
    };

    fetchIngredients(itemID, itemTitle, itemDescription);
  }, [itemID, itemTitle, itemDescription]);

  const findNearestFarm = async (ingredient) => {
    if (!zipCode) {
      console.error("Zip code is required to find nearest farm");
      return;
    }

    setLoadingFarmers((prev) => ({ ...prev, [ingredient]: true }));

    try {
      const response = await fetch(
        `/api/FindFarmer?zipCode=${zipCode}&ingredient=${encodeURIComponent(
          ingredient
        )}`
      );
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data.farmnlink)) {
          setFarmerData((prevState) => ({
            ...prevState,
            [ingredient]: [data.farmnlink[0], data.farmnlink[1]],
          }));
        } else if (typeof data.farmnlink === "string") {
          setFarmerData((prevState) => ({
            ...prevState,
            [ingredient]: [data.farmnlink, null],
          }));
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

  // Handle adding new ingredient
  const handleAddIngredient = async () => {
    if (!newIngredient.trim()) return; // Prevent empty ingredient submission

    try {
      const response = await fetch(`/api/AddIngredients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ingredients: newIngredient,
          itemid: itemID
        })
      });
      if (response.ok) {
        const updatedItem = await response.json();
      // Immediately update the ingredients in local state
      setIngredients((prev) => [...prev, newIngredient]); // Add new ingredient to local state
      setNewIngredient(""); // Reset the input field

      } else {
        console.error("Failed to add ingredient");
      }
    } catch (error) {
      console.error("Error adding ingredient:", error);
    }
  };

// Handle deleting an ingredient
const handleDeleteIngredient = async (ingredient) => {
  try {
    const response = await fetch(
      `/api/DeleteIngredient?ingredient=${encodeURIComponent(
        ingredient
      )}&itemid=${itemID}`,
      { method: "DELETE" }
    );
    if (response.ok) {
      setIngredients((prevIngredients) =>
        prevIngredients.filter((ing) => ing !== ingredient)
      ); // Remove ingredient from local state
    } else {
      console.error("Failed to delete ingredient");
    }
  } catch (error) {
    console.error("Error deleting ingredient:", error);
  }
};

  return (
    <div className="min-h-screen flex bg-[#E5F9E0] px-4 py-6 md:px-8 md:py-12 items-center">
  <div className="bg-white shadow-lg rounded-lg max-w-md mx-auto w-full p-4 md:p-8 md:mt-0">
    <h1 className="text-2xl md:text-3xl font-bold text-center text-[#02254D] mb-4 md:mb-6">
      Item Detail
    </h1>
    
    {loading ? (
      <p className="text-center mt-4 md:mt-6 text-[#02254D]">Loading...</p>
    ) : itemID && itemTitle && itemDescription ? (
      <div className="mt-4 md:mt-6">
        <h2 className="text-xl md:text-2xl font-bold text-center text-[#02254D] mb-3 md:mb-4">
          {itemTitle}
        </h2>
        <p className="text-center text-sm md:text-base text-[#02254D] mb-3 md:mb-4">
          {itemDescription}
        </p>
        <h3 className="text-lg md:text-xl font-semibold text-[#02254D] mb-2 md:mb-3">
          Ingredients:
        </h3>
        
        <ul className="space-y-2">
          {ingredients.map((ingredient, index) => (
            <li
              key={index}
              className="flex items-center justify-between p-2 border border-[#40C9A2] rounded-md"
            >
              <div className="flex items-center">
                <button
                  className="bg-[#40C9A2] text-white px-3 py-1.5 rounded-md hover:bg-[#02254D] transition duration-300 text-sm"
                  onClick={() => handleDeleteIngredient(ingredient)}
                >
                  X
                </button>
                <span className="text-[#02254D] ml-2 text-sm md:text-base">
                  {ingredient}
                </span>
              </div>
              
              <div className="ml-2">
                {farmerData[ingredient] ? (
                  <a
                    href={farmerData[ingredient][1]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#40C9A2] font-semibold text-sm md:text-base"
                  >
                    <span>
                      {farmerData[ingredient][0]}
                    </span>
                  </a>
                ) : loadingFarmers[ingredient] ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#40C9A2]"></div>
                    <span className="ml-2 text-[#40C9A2] text-sm">Loading...</span>
                  </div>
                ) : (
                  <button
                    className="bg-[#40C9A2] text-white px-3 py-1.5 rounded-md text-sm hover:bg-[#02254D] transition duration-300 whitespace-nowrap"
                    onClick={() => findNearestFarm(ingredient)}
                  >
                    Find Nearest Farm
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex gap-2">
  <input
    type="text"
    value={newIngredient}
    onChange={(e) => setNewIngredient(e.target.value)}
    className="border border-[#40C9A2] rounded-md p-2 flex-1 min-w-0 text-sm md:text-base"
    placeholder="Add new ingredient"
  />
  <button
    className="bg-[#40C9A2] text-white px-4 py-2 rounded-md hover:bg-[#02254D] transition duration-300 flex-shrink-0"
    onClick={handleAddIngredient}
  >
    +
  </button>
</div>

        {zipCode && (
          <div className="mt-4 text-center">
            <p className="text-sm md:text-base">Your Zip Code: {zipCode}</p>
          </div>
        )}
      </div>
    ) : (
      <p className="text-center mt-4 md:mt-6 text-[#02254D] text-sm md:text-base">
        No item details found. Please check the URL parameters.
      </p>
    )}
  </div>
</div>
  );
};

export default ItemDetails;
