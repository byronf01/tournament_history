import React from 'react';
import './imagecontainer.css';

const ImageContainer = ({ image }) => {
  return (
    <div className="container">
        <img src={image.url} alt={image.alt} className="image" /> 
    </div>
  );
};

export default ImageContainer;
