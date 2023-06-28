import React, { useEffect, useState } from 'react';
import '../css/global.css';
import '../css/notFound.css';

function NotFound() {
  const [starElements, setStarElements] = useState([]);

  useEffect(() => {
    const generateStarElements = () => {
      const stars = [];
      for (let i = 0; i < 20; i++) {
        stars.push(<div className="star" key={i}></div>);
      }
      setStarElements(stars);
    };

    generateStarElements();
  }, []);

  return (
    <>
      <div className="wrapper">
        <div className="text_group">
          <p className="text_404">404</p>
          <p className="text_lost">La página que buscabas <br/>se perdió en el espacio.</p>
        </div>
        <div className="window_group">
          <div className="window_404">
            <div className="stars">{starElements}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;