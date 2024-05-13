import React, { useState } from 'react';
import { Github, LogOut } from 'lucide-react';
import './Navbar.css'

const Navbar = ({ onSaveClick, onDownload, onMap, onInfoClick, onScenarioClick, onLogoutClick, dataLoaded, currentJourneyMap, handlePostClick }) => {
  
  const [nameTrue, setNameTrue] = useState(false);
  const [journeyMapName, setJourneyMapName] = useState("Clique aqui")
  const [editedName, setEditedName] = useState(journeyMapName);

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
      <img src="https://github.com/luca-ferro/imagestest/blob/main/mascote.png?raw=true" style={{ width: "50px", textAlign: "left" }} alt="cu"></img>
      {!dataLoaded ? (
        <button className="button-novo-mapa" onClick={handlePostClick}>
          <p>New Journey Map</p>
        </button>

      ) : (
        <>
        <span onClick={onScenarioClick}>Cenário {currentJourneyMap} - {localStorage.getItem("sceneName")}<span></span></span>
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
      </div>
    </div>
  );
};

export default Navbar;
