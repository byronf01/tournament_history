import React from 'react';
import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
  NavBtn,
  NavBtnLink,
} from './NavbarElements';
  
const Navbar = () => {
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
            paddingLeft: "0%", paddingRight: "0%"
          }}>
            <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                <img src='https://a.ppy.sh/16626263?1677187336.png' style={{
                    width: "15%", height: "auto", borderRadius: "50%"
                    }} />
                <span style={{padding: "4%"}}>My Profile</span>
            </div>
          </NavBtnLink>
          
        </NavBtn>
      </Nav>
    </>
  );
};
  
export default Navbar;