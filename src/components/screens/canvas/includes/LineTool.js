import React from 'react';

const LineTool = ({ element, ctx }) => {
  ctx.moveTo(element.x1, element.y1);
  ctx.lineTo(element.x2, element.y2);
  ctx.strokeStyle = element.color || "black";
  ctx.lineWidth = element.strokeSize || 1;
  ctx.stroke();
};

export default LineTool;
