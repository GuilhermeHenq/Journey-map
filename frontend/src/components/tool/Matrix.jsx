import React from "react";
import { Stage, Layer, Rect, Circle, Text, Group, Image } from "react-konva";
import EditableRect from "./EditableRect";
import useImage from 'use-image'

const Fase = () => {
    const [image] = useImage('https://cdn-icons-png.flaticon.com/512/30/30630.png');
    return <Image image={image} width={20} height={20} />;
};

const Acao = () => {
    const [image] = useImage('https://cdn-icons-png.flaticon.com/512/1589/1589051.png');
    return <Image image={image} width={20} height={20} />;
};

const Pensamento = () => {
    const [image] = useImage('https://cdn-icons-png.flaticon.com/512/2258/2258911.png');
    return <Image image={image} width={20} height={20} />;
};

const Contato = () => {
    const [image] = useImage('https://cdn-icons-png.flaticon.com/512/2199/2199553.png');
    return <Image image={image} width={20} height={20} />;
};

const Matrix = ({ matrix, emojis, setMatrix, handleRectClick, handleTextChange, handleCircleClick, handleDeleteSquare, handleAddSquare, handleDragEnd, handleSquareClick }) => (
    <>
        {matrix.map((row, rowIndex) => (
            row.map((square, colIndex) => (
                <Group
                    key={`square_${rowIndex}_${colIndex}_${square.id}`}
                    draggable={true}
                    x={0}
                    y={0}
                    onDragMove={(e) => {
                        const newY = e.target.y();

                        // Se rowIndex for 2, limita o movimento entre -50 e 50 em y
                        if (rowIndex === 2) {
                            //e.target.y(Math.max(-50, Math.min(50, newY)));
                            e.target.y(0);
                        } else {
                            e.target.y(0);
                        }

                        const newX = e.target.x();
                        e.target.x(newX);
                        e.target.opacity(0.5);
                        e.target.moveToTop();
                    }}
                    onDragEnd={(e) => {
                        const tipo = square.type;
                        const id = square.journeyPhase_id || square.userAction_id || square.emotion_id || square.thought_id || square.contactPoint_id;
                        console.log("O ID ANTES é " + id);
                        console.log("E Target X antes = " + e.target.x());
                        //console.log("E Target Y antes = " + e.target.y());
                        const initialX = square.x; // Posição inicial do quadrado
                        //const initialY = square.y;

                        const intervalWidth = 270; // Largura do intervalo
                        //const intervalWidthY = 50;

                        // Calcula a nova posição x com base na diferença entre a posição do mouse e a posição inicial
                        const diffX = e.target.x() - initialX;
                        let newX = initialX + diffX;

                        //const diffY = e.target.y() - initialY;
                        //let newY = initialY + diffY;

                        // Garante que newX não seja negativo
                        //newX = Math.max(0, newX);

                        // Ajusta para o múltiplo de 270 mais próximo
                        const closestMultiple = Math.round(newX / intervalWidth) * intervalWidth;
                        //const closestMultipleY = Math.round(newY / intervalWidthY) * intervalWidthY;

                        e.target.x(closestMultiple);
                        //e.target.y(closestMultipleY);
                        console.log("newX = " + newX);
                        console.log("E Target X Depois = " + e.target.x());
                        //console.log("E Target Y Depois = " + e.target.y());
                        e.target.opacity(1);
                        handleDragEnd(e, id, tipo, square.width, square.x);
                    }}

                >
                    {/* Botão de adição de quadrados */}
                    <Rect
                        x={rowIndex === 2 ? square.x + 230 : square.width === 230 ? (square.x + 230 * (square.width / 230)) : (square.x + 230 * (square.width / 230))}
                        y={rowIndex === 2 ? square.y + 0 : square.y + 50}
                        width={30}
                        height={30}
                        fill="gray"
                        opacity={1}
                        draggable={false}
                        onClick={() => handleAddSquare(rowIndex, colIndex, square.width)}
                        listening={true}
                        style={{ cursor: 'pointer' }}
                        cornerRadius={10}
                        onMouseEnter={(e) => {
                            const container = e.target.getStage().container();
                            container.style.cursor = "pointer";
                            // e.target.opacity(1);
                        }}
                        onMouseLeave={(e) => {
                            const container = e.target.getStage().container();
                            container.style.cursor = "default";
                            // e.target.opacity(0);
                        }}
                    />

                    <Text
                        x={rowIndex === 2 ? square.x + 236 : square.width === 230 ? (square.x + 236 * (square.width / 230)) : (square.x + 232 * (square.width / 230))}
                        y={rowIndex === 2 ? square.y + 2 : square.y + 52}
                        text="+"
                        fontSize={30}
                        fill="#d9d9d9"
                        align="center"
                        verticalAlign="middle"
                        listening={false}
                        onMouseEnter={(e) => {
                            const container = e.target.getStage().container();
                            container.style.cursor = "pointer";
                            // e.target.opacity(1);
                        }}
                        onMouseLeave={(e) => {
                            const container = e.target.getStage().container();
                            container.style.cursor = "default";
                            // e.target.opacity(0);
                        }}
                    />

                    {/* Resto do seu código */}
                    {rowIndex !== 2 ? (
                        <>
                            <EditableRect
                                key={`square_${square.id}`}
                                id={square.id}
                                x={square.x}
                                y={square.y}
                                width={square.width}
                                height={square.height}
                                color={square.color}
                                onClick={() => {
                                    const id = square.journeyPhase_id || square.userAction_id || square.emotion_id || square.thought_id || square.contactPoint_id;
                                    handleRectClick(square.text, id, square.y)
                                }}
                                onTextChange={(newText) => handleTextChange(rowIndex, colIndex, newText)}
                            />
                            <Text
                                x={square.x + 13}
                                y={square.y}
                                text={square.width === 230 ? 
                                    (square.text && square.text.length > 60 ? `${square.text.slice(0, 57)}...` : square.text)
                                    :
                                    (square.text && square.text.length > 150 ? `${square.text.slice(0, 147)}...` : square.text)
                                }
                                fontSize={20}
                                fill="#000000"
                                width={square.width}
                                height={135}
                                verticalAlign="middle"
                                listening={false}
                                fontFamily="Inter"
                            />
                            <Rect
                                x={square.width === 230 ? (square.x + 210 * (square.width / 230)) : (square.x + 224 * (square.width / 230)) }
                                y={square.y}
                                width={20}
                                height={20}
                                fill="gray"
                                opacity={1}
                                draggable={false}
                                onClick={() => handleDeleteSquare(rowIndex, colIndex)}
                                onTap={() => handleDeleteSquare(rowIndex, colIndex)}
                                listening={true}
                                style={{ cursor: 'pointer' }}
                                cornerRadius={3}
                            />
                            <Text
                                x={square.width === 230 ? (square.x + 216 * (square.width / 230)) : (square.x + 226 * (square.width / 230)) }
                                y={square.y + 5}
                                text="X"
                                fontSize={12}
                                fill="#fff"
                                align="center"
                                verticalAlign="middle"
                                listening={false}
                            />
                            <Circle
                                x={square.x}
                                y={square.y}
                                fill="#f7ef87"
                                stroke="#6E6E6E"
                                strokeWidth={3}
                                width={32}
                                height={32}
                            />
                            <Group x={square.x - 10} y={square.y - 10} >
                                {square.y < 230 ? (
                                    <Fase />
                                ) : square.y > 230 && square.y < 570 ? (
                                    <Acao />
                                ) : square.y > 570 && square.y < 740 ? (
                                    <Pensamento />
                                ) : square.y > 740 ? (
                                    <Contato />
                                ) : null}
                            </Group>
                        </>
                    ) : (
                        <>
                            {console.log("Line y aqui o:" + square.lineY)}
                            <Text
                                x={square.x + 60 - 18}  // Ajuste conforme necessário
                                y={square.y - 10}       // Ajuste conforme necessário + square.lineY 
                                fontSize={40}           // Ajuste conforme necessário
                                fill="#000"             // Ajuste conforme necessário
                                align="center"
                                verticalAlign="middle"
                                text={emojis[square.journeyPhase_id || square.userAction_id || square.emotion_id || square.thought_id || square.contactPoint_id] || "🔴"}
                                onClick={() => {
                                    const id = square.journeyPhase_id || square.userAction_id || square.emotion_id || square.thought_id || square.contactPoint_id;
                                    handleCircleClick(id);
                                }}
                            />

                            <Rect
                                x={square.x + 100}
                                y={square.y + 20}
                                width={20}
                                height={20}
                                fill="gray"
                                opacity={1}
                                draggable={false}
                                onClick={() => handleDeleteSquare(rowIndex, colIndex)}
                                onTap={() => handleDeleteSquare(rowIndex, colIndex)}
                                listening={true}
                                style={{ cursor: 'pointer' }}
                                cornerRadius={40}
                            />
                            <Text
                                x={square.x + 106}
                                y={square.y + 25}
                                text="X"
                                fontSize={12}
                                fill="#fff"
                                align="center"
                                verticalAlign="middle"
                                listening={false}
                            />
                        </>
                    )}
                </Group>
            ))
        ))}
        {matrix.map((row, rowIndex) => {
            // Encontrar o quadrado com o maior valor de x na linha
            const maxXSquare = row.reduce((maxSquare, currentSquare) => {
                return currentSquare.x > (maxSquare ? maxSquare.x : -Infinity) ? currentSquare : maxSquare;
            }, null);

            return (
                <Group key={`addButtonRow_${rowIndex}`}
                    onMouseEnter={(e) => {
                        const container = e.target.getStage().container();
                        container.style.cursor = "pointer";
                        e.target.opacity(1);
                    }}
                    onMouseLeave={(e) => {
                        const container = e.target.getStage().container();
                        container.style.cursor = "default";
                        e.target.opacity(0);
                    }}
                >
                    {/* Quadrado maior */}
                    <Rect
                        x={maxXSquare ? (maxXSquare.width === 230 ? maxXSquare.x + 259 * maxXSquare.width / 230  : maxXSquare.x + 282 * maxXSquare.width / 270) : 30}
                        y={rowIndex === 2 ? rowIndex * 170 + 117 : rowIndex * 170 + 104}
                        width={60}
                        height={45}
                        fill="gray"
                        opacity={0}
                        draggable={false}
                        onClick={() => handleAddSquare(rowIndex, (row.length - 1))}
                        listening={true}
                        style={{ cursor: 'pointer' }}
                        cornerRadius={10}
                    />
                    <Text
                        x={maxXSquare ? (maxXSquare.width === 230 ? maxXSquare.x + 273 * maxXSquare.width / 230  : maxXSquare.x + 287 * maxXSquare.width / 270) : 45}
                        y={rowIndex === 2 ? rowIndex * 170 + 117 : rowIndex * 170 + 104}
                        text="+"
                        fontSize={50}
                        fill='#d9d9d9'
                        align="center"
                        verticalAlign="middle"
                        listening={false}
                        opacity={1}
                    />
                </Group>
            );
        })}

    </>
);

export default Matrix;