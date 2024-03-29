import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Stage, Layer, Rect, Circle } from "react-konva";
import axios from "axios";
import Popup from "../../components/Popup";
import Matrix from "../../components/tool/Matrix";
import { toast } from 'sonner';
import Picker from '@emoji-mart/react';
import { Github, LogOut } from 'lucide-react';
import data from '@emoji-mart/data';
import { auth } from '../../services/firebase';
import { signOut } from 'firebase/auth';
import { init, getEmojiDataFromNative, SearchIndex } from 'emoji-mart';
import secureLocalStorage from "react-secure-storage";

import './tool.css';

init({ data })

const showAlert = () => {
  toast.success('Progresso salvo com sucesso!')
};




const Tool = ({ navigate }) => {

  const handleLogout = async () => {
    await signOut(auth);
    secureLocalStorage.removeItem('token');
    secureLocalStorage.removeItem('user');
    navigate('/login');
  }


  const [matrix, setMatrix] = useState([]);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [emojis, setEmojis] = useState({});

  const updateMatrixWithX = (matrix, id, newX, tipo) => {
    let updatedX;
    let constantToAdd = 0;

    console.log("o valor de x antes de passar pelos cases é: " + newX);

    // Switch case based on newX ranges
    switch (true) {
      case newX >= -269 && newX <= 269:
        constantToAdd = 1;
        break;
      case newX >= 250 && newX <= 499:
        updatedX = 270;
        break;
      case newX >= -499 && newX <= -250:
        updatedX = -270;
        break;
      case newX >= 500 && newX <= 749:
        updatedX = 540;
        break;
      case newX >= -749 && newX <= -500:
        updatedX = -540;
        break;
      case newX >= 750 && newX <= 999:
        updatedX = 810;
        break;
      case newX >= -999 && newX <= -750:
        updatedX = -810;
        break;
      case newX >= 1000 && newX <= 1249:
        updatedX = 1080;
        break;
      case newX >= -1249 && newX <= -1000:
        updatedX = -1080;
        break;
      case newX >= 1250 && newX <= 1499:
        updatedX = 1350;
        break;
      case newX >= -1499 && newX <= -1250:
        updatedX = -1350;
        break;
      case newX >= 1500 && newX <= 1749:
        updatedX = 1620;
        break;
      case newX >= -1749 && newX <= -1500:
        updatedX = -1620;
        break;
      default:
        constantToAdd = 1;
    }

    if (constantToAdd !== 0) {
      return matrix;
    }


    console.log("o valor de x passando pelos cases é: " + updatedX);

    return matrix.map((row) =>
      row.map((rect) =>
        rect[tipo + "_id"] !== undefined && rect[tipo + "_id"].toString() === id.toString()
          ? {
            ...rect,
            x: Math.max(20, Math.min(1620, rect.x + updatedX)),
          }
          : rect
      )
    );
  };



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
          journeyPhase_id: item.journeyPhase_id.toString(),
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
          emojiTag: item.emojiTag
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


        const convertedEmojis = {};

        for (const item of emotionMatrix) {
          console.log("emojiTag antes da pesquisa: " + item.emojiTag);
          const emojis = await SearchIndex.search(item.emojiTag);
          //console.log("Emojis após a pesquisa: " + JSON.stringify(emojis));

          if (emojis.length > 0) {
            // Pegar o primeiro native do array de skins
            const native = emojis[0].skins[0].native;
            console.log("NATIVE A SER INSERIDO: " + native);
            convertedEmojis[item.emotion_id] = native;
          }
        }

        setEmojis(convertedEmojis);
        console.log("Emojis após converter emojiTag to Native: " + JSON.stringify(convertedEmojis));

      } catch (error) {
        console.error("Erro ao buscar os dados:", error);
      }
    };

    fetchData();
  }, []);



  const handleDragEnd = (e, id, tipo) => {
    const identificador = id;
    const newX = e.target.x();

    setMatrix((prevMatrix) => {
      const updatedMatrix = updateMatrixWithX(prevMatrix, id, newX, tipo);
      return updatedMatrix;
    });

    console.log("id:", id);
    console.log("newX:", newX);
    console.log("tipo:", tipo);


    setEditedRectId(id);
    setForceUpdate(prev => prev + 1);
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
            data: { userAction_id: rect.userAction_id, posX: rect.x, description: rect.text },
          });
        } else if (rect.emotion_id !== undefined) {
          acc.push({
            endpoint: "emotion",
            data: { emotion_id: rect.emotion_id, posX: rect.x, lineY: rect.lineY, emojiTag: rect.emojiTag },
          });
        } else if (rect.thought_id !== undefined) {
          acc.push({
            endpoint: "thought",
            data: { thought_id: rect.thought_id, posX: rect.x, description: rect.text },
          });
        } else if (rect.journeyPhase_id !== undefined) {
          acc.push({
            endpoint: "journeyPhase",
            data: { journeyPhase_id: rect.journeyPhase_id, posX: rect.x, description: rect.text },
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
  const [editedRowIndex, setEditedRowIndex] = useState("0");
  const [editedText, setEditedText] = useState("");
  const [editedRectId, setEditedRectId] = useState("");
  const [textEdit, setTextEdit] = useState(false)

  const handleRectClick = (currentText, id, rectY) => {
    setEditedText(currentText); // Define o texto atual para edição no popup
    setEditedRectId(id);
    setEditedRowIndex(rectY);
    setButtonPopup(true); // Abre o popup
    setTextEdit(true); // Define a edição de texto como verdadeira
  };



  const handleTextChange = (rowIndex, colIndex, newText) => {
    const newMatrix = [...matrix];

    // Se o novo texto tiver mais de 30 caracteres, abrevie com reticências
    const abbreviatedText = newText.length > 30 ? newText.slice(0, 27) + '...' : newText;

    // Crie uma nova constante que guarde o valor do texto original
    const newTextOriginal = newText;
    setEditedText(newTextOriginal); // Atualize a constante do texto original
    setEditedRowIndex(rowIndex);

    // Atualize o texto na matriz
    newMatrix[rowIndex][colIndex].text = abbreviatedText;
    setMatrix(newMatrix); // Atualiza a matriz

  };

  const handleTextSubmit = () => {
    console.log("rectid:", editedRectId);
    console.log("editedRowIndex:", editedRowIndex);

    // Salvar o texto editado quando o usuário confirmar
    const updatedMatrix = matrix.map((row) =>
      row.map((rect) => {
        const type = rect.y === 61 ? 'journeyPhase' : rect.y === 231 ? 'userAction' : rect.y === 467 ? 'emotion' : rect.y === 571 ? 'thought' : rect.y === 741 ? 'contactPoint' : null;

        return (
          rect[`${type}_id`] === editedRectId && type === rect.type && rect.y === editedRowIndex
            ? { ...rect, text: editedText }
            : rect
        );
      })
    );

    console.log("editedText:", editedText);
    setMatrix(updatedMatrix);
    setEditedText("");
    setEditedRectId("");
  };


  const handleAddSquare = async (rowIndex, colIndex, prevMatrix, setMatrix) => {
    console.log("handleAddSquare rowIndex, colIndex:", rowIndex, colIndex);
    try {
      // Mapeia o rowIndex para o tipo correspondente
      const rowIndexToType = {
        0: 'journeyPhase',
        1: 'userAction',
        2: 'emotion',
        3: 'thought',
        4: 'contactPoint'
      };

      // Obtém o tipo com base no rowIndex
      const type = rowIndexToType[rowIndex];

      const colIndexToType = {
        0: 290,
        1: 560,
        2: 830,
        3: 1100,
        4: 1370
      };

      const novoX = colIndexToType[colIndex];

      if (!type) {
        console.error(`Tipo não encontrado para o rowIndex ${rowIndex}`);
        return;
      }

      let postData = {
        "journeyMap_id": 3,
        "linePos": 285,
        "posX": novoX,
        "length": 0,
        "description": "",
        "emojiTag": "Novo emoji"
      };

      if (type === 'emotion') {
        postData = {
          "posX": novoX,
          "lineY": 200,
          "emojiTag": "Emoji 1",
          "journeyMap_id": 3
        };
      }

      const response = await axios.post(`http://localhost:3000/${type}`, postData);

      const newSquare = response.data;

      console.log("id: " + newSquare.id);

      console.log("Aqui passou uma vez fora do setMatrix");

      const newMatrix = [...prevMatrix];

      if (!newMatrix[rowIndex]) {
        newMatrix[rowIndex] = [];
      }

      const color = newMatrix[rowIndex].length > 0 ? newMatrix[rowIndex][0].color : "#a3defe";
      console.log("Aqui passou mais uma vez dentro setMatrix");

      if (colIndex !== undefined && colIndex < newMatrix[rowIndex].length) {
        const sameColSquares = newMatrix[rowIndex].filter(square => square && square.x === newMatrix[rowIndex][colIndex].x);

        if (sameColSquares.length > 1) {
          newMatrix.forEach((row, rIndex) => {
            row.forEach((square, cIndex) => {
              if (rIndex === rowIndex && cIndex > colIndex) {
                square.x += 260;
              }
            });
          });
        }

        const newSquareId = `${type}_${newSquare.id}`;
        console.log("newSquareId: " + newSquareId);

        newMatrix[rowIndex].splice(colIndex + 1, 0, {
          id: newSquareId,
          x: newMatrix[rowIndex][colIndex].x + 260,
          y: rowIndex * 170 + (rowIndex === 2 ? 116 : 61),
          width: 120,
          height: 85,
          color: color,
        });
        console.log("aqui criou um");
      } else {
        const newSquareId = `${type}_${newSquare.id}`;

        const newX = newMatrix[rowIndex].length > 0 ? newMatrix[rowIndex][newMatrix[rowIndex].length - 1].x + 260 : 30;
        newMatrix[rowIndex].push({
          id: newSquareId,
          x: newX + 260,
          y: rowIndex * 170 + (rowIndex === 2 ? 116 : 61),
          width: 120,
          height: 85,
          color: color,
        });
        console.log("aqui criou outro");
      }

      newMatrix.forEach((row, rIndex) => {
        console.log(`IDs dos quadrados na linha ${rIndex + 1}:`, row.map(square => square.id));
      });

      setMatrix(newMatrix);
      return [...newMatrix];
    } catch (error) {
      console.error("Erro ao adicionar quadrado:", error);
    }
  };



  const handleDeleteSquare = async (rowIndex, colIndex) => {
    try {
      const square = matrix[rowIndex][colIndex];
      const squareType = square.type;
      const squareId = square[`${squareType}_id`];

      console.log(`Iniciando exclusão do quadrado: ${squareId}`);
      console.log(`Iniciando exclusão do quadrado: ${squareType}`);

      const response = await axios.delete(`http://localhost:3000/${squareType}/${squareId}`);

      console.log(`Quadrado ${squareId} excluído com sucesso!`, response);


      setMatrix((prevMatrix) => {
        const newMatrix = [...prevMatrix];

        if (newMatrix[rowIndex]) {
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
    } catch (error) {
      console.error("Erro ao excluir quadrado:", error);
    }
  };


  const [isPickerAvailable, setPickerAvailable] = useState(false);
  const [currentCellId, setCurrentCellId] = useState("");
  const [isPickerVisible, setPickerVisible] = useState(false);


  const handleCircleClick = (cellId) => {
    console.log("Clicked on circle with ID: ", cellId);
    console.log("Matrix state: ", matrix); // Verifique se matrix está atualizada
    console.log("cellId: ", cellId);
    setPickerAvailable(true);
    setCurrentCellId(cellId);
    console.log("CurrentCellId: ", currentCellId);
    setPickerVisible(true);
  };





  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <div className="scenario" style={{ textAlign: "left", padding: "31px", fontSize: "30px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <img src="https://github.com/luca-ferro/imagestest/blob/main/mascote.png?raw=true" style={{ width: "50px", textAlign: "left" }} alt="cu"></img>
        <span>Cenário 1 - X</span>
        <div className="botoes">
          <button className="button save" id="saveButton" onClick={() => { handleSaveClick(); }}>
            Salvar
          </button>
          <button className="button info" id="infoButton" style={{ marginLeft: "3vh", marginRight: "3vh" }} onClick={() => { setButtonPopup(true); }}>
            i
          </button>
          <button className="button logout" onClick={handleLogout}>
            <LogOut />
          </button>
        </div>
      </div>
      <div className="separator1" style={{ marginTop: "61.9px" }}></div>
      <Popup trigger={buttonPopup} setTrigger={setButtonPopup} setTextEdit={setTextEdit} style={{ borderRadius: "25px" }}>
        {textEdit ? (
          <>
            <div style={{ textAlign: "left", display: "flex", alignItems: "center" }}>
              <h1 style={{ fontSize: "50px", marginTop: "50px", marginBottom: "30px" }}>Editar card</h1>
            </div>
            <div className="areatexto">
              <textarea
                type="text"
                value={editedText}
                placeholder="Texto vazio"
                className="textolegal"
                onChange={(e) => setEditedText(e.target.value)}
                style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
              />

              <div className="separarbotoes">

                <button className="buttonconf" onClick={() => { handleTextSubmit(); setButtonPopup(false); setTextEdit(false) }}>
                  Adicionar texto
                </button>

                <button className="buttonconf2" onClick={() => setEditedText('')}>
                  Limpar texto
                </button>
              </div>
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
              <a href="https://github.com/GuilhermeHenq/Journey-map" target="_blank" style={{ marginTop: "20px", marginBottom: "20px", width: "70%", textAlign: "center", display: "flex", padding: "5px" }} >
                <Github style={{ marginTop: "px", marginRight: "5px" }} />
                <p>Repositório Git</p>
              </a>
              <div style={{ textAlign: "left", display: "flex", alignItems: "center" }}>
                <img src="https://github.com/luca-ferro/imagestest/blob/main/mascote.png?raw=true" style={{ width: "13%", textAlign: "right" }} alt="cu"></img>
                <button className="buttonconf" style={{ marginLeft: "5vh" }} onClick={() => setButtonPopup(false)}>OK</button>
              </div>
            </div>
          </>
        )}
      </Popup>
      {isPickerVisible && (
        <Popup trigger={isPickerVisible} setTrigger={setPickerVisible}>
          <div className="PickerContainer">
            <Picker
              className="Picker"
              data={data}
              emojiSize={30}
              emojiButtonSize={50}
              perLine={30}
              maxFrequentRows={10}
              previewPosition="none"
              navPosition="bottom"
              emojiButtonRadius="100%"
              theme="light"
              locale="pt"
              emojiButtonColors="rgba(155,223,88,.7)"
              onEmojiSelect={(e) => {
                getEmojiDataFromNative(e.native).then((emojiData) => {
                  setMatrix((prevMatrix) => {
                    const updatedMatrix = prevMatrix.map((row) =>
                      row.map((rect) =>
                        rect.emotion_id === currentCellId
                          ? {
                            ...rect,
                            emojiTag: emojiData.id,
                          }
                          : rect
                      )
                    );

                    setEmojis((prevEmojis) => ({
                      ...prevEmojis,
                      [currentCellId]: e.native,
                    }));

                    return updatedMatrix;
                  });
                  setPickerVisible(false);
                });
              }}
            />
          </div>
        </Popup>
      )}

      <div className="stage-container">
        <Stage width={window.innerWidth - 160} height={window.innerHeight + 180}>
          <Layer>
            <Matrix
              key={forceUpdate}
              matrix={matrix}
              handleTextSubmit={handleTextSubmit}
              handleTextChange={handleTextChange}
              handleAddSquare={handleAddSquare}
              handleDeleteSquare={handleDeleteSquare}
              handleDragEnd={handleDragEnd}
              handleCircleClick={handleCircleClick}
              emojis={emojis}
              handleRectClick={handleRectClick}
              setMatrix={setMatrix}
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
      <div className="separator1"></div>
    </div>
  );
};


export default Tool;