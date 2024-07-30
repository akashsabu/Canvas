import React from 'react';

const SelectTool = ({ element, ctx, selectedElement }) => {
  if (selectedElement && selectedElement.id === element.id) {
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
  } else {
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
  }

  if (element.type === "rectangle") {
    ctx.rect(element.x, element.y, element.width, element.height);
  } else if (element.type === "line") {
    ctx.moveTo(element.x1, element.y1);
    ctx.lineTo(element.x2, element.y2);
  }
  ctx.stroke();
};

export default SelectTool;






