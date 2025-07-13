import React from 'react';

interface PriceRange {
  min: number;
  max: number;
}

interface FiltersProps {
  results: { [key: string]: any };
}

const GeneratedFilters: React.FC<FiltersProps> = ({ results }) => {
  return (
    <div className="mt-8 p-6 bg-gray-100 rounded-lg shadow-lg w-full max-w-lg text-left">
      <h3 className="text-lg font-bold text-gray-900">Generated Filters:</h3>
      <div className="mt-2 text-sm text-gray-700 space-y-2">
        {Object.entries(results).map(([key, value]) => {
          if (value !== null && value !== undefined && value !== "") {
            // Handle price_range as a specific object with min and max properties
            if (typeof value === "object" && value !== null && key === "price_range") {
              const priceRange = value as PriceRange; // Cast to a specific type
              return (
                <div key={key} className="flex justify-between">
                  <strong>PRICE RANGE:&nbsp;</strong>
                  ${priceRange.min} - ${priceRange.max}
                </div>
              );
            } else {
              return (
                <div key={key} className="flex justify-between">
                  <strong>{key.replace(/_/g, " ").toUpperCase()}:&nbsp;</strong>
                  {Array.isArray(value) ? value.join(", ") : String(value)}
                </div>
              );
            }
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default GeneratedFilters;
