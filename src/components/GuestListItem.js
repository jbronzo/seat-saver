import React from 'react';

const GuestListItem = ({ guest, onDragStart }) => {
  const handleDragStart = (e) => {
    onDragStart(e, guest, null);
  };

  return (
    <li
      className="list-group-item mb-1"
      draggable
      data-name={guest}
      onDragStart={handleDragStart}
      style={{ cursor: 'grab' }}
    >
      {guest}
    </li>
  );
};

export default GuestListItem;