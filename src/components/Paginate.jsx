import React from 'react';
import { Link } from 'react-router-dom';

const Paginate = ({ pages, page, isAdmin = false, keyword = '' }) => {
  return (
    pages > 1 && (
      <div className="flex justify-center mt-8">
        <nav className="inline-flex rounded-md shadow-sm p-4" aria-label="Pagination">
          {[...Array(pages).keys()].map((x) => (
            <Link
              key={x + 1}
              to={!isAdmin ? keyword ? `/search/${keyword}/page/${x+1}` : `/page/${x + 1}` : `/admin/productslist/${x + 1}`}
              className={`${
                x + 1 === page
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md mx-1 transition-all duration-300`}
            >
              {x + 1}
            </Link>
          ))}
        </nav>
      </div>
    )
  );
};

export default Paginate;
