import React, { useState } from 'react';
import { Rect } from 'react-konva';
import Modal from './Modal';

const EditableRect = ({ x, y, width, height, color, text, onTextChange, isActive, onActivate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [textTest, setTextTest] = useState(text);

  const myFunction = () => {
    let person = prompt("Insira o texto:", textTest);
    if (person == null || person === "") {
      alert("Cancelou ou apagou o texto.");
      setTextTest("");
      onTextChange("");
    } else {
      setTextTest(person);
      onTextChange(person);
    }
    setIsEditing(true);
  };

  return (
    <>
      <Rect
        x={x}
        y={y}
        text={textTest}
        width={width}
        height={height}
        fill={isActive ? 'yellow' : color}
        opacity={1}
        draggable={false}
        onClick={myFunction}
        listening={true}
        cornerRadius={8}
        onMouseEnter={(e) => {
          const container = e.target.getStage().container();
          container.style.cursor = "pointer";
        }}
        onMouseLeave={(e) => {
          const container = e.target.getStage().container();
          container.style.cursor = "default";
        }}
      />
      {/* {isEditing && (
        <Modal
          isOpen={isEditing}
          onClose={handleCloseModal}
          onSave={handleSaveModal}
        />
      )} */}
    </>
  );
};

export default EditableRect;