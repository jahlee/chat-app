import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import "../styling/Modal.css";

/**
 * A modal/popup that displays a children component
 *
 * @param {Function} onClose - action when close modal
 * @param {Component} children - component to show in modal
 */
const Modal = ({ onClose, children }) => {
  const modalRef = useRef();

  // Define the keydown handler for the escape key
  const closeOnEscapeKeyDown = (e) => {
    if ((e.charCode || e.keyCode) === 27 || e.key === "Escape") {
      onClose();
    }
  };

  useEffect(() => {
    // Add event listeners for clicks outside of the modal and for the escape key
    document.body.addEventListener("keydown", closeOnEscapeKeyDown);
    return function cleanup() {
      document.body.removeEventListener("keydown", closeOnEscapeKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ReactDOM.createPortal(
    <div className="modal" onClick={onClose} ref={modalRef}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          X
        </button>
        {children}
      </div>
    </div>,
    document.getElementById("root")
  );
};

export default Modal;
