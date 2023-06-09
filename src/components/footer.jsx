import React from 'react';
import {Box} from "@material-ui/core";
import '../css/footer.css';
import '../css/global.css';

const Footer = () => {
  return (
    <>
      <Box height={50} />
      <footer className='footer'>
        <p className="spanFooter">Desarrollado por a <span className='italic magicHover'> Oficina de Sistemas y Tecnología </span> </p>  
        <p className="spanFooter">Secretaría de Informática</p>  
        <p className="spanFooter">Cámara Nacional de Apelaciones en lo Civil</p>  
      </footer>
    </>
  );
};

export default Footer;
