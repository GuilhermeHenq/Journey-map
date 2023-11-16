import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Stage, Layer, Rect, Circle, Text } from "react-konva";
import axios from "axios";
import "./index.css";
import { VscSave, VscSettingsGear } from 'react-icons/vsc';
import { BiSolidHelpCircle, BiSolidLogIn } from 'react-icons/bi';
import { GrDocumentConfig } from 'react-icons/gr';

function adjustCircleXToInterval(x) {
  const interval = 71;
  const startX = 30;
  const adjustedX = Math.floor((x - startX) / interval) * interval + startX;
  return adjustedX;
}


const getPhaseNameById = (id) => {
  switch (id) {
    case "1":
      return "Fases da Jornada";
    case "2":
      return "Ações do Usuário";
    case "3":
      return "Pensamentos";
    case "4":
      return "Pontos de Contato";
    default:
      return "";
  }
};

const App = () => {
  const [rects, setRects] = useState([]);
  const [circle, setCircle] = useState({ x: 0, y: 0 });
  const [activePhase, setActivePhase] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          journeyData,
          thoughtData,
          userActionData,
          contactPointData,
          emotionData,
        ] = await Promise.all([
          axios.get("http://localhost:8080/index.php?controller=journeyPhase&method=getAllItems"),
          axios.get("http://localhost:8080/index.php?controller=thought&method=getAllItems"),
          axios.get("http://localhost:8080/index.php?controller=userAction&method=getAllItems"),
          axios.get("http://localhost:8080/index.php?controller=contactPoint&method=getAllItems"),
          axios.get("http://localhost:8080/index.php?controller=emotion&method=getAllItems"),
        ]);

        const initialRedRectX1 = {
          id: "1",
          x: journeyData.data[0] ? Number(journeyData.data[0].posX) : 10,
          y: 61,
          isDragging: false,
          color: "#ff0000",
          width: 120,
        };

        const initialRedRectX2 = {
          id: "2",
          x: thoughtData.data[0] ? Number(thoughtData.data[0].posX) : 10,
          y: 160,
          isDragging: false,
          color: "#00ff00",
          width: 120,
        };

        const initialRedRectX3 = {
          id: "3",
          x: userActionData.data[0] ? Number(userActionData.data[0].posX) : 10,
          y: 360,
          isDragging: false,
          color: "#ffff00",
          width: 120,
        };

        const initialRedRectX4 = {
          id: "4",
          x: contactPointData.data[0] ? Number(contactPointData.data[0].posX) : 10,
          y: 460,
          isDragging: false,
          color: "#ff00ff",
          width: 120,
        };

        const initialRedCircle = {
          id: "5",
          x: emotionData.data[0] ? Number(emotionData.data[0].posX) : 10,
          y: emotionData.data[0] ? Number(emotionData.data[0].lineY) : 231,
          isDragging: false,
          color: "#0000ff",
          radius: 15,
        };

        setRects([initialRedRectX1, initialRedRectX2, initialRedRectX3, initialRedRectX4]);
        setCircle(initialRedCircle);
      } catch (error) {
        console.error("Erro ao buscar os dados:", error);
      }
    };

    fetchData();
  }, []);

  const handleDragMove = (e) => {
    const id = e.target.id();
    const newX = e.target.x();

    const updatedRects = rects.map((rect) => {
      if (rect.id === id) {
        return {
          ...rect,
          x: newX,
        };
      }
      return rect;
    });

    setRects(updatedRects);
  };

  const handleCircleDragMove = (e) => {
    const newX = e.target.x();
    const newY = Math.min(330, Math.max(261, e.target.y()));

    setCircle({
      ...circle,
      x: newX,
      y: newY,
    });
  };

  const handleDragEnd = (e) => {
    const id = e.target.id();
    const newX = e.target.x();

    if (newX >= 0 && newX <= 140) {
      e.target.x(10);
    } else if (newX >= 141 && newX <= 280) {
      e.target.x(150);
    } else if (newX >= 281 && newX <= 420) {
      e.target.x(290);
    } else if (newX >= 421 && newX <= 540) {
      e.target.x(430);
    }

    const updatedRects = rects.map((rect) => {
      if (rect.id === id) {
        return {
          ...rect,
          x: e.target.x(),
        };
      }
      return rect;
    });

    setRects(updatedRects);
  };

  const showMascote = () => {
    const mascoteImageSrc = process.env.PUBLIC_URL + '/Mascote.svg';
  
    const mascoteImage = new Image();
    mascoteImage.src = mascoteImageSrc;

    mascoteImage.onload = () => {
  
      const speechBubble = document.createElement('div');
      speechBubble.className = 'speech-bubble';

      document.body.appendChild(mascoteImage);
      document.body.appendChild(speechBubble);
  
      const imageSize = 100; 
      const imageX = window.innerWidth - imageSize - 60;
      const imageY = window.innerHeight - imageSize - 50; 
      const speechBubbleX = imageX - imageSize - 10;
      const speechBubbleY = imageY - imageSize / 2 - speechBubble.offsetHeight / 2;
  
      mascoteImage.style.position = 'fixed';
      mascoteImage.style.width = `${imageSize*1.2}px`;
      mascoteImage.style.height = 'auto';
      mascoteImage.style.left = `${imageX}px`;
      mascoteImage.style.top = `${imageY}px`;
  

      speechBubble.style.position = 'fixed';
      speechBubble.style.left = `${speechBubbleX}px`;
      speechBubble.style.top = `${speechBubbleY}px`;
      speechBubble.style.background = '#4CAF50'; 
      speechBubble.style.color = 'white'; 
      speechBubble.style.padding = '15px'; 
      speechBubble.style.borderRadius = '10px'; 
  
      speechBubble.innerText = 'Salvo com sucesso!';
  

      setTimeout(() => {
        document.body.removeChild(mascoteImage);
        document.body.removeChild(speechBubble);
      }, 3000); 
    };
  };
  

  const handleSaveClick = () => {
    const dataToPut = {
      journeyPhaseData: { posX: rects[0].x , journeyPhase_id: 3},
      thoughtData: { posX: rects[1].x, thought_id: 3},
      userActionData: { posX: rects[2].x, userAction_id: 3 },
      contactPointData: { posX: rects[3].x, contactPoint_id: 21},
      emotionData: { posX: circle.x, lineY: circle.y, emotion_id: 6},
    };
  
    const putConfig = { method: "PUT" };
  
    axios
      .put("http://localhost:8080/index.php?controller=journeyPhase&method=updateAllItems", dataToPut.journeyPhaseData, putConfig)
      .then(() => {
        return axios.put("http://localhost:8080/index.php?controller=thought&method=updateAllItems", dataToPut.thoughtData, putConfig);
      })
      .then(() => {
        return axios.put("http://localhost:8080/index.php?controller=userAction&method=updateAllItems", dataToPut.userActionData, putConfig);
      })
      .then(() => {
        return axios.put("http://localhost:8080/index.php?controller=contactPoint&method=updateAllItems", dataToPut.contactPointData, putConfig);
      })
      .then(() => {
        return axios.put("http://localhost:8080/index.php?controller=emotion&method=updateAllItems", dataToPut.emotionData, putConfig);
      })
      .then(() => {
        console.log("Dados salvos com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao salvar os dados:", error);
      });
  };


  const Navbar = ({ setActivePhase }) => {
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
            <BiSolidLogIn className="icons"/>
          </button>
          <button className="option-btn" onClick={() => handleOptionClick("Configurações")}>
            <VscSettingsGear className="icons"/>
          </button>
          <button className="option-btn" onClick={() => handleOptionClick("Ajuda")}>
            <BiSolidHelpCircle className="icons"/>
          </button>
        </div>
      </nav>
    );
  };
  

  return (
    <div>
      <Navbar setActivePhase={setActivePhase} />

      <div className="map-container">
        <Stage width={window.innerWidth} height={window.innerHeight}>
          <Layer>
          {rects.map((rect) => (
              <React.Fragment key={rect.id}>
                <Text
                  text={getPhaseNameById(rect.id)} 
                  x={10}
                  y={rect.y + 42}
                  fontSize={20}
                  fill="#000"
                />  
                <Rect
                  key={rect.id}
                  id={rect.id}
                  x={rect.x}
                  y={rect.y}
                  width={rect.width}
                  height={85}
                  fill={rect.color}
                  opacity={1}
                  draggable={true}
                  onDragMove={handleDragMove}
                  onDragEnd={handleDragEnd}
                  dragBoundFunc={(pos) => ({
                    x: Math.min(1410, Math.max(0, pos.x)),
                    y: rect.y,
                  })}
                />
              </React.Fragment>
            ))} 
            <Text
              text={"Emoções"} 
              x={10}
              y={260 + 42}
              fontSize={20}
              fill="#000"
            /> 
            <Circle
              key={circle.id}
              id={circle.id}
              x={circle.x}
              y={circle.y}
              radius={circle.radius}
              fill={circle.color}
              opacity={1}
              draggable={true}
              onDragMove={handleCircleDragMove}
              dragBoundFunc={(pos) => ({
                x: adjustCircleXToInterval(pos.x),
                y: Math.min(350, Math.max(265, pos.y)),
              })}
            />
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

createRoot(document.getElementById("root")).render(<App />);
