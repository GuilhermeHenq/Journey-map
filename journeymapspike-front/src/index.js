import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Stage, Layer, Rect, Circle, Text, Group } from "react-konva";
import axios from "axios";
import "./index.css";
import ReactDOM from "react-dom";
import Matrix from './components/Matrix';
import NavBar from './components/NavBar';




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

const PhaseNames = ({ matrix }) => (
  <Group>
    {matrix && matrix.map((row, index) => (
      <Text
        key={index}
        text={getPhaseNameById(String(index + 1))}
        x={10}
        y={row[0].y + row[0].height / 2}
        fontSize={20}
        fill="#000"
        align="left"
        verticalAlign="middle"
        width={120}
        height={row[0].height}
        listening={false}
      />
    ))}
  </Group>
);

const Square = ({ id, x, y, width, height, color, text, onTextChange, onDeleteClick }) => (
  <Group>
    <Rect
      key={id}
      id={id}
      x={x}
      y={y}
      width={width}
      height={height}
      fill={color}
      opacity={1}
      draggable={false}
    />
    <Text
      text={text}
      x={x + width / 2}
      y={y + height / 2}
      fontSize={20}
      fill="#000"
      align="center"
      verticalAlign="middle"
      width={width}
      height={height}
      listening={false}
    />
    <Text
      text="X"
      x={x + width - 20}
      y={y + 9}
      fontSize={16}
      fill="black"
      borderRadius="5px"
      onClick={() => onDeleteClick(id)}
      listening={true}
      onTap={() => onDeleteClick(id)}
      style={{ cursor: 'pointer' }}
    />
  </Group>
);

const App = () => {
  const [activeRect, setActiveRect] = useState(null);
  const [rects, setRects] = useState([]);
  const [balls, setBalls] = useState([]);
  const [circle, setCircle] = useState({ x: 0, y: 0 });
  const [activePhase, setActivePhase] = useState(1);
  const [editedText, setEditedText] = useState("");
  const [editedRectId, setEditedRectId] = useState("");
  const [matrix, setMatrix] = useState([
    [
      { id: "1", x: 30, y: 61, width: 120, height: 85, color: "#ff0000" },
    ],
    [
      { id: "2", x: 30, y: 161, width: 120, height: 85, color: "#00ff00" },
    ],
    [
      { id: "3", x: 30, y: 300, width: 120, height: 85, color: "#0000ff" },
    ],
    [
      { id: "4", x: 30, y: 361, width: 120, height: 85, color: "#ffff00" },
    ],
    [
      { id: "5", x: 30, y: 461, width: 120, height: 85, color: "#ff00ff" },
    ],
  ]);

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


  const handleCircleDragMove = (e) => {
    const newY = Math.min(330, Math.max(261, e.target.y()));
    setCircle({
      ...circle,
      y: newY,
    });
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
            const newX = colIndex === 0 ? 30 : newMatrix[rowIndex][colIndex - 1].x + 150;
            newMatrix[rowIndex].splice(colIndex, 0, {
                id: `${rowIndex + 1}_${newMatrix[rowIndex].length + 1}`,
                x: newX,
                y: rowIndex * 100 + (rowIndex === 2 ? 100 : 61),
                width: 120,
                height: 85,
                color: color,
            });
        } else {
            // Adiciona um novo quadrado no final da linha
            const newX =
                newMatrix[rowIndex].length > 0 ? newMatrix[rowIndex][newMatrix[rowIndex].length - 1].x + 150 : 30;
            newMatrix[rowIndex].push({
                id: `${rowIndex + 1}_${newMatrix[rowIndex].length + 1}`,
                x: newX,
                y: rowIndex * 100 + (rowIndex === 2 ? 100 : 61),
                width: 120,
                height: 85,
                color: color,
            });
        }

        return newMatrix;
    });
};


  const handleDeleteSquare = (rowIndex, colIndex) => {
    const newMatrix = [...matrix];
    newMatrix[rowIndex] = newMatrix[rowIndex].filter((_, index) => index !== colIndex);
    setMatrix(newMatrix);
  };

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
        setBalls(initialRedCircle);
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
      mascoteImage.style.width = `${imageSize * 1.2}px`;
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
      journeyPhaseData: { posX: rects[0].x, journeyPhase_id: 3 },
      thoughtData: { posX: rects[1].x, thought_id: 3 },
      userActionData: { posX: rects[2].x, userAction_id: 3 },
      contactPointData: { posX: rects[3].x, contactPoint_id: 21 },
      emotionData: { posX: circle.x, lineY: circle.y, emotion_id: 6 },
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



  return (
    <div>
      <NavBar />
      <div className="map-container" style={{ display: 'flex' }}>
        <div style={{ width: '200px', paddingRight: '10px' }}>
        <PhaseNames/>
        </div>
        <Stage width={window.innerWidth - 210} height={window.innerHeight}>
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
    </div>
  );
};

createRoot(document.getElementById("root")).render(<App />);