import React, { useState, useRef } from "react";
import AvatarEditor from "react-avatar-editor";
import FileUpload from "../../FileUpload";
import Button from "../../Button";

const AvatarStep = ({ onSave }) => {
  const [selectedFile, setSelectedFile] = useState([]);
  const editorRef = useRef(null);
  const [scale, setScale] = useState(1.2);

  const handleSave = () => {
    if (editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas();
      onSave(canvas.toDataURL());
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <FileUpload
        accept="image/*"
        multiple={false}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
      />

      {selectedFile.length > 0 && (
        <div className="flex flex-col items-center space-y-4">
          <AvatarEditor
            ref={editorRef}
            image={selectedFile[0]}
            width={200}
            height={200}
            border={50}
            borderRadius={100}
            color={[255, 255, 255, 0.6]}
            scale={scale}
            rotate={0}
          />

          <input
            type="range"
            min="1"
            max="3"
            step="0.1"
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
            className="custom-input"
          />

          <Button onClick={handleSave}>Save Avatar</Button>
        </div>
      )}
    </div>
  );
};

export default AvatarStep;
