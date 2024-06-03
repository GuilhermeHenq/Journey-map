import React, { useEffect, useState } from 'react';
import './IntroPopup.css'; 

const IntroPopup = ({ onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 15000); // fechar sozin

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="intro-popup">
      <div className="intro-popup-content">
        <div className="intro-popup-text">
          <p>Seja bem vindo(a) a JourneyEasyMap!</p>
          <p>Experimente criar ou acessar seus mapas de jornada de usuário.</p>
        </div>
        <img src="https://github.com/luca-ferro/imagestest/blob/main/mascote.png?raw=true" style={{ width: "80px", marginRight: "20px", marginLeft: "20px" }} alt="mascote" />
      </div>
      <button className="intro-popup-close" onClick={onClose}>X</button>
    </div>
  );
};

export default IntroPopup;
