import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Globe, MapPin } from "lucide-react";

const ItemDetails = () => {
  const [itemID, setItemID] = useState("");
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ingredientsData, setIngredientsData] = useState([]);
  const [ingredientsList, setIngredientsList] = useState([]);
  const [ingredients, setIngredients] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const id = query.get("id");
    if (id) {
      fetchItemDetails(id);
    }
  }, []);

  const fetchItemDetails = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/GetItemDetails?id=${id}`);
      if (response.ok) {
        const data = await response.json();
        setItem(data);
        console.log(data);
        
        // After fetching item details, fetch ingredients
        if (data.title && data.description) {
          await fetchIngredients(data.title, data.description);
        }
      } else {
        console.error("Item not found");
      }
    } catch (error) {
      console.error("Error fetching item:", error);
    }
    setLoading(false);
  };

  const fetchIngredients = async (title, description) => {
    try {
      const response = await fetch(`/api/GetIngredients?title=${title}&description=${description}`);
      if (response.ok) {
        const ingredientsData = await response.json();
        console.log(ingredientsData);
        if (typeof ingredientsData.ingredients === 'string') {
          const parsedIngredients = ingredientsData.ingredients
            .split(';')
            .map(ingredient => ingredient.trim())
            .filter(ingredient => ingredient !== ''); // Remove any empty strings
          
          console.log("Parsed ingredients:", parsedIngredients);
          setIngredients(parsedIngredients);
        setIngredients(ingredientsData.ingredients || []);
      } else {
        console.error("Ingredients not found");
      }
    } catch (error) {
      console.error("Error fetching ingredients:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push(`?id=${itemID}`);
  };

  return (
    <div className="min-h-screen bg-[#E5F9E0] flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg max-w-md w-full p-8">
        <h1 className="text-3xl font-bold text-center text-[#02254D] mb-6">
          Find Item Details
        </h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="itemID" className="block mb-2 font-medium text-[#02254D]">
              <Globe className="inline-block w-5 h-5 mr-2" />
              Item ID
            </label>
            <input
              id="itemID"
              type="text"
              required
              className="w-full p-3 border border-[#40C9A2] text-[#02254D] rounded-md focus:ring-[#40C9A2] focus:border-[#40C9A2]"
              placeholder="Enter Item ID"
              value={itemID}
              onChange={(e) => setItemID(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#40C9A2] text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-[#02254D] transition duration-300"
          >
            <Globe className="inline-block w-5 h-5 mr-2" />
            Search
          </button>
        </form>

        {loading && (
          <p className="text-center mt-6 text-[#02254D]">Loading...</p>
        )}
        {item && (
          <div className="mt-6">
            <h2 className="text-2xl font-bold text-center text-[#02254D] mb-4">
              {item.title}
            </h2>
            <p className="text-center text-[#02254D] mb-4">
              {item.description}
            </p>
            <ul className="space-y-2">
              {ingredients.map((ingredient, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center p-2 border border-[#40C9A2] rounded-md"
                >
                  <span className="text-[#02254D]">{ingredient}</span>
                  <button className="bg-[#40C9A2] text-white px-4 py-2 rounded-md text-sm hover:bg-[#02254D] transition duration-300">
                    Find Nearest Farm
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
}
export default ItemDetails;