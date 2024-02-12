import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Stage, Layer, Rect, Circle } from "react-konva";
import axios from "axios";
import Popup from "../../components/Popup";
import Matrix from "../../components/tool/Matrix";
import { toast } from 'sonner'
import './tool.css'


const showAlert = () => {
  toast.success('Progresso salvo com sucesso!')
};

function adjustPositionToInterval(x, interval) {
  const adjustedX = Math.floor(x / interval) * interval + 50;
  return adjustedX;
}

function adjustCircleXToInterval(x) {
  const interval = 71;
  const startX = 67;
  const adjustedX = Math.floor((x - startX) / interval) * interval + startX;
  return adjustedX;
}

const Tool = () => {

  let initialRedRectX1, initialRedRectX2, initialRedRectX3, initialRedRectX4, initialRedCircle;
  
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
          axios.get("http://localhost:3000/journeyPhase?method=getAllItems"),
          axios.get("http://localhost:3000/thought?method=getAllItems"),
          axios.get("http://localhost:3000/userAction?method=getAllItems"),
          axios.get("http://localhost:3000/contactPoint?method=getAllItems"),
          axios.get("http://localhost:3000/emotion?method=getAllItems"),
        ]);
  
        initialRedRectX1 = {
          id: "1",
          x: journeyData.data[0] ? Number(journeyData.data[0].posX) : 10,
          y: 11.5 * window.innerHeight / 100,
          isDragging: false,
          color: "gray",
          width: 230,
        };
  
        initialRedRectX2 = {
          id: "2",
          x: thoughtData.data[0] ? Number(thoughtData.data[0].posX) : 10,
          y: 34.5 * window.innerHeight / 100,
          isDragging: false,
          color: "gray",
          width: 160,
        };
  
        initialRedRectX3 = {
          id: "3",
          x: userActionData.data[0] ? Number(userActionData.data[0].posX) : 10,
          y: 80.5 * window.innerHeight / 100,
          isDragging: false,
          color: "gray",
          width: 160,
        };
  
        initialRedRectX4 = {
          id: "4",
          x: contactPointData.data[0] ? Number(contactPointData.data[0].posX) : 10,
          y: 103.5 * window.innerHeight / 100,
          isDragging: false,
          color: "gray",
          width: 160,
        };
  
        initialRedCircle = {
          id: "5",
          x: emotionData.data[0] ? Number(emotionData.data[0].posX) : 10,
          y: emotionData.data[0] ? Number(emotionData.data[0].lineY) : (67.5 * window.innerHeight / 100),
          isDragging: false,
          color: "gray",
          radius: 15,
        };
  
        setRects([initialRedRectX1, initialRedRectX2, initialRedRectX3, initialRedRectX4]);
        setCircle(initialRedCircle);
        setBalls(initialRedCircle);
      } catch (error) {
        console.error("Erro ao buscar os dados:", error);
      }
    };
  
    fetchData();
  }, []);
  
  const [rects, setRects] = React.useState([initialRedRectX1, initialRedRectX2, initialRedRectX3, initialRedRectX4]);
  const [circle, setCircle] = React.useState(initialRedCircle);
  

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
    const newY = Math.min(550, Math.max(432, e.target.y()));

    setCircle({
      ...circle,
      x: newX,
      y: newY,
    });
  };

  const handleDragEnd = (e) => {
    const id = e.target.id();
    const newX = e.target.x();

    // Use a função para ajustar a posição dos RedRects
    const adjustedX = adjustPositionToInterval(newX, 140);
    e.target.x(adjustedX);

    const updatedRects = rects.map((rect) => {
      if (rect.id === id) {
        return {
          ...rect,
          x: adjustedX,
        };
      }
      return rect;
    });

    setRects(updatedRects);
  };

  const handleSaveClick = () => {
    const dataToPut = {
      journeyPhaseData: { posX: rects[0].x, journeyPhase_id: 3 },
      thoughtData: { posX: rects[1].x, thought_id: 3 },
      userActionData: { posX: rects[2].x, userAction_id: 3 },
      contactPointData: { posX: rects[3].x, contactPoint_id: 21 },
      emotionData: { posX: circle.x, lineY: circle.y, emotion_id: 6 },
    };

    const putConfig = { method: "PUT" };

    axios
      .put("http://localhost:3000/journeyPhase?method=updateAllItems", dataToPut.journeyPhaseData, putConfig)
      .then(() => {
        return axios.put("http://localhost:3000/thought?method=updateAllItems", dataToPut.thoughtData, putConfig);
      })
      .then(() => {
        return axios.put("http://localhost:3000/userAction?method=updateAllItems", dataToPut.userActionData, putConfig);
      })
      .then(() => {
        return axios.put("http://localhost:3000/contactPoint?method=updateAllItems", dataToPut.contactPointData, putConfig);
      })
      .then(() => {
        return axios.put("http://localhost:3000/emotion?method=updateAllItems", dataToPut.emotionData, putConfig);
      })
      .then(() => {
        console.log("Dados salvos com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao salvar os dados:", error);
      });
  };
  
  const [buttonPopup, setButtonPopup] = useState(false);

  const handleTextSubmit = () => {
    // Salvar o texto editado quando o usuário confirmar
    const updatedMatrix = matrix.map((row) =>
      row.map((rect) =>
        rect.id === editedRectId ? { ...rect, text: editedText } : rect
      )
    );
    setMatrix(updatedMatrix);
    setEditedText("");
    setEditedRectId("");
  };

  const handleTextChange = (rowIndex, colIndex, newText) => {
    const newMatrix = [...matrix];
    const originalText = newMatrix[rowIndex][colIndex].text; // Guarda o texto original
  
    // Se o novo texto tiver mais de 30 caracteres, abrevie com reticências
    const abbreviatedText = newText.length > 30 ? newText.slice(0, 27) + '...' : newText;
  
    newMatrix[rowIndex][colIndex].text = abbreviatedText; // Atualiza o texto na matriz
    setMatrix(newMatrix); // Atualiza a matriz
  
    // Crie uma nova constante que guarde o valor do texto original
    const newTextOriginal = newText;
    setEditedText(newTextOriginal); // Atualize a constante do texto original
    setEditedRectId(newMatrix[rowIndex][colIndex].id); // Atualize o ID do retângulo editado
  };  

  const handleAddSquare = (rowIndex, colIndex) => {
    setMatrix((prevMatrix) => {
        const newMatrix = [...prevMatrix];

        // Verifica se a matriz na linha rowIndex está definida
        if (!newMatrix[rowIndex]) {
            newMatrix[rowIndex] = [];
        }

        // Determina a cor com base no comprimento da linha atual
        const color = newMatrix[rowIndex].length > 0 ? newMatrix[rowIndex][0].color : "#a3defe";

        if (colIndex !== undefined && colIndex < newMatrix[rowIndex].length) {
            // Adiciona um novo quadrado entre quadrados existentes
            const newX = newMatrix[rowIndex][colIndex].x + 260;

            // Empurra os quadrados seguintes para frente
            newMatrix[rowIndex].forEach((square, index) => {
                if (index > colIndex) {
                    square.x += 260;
                    square.id = `${rowIndex + 1}_${index + 2}`; // Atualiza a chave (key) do quadrado
                    console.log(`Quadrado ${square.id} foi empurrado para frente.`);
                }
            });

            newMatrix[rowIndex].splice(colIndex + 1, 0, {
                id: `${rowIndex + 1}_${colIndex + 2}`,
                x: newX,
                y: rowIndex * 170 + (rowIndex === 2 ? 116 : 61),
                width: 120,
                height: 85,
                color: color,
            });
        } else {
            // Adiciona um novo quadrado no final da linha
            const newSquareIndex = newMatrix[rowIndex].length + 1;
            const newX = newMatrix[rowIndex].length > 0 ? newMatrix[rowIndex][newMatrix[rowIndex].length - 1].x + 260 : 30;
            newMatrix[rowIndex].push({
                id: `${rowIndex + 1}_${newSquareIndex}`,
                x: newX,
                y: rowIndex * 170 + (rowIndex === 2 ? 116 : 61),
                width: 120,
                height: 85,
                color: color,
            });
        }

        return [...newMatrix];
    });
};


