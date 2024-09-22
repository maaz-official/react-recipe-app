import React from 'react';
import { Link } from 'react-router-dom';
import Meta from '../components/Meta'; // Import Meta component for SEO

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-900">
      {/* Meta Component for SEO */}
      <Meta 
        title="404 - Page Not Found" 
        description="Oops! The page you're looking for doesn't exist. Please navigate back to the home page."
        keywords="404, page not found, error, LazzyShop"
      />

      <div className="text-9xl font-bold">
        <span className="inline-block bg-blue-600 text-white rounded-full px-4 py-2 mx-1">4</span>
        <span className="inline-block bg-blue-600 text-white rounded-full px-4 py-2 mx-1">0</span>
        <span className="inline-block bg-blue-600 text-white rounded-full px-4 py-2 mx-1">4</span>
      </div>
      
      <div className="text-3xl mt-6">
        OH! <span className="inline-block bg-gray-700 text-white rounded-full px-3 py-1">Page not found</span>
      </div>

      <Link to="/" className="mt-6 text-blue-500 hover:text-blue-700">
        Go Home
      </Link>
    </div>
  );
}

export default NotFoundPage;
