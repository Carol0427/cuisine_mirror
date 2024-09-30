import React from 'react';
import { useItemDetails } from './hooks/useItemDetails';
import { useZipCode } from './hooks/useZipCode';
import { useFarmers } from './hooks/useFarmers';
import IngredientList from './components/IngredientList';
import LoadingSpinner from './components/LoadingSpinner';

const ItemDetails = ({ params }) => {
  const { item, ingredients, loading } = useItemDetails(params.id);
  const { zipCode } = useZipCode();
  const { farmers, findNearestFarm } = useFarmers(zipCode);

  if (loading) return <LoadingSpinner />;
  if (!item) return <NoItemFound />;

  return (
    <div className="min-h-screen bg-[#E5F9E0] flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg max-w-md w-full p-8">
        <h1 className="text-3xl font-bold text-center text-[#02254D] mb-6">Item Details</h1>
        <ItemContent item={item} />
        <IngredientList 
          ingredients={ingredients} 
          farmers={farmers} 
          onFindFarm={findNearestFarm}
        />
        {zipCode && <ZipCodeDisplay zipCode={zipCode} />}
      </div>
    </div>
  );
};

const ItemContent = ({ item }) => (
  <div className="mt-6">
    <h2 className="text-2xl font-bold text-center text-[#02254D] mb-4">{item.title}</h2>
    <p className="text-center text-[#02254D] mb-4">{item.description}</p>
  </div>
);

const NoItemFound = () => (
  <p className="text-center mt-6 text-[#02254D]">
    No item details found. Please check the URL parameters.
  </p>
);

const ZipCodeDisplay = ({ zipCode }) => (
  <div className="mt-4 text-center">
    <p>Your Zip Code: {zipCode}</p>
  </div>
);

export default ItemDetails;