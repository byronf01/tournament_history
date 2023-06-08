
import styled from 'styled-components';


export const Button = styled.div`
   position: fixed; 
   width: 100%;
   left: 85%;
   bottom: 40px;
   height: 20px;
   font-size: 3rem;
   z-index: 1;
   cursor: pointer;
   color: #8E9AAF;
   @media (min-width:600px) {
      left: 90%;
   }
   @media (min-width:900px) {
      left: 95%;
   }
`