import React from "react";
import { Stage, Layer, Rect, Circle, Text, Group } from "react-konva";
import EditableRect from "./EditableRect";

const Matrix = ({ matrix, activeRect, handleTextSubmit, handleTextChange, setActiveRect, handleDeleteSquare, handleAddSquare, onDragMove, onDragEnd }) => (
    <>
        {matrix.map((row, rowIndex) => (
            row.map((square, colIndex) => (
                <Group key={`square_${square.id}`}>
                    {rowIndex !== 2 ? (
                        <>
                            <EditableRect
                                key={`square_${square.id}`}
                                x={square.x}
                                y={square.y}
                                width={square.width}
                                height={square.height}
                                color={square.color}
                                text={square.text || ""}
                                onTextChange={(newText) => handleTextChange(rowIndex, colIndex, newText)}
                                isActive={activeRect === square.id}
                                onActivate={() => setActiveRect(square.id)}
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
                                x={square.x + square.width - 20}
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
                            />
                            <Text
                                x={square.x + square.width - 13}
                                y={square.y + 5}
                                text="X"
                                fontSize={12}
                                fill="#fff"
                                align="center"
                                verticalAlign="middle"
                                listening={false}
                            />
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
                                onClick={() => handleDeleteSquare(rowIndex, colIndex)}
                                onTap={() => handleDeleteSquare(rowIndex, colIndex)}
                                listening={true}
                                style={{ cursor: 'pointer' }}
                                cornerRadius={10}
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
            <Group key={`addButtonRow_${rowIndex}`}>
                <Rect
                    x={row.length > 0 ? row[row.length - 1].x + 150 : 30}
                    y={rowIndex * 100 + 80}
                    width={60}
                    height={45}
                    fill={"gray"}
                    opacity={1}
                    draggable={false}
                    onClick={() => handleAddSquare(rowIndex)}
                    onTap={() => handleAddSquare(rowIndex)}
                    listening={true}
                    style={{ cursor: 'pointer' }}
                    cornerRadius={10}
                />
                <Text
                    x={row.length > 0 ? row[row.length - 1].x + 165 : 45}
                    y={rowIndex * 100 + 82}
                    text="+"
                    fontSize={50}
                    fill="#fff"
                    align="center"
                    verticalAlign="middle"
                    listening={false}
                />
            </Group>
        ))}
    </>
);

export default Matrix;
