import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

function Rating({ value, text }) {
  // Function to render stars based on the value
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (value >= i) {
        stars.push(<FaStar key={i} className="text-warning" />);  // Bootstrap `text-warning` for yellow color
      } else if (value >= i - 0.5) {
        stars.push(<FaStarHalfAlt key={i} className="text-warning" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-secondary" />); // Bootstrap `text-secondary` for grey color
      }
    }
    return stars;
  };

  return (
    <div className="d-flex align-items-center">
      {renderStars()}
      {text && <span className="ms-2">{text}</span>}
    </div>
  );
}

export default Rating;
