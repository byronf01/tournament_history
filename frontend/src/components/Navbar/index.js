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
      <Nav>
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
            Teams
          </NavLink>
    
        </NavMenu>
        <NavBtn>
          <NavBtnLink to='https://osu.ppy.sh/users/16626263' style={{
            lineHeight: "0.3em"
          }}>
            <div style={{display: "flex", alignItems: "center"}}>
                <img src='https://a.ppy.sh/16626263?1677187336.png' style={{width: "15%", height: "auto", borderRadius: "50%"}} />
                <span style={{padding: "4%"}}>My Profile</span>
            </div>
          </NavBtnLink>
          
        </NavBtn>
      </Nav>
    </>
  );
};
  
export default Navbar;