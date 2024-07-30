import React from 'react';

const RectangleTool = ({ element, ctx }) => {
  ctx.rect(element.x, element.y, element.width, element.height);
  ctx.strokeStyle = element.color || "black";
  ctx.lineWidth = element.strokeSize || 1;
  ctx.stroke();
};

export default RectangleTool;



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
          }
        } else if (action === "resizing-end") {
          if (prevElement.type === "rectangle") {
            updatedElement.width = offsetX - updatedElement.x;
            updatedElement.height = offsetY - updatedElement.y;
          } else if (prevElement.type === "line") {
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

    if (tool === "select") {
      const foundElement = getElementAtPosition(offsetX, offsetY, elements);
      if (foundElement) {
        const resizeHandle = getResizeHandlePosition(
          offsetX,
          offsetY,
          foundElement
        );
        if (resizeHandle) {
          setCursorStyle("nwse-resize");
        } else {
          setCursorStyle("move");
        }
      } else {
        setCursorStyle("default");
      }
    }
  };