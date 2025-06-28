import React from "react";
import "./Modal.css";

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  isLoading = false,
  maxWidth = "700px"
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth }}
      >
        <div className="modal-header">
          <h2>{title}</h2>
          <button
            className="modal-close"
            onClick={handleClose}
            disabled={isLoading}
            aria-label="Закрыть"
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}; 