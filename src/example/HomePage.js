// HomePage.js
import React from 'react';
import products from './Product'; // Importing the array from Product.js
import ProductComponent from './ProductComponent'; // Importing the new product component

const HomePage = () => {
  return (
    <div>
      <h1>Homepage</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <ProductComponent product={product} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
