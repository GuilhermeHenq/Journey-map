import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import ModalName from "../../components/ModalName";
import { LogOut, Trash } from 'lucide-react';
import { auth } from '../../services/firebase';
import { signOut } from 'firebase/auth';

import "./MapCreation.css";

const MapCreation = () => {
  const [maps, setMaps] = useState([]);
  const [reloadMaps, setReloadMaps] = useState(false);
  const [newMapName, setNewMapName] = useState('');
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('user'));
  const [isPickerVisible, setPickerVisible] = useState(false);

  useEffect(() => {
    const fetchUserMaps = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      //console.log(user)
      if (user && user.uid) {
        try {
          const response = await axios.get(`${import.meta.env.VITE_BACKEND}/journeyMap?uid=${user.uid}`);
          const userMaps = response.data.userMaps;
          setMaps(userMaps);
        } catch (error) {
          console.error('Error fetching user maps:', error);
        }
      }
    };

    fetchUserMaps();
  }, [reloadMaps]);

  const handleCreateNewMap = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.uid && newMapName.trim() !== '') {
      try {
        await axios.post(`${import.meta.env.VITE_BACKEND}/journeyMap`, { uid: user.uid, name: newMapName });
        setReloadMaps(prevState => !prevState);
        setNewMapName('');
      } catch (error) {
        console.error('Error creating new map:', error);
      }
    }
  };

  const handleSelectMap = (selectedMapId) => {
    navigate(`/home/${selectedMapId}`);
  };

  const handlePickerClose = () => {
    setPickerVisible(false);
  };

  const handleClickModal = () => {
    setPickerVisible(true);
  }

  const handleMapNameChange = (event) => {
    setNewMapName(event.target.value);
  };

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }

  const getColorAtIndex = (index) => {
    const colors = ["#CDEAC0", "#EFE9AE", "#FEC3A6", "#FF928B", "#FFAC81"];
    return colors[index % colors.length];
  };

  return (
    <div className="">
      <div className="navbar" style={{ textAlign: "left", padding: "31px", fontSize: "30px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <img src="https://github.com/luca-ferro/imagestest/blob/main/mascote.png?raw=true" style={{ width: "50px", textAlign: "left" }} alt="mascote"></img>
        <div className="textoboas">
          <h1>Olá, seja bem vindo {usuario.displayName ? usuario.displayName : ""}!</h1>
        </div>
        <button className="botaologout" onClick={handleLogout}>
          <LogOut />
        </button>
      </div>
      {isPickerVisible && (
        <ModalName trigger={isPickerVisible} setTrigger={setPickerVisible}>
          <div style={{ textAlign: "left", display: "flex", alignItems: "center" }}>
            <h1 style={{ fontSize: "50px", marginTop: "50px", marginBottom: "30px" }}>Criar Mapa</h1>
          </div>
          <input type="text" value={newMapName} onChange={handleMapNameChange} className="inputname" placeholder="Nome do novo mapa" />
          <button className="botaosavename" onClick={() => { handleCreateNewMap(); handlePickerClose(); }} disabled={!newMapName.trim()}>Criar Novo Mapa</button>
        </ModalName>


      )}
      {maps.length > 0 ? (
        <div className="margem">
          <h2 className="mapasuser">Mapas do Usuário:</h2>
          <div className="pad">
            <div className="separar">
              <div className="blocoadd" onClick={handleClickModal}>
                <h4 className="icon"><Plus size={200} /></h4>
                {/* <input type="text" value={newMapName} onChange={handleMapNameChange} placeholder="Nome do novo mapa" />
                  <button className="botaoadd" onClick={handleCreateNewMap} disabled={!newMapName.trim()}>Criar Novo Mapa</button> */}
                <div className="bloconovo">
                  <p>Novo mapa</p>
                </div>
              </div>
            </div>
            {maps.map((map, index) => (
              <div key={map.id}>
                <div className="separar">
                  <div className="bloco" style={{ backgroundColor: getColorAtIndex(index) }}>
                    <h4 className="texto">{map.name}</h4>
                    <div className="divbotoes">
                      <button className="lixeira" > <Trash size={40} /> </button>
                      <button className="botao" onClick={() => handleSelectMap(map.id)}>Acessar</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="margem2" >
          <p className="nenhum">Nenhum mapa encontrado.</p>
            <div className="separar">
              <div className="blocoadd" onClick={handleClickModal}>
                <h4 className="icon"><Plus size={200} /></h4>
                {/* <input type="text" value={newMapName} onChange={handleMapNameChange} placeholder="Nome do novo mapa" />
                  <button className="botaoadd" onClick={handleCreateNewMap} disabled={!newMapName.trim()}>Criar Novo Mapa</button> */}
                <div className="bloconovo">
                  <p>Novo mapa</p>
                </div>
              </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapCreation;
