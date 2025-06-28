import React from "react";
import "./Card.css";

export const Card = ({ 
  children, 
  className = "", 
  onClick, 
  hoverable = true 
}) => {
  return (
    <div 
      className={`card ${hoverable ? 'card-hoverable' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const CardContainer = ({ children, className = "" }) => {
  return (
    <div className={`card-container ${className}`}>
      {children}
    </div>
  );
}; 