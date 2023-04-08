import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileImage, faFile } from "@fortawesome/free-regular-svg-icons";
import "../styling/ChatInput.css";

/**
 * The input section of the conversation where you can add text and files
 *
 * @param {Function} sendMessage - Handle sending a message
 * @param {Function} handleTyping - Update value of message to be sent
 */
export default function ChatInput({ sendMessage, handleTyping }) {
  const [chatInputValue, setChatInputValue] = useState("");
  const [files, setFiles] = useState([]);
  const [previewURLs, setPreviewURLs] = useState([]);
  const [fileError, setFileError] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const MAX_FILES = 5;
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB in bytes
  const typingTimer = useRef(null);

  useEffect(() => {
    handleTyping(isTyping);
  }, [isTyping]);

  // if the user stops typing for 5 seconds, set isTyping to false
  useEffect(() => {
    if (!isTyping && chatInputValue !== "") setIsTyping(true);
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      setIsTyping(false);
    }, 5000);
  }, [chatInputValue]);

  function handleChatInputChange(event) {
    setChatInputValue(event.target.value);
  }

  function handleEnter(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      setIsTyping(false);
      handleSendMessage(event);
    }
  }

  function handleFilesChange(event) {
    const uploadedFiles = event.target.files;
    if (uploadedFiles.length > MAX_FILES) {
      setFileError("Cannot have more than 5 files uploaded at a time");
      return;
    }
    const previewArray = [];
    for (const file of uploadedFiles) {
      if (file.size > MAX_FILE_SIZE) {
        setFileError("Cannot upload files larger than 10MB");
        return;
      }
      const urlObj = {
        url: URL.createObjectURL(file),
        type: file.type.includes("image") ? "image" : "file",
      };
      previewArray.push(urlObj);
    }
    setFiles(uploadedFiles);
    setPreviewURLs(previewArray);
    setFileError(null);
  }

  function handleRemovePreview(idx) {
    const newPreviewURLs = [];
    const newFiles = [];
    for (let i = 0; i < previewURLs.length; i++) {
      if (i !== idx) {
        newPreviewURLs.push(previewURLs[i]);
        newFiles.push(files[i]);
      }
    }
    setPreviewURLs(newPreviewURLs);
    setFiles(newFiles);
  }

  function renderPreviews() {
    return (
      <div className="previews-container">
        {previewURLs.map((urlObj, idx) => (
          <div className="preview-container" key={urlObj.url}>
            <button
              className="remove-preview"
              onClick={() => handleRemovePreview(idx)}
            >
              X
            </button>
            {urlObj.type === "file" ? (
              <FontAwesomeIcon icon={faFile} className="preview" />
            ) : (
              <img src={urlObj.url} alt="" className="preview" />
            )}
          </div>
        ))}
      </div>
    );
  }

  function handleSendMessage(event) {
    // prevents form from being submitted (page refresh)
    event.preventDefault();
    if (chatInputValue || files) {
      sendMessage(chatInputValue, files);
      setChatInputValue("");
      setFiles([]);
      for (const urlObj of previewURLs) {
        URL.revokeObjectURL(urlObj.url);
      }
      setPreviewURLs([]);
    }
  }

  return (
    <form onSubmit={handleSendMessage} className="chat-input">
      <label htmlFor="file-input" className="chat-input-file-button">
        <FontAwesomeIcon icon={faFileImage} />
      </label>
      <div className="input-container">
        <div className="file-container">
          <input
            type="file"
            id="file-input"
            key={files.length}
            accept="application/pdf, image/*"
            onChange={handleFilesChange}
            className="chat-input-file"
            multiple
          />
          {previewURLs.length > 0 && renderPreviews()}
        </div>
        {fileError && <div className="file-error">{fileError}</div>}
        <textarea
          type="text"
          placeholder="Type a message..."
          value={chatInputValue}
          onChange={handleChatInputChange}
          onKeyDown={handleEnter}
          className="chat-input-message"
        />
      </div>
      <button type="submit" className="chat-input-send-button">
        Send
      </button>
    </form>
  );
}
