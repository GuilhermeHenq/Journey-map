import React, { useState } from "react";
import { VscSave, VscSettingsGear } from 'react-icons/vsc';
import { BiSolidHelpCircle, BiSolidLogIn } from 'react-icons/bi';
import { GrDocumentConfig } from 'react-icons/gr';
import { IoIosAddCircle } from "react-icons/io";

const Navbar = ({ handleSaveClick, showMascote }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [selectedMap, setSelectedMap] = useState("Mapa 1");

    const handleMascoteClick = () => {
        console.log("Mascote clicado!");
    };

    const handleOptionClick = (option) => {
        console.log(`${option} clicado!`);
    };

    const handleMapChange = (event) => {
        setSelectedMap(event.target.value);
        // mudar o mapa
    };

    return (
        <nav className="navbar">
            <div className="logo" onClick={handleMascoteClick}>
                <img src={process.env.PUBLIC_URL + '/Mascote.svg'} alt="Mascote Logo" className="mascoteperso" />
            </div>
            <div className="options">
                <div className="dropdown-container">
                    <label htmlFor="mapDropdown">Mapa: </label>
                    <select id="mapDropdown" value={selectedMap} onChange={handleMapChange}>
                        <option value="Mapa 1">Mapa 1</option>
                        <option value="Mapa 2">Mapa 2</option>
                    </select>
                </div>
                <div className="botaosalvar">
                    <button className="arrumarbotao" id="" onClick={() => { handleSaveClick(); showMascote(); }}>
                        <VscSave className="icons2" />
                        <div className="textoarrumar">Salvar</div>
                    </button>
                </div>
                <button className="option-btn" onClick={() => handleOptionClick("Login")}>
                    <BiSolidLogIn className="icons" />
                </button>
                <button className="option-btn" onClick={() => handleOptionClick("Configurações")}>
                    <VscSettingsGear className="icons" />
                </button>
                <button className="option-btn" onClick={() => handleOptionClick("Ajuda")}>
                    <BiSolidHelpCircle className="icons" />
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
