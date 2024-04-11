import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Stage, Layer, Rect, Circle } from "react-konva";
import axios from "axios";
import Popup from "../../components/Popup";
import Navbar from "../../components/Navbar";
import Matrix from "../../components/tool/Matrix";
import { toast } from 'sonner';
import Picker from '@emoji-mart/react';
import { Github, LogOut } from 'lucide-react';
import data from '@emoji-mart/data';
import { auth } from '../../services/firebase';
import { signOut } from 'firebase/auth';
import { init, getEmojiDataFromNative, SearchIndex } from 'emoji-mart';
import secureLocalStorage from "react-secure-storage";
import img from "../../assets/mascote.png";

import './tool.css';

init({ data })

const showAlert = () => {
  toast.success('Progresso salvo com sucesso!')
};



const Tool = ({ navigate }) => {


  const handlePostClick = async () => {
    try {
      await axios.post(import.meta.env.VITE_BACKEND + '/journeyPhase', {
        journeyMap_id: 3,
        linePos: 285,
        posX: 20,
        length: 230,
        description: 'essa é uma fase de jornada',
        emojiTag: 'emoji feliz',
      });

      await axios.post(import.meta.env.VITE_BACKEND + '/userAction', {
        journeyMap_id: 3,
        linePos: 285,
        posX: 20,
        length: 230,
        description: 'essa é uma ação do usuario',
        emojiTag: 'emoji feliz',
      });

      await axios.post(import.meta.env.VITE_BACKEND + '/thought', {
        journeyMap_id: 3,
        linePos: 285,
        posX: 20,
        length: 230,
        description: 'esse é um pensamento',
        emojiTag: 'emoji pensando',
      });

      await axios.post(import.meta.env.VITE_BACKEND + '/contactPoint', {
        journeyMap_id: 3,
        linePos: 285,
        posX: 20,
        length: 230,
        description: 'esse é um ponto de contato ',
        emojiTag: 'emoji triste',
      });

      await axios.post(import.meta.env.VITE_BACKEND + '/emotion', {
        posX: 20,
        lineY: 40,
        emojiTag: '😀',
        journeyMap_id: 3,
      });

      window.location.reload();
    } catch (error) {
      console.error('Erro ao salvar:', error.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    secureLocalStorage.removeItem('token');
    secureLocalStorage.removeItem('user');
    navigate('/login');
  }


  const [matrix, setMatrix] = useState([]);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [emojis, setEmojis] = useState({});
  const [dataLoaded, setDataLoaded] = useState(true);
  const [selectedHouses, setSelectedHouses] = useState(1);

  const handleSelectChange = (event) => {
    const value = parseInt(event.target.value, 10);
    setSelectedHouses(value);
  };


  const updateMatrixWithX = (matrix, id, newX, tipo, length, x) => {
    let updatedX;
    let constantToAdd = 0;

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

    // Se constantToAdd for diferente de zero, significa que não há uma alteração válida para newX
    if (constantToAdd !== 0) {
      return matrix;
    }

    console.log("id antes do overlapping: " + id.toString());
    // Verificando se há sobreposição apenas na mesma linha
    const rowIndex = matrix.findIndex(row => row.some(rect => rect[tipo + "_id"] !== undefined && rect[tipo + "_id"].toString() === id.toString()));
    const row = matrix[rowIndex];
    const newXEnd = x + updatedX + length - 20; // Final do novo intervalo do retângulo movido
    console.log("newX end que é o x recebido + o X que ele ia somar: " + newXEnd);
    const isOverlapping = row.some(rect =>
      rect[tipo + "_id"] !== undefined &&
      rect[tipo + "_id"].toString() === id.toString() &&
      row.some(otherRect =>
        otherRect[tipo + "_id"] !== undefined &&
        otherRect[tipo + "_id"].toString() !== id.toString() &&
        (newXEnd > otherRect.x && newXEnd < otherRect.x + otherRect.width) || // Verifica se há sobreposição à direita ou
        (x + updatedX > otherRect.x && x + updatedX < otherRect.x + otherRect.width) // Verifica se há sobreposição à esquerda
      )
    );

    // Se houver sobreposição na mesma linha, retorne a matriz original
    if (isOverlapping) {
      return matrix;
    }

    // Caso contrário, aplique a lógica de atualização de x para os retângulos
    return matrix.map((row, rowIndex) =>
      row.map((rect) =>
        rect[tipo + "_id"] !== undefined && rect[tipo + "_id"].toString() === id.toString()
          ? {
            ...rect,
            x: Math.max(20, Math.min(1640, rect.x + updatedX)),
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
          axios.get(import.meta.env.VITE_BACKEND + "/journeyPhase"),
          axios.get(import.meta.env.VITE_BACKEND + "/userAction"),
          axios.get(import.meta.env.VITE_BACKEND + "/emotion"),
          axios.get(import.meta.env.VITE_BACKEND + "/thought"),
          axios.get(import.meta.env.VITE_BACKEND + "/contactPoint"),
        ]);

        // Mapeie os dados da API para o formato desejado na matriz
        const journeyMatrix = journeyData.data.map(item => ({
          type: 'journeyPhase',
          journeyPhase_id: item.journeyPhase_id.toString(),
          x: item.posX,
          y: 61,
          width: item.length,
          height: 135,
          color: "#FFAC81",
          text: item.description,
        }));

        const userActionMatrix = userActionData.data.map(item => ({
          type: 'userAction',
          userAction_id: item.userAction_id.toString(),
          x: item.posX,
          y: 231,
          width: item.length,
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
          width: item.length,
          height: 135,
          color: "#EFE9AE",
          text: item.description,
        }));

        const contactPointMatrix = contactPointData.data.map(item => ({
          type: 'contactPoint',
          contactPoint_id: item.contactPoint_id.toString(),
          x: item.posX,
          y: 741,
          width: item.length,
          height: 135,
          color: "#CDEAC0",
          text: item.description,
        }));

        const newMatrix = [journeyMatrix, userActionMatrix, emotionMatrix, thoughtMatrix, contactPointMatrix];
        console.log(newMatrix);
        setMatrix(newMatrix);
        // Verifique se pelo menos uma matriz tem dados
        if (newMatrix.some(matrix => matrix.length > 0)) {
          setDataLoaded(true);
        } else {
          setDataLoaded(false);
        }

        const convertedEmojis = {};

        for (const item of emotionMatrix) {
          //console.log("emojiTag antes da pesquisa: " + item.emojiTag);
          const emojis = item.emojiTag;
          //console.log("Emojis após a pesquisa: " + emojis);

          if (emojis.length > 0) {
            // Pegar o primeiro native do array de skins
            const native = emojis;
            //console.log("NATIVE A SER INSERIDO: " + native);
            convertedEmojis[item.emotion_id] = native;
          }
        }

        setEmojis(convertedEmojis);
        //console.log("Emojis após converter emojiTag to Native: " + JSON.stringify(convertedEmojis));

      } catch (error) {
        console.error("Erro ao buscar os dados:", error);
      }
    };

    fetchData();
  }, []);



    const handleDragEnd = (e, id, tipo, length, x) => {
      const newX = e.target.x();
      const newY = e.target.y();
      setMatrix((prevMatrix) => {
          const rearrangedMatrix = updateMatrixWithX(prevMatrix, id, newX, tipo, length, x);

          const updatedMatrix = rearrangedMatrix.map((row) => {
              return row.sort((a, b) => {
                  return (a.x - 20) / 270 - (b.x - 20) / 270;
              });
          });
          
          console.log(updatedMatrix)
          return updatedMatrix;
      });
      setEditedRectId(id);
      setForceUpdate((prev) => prev + 1);
  };

  const handleSaveClick = () => {
    const putConfig = { method: "PUT" };
    console.log("Final matrix: ", matrix)
    // Mapeie os dados da matriz para os dados necessários para cada tipo de entidade
    const dataToPut = matrix.reduce((acc, row) => {
      row.forEach((rect) => {
        console.log("Saving data for rect:", rect);

        if (rect.contactPoint_id !== undefined) {
          acc.push({
            endpoint: "contactPoint",
            data: { contactPoint_id: rect.contactPoint_id, posX: rect.x, description: rect.text, width: rect.width },
          });
        } else if (rect.userAction_id !== undefined) {
          acc.push({
            endpoint: "userAction",
            data: { userAction_id: rect.userAction_id, posX: rect.x, description: rect.text, width: rect.width },
          });
        } else if (rect.emotion_id !== undefined) {
          acc.push({
            endpoint: "emotion",
            data: { emotion_id: rect.emotion_id, posX: rect.x, lineY: rect.lineY, emojiTag: rect.emojiTag },
          });
        } else if (rect.thought_id !== undefined) {
          acc.push({
            endpoint: "thought",
            data: { thought_id: rect.thought_id, posX: rect.x, description: rect.text, width: rect.width },
          });
        } else if (rect.journeyPhase_id !== undefined) {
          acc.push({
            endpoint: "journeyPhase",
            data: { journeyPhase_id: rect.journeyPhase_id, posX: rect.x, description: rect.text, width: rect.width },
          });
        }
      });
      return acc;
    }, []);

    console.log("Data to put:", dataToPut);

    // Envie as solicitações para a API usando os dados mapeados
    const requests = dataToPut.map(({ endpoint, data }) => {
      const url = import.meta.env.VITE_BACKEND + `/${endpoint}`;
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


    setMatrix((prevMatrix) => {
      const updatedMatrix = prevMatrix.map((row) =>
        row.map((rect) => {
          const type = rect.y === 61 ? 'journeyPhase' : rect.y === 231 ? 'userAction' : rect.y === 467 ? 'emotion' : rect.y === 571 ? 'thought' : rect.y === 741 ? 'contactPoint' : null;

          return (
            rect[`${type}_id`] === editedRectId && type === rect.type && rect.y === editedRowIndex
              ? { ...rect, x: Math.max(20, Math.min(1620, rect.x)) }
              : rect
          );
        })
      );

      return updatedMatrix;
    });


  };


  const handleSaveHouse = () => {
    setMatrix((prevMatrix) => {
      let updatedMatrix = prevMatrix.map((row) => {
        let rowUpdated = false;
        const updatedRow = row.map((rect) => {
          const type = rect.y === 61 ? 'journeyPhase' : rect.y === 231 ? 'userAction' : rect.y === 467 ? 'emotion' : rect.y === 571 ? 'thought' : rect.y === 741 ? 'contactPoint' : null;

          if (rect[`${type}_id`] === editedRectId && type === rect.type && rect.y === editedRowIndex) {
            rowUpdated = true;
            return { ...rect, width: selectedHouses * 270 - 40 };
          }
          return rect;
        });

        // Se a linha foi atualizada, ajuste os rects subsequentes na mesma linha
        if (rowUpdated) {
          let adjustedX = -1;
          updatedRow.forEach((rect, index) => {
            if (adjustedX !== -1 && rect) {
              rect.x = adjustedX + 40;
              adjustedX += rect.width;
            }
            if (rect && rect[`${rect.type}_id`] === editedRectId && rect.y === editedRowIndex) {
              adjustedX = rect.x + rect.width;
            }
          });
        }

        return updatedRow;
      });

      return updatedMatrix;
    });

    setSelectedHouses(1);
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


  const handleAddSquare = async (rowIndex, colIndex, squarewidth) => {
    console.log("handleAddSquare rowIndex, colIndex, squarewidth:", rowIndex, colIndex, squarewidth);
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
        4: 1370,
        5: 1640
      };

      const novoX = colIndexToType[colIndex];

      if (!type) {
        console.error(`Tipo não encontrado para o rowIndex ${rowIndex}`);
        return;
      }

      let postData = {
        "journeyMap_id": 3,
        "linePos": 285,
        "posX": squarewidth - 230 + novoX,
        "length": 230,
        "description": "",
        "emojiTag": "Novo emoji"
      };

      if (type === 'emotion') {
        postData = {
          "posX": novoX,
          "lineY": 40,
          "emojiTag": "🔴",
          "journeyMap_id": 3
        };
      }

      const response = await axios.post(import.meta.env.VITE_BACKEND + `/${type}`, postData);

      const newSquare = response.data;

      console.log("id: " + newSquare.id);

      window.location.reload();
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

      const response = await axios.delete(import.meta.env.VITE_BACKEND + `/${squareType}/${squareId}`);

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
      window.location.reload();
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
      <>
        <Navbar
          onSaveClick={handleSaveClick}
          onInfoClick={() => setButtonPopup(true)}
          onLogoutClick={handleLogout}
          handlePostClick={handlePostClick}
          dataLoaded={dataLoaded}
          currentJourneyMap={1}
        />

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

                  <div className="buttonconf3">
                    {/* <label className="numerocasas" htmlFor="houseCount">Tamanho: </label> */}
                    <input
                      type="number"
                      id="houseCount"
                      value={selectedHouses}
                      onChange={handleSelectChange}
                      min={1} // Define o valor mínimo como 1
                      step={1} // Define o incremento/decremento como 1 (apenas números inteiros)
                      className="houseInput"
                    />
                    <p>Card(s)</p>
                  </div>
                  <button className="botaosavetamanho" onClick={handleSaveHouse}> Salvar </button>
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
                theme="dark"
                locale="pt"
                onEmojiSelect={(e) => {
                  getEmojiDataFromNative(e.native).then((emojiData) => {
                    setMatrix((prevMatrix) => {
                      const updatedMatrix = prevMatrix.map((row) =>
                        row.map((rect) =>
                          rect.emotion_id === currentCellId
                            ? {
                              ...rect,
                              emojiTag: emojiData.native,
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
        {/* Verifica se os dados da matriz estão carregados antes de renderizar a matriz */}
        {dataLoaded && (
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
        )}

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
      </>
    </div>
  );

};


export default Tool;