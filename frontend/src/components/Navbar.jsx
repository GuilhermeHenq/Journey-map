import React, { useState, useEffect } from 'react';
import { Github, LogOut } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ 
  onSaveClick, 
  onDownload, 
  onMap, 
  onInfoClick, 
  onScenarioClick, 
  onLogoutClick, 
  dataLoaded, 
  currentJourneyMap, 
  handlePostClick,
  scenarioName
}) => {
  const [nameTrue, setNameTrue] = useState(false);
  const [journeyMapName, setJourneyMapName] = useState("Clique aqui");
  const [editedName, setEditedName] = useState(journeyMapName);

  const usuario = JSON.parse(localStorage.getItem('user'));

  const handleInputBlur = () => {
    setNameTrue(false);
    if (editedName.trim() === "") { 
      setJourneyMapName("Vazio");
    } else {
      setJourneyMapName(editedName);
    }
  };

  const handleInputChange = (e) => {
    setEditedName(e.target.value);
  };

  return (
    <div className="scenario" style={{ textAlign: "left", padding: "31px", fontSize: "30px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <img src="https://github.com/luca-ferro/imagestest/blob/main/mascote.png?raw=true" style={{ width: "50px", textAlign: "left", marginRight: "20px" }} alt="Mascote"></img>
        <p>JEM</p>
      </div>
      {!dataLoaded ? (
        <button className="button-novo-mapa" onClick={handlePostClick}>
          <p>Novo Mapa de Jornada</p>
        </button>
      ) : (
        <>
          <span onClick={onScenarioClick}>Cenário - {scenarioName || "Nome do Cenário"}</span>
        </>
      )}
      <div className="botoes">
        <button className="button save" id="saveButton" onClick={onSaveClick}>
          Salvar
        </button>
        <button className="button info" id="infoButton" style={{ marginLeft: "3vh", marginRight: "3vh" }} onClick={onInfoClick}>
          i
        </button>
        <button className="button map" id="infoButton" style={{ marginLeft: "1vh", marginRight: "3vh" }} onClick={onMap}>
          Mapas
        </button>
        <button className="button logout" onClick={onLogoutClick}>
          <LogOut />
        </button>
        <img 
          src={usuario.providerData[0]?.photoURL || "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG.png"} 
          alt="Profile" 
          style={{ marginLeft: "20px", width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover", marginRight: "10px" }} 
        />
      </div>
    </div>
  );
};

export default Navbar;
