import React, { useState } from 'react';

const Modal = ({ isOpen, onClose, onSave }) => {
  const [text, setText] = useState('');

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleSave = () => {
    onSave(text);
    setText('');
    onClose();
  };

  return (
    <div className={`modal ${isOpen ? 'open' : ''}`}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <input type="text" value={text} onChange={handleTextChange} />
        <button onClick={handleSave}>Salvar</button>
      </div>
    </div>
  );
};

export default Modal;
