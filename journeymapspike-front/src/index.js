import React from "react";
import { useState } from "react";
import { createRoot } from "react-dom/client";
import { Stage, Layer, Rect, Circle } from "react-konva";
import axios from "axios";
import Popup from "./Popup";
import Matrix from './components/Matrix';

const showAlert = () => {
  alert("Seu progresso foi salvo!");
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

const initialRedRectX1 = {
  id: "1",
  x: localStorage.getItem("redRectX1")
    ? Number(localStorage.getItem("redRectX1"))
    : 10,
  y: 11.5 * window.innerHeight / 100,
  isDragging: false,
  color: "#7acefa",
  width: 230,
};

const initialRedRectX2 = {
  id: "2",
  x: localStorage.getItem("redRectX2")
    ? Number(localStorage.getItem("redRectX2"))
    : 10,
  y: 34.5 * window.innerHeight / 100,
  isDragging: false,
  color: "#f7ef87",
  width: 160,
};

const initialRedRectX3 = {
  id: "3",
  x: localStorage.getItem("redRectX3")
    ? Number(localStorage.getItem("redRectX3"))
    : 10,
  y: 80.5 * window.innerHeight / 100,
  isDragging: false,
  color: "#b49cdc",
  width: 160,
};

const initialRedRectX4 = {
  id: "4",
  x: localStorage.getItem("redRectX4")
    ? Number(localStorage.getItem("redRectX4"))
    : 10,
  y: 103.5 * window.innerHeight / 100,
  isDragging: false,
  color: "#6a96d7",
  width: 160,
};

const initialRedCircle = {
  id: "5",
  x: localStorage.getItem("redCircleX")
    ? Number(localStorage.getItem("redCircleX"))
    : 10,
  y: localStorage.getItem("redCircleY")
    ? Number(localStorage.getItem("redCircleY"))
    : (67.5 * window.innerHeight / 100),
  isDragging: false,
  color: "#383c43",
  radius: 15,
};

const App = () => {
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
    localStorage.setItem("redRectX1", rects[0].x);
    localStorage.setItem("redRectX2", rects[1].x);
    localStorage.setItem("redRectX3", rects[2].x);
    localStorage.setItem("redRectX4", rects[3].x);
    localStorage.setItem("redCircleX", circle.x);
    localStorage.setItem("redCircleY", circle.y);

    axios
      .put("/api/redRectX1", { x: rects[0].x })
      .then(() => {
        return axios.put("/api/redRectX2", { x: rects[1].x });
      })
      .then(() => {
        return axios.put("/api/redRectX3", { x: rects[2].x });
      })
      .then(() => {
        return axios.put("/api/redRectX4", { x: rects[3].x });
      })
      .then(() => {
        return axios.put("/api/redCircle", { x: circle.x, y: circle.y });
      })
      .then(() => {
        console.log("Posições atualizadas com sucesso!");
        showAlert();
      })
      .catch((error) => {
        console.error("Erro ao atualizar posições:", error);
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
    newMatrix[rowIndex][colIndex].text = newText;
    setMatrix(newMatrix);
  };

const handleAddSquare = (rowIndex, colIndex) => {
    setMatrix((prevMatrix) => {
        const newMatrix = [...prevMatrix];

        // Verifica se a matriz na linha rowIndex está definida
        if (!newMatrix[rowIndex]) {
            newMatrix[rowIndex] = [];
        }

        const color = newMatrix[rowIndex].length > 0 ? matrix[rowIndex][0].color : "#000";

        // Se colIndex estiver definido, insere o quadrado na posição correta
        if (colIndex !== undefined && colIndex < newMatrix[rowIndex].length) {
            const newX = colIndex === 0 ? 30 : newMatrix[rowIndex][colIndex - 1].x + 260;
            newMatrix[rowIndex].splice(colIndex, 0, {
                id: `${rowIndex + 1}_${newMatrix[rowIndex].length + 1}`,
                x: newX,
                y: rowIndex * 177 + (rowIndex === 2 ? 116 : 61),
                width: 120,
                height: 85,
                color: color,
            });
        } else {
            // Adiciona um novo quadrado no final da linha
            const newX =
                newMatrix[rowIndex].length > 0 ? newMatrix[rowIndex][newMatrix[rowIndex].length - 1].x + 260 : 30;
            newMatrix[rowIndex].push({
                id: `${rowIndex + 1}_${newMatrix[rowIndex].length + 1}`,
                x: newX,
                y: rowIndex * 177 + (rowIndex === 2 ? 116 : 61),
                width: 120,
                height: 85,
                color: color,
            });
        }

        return newMatrix;
    });
};

const [activeRect, setActiveRect] = useState(null);
const [balls, setBalls] = useState([]);
const [activePhase, setActivePhase] = useState(1);
const [editedText, setEditedText] = useState("");
const [editedRectId, setEditedRectId] = useState("");
const [matrix, setMatrix] = useState([
  [
    { id: "1", x: 30, y: 61, width: 230, height: 135, color: "#ff0000", text: "" },
  ],
  [
    { id: "2", x: 30, y: 238, width: 230, height: 135, color: "#00ff00", text: "" },
  ],
  [
    { id: "3", x: 30, y: 470, width: 230, height: 135, color: "#0000ff", text: "" },
  ],
  [
    { id: "4", x: 30, y: 592, width: 230, height: 135, color: "#ffff00", text: "" },
  ],
  [
    { id: "5", x: 30, y: 769, width: 230, height: 135, color: "#ff00ff", text: "" },
  ],
]);

  const handleDeleteSquare = (rowIndex, colIndex) => {
    const newMatrix = [...matrix];
    newMatrix[rowIndex] = newMatrix[rowIndex].filter((_, index) => index !== colIndex);
    setMatrix(newMatrix);
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <div className="scenario" style={{ textAlign: "left", padding: "1.5vh", fontSize: "30px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>Cenário 1 - X</span>
          <button className="button info" id="infoButton" style={{ marginRight: "3vh" }} onClick={() => { setButtonPopup(true); }}>
          i
          </button>
      </div>
      <div className="separator1" style={{ marginTop: "7.5vh" }}></div>
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
        <Stage width={window.innerWidth} height={window.innerHeight+180}>
          <Layer>
            {/* {rects.map((rect) => (
              <Rect
                key={rect.id}
                id={rect.id}
                x={rect.x}
                y={rect.y}
                width={rect.width}
                height={18 * window.innerHeight / 100}
                fill={rect.color}
                opacity={1}
                draggable={false}
                cornerRadius={10}
                onDragMove={handleDragMove}
                onDragEnd={handleDragEnd}
                dragBoundFunc={(pos) => ({
                  x: Math.min(1410, Math.max(50, pos.x)),
                  y: rect.y,
                })}
              />
            ))}
            <Circle
              key={circle.id}
              id={circle.id}
              x={circle.x}
              y={circle.y}
              radius={circle.radius}
              fill={circle.color}
              opacity={1}
              draggable={false}
              onDragMove={handleCircleDragMove}
              dragBoundFunc={(pos) => ({
                x: adjustCircleXToInterval(pos.x), // Use a função para ajustar a posição do RedCircle
                y: Math.min(550, Math.max(432, pos.y)),
              })}
            />  */}
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
        <button className="button save" id="saveButton" onClick={() => { handleSaveClick(); showAlert(); }}>
          Salvar
        </button>
      </div>
    </div>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);