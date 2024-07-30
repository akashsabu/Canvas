import React, { useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";

import { setTool, setStroke, setColor, setFillColor } from "../../../features/toolSlice";

const Toolbar = () => {
  const dispatch = useDispatch();

  const [currentColor, setCurrentColor] = useState("#000000"); // Initial color black
  const [currentFillColor, setCurrentFillColor] = useState("#000000"); // Initial color black
  const [currentStrokeSize, setCurrentStrokeSize] = useState(1); // Initial stroke size 1

  const handleColorChange = (e) => {
    const newColor = e.target.value;
    setCurrentColor(newColor);
    dispatch(setColor(newColor));
  };
  const handleFillColorChange = (e) => {
    const newColor = e.target.value;
    setCurrentFillColor(newColor);
    dispatch(setFillColor(newColor));
  };

  const handleStrokeSizeChange = (e) => {
    const newStrokeSize = parseInt(e.target.value, 10);
    setCurrentStrokeSize(newStrokeSize);
    dispatch(setStroke(newStrokeSize));
  };

  const handleToolChange = (tool) => {
    dispatch(setTool(tool));
  };

  return (
    <Container>
      <Button onClick={() => handleToolChange("select")}>Select</Button>
      <Button onClick={() => handleToolChange("pencil")}>pencil</Button>

      <Button onClick={() => handleToolChange("rectangle")}>Rectangle</Button>
      <Button onClick={() => handleToolChange("line")}>Line</Button>
      
      <Button onClick={() => handleToolChange("circle")}>Circle</Button>
      <Button onClick={() => handleToolChange("semi-circle")}>
        Semi-circle
      </Button>
      <Button onClick={() => handleToolChange("fill")}>Fill</Button>
     
     
      <ColorInput
        type="color"
        value={currentFillColor}
        onChange={handleFillColorChange}
        title="Choose fill color"
      />
      
      <StrokeLabel>Stroke Color:</StrokeLabel>
      <ColorInput
        type="color"
        value={currentColor}
        onChange={handleColorChange}
        title="Choose color"
      />
      <StrokeLabel>Stroke Size:</StrokeLabel>
      <StrokeSizeInput
        type="number"
        value={currentStrokeSize}
        onChange={handleStrokeSizeChange}
        min="1"
        max="10"
        title="Choose stroke size"
      />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-right: 10px;
`;

const Button = styled.button`
  width: 100px;
  margin: 5px;
  padding: 5px 8px;
  font-size: 14px;
  cursor: pointer;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 4px;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const ColorInput = styled.input`
  width: 100px;
  margin: 5px;
  padding: 5px;
  cursor: pointer;
`;

const StrokeLabel = styled.label`
  width: 100px;
  margin: 5px;
  font-size: 14px;
`;

const StrokeSizeInput = styled.input`
  width: 100px;
  box-sizing: border-box;
  margin: 5px;
  padding: 5px;
  font-size: 14px;
`;

export default Toolbar;
