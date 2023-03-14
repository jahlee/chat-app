import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileImage } from "@fortawesome/free-regular-svg-icons";
import '../styling/Input.css';


export default function Input() {
    const [inputValue, setInputValue] = useState('');
    const [file, setFile] = useState(null);

    function handleInputChange(event) {
        setInputValue(event.target.value);
        console.log ('changed value to: ', inputValue);
    }

    function handleEnter(event) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage(event);
        }
    }

    function handleFileChange(event) {
        setFile(event.target.files);
        console.log('file:', file);
    }

    function handleSendMessage(event) {
        // prevent form from beng submitted + page refresh
        event.preventDefault();
        // display message on frontend
            // need prop of function that changes frontend messages
        // send data to backend
        console.log(inputValue, 'sent')
        setInputValue('');
        setFile(null);
    }

  return (
    <form onSubmit={handleSendMessage} className="chat-input">
      <label htmlFor="file-input" className="chat-input-file-button">
        <FontAwesomeIcon icon={faFileImage} />
      </label>
      <input
        type="file"
        id="file-input"
        onChange={handleFileChange}
        className="chat-input-file"
      />
      <textarea
        type="text"
        placeholder="Type a message..."
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleEnter}
        className="chat-input-message"
      />
      <button type="submit" className="chat-input-send-button">
        Send
      </button>
    </form>
  );
}
