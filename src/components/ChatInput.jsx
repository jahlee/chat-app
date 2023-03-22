import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileImage } from "@fortawesome/free-regular-svg-icons";
import "../styling/ChatInput.css";

export default function ChatInput(props) {
  const { sendMessage } = props;
  const [chatInputValue, setChatInputValue] = useState("");
  const [files, setFiles] = useState(null);

  function handleChatInputChange(event) {
    setChatInputValue(event.target.value);
    console.log("changed value to: ", chatInputValue);
  }

  function handleEnter(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage(event);
    }
  }

  function handleFilesChange(event) {
    setFiles(event.target.files);
    console.log("files:", files);
  }

  function handleSendMessage(event) {
    // prevent form from beng submitted + page refresh
    event.preventDefault();
    // display message on frontend
    // need prop of function that changes frontend messages
    // send data to backend
    sendMessage(chatInputValue, files);
    console.log(chatInputValue, "sent");
    setChatInputValue("");
    setFiles(null);
  }

  return (
    <form onSubmit={handleSendMessage} className="chat-input">
      <label htmlFor="file-input" className="chat-input-file-button">
        <FontAwesomeIcon icon={faFileImage} />
      </label>
      <input
        type="file"
        id="file-input"
        onChange={handleFilesChange}
        className="chat-input-file"
      />
      <textarea
        type="text"
        placeholder="Type a message..."
        value={chatInputValue}
        onChange={handleChatInputChange}
        onKeyDown={handleEnter}
        className="chat-input-message"
      />
      <button type="submit" className="chat-input-send-button">
        Send
      </button>
    </form>
  );
}
