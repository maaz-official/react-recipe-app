// import React, { useState } from 'react';
// import './Product.scss';

// function ProductCard() {
//   const [selectedSize, setSelectedSize] = useState(null);
//   const [selectedColor, setSelectedColor] = useState(null);
//   const [isMorphed, setIsMorphed] = useState(false);
//   const [activeImage, setActiveImage] = useState(0); // Tracks active image
//   const [isZoomed, setIsZoomed] = useState(false); // For zoom effect

//   const images = [
//     "https://firebasestorage.googleapis.com/v0/b/fotos-3cba1.appspot.com/o/tenis%2Ffila%2Ft2.png?alt=media&token=f481e143-1e6f-43fd-8ba5-66bb593d8486",
//     "https://firebasestorage.googleapis.com/v0/b/fotos-3cba1.appspot.com/o/tenis%2Ffila%2Ft3.png?alt=media&token=b2352ce3-be90-411d-b112-cfc6453760a0",
//     "https://firebasestorage.googleapis.com/v0/b/fotos-3cba1.appspot.com/o/tenis%2Ffila%2Ft1.png?alt=media&token=9b161cad-8068-418e-a0d3-ee2e0975e6f4"
//   ];

//   const handleSelectSize = (size) => {
//     setSelectedSize(size);
//   };

//   const handleSelectColor = (color) => {
//     setSelectedColor(color);
//   };

//   const toggleMorph = () => {
//     setIsMorphed(!isMorphed);
//     document.body.classList.toggle('noScroll', !isMorphed);
//   };

//   const toggleZoom = () => {
//     setIsZoomed(!isZoomed); // Toggle zoom effect
//   };

//   const handleMoveControl = (direction) => {
//     let newIndex = direction === 'left' ? activeImage - 1 : activeImage + 1;
//     if (newIndex < 0) newIndex = images.length - 1;
//     if (newIndex >= images.length) newIndex = 0;
//     setActiveImage(newIndex);
//   };

//   return (
//     <section className={`productCard ${isMorphed ? 'morph' : ''}`}>
//       <div className="container">
//         <div className="info">
//           <h3 className="name">Fila Disruptor</h3>
//           <h1 className="slogan">Performance with comfort</h1>
//           <p className="price">$500.00</p>
//           <div className="attribs">
//             <div className="attrib size">
//               <p className="header">Select Size</p>
//               <div className="options">
//                 {[6, 7, 8, 9, 10, 11].map(size => (
//                   <div key={size} className={`option ${selectedSize === size ? 'activ' : ''}`} onClick={() => handleSelectSize(size)}>
//                     {size}
//                   </div>
//                 ))}
//               </div>
//             </div>
//             <div className="attrib color">
//               <p className="header">Select Color</p>
//               <div className="options">
//                 {['#60aec1', '#ef525e', '#000000'].map(color => (
//                   <div key={color} className={`option ${selectedColor === color ? 'activ' : ''}`} style={{ backgroundColor: color }} onClick={() => handleSelectColor(color)}></div>
//                 ))}
//               </div>
//             </div>
//           </div>
//           <div className="buttons">
//             <div className="button">Add to cart</div>
//             <div className="button colored">Buy now</div>
//           </div>
//         </div>
//         <div className="colorLayer"></div>
//         <div className={`preview ${isZoomed ? 'zoomed' : ''}`}>
//           <h1 className="brand">Fila</h1>
//           <div className="imgs">
//             <img
//               key={images[activeImage]}
//               className="activ"
//               src={images[activeImage]}
//               alt={`img ${activeImage + 1}`}
//               onClick={toggleZoom} // Toggle zoom on image click
//             />
//           </div>
//           <div className="zoomControl" onClick={toggleMorph}></div>
//           <div className="closePreview" onClick={toggleMorph}></div>
//           <div className="movControls">
//             <div className="movControl left" onClick={() => handleMoveControl('left')}></div>
//             <div className="movControl right" onClick={() => handleMoveControl('right')}></div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// export default ProductCard;
