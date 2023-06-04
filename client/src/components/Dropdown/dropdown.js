import { useState, useRef } from 'react';
import arrowup from '../../assets/arrowup.png';
import arrowdown from '../../assets/arrowdown.png';
import './dropdown.css'

const Dropdown = ({showBanners, setShowBanners, banners}) => {
  const ulRef = useRef(null);
  const [ulHeight, setUlHeight] = useState(0);

  const toggleShowBanners = () => {
    setShowBanners(!showBanners);
    setUlHeight(showBanners ? 0 : ulRef.current.scrollHeight);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
      <h3 style={{ fontSize: '2.2vw', marginTop: '2vw', marginBottom: '1vw' }}>Banners</h3>
      <button
        style={{
          width: '5%',
          margin: 'auto',
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          cursor: 'pointer',
          color: '#FFFFFF',
          fontFamily: 'trebuchet ms',
          fontSize: '1.2vw',
        }}
        onClick={toggleShowBanners}
      >
        {showBanners ? (
          <div>
            <p>Close</p>
            <img src={arrowup} style={{ maxWidth: '1.2vw', maxHeight: '1.2vw' }} />
          </div>
        ) : (
          <div>
            <p>Expand</p>
            <img src={arrowdown} style={{ maxWidth: '1.2vw', maxHeight: '1.2vw' }} />
          </div>
        )}
      </button>
      <ul
        
        style={{
          paddingLeft: '0',
          height: `${ulHeight}px`,
          overflow: 'hidden',
          transition: 'height 0.6s ease-out',
        }}
        ref={ulRef}
      >
        {banners}
      </ul>
    </div>
  );
};

export default Dropdown;