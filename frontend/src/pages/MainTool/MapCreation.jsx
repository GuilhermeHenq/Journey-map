import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Plus, X } from 'lucide-react';
import ModalName from "../../components/ModalName";
import { LogOut, Trash, Pencil, ChevronRight , ChevronLeft, ChevronsRight , ChevronsLeft } from 'lucide-react';
import { auth } from '../../services/firebase';
import { signOut } from 'firebase/auth';

import IntroPopup from "./IntroPopup"; // Import the new popup component

import fundomapas from "../../assets/Fundomapas.png";

import "./MapCreation.css";

const MapCreation = () => {
  const [maps, setMaps] = useState([]);
  const [reloadMaps, setReloadMaps] = useState(false);
  const [newMapName, setNewMapName] = useState('');
  const [newMapNameUpdate, setNewMapNameUpdate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('user'));
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [modalUpdate, setmodalUpdate] = useState(false);
  const [mapToDelete, setMapToDelete] = useState(null);
  const [mapToUpdate, setmapToUpdate] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [showIntroPopup, setShowIntroPopup] = useState(true); // State to manage the intro popup

  const mapsPerPage = 5; // Number of maps per page

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

  const handleSelectMap = async (selectedMapId) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.uid) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND}/journeyMap/${selectedMapId}/owner`);
        const owner = response.data;
        if (owner.uid === user.uid) {
          navigate(`/home/${selectedMapId}`);
        } else {
          alert("Você não tem permissão para acessar este mapa.");
        }
      } catch (error) {
        console.error('Error verifying map ownership:', error);
        alert("Erro ao verificar a propriedade do mapa.");
      }
    }
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

  const handleMapNameChangeUpdate = (event) => {
    setNewMapNameUpdate(event.target.value);
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

  const handleEditButtonClick = (mapId) => {
    setmapToUpdate(mapId);
    setmodalUpdate(true);
  };

  const handleConfirmUpdate = async () => {
    await handleUpdate(mapToUpdate);
    setmodalUpdate(false);
  };

  const handleUpdate = async () => {
    if (newMapNameUpdate.trim() !== '') {
      try {
        await axios.put(`${import.meta.env.VITE_BACKEND}/journeyMap`, { journeyMapId: mapToUpdate, newName: newMapNameUpdate });
        setReloadMaps(prevState => !prevState);
        setNewMapNameUpdate('');
      } catch (error) {
        console.error('Error att name map:', error);
      }
    }
  };

  const handleConfirmDelete = async () => {
    await handleDeleteMap(mapToDelete);
    setConfirmDelete(false);
  };

  const handleCancelDelete = () => {
    setConfirmDelete(false);
  };

  const handleClearInput = () => {
    setFilterText("");
    setCurrentPage(1); // Reset to page 1 when clearing the filter
  }

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

  const indexOfLastMap = currentPage * mapsPerPage;
  const indexOfFirstMap = indexOfLastMap - mapsPerPage;
  const filteredMaps = maps.filter(map => map.name.toLowerCase().includes(filterText.toLowerCase()));
  const currentMaps = filteredMaps.slice(indexOfFirstMap, indexOfLastMap);
  const totalPages = Math.ceil(filteredMaps.length / mapsPerPage);

  const handlePreviousPage = () => {
    setCurrentPage(prevPage => (prevPage > 1 ? prevPage - 1 : prevPage));
  };

  const handleNextPage = () => {
    setCurrentPage(prevPage => (prevPage < totalPages ? prevPage + 1 : prevPage));
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 when the filter text changes
  }, [filterText]);

  return (
    <div className="map-creation-container" style={{ backgroundImage: `url(${fundomapas})`, height: "100vh", width: "100vw" }}>
      <div className="navbar" style={{ textAlign: "left", padding: "31px", fontSize: "30px", display: "flex", alignItems: "center" }}>
        <img src="https://github.com/luca-ferro/imagestest/blob/main/mascote.png?raw=true" style={{ width: "50px", marginRight: "20px" }} alt="mascote"></img>
        <p>JEM</p>
        <div className="textoboas" style={{ flex: "1" }}>
          <h1 style={{ margin: "0", textAlign: "center" }}>Olá {usuario.displayName ? usuario.displayName : ""}, seja muito bem-vindo(a)!</h1>
        </div>
        <img src={usuario.providerData[0].photoURL || "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG.png"} alt="Profile" style={{ width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover", marginRight: "20px" }} />
        <button className="botaologout" onClick={handleLogout}>
          <LogOut />
        </button>
      </div>
      {showIntroPopup && <IntroPopup onClose={() => setShowIntroPopup(false)} />} 
      {isPickerVisible && (
        <ModalName trigger={isPickerVisible} setTrigger={setPickerVisible}>
          <div style={{ textAlign: "left", display: "flex", alignItems: "center" }}>
            <h1 style={{ fontSize: "50px", marginTop: "50px", marginBottom: "30px" }}>Criar Mapa de jornada</h1>
          </div>
          <input type="text" value={newMapName} onChange={handleMapNameChange} className="inputname" placeholder="Título do novo mapa" />
          <div className="" style={{ margin: "0", textAlign: "center" }}>
            <button className="botaosavename" onClick={() => { handleCreateNewMap(); handlePickerClose(); }} disabled={!newMapName.trim()}>Criar Novo Mapa</button>
          </div>
        </ModalName>
      )}
      {maps.length > 0 ? (
        <div className="margem">
          <div className="input-wrapper">
            <h1 className="mapasuser">Mapas de jornadas:</h1>
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Filtrar por nome..."
              className="input-filter"
            />
            <X className='x' onClick={handleClearInput} size={40} />
          </div>
          <div className="pad">
            <div className="separar">
              <div className="blocoadd" onClick={handleClickModal}>
                <h4 className="icon"><Plus size={200} /></h4>
                <div className="bloconovo">
                  <p>Novo mapa</p>
                </div>
              </div>
            </div>
            {currentMaps
              .map((map, index) => (
                <div key={map.id}>
                  <div className="separar">
                    <div className="bloco" style={{ backgroundColor: getColorAtIndex(index) }} onClick={() => handleSelectMap(map.id)} >
                      <h4 className="texto">{truncateText(map.name)}</h4>
                      <div className="divbotoes">
                        <button className="lixeira" onClick={(e) => { e.stopPropagation(); handleDeleteButtonClick(map.id); }}> <Trash className='icontrash' size={40} /> </button>
                        <button className="lixeira" onClick={(e) => { e.stopPropagation(); handleEditButtonClick(map.id); }}> <Pencil className='icontrash' size={40} /> </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <div className="pagination">
            <button className="buttonPage" onClick={handleFirstPage} disabled={currentPage === 1}> <ChevronsLeft/> </button>
            <button className="buttonPage" onClick={handlePreviousPage} disabled={currentPage === 1}><ChevronLeft/></button>
            <p className="pagePar" > Página {currentPage} de {totalPages} </p>
            <button className="buttonPage" onClick={handleNextPage} disabled={currentPage === totalPages}><ChevronRight/></button>
            <button className="buttonPage" onClick={handleLastPage} disabled={currentPage === totalPages}><ChevronsRight/></button>
          </div>
        </div>
      ) : (
        <div className="margem2" >
          <p className="nenhum">Nenhum mapa encontrado.</p>
          <div className="separar">
            <div className="blocoadd" onClick={handleClickModal}>
              <h4 className="icon"><Plus size={200} /></h4>
              <div className="bloconovo">
                <p>Novo mapa</p>
              </div>
            </div>
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
      {modalUpdate && (
        <ModalName trigger={modalUpdate} setTrigger={setmodalUpdate}>
          <div style={{ textAlign: "left", display: "flex", alignItems: "center" }}>
            <h1 style={{ fontSize: "50px", marginTop: "50px", marginBottom: "30px" }}>Atualizar título do mapa:</h1>
          </div>
          <input type="text" value={newMapNameUpdate} onChange={handleMapNameChangeUpdate} className="inputname" placeholder="Novo título do mapa" />
          <div className="" style={{ margin: "0", textAlign: "center" }}>
            <button className="botaosavename" onClick={() => { handleConfirmUpdate(); }} disabled={!newMapNameUpdate.trim()}>Salvar</button>
          </div>
        </ModalName>
      )}
    </div>
  );
};

export default MapCreation;