const [activeRect, setActiveRect] = useState(null);
const [balls, setBalls] = useState([]);
const [activePhase, setActivePhase] = useState(1);
const [editedText, setEditedText] = useState("");
const [editedRectId, setEditedRectId] = useState("");
const [matrix, setMatrix] = useState([
  [
    { id: "1", x: 30, y: 61, width: 230, height: 135, color: "#a3defe", text: "" },
  ],
  [
    { id: "2", x: 30, y: 231, width: 230, height: 135, color: "#a3defe", text: "" },
  ],
  [
    { id: "3", x: 30, y: 467, width: 230, height: 135, color: "#0000ff", text: "" },
  ],
  [
    { id: "4", x: 30, y: 571, width: 230, height: 135, color: "#a3defe", text: "" },
  ],
  [
    { id: "5", x: 30, y: 741, width: 230, height: 135, color: "#a3defe", text: "" },
  ],
]);

  const handleDeleteSquare = (rowIndex, colIndex) => {
    const newMatrix = [...matrix];
    newMatrix[rowIndex] = newMatrix[rowIndex].filter((_, index) => index !== colIndex);
    setMatrix(newMatrix);
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <div className="scenario" style={{ textAlign: "left", padding: "11px", fontSize: "30px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>Cenário 1 - X</span>
          <button className="button info" id="infoButton" style={{ marginRight: "3vh" }} onClick={() => { setButtonPopup(true); }}>
          i
          </button>
      </div>
      <div className="separator1" style={{ marginTop: "61.9px" }}></div>
      <Popup trigger={buttonPopup} setTrigger={setButtonPopup} style={{ borderRadius: "25px" }}>
        <div style={{ textAlign: "left", display: "flex", alignItems: "center" }}>
          <h1 style={{ fontSize: "50px" }}>Cenário</h1>
          <button className="button info" style={{ marginLeft: "1.5vh" }}>
            i
          </button>
        </div>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sit amet ex vel enim luctus molestie. Donec lacinia, magna id facilisis maximus, arcu ligula luctus nunc, vel facilisis justo lectus sit amet elit. Ut eu fringilla velit, congue luctus arcu. Cras tincidunt enim vitae facilisis vulputate. In eu tincidunt lorem, eget bibendum nunc. Quisque a aliquam turpis, eu elementum turpis. Vestibulum vitae posuere elit. Aenean venenatis condimentum faucibus. Mauris eleifend lorem finibus, efficitur nisi non, feugiat enim. Etiam interdum, augue ut commodo auctor, urna risus elementum sem, at vehicula nisi libero vel felis.</p>
        <div style={{ textAlign: "left", display: "flex", alignItems: "center" }}>
          <img src="https://github.com/luca-ferro/imagestest/blob/main/mascote.png?raw=true" style={{ width: "13%", textAlign: "right" }} alt="cu"></img>
        <button className="buttonconf" style={{ marginLeft: "5vh" }} onClick={() => setButtonPopup(false)}>OK</button>
        </div>
      </Popup>
      <div className="stage-container">
        <Stage width={window.innerWidth-160} height={window.innerHeight+180}>
          <Layer>
            <Matrix
              matrix={matrix}
              activeRect={activeRect}
              handleTextSubmit={handleTextSubmit}
              handleTextChange={handleTextChange}
              handleAddSquare={handleAddSquare}
              handleDeleteSquare={handleDeleteSquare}
              onDragMove={handleDragMove}
              onDragEnd={handleDragEnd}
            />
          </Layer>
        </Stage>
      </div>
      <div className="fases-container">
        <div className="fases-content">
          <div className="fases-text">Fases da Jornada</div>
        </div>
      </div>
      <div className="separator1"></div>
      <div className="fases-container">
        <div className="fases-content">
          <div className="fases-text">Ações do Usuário</div>
        </div>
      </div>
      <div className="separator1"></div>
      <div className="fases-container">
        <div className="fases-content">
          <div className="fases-text">Emoções</div>
        </div>
      </div>
      <div className="separator1"></div>
      <div className="fases-container">
        <div className="fases-content">
          <div className="fases-text">Pensamentos</div>
        </div>
      </div>
      <div className="separator1"></div>
      <div className="fases-container">
        <div className="fases-content">
          <div className="fases-text">Pontos de Contato</div>
        </div>
      </div>
      {/* <div style={{ textAlign: "center", padding: "10px", background: "#d3d3d3", fontFamily: "sans-serif", fontSize: "30px" }}>
        FasesX: {rects[0].x} | AçõesX: {rects[1].x} | EmoçõesX: {circle.x} | EmoçõesY: {circle.y} | PensamentosX: {rects[2].x} | PontosX: {rects[3].x}
      </div> */}
      {/*<div style={{ background: "repeating-linear-gradient(0deg,#d3d3d3,#d3d3d3 100px,white 100px,white 200px)" }} >*/}
      <div className="espaco"></div>
      <div className="footer">
        <button className="button save" id="saveButton" onClick={() => { showAlert(); }}>
          Salvar
        </button>
      </div>
    </div>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<Tool />);

export default Tool