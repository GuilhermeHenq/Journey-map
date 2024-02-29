import React from "react";
import { Rect, Circle, Text, Group, Image } from "react-konva";
import EditableRect from "./EditableRect";
import useImage from 'use-image';

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

const Matrix = ({ matrix, activeRect, handleTextSubmit, handleTextChange, setActiveRect, handleDeleteSquare, handleAddSquare, onDragMove, onDragEnd, handleSquareClick }) => (
    <>
        {matrix.map((square) => (
            <Group
                key={`square_${square.id}`}
                draggable={true}
                x={0}
                y={0}
                onDragMove={(e) => {
                    const newX = e.target.x();
                    e.target.x(newX);
                    e.target.y(0);
                    e.target.opacity(0.5);
                    e.target.moveToTop();
                }}
                onDragEnd={(e) => {
                    const newX = Math.round(e.target.x() / 260) * 260;
                    e.target.x(newX);
                    e.target.opacity(1);
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
                    onClick={() => handleAddSquare(square.id)}
                    onTap={() => handleAddSquare(square.id)}
                    listening={true}
                    style={{ cursor: 'pointer' }}
                    cornerRadius={10}
                />
                <Text
                    x={square.x + 236.5} // Ajuste conforme necessário
                    y={square.y + 53} // Ajuste conforme necessário
                    text="+"
                    fontSize={30}
                    fill="#d9d9d9"
                    align="center"
                    verticalAlign="middle"
                    listening={false}
                />

                {/* Resto do seu código */}
                {square.rowIndex !== 2 ? (
                    <>
                        <EditableRect
                            key={`square_${square.id}`}
                            x={square.x}
                            y={square.y}
                            width={230}
                            height={135}
                            color={square.color}
                            onClick={() => handleSquareClick(square.text, square.id)}
                            onTextChange={(newText) => handleTextChange(square.rowIndex, square.colIndex, newText)}
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
                                onClick={() => handleTextSubmit(square.rowIndex, square.colIndex)}
                                onTap={() => handleTextSubmit(square.rowIndex, square.colIndex)}
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
                            onClick={() => handleDeleteSquare(square.rowIndex, square.colIndex)}
                            onTap={() => handleDeleteSquare(square.rowIndex, square.colIndex)}
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
                        <Circle
                            x={square.x + 60}
                            y={square.y}
                            radius={10}
                            fill={square.color}
                            opacity={1}
                            draggable={false}
                            listening={true}
                            style={{ cursor: 'pointer' }}
                        />
                        <Rect
                            x={square.x + 100}
                            y={square.y + 20}
                            width={20}
                            height={20}
                            fill="gray"
                            opacity={1}
                            draggable={false}
                            onClick={() => handleDeleteSquare(square.rowIndex, square.colIndex)}
                            onTap={() => handleDeleteSquare(square.rowIndex, square.colIndex)}
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
                {/* Quadrado maior */}
                <Rect
                    x={row.length > 0 ? row[row.length - 1].x + 259 : 290}
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
                    x={row.length > 0 ? row[row.length - 1].x + 273 : 303}
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
