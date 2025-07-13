import React, { useState } from 'react';

interface Product {
  image_src: string;
  title: string;
  price: string;
  review_count: string;
  review_rating: string;
  link: string;
}

interface ProductDisplayProps {
  products: Product[];
}

const ProductDisplay: React.FC<ProductDisplayProps> = ({ products }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  console.log('Products count:', products.length);
  console.log('Products:', products);

  // Helper function to format price
  const formatPrice = (price: string) => {
    if (!price) return 'Price not available';
    return `$${price}`;
  };

  // Helper function to format rating
  const formatRating = (rating: string) => {
    if (!rating) return '';
    return rating.replace('out of 5 stars', '').trim();
  };

  // Helper function to truncate title
  const truncateTitle = (title: string, maxLength: number = 60) => {
    if (!title) return 'No title available';
    return title.length > maxLength ? `${title.slice(0, maxLength)}...` : title;
  };

  return (
    <>
      {/* Product Display Section */}
      {products.length > 0 && (
        <div className="w-full max-w-7xl mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Found {products.length} Products
            </h2>
            <p className="text-gray-600">Discover amazing products tailored to your search</p>
          </div>

          {/* Products Grid */}
          <div className="grid gap-6 w-full" style={{ 
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
           
          }}>
            {products.map((product, index) => (
                              <div
                  key={index}
                  className={`group relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden w-full ${
                    hoveredIndex === index ? 'ring-2 ring-purple-500' : ''
                  }`}
                  style={{ border: '2px solid blue' }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                {/* Image Container */}
                <div className="relative overflow-hidden">
                  <img
                    src={product.image_src || '/placeholder-image.jpg'}
                    alt={product.title || 'Product'}
                    className="w-full h-64 object-cover transition-all duration-500 group-hover:scale-110"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                    }}
                  />
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Price Badge */}
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                    {formatPrice(product.price)}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Title */}
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors duration-300">
                    {truncateTitle(product.title)}
                  </h3>

                  {/* Rating and Reviews */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(parseFloat(formatRating(product.review_rating)) || 0)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {formatRating(product.review_rating)}
                      </span>
                    </div>
                    
                    {product.review_count && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {product.review_count} reviews
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <a
                      href={product.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-3 px-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      View Product
                    </a>
                    
                    <button
                      className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-all duration-300 transform hover:scale-105"
                      title="Add to favorites"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 border-2 border-transparent rounded-2xl group-hover:border-purple-500 transition-all duration-300 pointer-events-none"></div>
              </div>
            ))}
          </div>

          {/* Load More Button (if needed) */}
          {products.length >= 9 && (
            <div className="text-center mt-8">
              <button className="px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg">
                Load More Products
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ProductDisplay;
