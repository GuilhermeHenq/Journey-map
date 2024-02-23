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

const Matrix = ({ matrix, activeRect, handleTextSubmit, currentEmoji, handleTextChange, handleCircleClick, setActiveRect, handleDeleteSquare, handleAddSquare, onDragMove, onDragEnd, handleSquareClick }) => (
    <>
        {matrix.map((row, rowIndex) => (
            row.map((square, colIndex) => (
                <Group
                    key={`square_${rowIndex}_${colIndex}_${square.id}`}
                    draggable={true}
                    x={0}
                    y={0}
                    onDragMove={(e) => {
                        const newX = e.target.x();
                        //console.log("Começou movem com = " + newX);
                        e.target.x(newX);
                        //console.log("Começou movem com e target = " + e.target.x());
                        e.target.y(0);
                        e.target.opacity(0.5);
                        e.target.moveToTop();
                        onDragMove(e);
                    }}
                    onDragEnd={(e) => {
                        const tipo = square.type;
                        const id = square.journeyPhase_id || square.userAction_id || square.emotion_id || square.thought_id || square.contactPoint_id; // Use a propriedade de ID específica
                        console.log("E Target X antes = " + e.target.x());
                        const newX = e.target.x();
                        const minX = 20;
                        const maxX = 780;
                        const restrictedX = Math.max(minX, Math.min(newX, maxX));
                        e.target.x(restrictedX);
                        console.log("newX = " + newX);
                        console.log("E Target X Depois = " + e.target.x());
                        e.target.opacity(1);
                        onDragEnd(e, id, tipo);
                    }}
                >
                    {/* Botão de adição de quadrados */}
                    <Rect
                        x={square.x + 230} // Ajuste conforme necessário
                        y={square.y + 50} // Ajuste conforme necessário
                        width={30}
                        height={30}
                        fill="gray"
                        opacity={1}
                        draggable={false}
                        onClick={() => handleAddSquare(rowIndex, colIndex)}
                        onTap={() => handleAddSquare(rowIndex, colIndex)}
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
                        x={square.x + 236.5}
                        y={square.y + 53}
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
                                width={230}
                                height={135}
                                color={square.color}
                                onClick={() => handleSquareClick(square.text, square.id, square.y)}
                                onTextChange={(newText) => handleTextChange(rowIndex, colIndex, newText)}
                                isActive={activeRect === square.id}
                                onActivate={() => setActiveRect(square.id)}
                            />
                            <Text
                                x={square.x + 13}
                                y={square.y}
                                text={square.text && square.text.length > 60 ? `${square.text.slice(0, 57)}...` : square.text}
                                fontSize={20}
                                fill="#000000"
                                width={200}
                                height={135}
                                verticalAlign="middle"
                                listening={false}
                                fontFamily="Inter"
                            />
                            {activeRect === square.id && (
                                <Rect
                                    x={square.x + square.width}
                                    y={square.y}
                                    width={30}
                                    height={30}
                                    fill="green"
                                    opacity={1}
                                    draggable={false}
                                    onClick={() => handleTextSubmit(rowIndex, colIndex)}
                                    onTap={() => handleTextSubmit(rowIndex, colIndex)}
                                    listening={true}
                                    style={{ cursor: 'pointer' }}
                                />
                            )}
                            <Rect
                                x={square.x + 210}
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
                                x={square.x + 216}
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
                            <Text
                                x={square.x + 60 - 18}  // Ajuste conforme necessário
                                y={square.y - 10}       // Ajuste conforme necessário
                                fontSize={40}           // Ajuste conforme necessário
                                fill="#000"             // Ajuste conforme necessário
                                align="center"
                                verticalAlign="middle"
                                text={currentEmoji || "+" }
                                onClick={handleCircleClick}
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
        {matrix.map((row, rowIndex) => (
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
                <Rect
                    x={row.length > 0 ? row[row.length - 1].x + 259 : 30}
                    y={rowIndex * 170 + 104}
                    width={60}
                    height={45}
                    fill="gray"
                    opacity={0}
                    draggable={false}
                    onClick={() => handleAddSquare(rowIndex)}
                    onTap={() => handleAddSquare(rowIndex)}
                    listening={true}
                    style={{ cursor: 'pointer' }}
                    cornerRadius={10}
                />
                <Text
                    x={row.length > 0 ? row[row.length - 1].x + 273 : 45}
                    y={rowIndex * 170 + 106}
                    text="+"
                    fontSize={50}
                    fill='#d9d9d9'
                    align="center"
                    verticalAlign="middle"
                    listening={false}
                    opacity={1}
                />
            </Group>
        ))}
    </>
);

export default Matrix;