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
      className={`product-card ${hoverable ? 'product-card-hoverable' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const CardContainer = ({ children, className = "" }) => {
  return (
    <div className={`product-grid ${className}`}>
      {children}
    </div>
  );
}; 