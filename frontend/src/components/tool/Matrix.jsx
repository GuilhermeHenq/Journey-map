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
                                width={230}
                                height={135}
                                color={square.color}
                                onTextChange={(newText) => handleTextChange(rowIndex, colIndex, newText)}
                                isActive={activeRect === square.id}
                                onActivate={() => setActiveRect(square.id)}
                            />
                            <Text
                                x={square.x + 13}
                                y={square.y + 13}
                                text={square.text}
                                fontSize={20}
                                fill="#000000"
                                width={200}
                                height={125}
                                listening={false}
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
                // e.target.opacity(1);
            }}
            onMouseLeave={(e) => {
                const container = e.target.getStage().container();
                container.style.cursor = "default";
                // e.target.opacity(0);
            }}
            >
                <Rect
                    x={row.length > 0 ? row[row.length - 1].x + 259 : 30}
                    y={rowIndex * 170 + 104}
                    width={60}
                    height={45}
                    fill="gray"
                    opacity={1}
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
        {matrix.map((row, rowIndex) => (
            <Group key={`addButtonRow_${rowIndex}`}>
                {row.map((square, colIndex) => (
                    <Group key={`addButton_${square.id}`}
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
                    >
                        <Rect
                            x={square.x + 230}
                            y={square.y + 50}
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
                        />
                    </Group>
                ))}
            </Group>
        ))}
    </>
);

export default Matrix;