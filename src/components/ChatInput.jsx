import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileImage, faFile } from "@fortawesome/free-regular-svg-icons";
import "../styling/ChatInput.css";

export default function ChatInput(props) {
  const { sendMessage } = props;
  const [chatInputValue, setChatInputValue] = useState("");
  const [files, setFiles] = useState([]);
  const [previewURLs, setPreviewURLs] = useState([]);
  const [fileError, setFileError] = useState(null);
  const MAX_FILES = 5;
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB in bytes

  useEffect(() => {
    console.log("files:", files);
  }, [files]);

  useEffect(() => {
    console.log("urls:", previewURLs);
  }, [previewURLs]);

  useEffect(() => {
    console.log("error:", fileError);
  }, [fileError]);

  function handleChatInputChange(event) {
    setChatInputValue(event.target.value);
  }

  function handleEnter(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage(event);
    }
  }

  function handleFilesChange(event) {
    console.log(event);
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
    // prevent form from beng submitted + page refresh
    event.preventDefault();
    // display message on frontend
    // need prop of function that changes frontend messages
    // send data to backend
    if (chatInputValue || files) {
      sendMessage(chatInputValue, files);
      console.log(chatInputValue, "sent");
      setChatInputValue("");
      setFiles(null);
      for (const urlObj of previewURLs) {
        URL.revokeObjectURL(urlObj.url);
      }
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
