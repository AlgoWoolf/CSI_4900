import React, { useState } from 'react';
import "../css/Home.css"

function Home() {
  const images = [
    "https://crimestoppers.ab.ca/edmonton/wp-content/uploads/sites/3/2017/03/COS_RecRoom-2.jpg",
    "https://crimestoppers.ab.ca/edmonton/wp-content/uploads/sites/3/2017/03/COS_Bedroom.jpg",
    "https://crimestoppers.ab.ca/edmonton/wp-content/uploads/sites/3/2017/03/COS_Bathroom.jpg"
  ];

  return (
    <div className="image-container">
      {images.map((img, index) => (
        <div key={index} className="image-wrapper">
          <img src={img} alt={`Image ${index + 1}`} className="image" />
        </div>
      ))}
    </div>
  );
}

export default Home;


