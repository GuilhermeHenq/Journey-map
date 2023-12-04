import React, { useState } from 'react';
import { Rect, Group } from 'react-konva';
import Modal from './Modal';

const EditableRect = ({ x, y, width, height, color, text, onTextChange, isActive, onActivate }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleClick = () => {
    setIsEditing(true);
    onActivate();
  };

  const handleCloseModal = () => {
    setIsEditing(false);
  };

  const handleSaveModal = (newText) => {
    onTextChange(newText);
    setIsEditing(false);
  };

  return (
    <>
      <Rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={isActive ? 'yellow' : color}
        opacity={1}
        draggable={false}
        onClick={handleClick}
        onTap={handleClick}
        listening={true}
      />
      {isEditing && (
        <Modal
          isOpen={isEditing}
          onClose={handleCloseModal}
          onSave={handleSaveModal}
        />
      )}
    </>
  );
};

export default EditableRect;
