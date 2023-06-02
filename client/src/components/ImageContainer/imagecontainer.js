import React from 'react';

const ImageContainer = ({ image, width, height }) => {
  const containerStyle = {
    width: `${width}`,
    height: `${height}`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const imageStyle = {
    objectFit: 'contain',
    maxWidth: '100%',
    maxHeight: '100%',
  };

  return (
    <div style={containerStyle}>
      <img src={image.url} alt={image.alt} style={imageStyle} />
    </div>
  );
};

export default ImageContainer;
