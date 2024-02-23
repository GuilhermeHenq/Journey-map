import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Stage, Layer, Rect, Circle } from "react-konva";
import axios from "axios";
import Popup from "../../components/Popup";
import Matrix from "../../components/tool/Matrix";
import { toast } from 'sonner';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data'
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

const updateMatrixWithX = (matrix, id, newX, tipo) => {
  return matrix.map((row) =>
    row.map((rect) =>
      (rect[tipo + '_id'] !== undefined && rect[tipo + '_id'].toString() === id.toString())
        ? {
            ...rect,
            x: newX
            // Adicione as propriedades específicas aqui (se necessário)
          }
        : rect
    )
  );
};


const Tool = () => {

  const [matrix, setMatrix] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          journeyData,
          userActionData,
          emotionData,
          thoughtData,
          contactPointData,
        ] = await Promise.all([
          axios.get("http://localhost:3000/journeyPhase"),
          axios.get("http://localhost:3000/userAction"),
          axios.get("http://localhost:3000/emotion"),
          axios.get("http://localhost:3000/thought"),
          axios.get("http://localhost:3000/contactPoint"),
        ]);

        // Mapeie os dados da API para o formato desejado na matriz
        const journeyMatrix = journeyData.data.map(item => ({
          type: 'journeyPhase',
          journeyPhase_id: item.journeyMap_id.toString(),
          x: item.posX,
          y: 61,
          width: 230,
          height: 135,
          color: "#FFAC81",
          text: item.description,
        }));

        const userActionMatrix = userActionData.data.map(item => ({
          type: 'userAction',
          userAction_id: item.userAction_id.toString(),
          x: item.posX,
          y: 231,
          width: 230,
          height: 135,
          color: "#FF928B",
          text: item.description,
        }));

        const emotionMatrix = emotionData.data.map(item => ({
          type: 'emotion',
          emotion_id: item.emotion_id.toString(),
          x: item.posX,
          y: 467,
          lineY: item.lineY,
          width: 230,
          height: 135,
          color: "#FEC3A6",
          text: item.description,
        }));

        const thoughtMatrix = thoughtData.data.map(item => ({
          type: 'thought',
          thought_id: item.thought_id.toString(),
          x: item.posX,
          y: 571,
          width: 230,
          height: 135,
          color: "#EFE9AE",
          text: item.description,
        }));

        const contactPointMatrix = contactPointData.data.map(item => ({
          type: 'contactPoint',
          contactPoint_id: item.contactPoint_id.toString(),
          x: item.posX,
          y: 741,
          width: 230,
          height: 135,
          color: "#CDEAC0",
          text: item.description,
        }));

        const newMatrix = [journeyMatrix, userActionMatrix, emotionMatrix, thoughtMatrix, contactPointMatrix];
        console.log(newMatrix);
        setMatrix(newMatrix);
      } catch (error) {
        console.error("Erro ao buscar os dados:", error);
      }
    };

    fetchData();
  }, []);



  const handleDragMove = (id, newX) => {
    setMatrix((prevMatrix) =>
      prevMatrix.map((row) =>
        row.map((rect) =>
          rect.id === id ? { ...rect, x: newX } : rect
        )
      )
    );
    //setEditedRectId = JSON.stringify(id);
  };

  const handleCircleDragMove = (e) => {
    const newX = e.target.x();
    const newY = Math.min(550, Math.max(432, e.target.y()));

    setBalls([{ x: newX, y: newY }]);
  };

  const handleDragEnd = (e, id, tipo) => {
    const identificador = id;
    const newX = e.target.x();

  
    console.log("id:", id);
    console.log("newX:", newX);
    console.log("tipo:", tipo);
  
    // Use a função para ajustar a posição dos RedRects
    
  
    // Atualize diretamente a matriz com a nova posição posX
    setMatrix((prevMatrix) => {
      const updatedMatrix = updateMatrixWithX(prevMatrix, id, newX, tipo);
      return updatedMatrix;
    });
  };
  
  
  
  
  

  const handleSaveClick = () => {
    const putConfig = { method: "PUT" };
  
    // Mapeie os dados da matriz para os dados necessários para cada tipo de entidade
    const dataToPut = matrix.reduce((acc, row) => {
      row.forEach((rect) => {
        console.log("Saving data for rect:", rect);
  
        if (rect.contactPoint_id !== undefined) {
          acc.push({
            endpoint: "contactPoint",
            data: { contactPoint_id: rect.contactPoint_id, posX: rect.x, description: rect.text },
          });
        } else if (rect.userAction_id !== undefined) {
          acc.push({
            endpoint: "userAction",
            data: { userAction_id: rect.userAction_id, posX: rect.x, description: rect.text},
          });
        } else if (rect.emotion_id !== undefined) {
          acc.push({
            endpoint: "emotion",
            data: { emotion_id: rect.emotion_id, posX: rect.x, lineY: rect.lineY },
          });
        } else if (rect.thought_id !== undefined) {
          acc.push({
            endpoint: "thought",
            data: { thought_id: rect.thought_id, posX: rect.x, description: rect.text },
          });
        } else if (rect.journeyPhase_id !== undefined) {
          acc.push({
            endpoint: "journeyPhase",
        data: { journeyPhase_id: rect.journeyPhase_id, posX: rect.x, description: rect.text},
          });
        }
      });
      return acc;
    }, []);
  
    console.log("Data to put:", dataToPut);
  
    // Envie as solicitações para a API usando os dados mapeados
    const requests = dataToPut.map(({ endpoint, data }) => {
      const url = `http://localhost:3000/${endpoint}`;
      return axios.put(url, data, putConfig);
    });
  
    // Execute todas as solicitações
    Promise.all(requests)
      .then(() => {
        console.log("Dados salvos com sucesso!");
        showAlert();
      })
      .catch((error) => {
        console.error("Erro ao salvar os dados:", error);
      });
  };
  
  
  
  
  

  const [buttonPopup, setButtonPopup] = useState(false);
  const [editedRowIndex, setEditedRowIndex] = useState(61);

  const handleTextSubmit = () => {
    // Salvar o texto editado quando o usuário confirmar
    const updatedMatrix = matrix.map((row) =>
      row.map((rect) =>
        rect.id === editedRectId && rect.y === editedRowIndex
          ? { ...rect, text: editedText }
          : rect
      )
    );
    //console.log("rect.id:", rect.id);
    console.log("rectid:", editedRectId);
    console.log("editedRowIndex:", editedRowIndex),
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

const handleAddSquare = async (rowIndex, colIndex) => {
  try {
    const response = await axios.post(`http://localhost:/${matrix[rowIndex][0].type}`, {
      // Os dados para a criação do novo quadrado
      "journeyMap_id": 3,
      "linePos": 285,
      "posX": 125,
      "length": 0,
      "description": "Nova descrição",
      "emojiTag": "Novo emoji"
    });

    const newSquare = response.data;

    setMatrix((prevMatrix) => {
      const newMatrix = [...prevMatrix];

      // Verifica se a matriz na linha rowIndex está definida
      if (!newMatrix[rowIndex]) {
        newMatrix[rowIndex] = [];
      }

      // Determina a cor com base no comprimento da linha atual
      const color = newMatrix[rowIndex].length > 0 ? newMatrix[rowIndex][0].color : "#a3defe";

      if (colIndex !== undefined && colIndex < newMatrix[rowIndex].length) {
        // Verifica se existem outros quadrados com o mesmo colIndex
        const sameColSquares = newMatrix.flatMap(row => row.filter(square => square && square.x === newMatrix[rowIndex][colIndex].x));

        if (sameColSquares.length > 1) {
          // Se houver outros quadrados com o mesmo colIndex, empurra os quadrados subsequentes em todas as linhas para frente
          newMatrix.forEach((row, rIndex) => {
            row.forEach((square, cIndex) => {
              if (rIndex === rowIndex && cIndex > colIndex) {
                square.x += 260;
              }
            });
          });
        }

        // Combinação única de ID com o índice da linha
        const newSquareId = newSquare.id.toString();

        // Insere o novo quadrado na posição desejada
        newMatrix[rowIndex].splice(colIndex + 1, 0, {
          id: newSquareId,
          x: newMatrix[rowIndex][colIndex].x + 260,
          y: rowIndex * 170 + (rowIndex === 2 ? 116 : 61),
          width: 120,
          height: 85,
          color: color,
        });
      } else {
        // Combinação única de ID com o índice da linha
        const newSquareId = newSquare.id.toString();

        // Adiciona um novo quadrado no final da linha
        const newX = newMatrix[rowIndex].length > 0 ? newMatrix[rowIndex][newMatrix[rowIndex].length - 1].x + 260 : 30;
        newMatrix[rowIndex].push({
          id: newSquareId,
          x: newX,
          y: rowIndex * 170 + (rowIndex === 2 ? 116 : 61),
          width: 120,
          height: 85,
          color: color,
        });
      }

      // Printa todos os IDs dos quadrados em todas as linhas
      newMatrix.forEach((row, rIndex) => {
        console.log(`IDs dos quadrados na linha ${rIndex + 1}:`, row.map(square => square.id));
      });

      return [...newMatrix];
    });
  } catch (error) {
    console.error("Erro ao adicionar quadrado:", error);
  }
};


  const [activeRect, setActiveRect] = useState(null);
  const [balls, setBalls] = useState([{ x: 0, y: 0 }]);
  const [activePhase, setActivePhase] = useState(1);
  const [editedText, setEditedText] = useState("");
  const [editedRectId, setEditedRectId] = useState("");
  

  const handleDeleteSquare = (rowIndex, colIndex) => {
    setMatrix((prevMatrix) => {
      const newMatrix = [...prevMatrix];

      if (newMatrix[rowIndex] && newMatrix[rowIndex][colIndex]) {
        const deletedSquareId = newMatrix[rowIndex][colIndex].id;

        // Remove o quadrado da matriz
        newMatrix[rowIndex].splice(colIndex, 1);

        // Diminui o rowIndex dos quadrados subsequentes
        newMatrix[rowIndex].forEach((square, index) => {
          if (index >= colIndex) {
            square.id = `${rowIndex + 1}_${index + 1}`;
            console.log(`Quadrado ${square.id} teve seu rowIndex ajustado.`);
          }
        });

        // Printa todos os IDs dos quadrados na linha
        console.log(`IDs dos quadrados na linha ${rowIndex + 1}:`, newMatrix[rowIndex].map(square => square.id));

        return [...newMatrix];
      }

      return prevMatrix;
    });
  };

  const [textEdit, setTextEdit] = useState(false)
  const [isPickerAvailable, setPickerAvailable] = useState(false);
  const [currentEmoji, setCurrentEmoji] = useState(null);

  const handleCircleClick = () => {
     setPickerAvailable(!isPickerAvailable);
  }

  const handleSquareClick = (currentText, squareId, rectY) => {
    setEditedText(currentText); // Define o texto atual para edição no popup
    setEditedRectId(squareId); // Define o ID do quadrado atual para edição no popup
    setEditedRowIndex(rectY); // Define a posição y do retângulo atual para edição no popup
    setButtonPopup(true); // Abre o popup
    setTextEdit(true); // Define a edição de texto como verdadeira
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
        {textEdit ? (
          <>
            <div style={{ textAlign: "left", display: "flex", alignItems: "center" }}>
              <h1 style={{ fontSize: "50px" }}>Editar card</h1>
            </div>
            <div>
              <textarea
                type="text"
                value={editedText}
                placeholder="Texto vazio"
                className="textolegal"
                onChange={(e) => setEditedText(e.target.value)}
                style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
              />
              <button className="buttonconf" onClick={() => { handleTextSubmit(); setButtonPopup(false); setTextEdit(false) }}>
                Adicionar texto
              </button>

              {/* adicionar limpar texto */}
            </div>
          </>
        ) : (
          <>
            <div style={{ textAlign: "left", display: "flex", alignItems: "center" }}>
              <h1 style={{ fontSize: "50px" }}>Cenário</h1>
              <button className="button info" style={{ marginLeft: "1.5vh" }}>
                i
              </button>
            </div>
            <div>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
              <div style={{ textAlign: "left", display: "flex", alignItems: "center" }}>
                <img src="https://github.com/luca-ferro/imagestest/blob/main/mascote.png?raw=true" style={{ width: "13%", textAlign: "right" }} alt="cu"></img>
                <button className="buttonconf" style={{ marginLeft: "5vh" }} onClick={() => setButtonPopup(false)}>OK</button>
              </div>
            </div>
          </>
        )}
      </Popup>
      <div className="stage-container">
        <Stage width={window.innerWidth - 160} height={window.innerHeight + 180}>
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
              handleSquareClick={handleSquareClick}
              handleCircleClick={handleCircleClick}
              currentEmoji={currentEmoji}
            />
          </Layer>
        </Stage>
      </div>
      <div className="selectemote">
        {isPickerAvailable ?
        <> 
        <Picker className="Picker" data={data} previewPosition="none" onEmojiSelect={(e) => { setCurrentEmoji(e.native); setPickerAvailable(!isPickerAvailable); }} 
        /> 
        {console.log("currentEmoji = " + JSON.stringify(currentEmoji))}
        </>
        : 
        null}
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
        <button className="button save" id="saveButton" onClick={() => { handleSaveClick(); }}>
          Salvar
        </button>
      </div>
    </div>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<Tool />);

export default Tool;