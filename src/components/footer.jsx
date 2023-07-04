import React from 'react';
import {Box} from "@material-ui/core";
import '../css/footer.css';
import '../css/global.css';

const Footer = () => {
  return (
    <>
      <Box height={50} />
      <footer className='footer'>
          Desarrollado por Oficina de Sistemas y Tecnología
          <br />Secretaría de Informática
          <br />Cámara Nacional de Apelaciones en lo Civil
      </footer>
    </>
  );
};

export default Footer;
