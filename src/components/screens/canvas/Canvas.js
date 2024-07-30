import React, { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import Toolbar from "./Toolbar";
import logo from '../../../assets/images/logo.png'


const Canvas = () => {
  const can_name = useSelector((state) => state.projectProps.value.name);
  const can_height = useSelector((state) => state.projectProps.value.height);
  const can_width = useSelector((state) => state.projectProps.value.width);

  const tool = useSelector((state) => state.toolProps.value.tool);
  const tool_color = useSelector((state) => state.toolProps.value.color);
  const tool_fill_color = useSelector(
    (state) => state.toolProps.value.fillColor
  );
  const tool_stroke_width = useSelector(
    (state) => state.toolProps.value.stroke_width
  );


  const canvasRef = useRef(null);
  const [elements, setElements] = useState([]);
  const [currentElement, setCurrentElement] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedElement, setSelectedElement] = useState(null);
  const [action, setAction] = useState(null);
  // const [undoStack, setUndoStack] = useState([]);
  // const [redoStack, setRedoStack] = useState([]);
  const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 });
  const [cursorStyle, setCursorStyle] = useState("default");
  const [isMouseDown, setIsMouseDown] = useState(false); // New state to track mouse down

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvasRef.current.width = can_width;
    canvasRef.current.height = can_height;

    // Redraw all elements
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    elements.forEach((element) => {
      drawElement(ctx, element);
    });

    // Highlight selected element
    if (selectedElement) {
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      drawElement(ctx, selectedElement);
      ctx.strokeStyle = "black";
      ctx.lineWidth = 1;
    }
  }, [elements, selectedElement]);

  const drawElement = (ctx, element) => {
    ctx.beginPath();
    if (element.type === "rectangle") {
      ctx.rect(element.x, element.y, element.width, element.height);
      if (element.fillColor) {
        ctx.fillStyle = element.fillColor;
        ctx.fill();
      }
      ctx.strokeStyle = element.color || "black";
      ctx.lineWidth = element.strokeSize || 1;
      ctx.stroke();
    } else if (element.type === "line") {
      ctx.moveTo(element.x1, element.y1);
      ctx.lineTo(element.x2, element.y2);
      ctx.strokeStyle = element.color || "black";
      ctx.lineWidth = element.strokeSize || 1;
      ctx.stroke();
    } else if (element.type === "circle") {
      const radius = Math.sqrt(
        Math.pow(element.x2 - element.x1, 2) +
          Math.pow(element.y2 - element.y1, 2)
      );
      ctx.arc(element.x1, element.y1, radius, 0, 2 * Math.PI);
      if (element.fillColor) {
        ctx.fillStyle = element.fillColor;
        ctx.fill();
      }
      ctx.strokeStyle = element.color || "black";
      ctx.lineWidth = element.strokeSize || 1;
      ctx.stroke();
    } else if (element.type === "semi-circle") {
      const radius = Math.sqrt(
        Math.pow(element.x2 - element.x1, 2) +
          Math.pow(element.y2 - element.y1, 2)
      );
      const angle = Math.atan2(
        element.y2 - element.y1,
        element.x2 - element.x1
      );

      ctx.translate(element.x1, element.y1);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI);
      ctx.closePath();
      ctx.lineTo(-radius, 0);
      if (element.fillColor) {
        ctx.fillStyle = element.fillColor;
        ctx.fill();
      }
      ctx.strokeStyle = element.color || "black";
      ctx.lineWidth = element.strokeSize || 1;
      ctx.stroke();
      ctx.rotate(-angle);
      ctx.translate(-element.x1, -element.y1);
    } else if (element.type === "fill") {
      fill(ctx, element.x, element.y, element.color);
    }
  };

  const handleMouseDown = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    setLastMousePosition({ x: offsetX, y: offsetY });
    setIsMouseDown(true); // Mouse button is down

    if (tool === "select") {
      const foundElement = getElementAtPosition(offsetX, offsetY, elements);
      if (foundElement) {
        setSelectedElement(foundElement);
        const resizeHandle = getResizeHandlePosition(
          offsetX,
          offsetY,
          foundElement
        );
        if (resizeHandle) {
          setAction(resizeHandle);
        } else {
          setAction("moving");
        }
      } else {
        setSelectedElement(null);
      }
    } else if (tool === "fill") {
      const newElement = {
        id: elements.length,
        type: tool,
        x: offsetX,
        y: offsetY,
        color: tool_fill_color,
      };
      setElements((prevElements) => [...prevElements, newElement]);
    } else {
      setIsDrawing(true);
      const newElement = {
        id: elements.length,
        type: tool,
        x: offsetX,
        y: offsetY,
        width: 0,
        height: 0,
        x1: offsetX,
        y1: offsetY,
        x2: offsetX,
        y2: offsetY,
        color: tool_color,
        // fillColor: tool_fill_color,
        strokeSize: tool_stroke_width,
      };
      setCurrentElement(newElement);
    }
  };

  const handleMouseMove = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;

    if (isDrawing) {
      setCurrentElement((prevElement) => {
        if (!prevElement) return null;
        const updatedElement = { ...prevElement };

        if (tool === "rectangle") {
          updatedElement.width = offsetX - updatedElement.x;
          updatedElement.height = offsetY - updatedElement.y;
        } else if (tool === "line") {
          updatedElement.x2 = offsetX;
          updatedElement.y2 = offsetY;
        } else if (tool === "circle" || tool === "semi-circle") {
          updatedElement.x2 = offsetX;
          updatedElement.y2 = offsetY;
        }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        elements.forEach((element) => drawElement(ctx, element));
        drawElement(ctx, updatedElement);

        return updatedElement;
      });
    } else if (action === "moving" && selectedElement) {
      const dx = offsetX - lastMousePosition.x;
      const dy = offsetY - lastMousePosition.y;

      setSelectedElement((prevElement) => {
        if (!prevElement) return null;
        const updatedElement = { ...prevElement };

        if (prevElement.type === "rectangle") {
          updatedElement.x += dx;
          updatedElement.y += dy;
        } else if (prevElement.type === "line") {
          updatedElement.x1 += dx;
          updatedElement.y1 += dy;
          updatedElement.x2 += dx;
          updatedElement.y2 += dy;
        } else if (
          prevElement.type === "circle" ||
          prevElement.type === "semi-circle"
        ) {
          updatedElement.x1 += dx;
          updatedElement.y1 += dy;
          updatedElement.x2 += dx;
          updatedElement.y2 += dy;
        }

        setLastMousePosition({ x: offsetX, y: offsetY });

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        elements.forEach((element) => drawElement(ctx, element));
        drawElement(ctx, updatedElement);

        return updatedElement;
      });
    } else if (
      (action === "resizing-start" || action === "resizing-end") &&
      selectedElement
    ) {
      setSelectedElement((prevElement) => {
        if (!prevElement) return null;
        const updatedElement = { ...prevElement };

        if (action === "resizing-start") {
          if (prevElement.type === "rectangle") {
            const width = updatedElement.x + updatedElement.width - offsetX;
            const height = updatedElement.y + updatedElement.height - offsetY;
            updatedElement.width = width;
            updatedElement.height = height;
            updatedElement.x = offsetX;
            updatedElement.y = offsetY;
          } else if (prevElement.type === "line") {
            updatedElement.x1 = offsetX;
            updatedElement.y1 = offsetY;
          } else if (
            prevElement.type === "circle" ||
            prevElement.type === "semi-circle"
          ) {
            updatedElement.x1 = offsetX;
            updatedElement.y1 = offsetY;
          }
        } else if (action === "resizing-end") {
          if (prevElement.type === "rectangle") {
            updatedElement.width = offsetX - updatedElement.x;
            updatedElement.height = offsetY - updatedElement.y;
          } else if (prevElement.type === "line") {
            updatedElement.x2 = offsetX;
            updatedElement.y2 = offsetY;
          } else if (
            prevElement.type === "circle" ||
            prevElement.type === "semi-circle"
          ) {
            updatedElement.x2 = offsetX;
            updatedElement.y2 = offsetY;
          }
        }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        elements.forEach((element) => drawElement(ctx, element));
        drawElement(ctx, updatedElement);

        return updatedElement;
      });
    }
  };

  const handleMouseUp = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    setIsMouseDown(false); // Mouse button is released

    if (isDrawing && currentElement) {
      setElements((prevElements) => [...prevElements, currentElement]);
      setCurrentElement(null);
      setIsDrawing(false);
    } else if (selectedElement && action) {
      setElements((prevElements) =>
        prevElements.map((element) =>
          element.id === selectedElement.id ? selectedElement : element
        )
      );
      setAction(null);
    }
  };

  const getElementAtPosition = (x, y, elements) => {
    return elements.find((element) => {
      if (element.type === "rectangle") {
        return (
          x >= element.x &&
          x <= element.x + element.width &&
          y >= element.y &&
          y <= element.y + element.height
        );
      } else if (element.type === "line") {
        // Implement logic for line selection
      } else if (element.type === "circle" || element.type === "semi-circle") {
        const radius = Math.sqrt(
          Math.pow(element.x2 - element.x1, 2) +
            Math.pow(element.y2 - element.y1, 2)
        );
        const distance = Math.sqrt(
          Math.pow(x - element.x1, 2) + Math.pow(y - element.y1, 2)
        );
        return distance <= radius;
      }
      return false;
    });
  };

  const getResizeHandlePosition = (x, y, element) => {
    const handleSize = 10;
    if (element.type === "rectangle") {
      const startHandle = {
        x: element.x - handleSize / 2,
        y: element.y - handleSize / 2,
        width: handleSize,
        height: handleSize,
      };
      const endHandle = {
        x: element.x + element.width - handleSize / 2,
        y: element.y + element.height - handleSize / 2,
        width: handleSize,
        height: handleSize,
      };
      if (
        x >= startHandle.x &&
        x <= startHandle.x + startHandle.width &&
        y >= startHandle.y &&
        y <= startHandle.y + startHandle.height
      ) {
        return "resizing-start";
      } else if (
        x >= endHandle.x &&
        x <= endHandle.x + endHandle.width &&
        y >= endHandle.y &&
        y <= endHandle.y + endHandle.height
      ) {
        return "resizing-end";
      }
    } else if (
      element.type === "line" ||
      element.type === "circle" ||
      element.type === "semi-circle"
    ) {
      // Implement logic for line and circle resize handles
    }
    return null;
  };

  const fill = (ctx, x, y, fillColor) => {
    const canvas = ctx.canvas;
    const width = canvas.width;
    const height = canvas.height;
  
    // Ensure x and y are within canvas bounds
    if (x < 0 || y < 0 || x >= width || y >= height) {
      console.error("Invalid coordinates for fill:", x, y);
      return;
    }
  
    const imageData = ctx.getImageData(0, 0, width, height, { willReadFrequently: true });
    const data = imageData.data;
  
    const getColorAtPixel = (data, x, y, width) => {
      const index = (y * width + x) * 4;
      return {
        r: data[index],
        g: data[index + 1],
        b: data[index + 2],
        a: data[index + 3],
      };
    };
  
    const setColorAtPixel = (data, x, y, width, color) => {
      const index = (y * width + x) * 4;
      data[index] = color.r;
      data[index + 1] = color.g;
      data[index + 2] = color.b;
      data[index + 3] = color.a;
    };
  
    const hexToRgbA = (hex) => {
      let c;
      if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split("");
        if (c.length === 3) {
          c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = "0x" + c.join("");
        return {
          r: (c >> 16) & 255,
          g: (c >> 8) & 255,
          b: c & 255,
          a: 255,
        };
      }
      throw new Error("Bad Hex");
    };
  
    const targetColor = getColorAtPixel(data, x, y, width);
    const fillColorRgbA = hexToRgbA(fillColor);
  
    const colorMatch = (a, b) => {
      return a.r === b.r && a.g === b.g && a.b === b.b && a.a === b.a;
    };
  
    const visited = new Set();
    const stack = [{ x, y }];
  
    while (stack.length > 0) {
      const { x, y } = stack.pop();
      const key = `${x},${y}`;
  
      if (!visited.has(key)) {
        visited.add(key);
        const currentColor = getColorAtPixel(data, x, y, width);
  
        if (colorMatch(currentColor, targetColor)) {
          setColorAtPixel(data, x, y, width, fillColorRgbA);
  
          if (x - 1 >= 0) stack.push({ x: x - 1, y });
          if (x + 1 < width) stack.push({ x: x + 1, y });
          if (y - 1 >= 0) stack.push({ x, y: y - 1 });
          if (y + 1 < height) stack.push({ x, y: y + 1 });
        }
      }
    }
  
    ctx.putImageData(imageData, 0, 0);
  };
  

  const saveCanvas = async () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL("image/png");

    // Convert data URL to a blob
    const blob = await (await fetch(dataURL)).blob();

    // Create a file handle and save the file
    try {
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: `${can_name}.png`,
        types: [
          {
            description: "PNG Files",
            accept: {
              "image/png": [".png"],
            },
          },
        ],
      });
      const writableStream = await fileHandle.createWritable();
      await writableStream.write(blob);
      await writableStream.close();
    } catch (error) {
      console.error("Save operation failed:", error);
    }
  };

  return (
    <>
    <ContainerDiv>
      <TitleDiv>
        <LogoDiv>
        <img src={logo} alt="Logo" />
        </LogoDiv>
        <h4> Project Name : {can_name}</h4>
        <div>
        <h6>Height : {can_height} px</h6>
        <h6>Width : {can_width} px</h6>
        </div>
       
      </TitleDiv>

      <CanvasDiv>
        <Toolbar />
        <div>
          <canvas
            ref={canvasRef}
            width={can_width}
            height={can_height}
            style={{ border: "1px solid black", cursor: cursorStyle }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          />
        </div>
        <Button onClick={saveCanvas}>Save</Button>

      </CanvasDiv>
    </ContainerDiv>
    </>
  );
};

const CanvasDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

`;

const LogoDiv = styled.div`
  width: 100px;
`;

const TitleDiv = styled.div`
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  margin-bottom: 10px;
  background-color: #351430; 
  color: #fff; 
  
  & h6{
    padding: 5px;
    margin: 0px;
  }
`;
const ContainerDiv = styled.div`
  margin: 0px;
  padding: 0px;
`;

const Button = styled.button`
  width: 120px;
  margin: 5px;
  margin-left: 15px;
  padding: 10px 15px;
  font-size: 16px;
  cursor: pointer;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 4px;

  &:hover {
    background-color: #e0e0e0;
  }
`;

export default Canvas;
