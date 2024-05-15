import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import ModalName from "../../components/ModalName";
import { LogOut, Trash } from 'lucide-react';
import { auth } from '../../services/firebase';
import { signOut } from 'firebase/auth';

import background from "../../assets/Background.png";

import "./MapCreation.css";

const MapCreation = () => {
  const [maps, setMaps] = useState([]);
  const [reloadMaps, setReloadMaps] = useState(false);
  const [newMapName, setNewMapName] = useState('');
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('user'));
  console.log(usuario);
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false); // Estado para controlar a exibição do modal de confirmação
  const [mapToDelete, setMapToDelete] = useState(null); // Estado para armazenar o ID do mapa a ser excluído

  useEffect(() => {
    const fetchUserMaps = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
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

  const truncateText = (text) => {
    const maxLength = 10;
    if (text.length > maxLength) {
      return text.substring(0, maxLength - 3) + '...';
    } else {
      return text;
    }
  };

  const handleDeleteButtonClick = (mapId) => {
    setMapToDelete(mapId);
    setConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    await handleDeleteMap(mapToDelete);
    setConfirmDelete(false);
  };

  const handleCancelDelete = () => {
    setConfirmDelete(false);
  };

  const handleDeleteMap = async (mapId) => {
    try {
      const deleteRequests = [
        axios.delete(`${import.meta.env.VITE_BACKEND}/emotion`, { data: { journeyMap_id: mapId } }),
        axios.delete(`${import.meta.env.VITE_BACKEND}/contactPoint`, { data: { journeyMap_id: mapId } }),
        axios.delete(`${import.meta.env.VITE_BACKEND}/userAction`, { data: { journeyMap_id: mapId } }),
        axios.delete(`${import.meta.env.VITE_BACKEND}/journeyPhase`, { data: { journeyMap_id: mapId } }),
        axios.delete(`${import.meta.env.VITE_BACKEND}/thought`, { data: { journeyMap_id: mapId } })
      ];
      await Promise.all(deleteRequests);
      await axios.delete(`${import.meta.env.VITE_BACKEND}/journeyMap/${mapId}`);
      setReloadMaps(prevState => !prevState);
    } catch (error) {
      console.error('Error deleting map:', error);
    }
  };

  return (
    <div className="map-creation-container" style={{ backgroundImage: `url(${background})`, height: "100vh", width: "100vw" }}>
      <div className="navbar" style={{ textAlign: "left", padding: "31px", fontSize: "30px", display: "flex", alignItems: "center" }}>
        <img src="https://github.com/luca-ferro/imagestest/blob/main/mascote.png?raw=true" style={{ width: "50px", marginRight: "20px" }} alt="mascote"></img>
        <div className="textoboas" style={{ flex: "1" }}>
          <h1 style={{ margin: "0", textAlign: "center" }}>Olá, seja bem vindo {usuario.displayName ? usuario.displayName : ""}!</h1>
        </div>
        <img src={usuario.photoURL || "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG.png"} alt="Profile" style={{ width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover", marginRight: "20px" }} />
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
          <div className="" style={{ margin: "0", textAlign: "center"}}>
            <button className="botaosavename" onClick={() => { handleCreateNewMap(); handlePickerClose(); }} disabled={!newMapName.trim()}>Criar Novo Mapa</button>
          </div>
        </ModalName>
      )}
      {maps.length > 0 ? (
        <div className="margem">
          <h1 className="mapasuser">Mapas do Usuário:</h1>
          <div className="pad">
            <div className="separar">
              {/* <div className="blocoadd" onClick={handleClickModal}>
                <h4 className="icon"><Plus size={200} /></h4>
                <div className="bloconovo">
                  <p>Novo mapa</p>
                </div>
              </div> */}
            </div>
            {maps.map((map, index) => (
              <div key={map.id}>
                <div className="separar">
                  <div className="bloco" style={{ backgroundColor: getColorAtIndex(index) }} onClick={() => handleSelectMap(map.id)} >
                    <h4 className="texto">{truncateText(map.name)}</h4>
                    {/* <div className="divbotoes">
                      <button className="lixeira" onClick={(e) => { e.stopPropagation(); handleDeleteButtonClick(map.id); }}> <Trash className='icontrash' size={40} /> </button>
                    </div> */}
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
            {/* <div className="blocoadd" onClick={handleClickModal}>
              <h4 className="icon"><Plus size={200} /></h4>
              <div className="bloconovo">
                <p>Novo mapa</p>
              </div>
            </div> */}
          </div>
        </div>
      )}
      {confirmDelete && (
        <ModalName trigger={confirmDelete} setTrigger={setConfirmDelete}>
          <div style={{ textAlign: "left", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <h1 style={{ fontSize: "40px", marginTop: "60px", marginBottom: "50px", justifyContent: "center" }}>Tem certeza que deseja excluir esse mapa?</h1>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button className="botaosavename" onClick={handleConfirmDelete}>Sim</button>
            <button className="botaocancelname" onClick={handleCancelDelete}>Não</button>
          </div>
        </ModalName>
      )}
    </div>
  );
};

export default MapCreation;