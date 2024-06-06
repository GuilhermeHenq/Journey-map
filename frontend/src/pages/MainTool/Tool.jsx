import React, { useState, useEffect, Fragment } from "react";
import { createRoot } from "react-dom/client";
import { Stage, Layer, Rect, Circle } from "react-konva";
import axios from "axios";
import Popup from "../../components/Popup";
import Navbar from "../../components/Navbar";
import Matrix from "../../components/tool/Matrix";
import { toast } from 'sonner';
import Picker from '@emoji-mart/react';
import { Github, LogOut, Download } from 'lucide-react';
import data from '@emoji-mart/data';
import { auth } from '../../services/firebase';
import { signOut } from 'firebase/auth';
import { init, getEmojiDataFromNative, SearchIndex } from 'emoji-mart';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import html2canvas from 'html2canvas';

import './tool.css';

init({ data })

const showAlert = () => {
  toast.success('Progresso salvo com sucesso!')
};

const sizeUpdated = () => {
  toast.success('Tamanho atualizado com sucesso!')
};


const Tool = ({ }) => {
  const navigate = useNavigate();
  const { id_mapa } = useParams();

  const width = window.innerWidth;
  const height = window.innerHeight;

  const stageRef = React.useRef(null);

  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    console.log("entrou em handleExport");
    try {
      // Capturar a imagem do stage Konva
      const stage = stageRef.current.getStage();
      const konvaDataURL = stage.toDataURL({ pixelRatio: 0.84 });

      const konvaImage = await new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = konvaDataURL;
      });

      // Capturar a imagem de fundo
      const backgroundCanvas = await html2canvas(document.querySelector('.teste-1'), {
        backgroundColor: null,
      });

      // Capturar a largura da div .teste-1
      const teste1Div = document.querySelector('.teste-1');
      const totalWidth = konvaImage.width; // Use offsetWidth para capturar a largura aplicada pelo CSS
      const totalHeight = Math.max(backgroundCanvas.height, konvaImage.height);

      console.log("konva width: ", konvaImage.width);
      console.log("konva height: ", konvaImage.height);
      console.log("backgroundCanvas width: ", backgroundCanvas.width);
      console.log("backgroundCanvas height: ", backgroundCanvas.height);
      console.log(totalWidth);
      console.log(totalHeight);

      const finalCanvas = document.createElement('canvas');
      finalCanvas.width = totalWidth;
      finalCanvas.height = totalHeight;
      const ctx = finalCanvas.getContext('2d');

      // Preencher o fundo com a cor quase branca
      ctx.fillStyle = "#f8f8f8";
      ctx.fillRect(0, 0, totalWidth, totalHeight);

      // Desenhar a imagem de fundo
      ctx.drawImage(backgroundCanvas, 0, 12);

      // Desenhar a imagem do stage Konva
      ctx.drawImage(konvaImage, 150, -35);

      // Desenhar o texto
      ctx.fillStyle = "#000000"; // Cor do texto
      ctx.font = "40px Arial"; // Estilo da fonte
      ctx.textAlign = "center"; // Centralizar o texto
      ctx.fillText("JEM - JourneyEasyMap", totalWidth / 2, totalHeight - 20);

      // Exportar o canvas final como imagem
      const finalImage = finalCanvas.toDataURL('image/png');
      downloadURI(finalImage, 'mapa_de_jornada.png');
    } catch (error) {
      console.error('Erro ao exportar o mapa de jornada:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadURI = (uri, name) => {
    console.log("entrou em downloadURI");
    const link = document.createElement('a');
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const handlePostClick = async () => {
    try {
      await axios.post(import.meta.env.VITE_BACKEND + '/journeyPhase', {
        journeyMap_id: id_mapa,
        linePos: 285,
        posX: 20,
        length: 230,
        description: 'essa é uma fase de jornada',
        emojiTag: 'emoji feliz',
      });

      await axios.post(import.meta.env.VITE_BACKEND + '/userAction', {
        journeyMap_id: id_mapa,
        linePos: 285,
        posX: 20,
        length: 230,
        description: 'essa é uma ação do usuario',
        emojiTag: 'emoji feliz',
      });

      await axios.post(import.meta.env.VITE_BACKEND + '/thought', {
        journeyMap_id: id_mapa,
        linePos: 285,
        posX: 20,
        length: 230,
        description: 'esse é um pensamento',
        emojiTag: 'emoji pensando',
      });

      await axios.post(import.meta.env.VITE_BACKEND + '/contactPoint', {
        journeyMap_id: id_mapa,
        linePos: 285,
        posX: 20,
        length: 230,
        description: 'esse é um ponto de contato ',
        emojiTag: 'emoji triste',
      });

      await axios.post(import.meta.env.VITE_BACKEND + '/emotion', {
        posX: 20,
        lineY: -15,
        emojiTag: '😀',
        journeyMap_id: id_mapa,
      });

      window.location.reload();
    } catch (error) {
      console.error('Erro ao salvar:', error.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }

  const onMap = async () => {
    navigate('/');
  }

  const fetchData = async () => {
    try {
      const [
        journeyData,
        userActionData,
        emotionData,
        thoughtData,
        contactPointData,
      ] = await Promise.all([
        axios.get(import.meta.env.VITE_BACKEND + "/journeyPhase", { params: { journeyMap_id: id_mapa } }),
        axios.get(import.meta.env.VITE_BACKEND + "/userAction", { params: { journeyMap_id: id_mapa } }),
        axios.get(import.meta.env.VITE_BACKEND + "/emotion", { params: { journeyMap_id: id_mapa } }),
        axios.get(import.meta.env.VITE_BACKEND + "/thought", { params: { journeyMap_id: id_mapa } }),
        axios.get(import.meta.env.VITE_BACKEND + "/contactPoint", { params: { journeyMap_id: id_mapa } }),
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
      return (newMatrix);

    } catch (error) {
      console.error("Erro ao buscar os dados:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  const [matrix, setMatrix] = useState([]);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [emojis, setEmojis] = useState({});
  const [dataLoaded, setDataLoaded] = useState(true);
  const [selectedHouses, setSelectedHouses] = useState(1);

  const calculateTotalWidth = (matrix) => {
    let totalWidth = 0;
    matrix.forEach(row => {
      row.forEach(rect => {
        totalWidth = Math.max(totalWidth, rect.x + rect.width);
      });
    });
    return totalWidth;
  };


  const handleSelectChange = (event) => {
    const value = parseInt(event.target.value, 10);
    setSelectedHouses(value);
  };


  const updateMatrixWithX = (matrix, id, newX, tipo, length, x, closeY, xoriginal) => {
    console.log("Iniciando updateMatrixWithX");
    console.log("Parâmetros: id:", id, "newX:", newX, "tipo:", tipo, "length:", length, "x:", x, "closeY:", closeY, "xoriginal:", xoriginal);

    let updatedX;

    // Verificar quantos intervalos de 270 cabem em newX
    const intervalCount = Math.floor(newX / 270);
    updatedX = intervalCount * 270;

    console.log("intervalCount:", intervalCount);
    console.log("updatedX:", updatedX);

    const newXStart = xoriginal + updatedX; // Atualize xoriginal em vez de x
    const newXEnd = newXStart + length;

    console.log("newXStart:", newXStart);
    console.log("newXEnd:", newXEnd);

    const tamanhoRectMovido = Math.round(length / 270);
    console.log("length:", length);
    console.log("tamanhoRectMovido:", tamanhoRectMovido);

    return matrix.map((row, rowIndex) => {
      console.log("Analisando linha:", rowIndex);

      // Verificar se há sobreposição apenas na mesma linha
      const rectIndex = row.findIndex(rect => rect[tipo + "_id"] !== undefined && rect[tipo + "_id"].toString() === id.toString());
      if (rectIndex === -1) {
        console.log("Rect não encontrado na linha:", rowIndex);
        return row;
      }

      console.log("Rect encontrado na linha:", rowIndex);

      // Verificar se há um retângulo no qual o usuário arrastou por cima
      const overlappingRect = row.find(rect => {
        if (rect[tipo + "_id"] !== undefined && rect[tipo + "_id"].toString() !== id.toString()) {
          const rectStart = rect.x;
          const rectEnd = rect.x + rect.width;
          const isOverlapping = !(newXEnd <= rectStart || newXStart >= rectEnd);
          if (isOverlapping) {
            console.log("Sobreposição detectada com rect:", rect);
          }
          return isOverlapping;
        }
        return false;
      });

      // Se há um retângulo sobreposto, ajustar as posições
      if (overlappingRect) {
        console.log("Encontrado retângulo sobreposto:", overlappingRect);

        return row.map(rect => {
          if (rect[tipo + "_id"] !== undefined && rect[tipo + "_id"].toString() === id.toString()) {
            console.log("Atualizando rect movido:", rect, "Novo X:", newXStart);
            return {
              ...rect,
              x: Math.max(20, newXStart),
            };
          }
          if (updatedX < 0) {
            if (rect.x >= newXStart && rect.x <= xoriginal) {
              console.log("Movendo rect para frente (esquerda):", rect, "Novo X:", rect.x + 270 * tamanhoRectMovido);
              return {
                ...rect,
                x: rect.x + 270 * tamanhoRectMovido,
              };
            }
          } else {
            if (rect.x >= newXStart) {
              console.log("Movendo rect para frente (direita):", rect, "Novo X:", rect.x + 270 * tamanhoRectMovido);
              return {
                ...rect,
                x: rect.x + 270 * tamanhoRectMovido,
              };
            }
          } if (rect.x + rect.width >= newXStart && rect.x + rect.width <= xoriginal) {
              console.log("Moveu por cima de um trem", rect, "Novo X:", rect.x);
              return {
                ...rect,
                x: xoriginal,
              };
          } else {
            if (rect.x + rect.width >= newXStart) {
              console.log("Movendo rect para frente (direita):", rect, "Novo X:", xoriginal + overlappingRect.width + 310);
              return {
                ...rect,
                x: xoriginal + overlappingRect.width + 310,
              };
            } 
          }
          return rect;
        });
      }

      // Caso contrário, verifique se há sobreposição com tamanho diferente e, se houver, retorne a matriz original
      const isOverlappingWithDifferentSize = row.some(rect => {
        if (rect[tipo + "_id"] !== undefined && rect[tipo + "_id"].toString() !== id.toString()) {
          const rectStart = rect.x;
          const rectEnd = rect.x + rect.width;
          const isOverlapping = !(newXEnd <= rectStart || newXStart >= rectEnd);
          if (isOverlapping && rect.width !== length) {
            console.log("Sobreposição detectada com tamanho diferente para rect:", rect);
            return true;
          }
        }
        return false;
      });

      if (isOverlappingWithDifferentSize) {
        console.log("Sobreposição detectada com retângulo de tamanho diferente, operação não permitida.");
        return row;
      }

      return row.map((rect) => {
        if (rect.type === 'emotion' && rect.emotion_id.toString() === id.toString()) {
          // Limita o valor de lineY aos valores permitidos
          const allowedValues = [35, -15, -60];
          const newLineY = allowedValues.reduce((prev, curr) => (Math.abs(curr - (rect.lineY + closeY)) < Math.abs(prev - (rect.lineY + closeY)) ? curr : prev));
          console.log("Atualizando rect de emotion:", rect, "Novo X:", newXStart, "Novo LineY:", newLineY);
          return {
            ...rect,
            x: Math.max(20, newXStart),
            lineY: newLineY,
          };
        } else if (rect[tipo + "_id"] !== undefined && rect[tipo + "_id"].toString() === id.toString()) {
          console.log("Atualizando rect:", rect, "Novo X:", newXStart);
          return {
            ...rect,
            x: Math.max(20, newXStart),
          };
        } else {
          return rect;
        }
      });
    }).map((row) => {
      // Verificar e corrigir as posições duplicadas após a troca
      const positions = new Set();
      return row.map((rect) => {
        if (positions.has(rect.x)) {
          console.log("Corrigindo posição duplicada para rect:", rect);
          rect.x = newXStart;
        }
        positions.add(rect.x);
        return rect;
      });
    });
  };



  const handleDragEnd = (e, id, tipo, length, x, closeY, xoriginal) => {
    const newX = e.target.x();
    console.log(newX);
    console.log(x);
    setMatrix((prevMatrix) => {
      const rearrangedMatrix = updateMatrixWithX(prevMatrix, id, newX, tipo, length, x, closeY, xoriginal);
  
      const updatedMatrix = rearrangedMatrix.map((row) => {
        // Ajustar x para o intervalo mais próximo de 270 em 270, começando em 20
        const adjustedRow = row.map((rect) => {
          const intervalCount = Math.round((rect.x - 20) / 270);
          const adjustedX = 20 + intervalCount * 270;
          return {
            ...rect,
            x: adjustedX,
          };
        }).sort((a, b) => {
          return (a.x - 20) / 270 - (b.x - 20) / 270;
        });
  
        // Verificar e corrigir sobreposições na linha
        for (let i = 0; i < adjustedRow.length - 1; i++) {
          const currentRect = adjustedRow[i];
          const nextRect = adjustedRow[i + 1];
  
          while (nextRect.x < currentRect.x + currentRect.width) {
            nextRect.x = currentRect.x + currentRect.width + 40;
          }
        }
  
        return adjustedRow;
      });
  
      console.log(updatedMatrix);
      return updatedMatrix;
    });
    setEditedRectId(id);
    setForceUpdate((prev) => prev + 1);
    setSaveTriggered(true);
    setShowMessage(false);
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
        if (showMessage) {
          console.log("Dados salvos com sucesso!");
        } else {
          setShowMessage(true)
        }
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

  const [tempWidth, setTempWidth] = useState()

  const handleSaveHouse = async () => {
    let tempMatrix = [];
    let foundExtendedRect = null;

    setMatrix((prevMatrix) => {
      console.log('Previous Matrix:', prevMatrix);

      tempMatrix = prevMatrix.map((row) => {
        let rowUpdated = false;
        let extendedRect; // To store the extended rectangle
        let extendedIndex = -1; // To store the index of the extended rectangle

        const updatedRow = row.map((rect, index) => {
          const type = rect.y === 61 ? 'journeyPhase' : rect.y === 231 ? 'userAction' : rect.y === 467 ? 'emotion' : rect.y === 571 ? 'thought' : rect.y === 741 ? 'contactPoint' : null;
          if (!type) return rect; // Skip if type is null

          if (rect[`${type}_id`] === editedRectId && type === rect.type && rect.y === editedRowIndex) {
            rowUpdated = true;
            // Save the original X position before extending the width
            const originalX = rect.x;
            extendedRect = { ...rect, width: selectedHouses * 270 - 40, x: originalX }; // Maintain the original X position
            extendedIndex = index;
            console.log('Extended Rect:', extendedRect);
            return extendedRect;
          }
          return rect;
        });

        // If the row was updated, adjust the X position of subsequent rectangles
        if (rowUpdated) {
          let adjustedX = extendedRect.x + extendedRect.width; // Start X position after the extended rectangle
          updatedRow.forEach((rect, index) => {
            if (rect && index > extendedIndex) {
              rect.x = adjustedX + 40; // Adjust subsequent rectangles with the 40px gap
              adjustedX += rect.width + 40; // Increment adjustedX by rect.width and 40px gap
            }
          });
          console.log('Row Updated:', updatedRow);
          foundExtendedRect = extendedRect; // Track the extended rectangle
        }

        return updatedRow;
      });

      console.log('Temporary Matrix:', tempMatrix);
      return tempMatrix;
    });

    // Use a state variable to trigger saving the data after the state update completes
    setSaveTriggered(true);
    setShowMessage(false);
    setSelectedHouses(1);
  };

  const [saveTriggered, setSaveTriggered] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (saveTriggered) {
      handleSaveClick();
      setSaveTriggered(false);
    }
  }, [saveTriggered, matrix]); // Run when saveTriggered or matrix changes




  const handleTextChange = (rowIndex, colIndex, newText) => {
    const newMatrix = [...matrix];

    // Se o novo texto tiver mais de 30 caracteres, abrevie com reticências
    console.log(newText);
    console.log(newText.length);
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
    setSaveTriggered(true);
    setEditedRectId("");
  };

  const [newSquareId, setNewSquareId] = useState(null);

  const handleAddSquare = async (rowIndex, colIndex, squarewidth) => {
    console.log("handleAddSquare rowIndex, colIndex, squarewidth:", rowIndex, colIndex, squarewidth);
    try {
      const rowIndexToType = {
        0: 'journeyPhase',
        1: 'userAction',
        2: 'emotion',
        3: 'thought',
        4: 'contactPoint'
      };

      const type = rowIndexToType[rowIndex];

      // Calculate novoX based on colIndex, handling cases beyond the predefined columns
      let novoX;
      if (colIndex !== undefined) {
        novoX = 290 + colIndex * 270; // Ajuste a posição inicial se necessário
      } else {
        console.error("colIndex is undefined");
        return;
      }

      if (!type) {
        console.error(`Tipo não encontrado para o rowIndex ${rowIndex}`);
        return;
      }

      console.log(novoX);

      // Check if there's a rect with the same novoX and type
      const isOverlapping = matrix[rowIndex].some(rect =>
        rect.type === type &&
        rect.x === novoX
      );

      // If there is an overlap, push subsequent cards forward and update their positions on the backend
      if (isOverlapping) {
        for (let i = 0; i < matrix[rowIndex].length; i++) {
          const card = matrix[rowIndex][i];
          if (card.x >= novoX) {
            card.x += 270; // Empurrar para frente
            // Update the position of the card on the backend
            const putData = {
              [`${type}_id`]: card[`${type}_id`],
              posX: card.x,
              width: card.width,
              lineY: card.lineY
            };
            if (type !== 'emotion') {
              putData.description = card.text || "";
            }
            console.log(putData);
            await axios.put(import.meta.env.VITE_BACKEND + `/${type}`, putData);
          }
        }
      }

      // If the type is 'emotion', open the Picker and wait for the user to select an emoji
      if (type === 'emotion') {
        setCurrentCellId('new');
        setPickerVisible(true);
        setPendingPostData({ novoX, rowIndex, colIndex, squarewidth });
      } else {
        await postNewCard({ novoX, rowIndex, colIndex, squarewidth }, type);
      }

    } catch (error) {
      console.error("Erro ao adicionar quadrado:", error);
    }
  };


  const [pendingPostData, setPendingPostData] = useState(null);

  const postNewCard = async ({ novoX, rowIndex, colIndex, squarewidth }, type, emojiTag = "Novo emoji") => {
    const postData = {
      "journeyMap_id": id_mapa,
      "linePos": 285,
      "posX": novoX,
      "length": 230,
      "description": "",
      "emojiTag": emojiTag
    };

    if (type === 'emotion') {
      postData.posX = novoX;
      postData.journeyMap_id = id_mapa;
      postData.lineY = -15;
    }

    console.log(postData);
    const response = await axios.post(import.meta.env.VITE_BACKEND + `/${type}`, postData);

    fetchData();
  };











  useEffect(() => {
    if (newSquareId && matrix) {
      const [journeyPhase, userAction, emotions] = matrix;
      console.log("[emotions]: ", emotions);
      const emotionIds = emotions.map(emotion => emotion.emotion_id);
      console.log("emotion ids: ", emotionIds);
      console.log("newSquareID: ", newSquareId);

      if (emotionIds.includes(newSquareId)) {
        console.log("ID DO EMOJI", newSquareId);
        handleCircleClick(newSquareId);
        console.log("handleCircleClick chamado");
      } else {
        console.log("ID DO EMOJI não encontrado na lista de emoções");
      }
    } else {
      console.log("newSquareId ou matrix estão ausentes");
    }
  }, [newSquareId, matrix]);


  const handleDeleteSquare = async (rowIndex, colIndex) => {
    try {
      const square = matrix[rowIndex][colIndex];
      const squareType = square.type;
      const squareId = square[`${squareType}_id`];

      console.log(`Iniciando exclusão do quadrado: ${squareId}`);
      console.log(`Iniciando exclusão do quadrado: ${squareType}`);

      await axios.delete(import.meta.env.VITE_BACKEND + `/${squareType}/${squareId}`);

      console.log(`Quadrado ${squareId} excluído com sucesso!`);

      // Atualizar a matriz com os novos dados após a exclusão
      const newData = await fetchData();
      if (newData) {
        setMatrix(newData);
      } else {
        console.error("Erro ao obter os dados atualizados após a exclusão do quadrado.");
      }
    } catch (error) {
      console.error("Erro ao excluir quadrado:", error);
    }
  };




  const [currentCellId, setCurrentCellId] = useState("");
  const [isPickerVisible, setPickerVisible] = useState(false);


  const handleCircleClick = (cellId) => {
    console.log("Clicked on circle with ID: ", cellId);
    console.log("Matrix state: ", matrix); // Verifique se matrix está atualizada
    console.log("cellId: ", cellId);
    setCurrentCellId(cellId);
  };

  useEffect(() => {
    if (currentCellId !== "") {
      console.log("CurrentCellId: ", currentCellId);
      setPickerVisible(true);
    }
  }, [currentCellId]);


  const handlePickerClose = (selectedEmoji) => {
    if (selectedEmoji) {
      getEmojiDataFromNative(selectedEmoji).then((emojiData) => {
        if (currentCellId === 'new' && pendingPostData) {
          const { novoX, rowIndex, colIndex, squarewidth } = pendingPostData;
          postNewCard({ novoX, rowIndex, colIndex, squarewidth }, 'emotion', emojiData.native);
        } else {
          setMatrix((prevMatrix) => {
            const updatedMatrix = prevMatrix.map((row) =>
              row.map((rect) => {
                if (rect.emotion_id === currentCellId) {
                  const updatedRect = {
                    ...rect,
                    emojiTag: emojiData.native,
                  };

                  axios.put(`${import.meta.env.VITE_BACKEND}/emotion`, {
                    emotion_id: rect.emotion_id,
                    posX: rect.x,
                    lineY: rect.lineY,
                    emojiTag: emojiData.native
                  }).then(() => {
                    console.log('Emoji atualizado no backend:', updatedRect);
                  }).catch((error) => {
                    console.error('Erro ao atualizar emoji no backend:', error);
                  });

                  return updatedRect;
                }
                return rect;
              })
            );

            return updatedMatrix;
          });

          setEmojis((prevEmojis) => ({
            ...prevEmojis,
            [currentCellId]: emojiData.native,
          }));
        }
      });
    }
    setPickerVisible(false);
    setPendingPostData(null);
  };


  const [scenario, setScenario] = useState(false)
  const [sceneName, setSceneName] = useState("")
  const [sceneDesc, setSceneDesc] = useState("")
  const [scenarioExists, setScenarioExists] = useState(false);

  const fetchScenarioData = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_BACKEND + `/scenario/${id_mapa}`);
      const scenario = response.data;
      if (scenario) {
        setSceneName(scenario.name);
        setSceneDesc(scenario.description);
        setScenarioExists(true);
      } else {
        setScenarioExists(false);
      }
    } catch (error) {
      console.error("Erro ao buscar os dados do cenário:", error);
    }
  };

  useEffect(() => {
    if (scenario) {
      fetchScenarioData();
    }
  }, [scenario]);

  const handleSaveScenario = async () => {
    try {
      if (scenarioExists) {
        await axios.put(import.meta.env.VITE_BACKEND + '/scenario', {
          journeyMapId: id_mapa,
          newName: sceneName,
          newDescription: sceneDesc
        });
      } else {
        await axios.post(import.meta.env.VITE_BACKEND + '/scenario', {
          journeyMapId: id_mapa,
          name: sceneName,
          description: sceneDesc
        });
      }
    } catch (error) {
      console.error("Erro ao salvar o cenário:", error);
    }
  };

  return (
    <div className="scrollable-container">
      <div style={{ width: "100vw", height: "100vh" }}>
        <>
          {loading && (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
            </div>
          )}
          <Navbar
            onSaveClick={() => { handleSaveClick(); showAlert() }}
            onInfoClick={() => setButtonPopup(true)}
            onScenarioClick={() => { setButtonPopup(true); setScenario(true) }}
            onLogoutClick={handleLogout}
            onMap={onMap}
            onDownload={handleExport}
            handlePostClick={handlePostClick}
            dataLoaded={dataLoaded}
            currentJourneyMap={id_mapa}
          />

          <div className="separator1" style={{ marginTop: "61.9px", width: calculateTotalWidth(matrix) + 2400 }}></div>
          <Popup trigger={buttonPopup} setTrigger={setButtonPopup} setTextEdit={setTextEdit} setScenario={setScenario} style={{ borderRadius: "25px", padding: "20px", backgroundColor: "#f9f9f9", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
            {textEdit ? (
              <>
                <div style={{ textAlign: "left", display: "flex", alignItems: "center" }}>
                  <h1 style={{ fontSize: "36px", marginTop: "20px", marginBottom: "20px", color: "#333" }}>Editar card</h1>
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
                  <div className="separarbotoes" style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex' }}>
                      <button
                        className="buttonconf"
                        onClick={() => { handleTextSubmit(); setButtonPopup(false); setTextEdit(false) }}
                        style={{ backgroundColor: '#4caf50', color: 'white', padding: '10px 40px', borderRadius: '5px', border: 'none', cursor: 'pointer', fontSize: '22px', marginRight: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                      >
                        Salvar texto
                      </button>
                      <button
                        className="buttonconf2"
                        onClick={() => setEditedText('')}
                        style={{ backgroundColor: '#f44336', color: 'white', padding: '10px 40px', borderRadius: '5px', border: 'none', cursor: 'pointer', fontSize: '22px', marginLeft: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                      >
                        Limpar texto
                      </button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <input
                        type="number"
                        id="houseCount"
                        value={selectedHouses}
                        onChange={handleSelectChange}
                        min={1}
                        step={1}
                        className="houseInput"
                        style={{
                          width: '100px',
                          height: '60px',
                          borderRadius: '5px',
                          border: '1px solid #ccc',
                          marginRight: '10px',
                          padding: '5px',
                          fontSize: '28px',
                          textAlign: 'center',
                          position: 'relative'
                        }}
                      />
                      <p style={{ margin: '0', fontSize: '22px', color: '#333' }}>Card(s)</p>
                      <button
                        className="botaosavetamanho"
                        onClick={handleSaveHouse}
                        style={{ backgroundColor: '#4caf50', color: 'white', padding: '10px 20px', borderRadius: '5px', border: 'none', cursor: 'pointer', fontSize: '18px', marginLeft: '10px', width: '100px', height: "60px", display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                      >
                        Salvar
                      </button>
                    </div>
                  </div>
                </div>
              </>

            ) : scenario === true ? (
              <>
                <div style={{ textAlign: "left", display: "flex", alignItems: "center" }}>
                  <h1 style={{ fontSize: "50px" }}>Cenário</h1>
                </div>
                <br />
                <h2>Nome do cenário</h2>
                <input
                  type="text"
                  className="input-texto"
                  value={sceneName}
                  onChange={(e) => setSceneName(e.target.value)}
                  placeholder="Escreva o título..."
                />
                <h2 style={{ marginBottom: "-20px" }}>Descreva o cenário</h2>
                <div className="areatexto">
                  <textarea
                    type="text"
                    className="textolegal"
                    value={sceneDesc}
                    onChange={(e) => setSceneDesc(e.target.value)}
                    placeholder="Escreva o cenário..."
                    style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
                  />
                  <div className="separarbotoes">
                    <button className="buttonconf" onClick={() => { setButtonPopup(false); setScenario(false); handleSaveScenario() }}>
                      Salvar cenário
                    </button>
                    <button className="buttonconf2" onClick={() => { setSceneName(''); setSceneDesc('') }}>
                      Limpar texto
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div style={{ textAlign: "left", display: "flex", alignItems: "center" }}>
                  <h1 style={{ fontSize: "50px" }}>Mapas de jornada</h1>
                  <button className="button info" style={{ marginLeft: "1.5vh", cursor: "auto" }}>
                    i
                  </button>
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", marginTop: "50px" }}>
                  <div style={{ marginRight: "20px", textAlign: "center", width: "80%" }}>
                    <img
                      src="https://github.com/luca-ferro/imagestest/blob/main/mascote.png?raw=true"
                      style={{ width: "100%", maxWidth: "200px" }}
                      alt="Mascote"
                    />
                    <button
                      onClick={() => { handleExport(); }}
                      style={{
                        backgroundColor: "#4CAF50",
                        color: "white",
                        padding: "10px 25px",
                        borderRadius: "5px",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "16px",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                        display: "flex",
                        marginTop: "25px",
                        marginLeft: "27%"
                      }}
                    >
                      <Download size={40} />
                      <p style={{ fontSize: "18px", lineHeight: "1.6" }}>Download</p>
                    </button>
                  </div>
                  <div>
                    <p style={{ fontSize: "25px", lineHeight: "1.6", marginLeft: "40px" }}>
                      Mapas de jornada de usuário são representações visuais que ilustram as etapas pelas quais os usuários passam ao interagir com um produto ou serviço. Eles ajudam a entender a experiência do usuário, identificando pontos de contato, emoções e possíveis obstáculos.
                      <br /> <br />
                      <i>Você pode baixar o seu mapa clicando no botão de download!</i>
                    </p>
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
                  emojiButtonSize={60}
                  perLine={20}
                  maxFrequentRows={10}
                  previewPosition="none"
                  navPosition="bottom"
                  emojiButtonRadius="100%"
                  theme="light"
                  locale="pt"
                  onEmojiSelect={(e) => handlePickerClose(e.native)}
                />
              </div>
            </Popup>
          )}
          {dataLoaded && (
            <div className="stage-container">
              <Stage width={calculateTotalWidth(matrix) + 1260} height={window.innerHeight} ref={stageRef}>
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
          <div className="teste-1" style={{ width: calculateTotalWidth(matrix) + 200 }}>
            <div className="fases-container" style={{ width: calculateTotalWidth(matrix) + 2400 }}>
              <div className="barra1" />
              <div className="fases-content" style={{ width: calculateTotalWidth(matrix) + 2400 }}>
                <div className="fases-text">Fases da Jornada</div>
              </div>
            </div>
            <div className="separator1" style={{ width: calculateTotalWidth(matrix) + 2400 }}></div>
            <div className="fases-container" style={{ width: calculateTotalWidth(matrix) + 2400 }}>
              <div className="barra2" />
              <div className="fases-content" style={{ width: calculateTotalWidth(matrix) + 2400 }}>
                <div className="fases-text">Ações do Usuário</div>
              </div>
            </div>
            <div className="separator1" style={{ width: calculateTotalWidth(matrix) + 2400 }}></div>
            <div className="fases-container" style={{ width: calculateTotalWidth(matrix) + 2400 }}>
              <div className="barra3" />
              <div className="fases-content" style={{ width: calculateTotalWidth(matrix) + 2400 }}>
                <div className="fases-text">Emoções</div>
              </div>
            </div>
            <div className="separator1" style={{ width: calculateTotalWidth(matrix) + 2400 }}></div>
            <div className="fases-container" style={{ width: calculateTotalWidth(matrix) + 2400 }}>
              <div className="barra4" />
              <div className="fases-content" style={{ width: calculateTotalWidth(matrix) + 2400 }}>
                <div className="fases-text">Pensamentos</div>
              </div>
            </div>
            <div className="separator1" style={{ width: calculateTotalWidth(matrix) + 2400 }}></div>
            <div className="fases-container" style={{ width: calculateTotalWidth(matrix) + 2400 }}>
              <div className="barra5" />
              <div className="fases-content" style={{ width: calculateTotalWidth(matrix) + 2400 }}>
                <div className="fases-text">Pontos de Contato</div>
              </div>
            </div>
            <div className="separator1" style={{ width: calculateTotalWidth(matrix) + 2400 }}></div>
          </div>
        </>
      </div>
    </div>
  );

};

export default Tool;
