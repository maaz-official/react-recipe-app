// ProductComponent.js
import React from 'react';
import { Link } from 'react-router-dom';

const ProductComponent = ({ product }) => {
  return (
    <div>
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
      <Link to={`/product/${product.id}`}>View Product</Link>
    </div>
  );
};

export default ProductComponent;
