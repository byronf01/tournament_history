import React, { useEffect, useState } from 'react';
import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
  NavBtn,
  NavBtnLink,
} from './NavbarElements';
  
const Navbar = () => {

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const profile = () => {
    if (windowWidth < 600) {
      return null;
    } else {
      return <span style={{ padding: '4%' }}>My Profile</span>;
    }
  };

  return (
    <>
      <Nav style={{position: 'sticky', top: '0'}}>
        <Bars />
  
        <NavMenu>
          <NavLink to='/' activeStyle>
            Home
          </NavLink>
          <NavLink to='/tournaments' activeStyle>
            Tournaments
          </NavLink>
          <NavLink to='/matches' activeStyle>
            Matches
          </NavLink>
          <NavLink to='/stats' activeStyle>
            Stats
          </NavLink>
    
        </NavMenu>
        <NavBtn>
          <NavBtnLink to='https://osu.ppy.sh/users/16626263' target="_blank" rel="noreferrer" style={{
            paddingLeft: "0%", paddingRight: "0%", 
          }}>
            <div style={{display: "flex", alignItems: "center", justifyContent: "center", }}>
                <img className='navbar-pfp' src='https://a.ppy.sh/16626263?1677187336.png' />
                {profile()}
            </div>
          </NavBtnLink>
          
        </NavBtn>
      </Nav>
    </>
  );
};
  
export default Navbar;