// Get canvas and context
var canvas = document.getElementById('drawingCanvas');
var ctx = canvas.getContext('2d');
var shapeSelector = document.getElementById('shape');
var isDrawing = false;
var isDragging = false;
var dragPointIndex = null;
var startX = 0, startY = 0;
var vertices = [];
var selectedShape = 'rectangle'; // Only rectangle is allowed
// Start drawing
canvas.addEventListener('mousedown', function (e) {
    if (isDragging)
        return;
    var offsetX = e.offsetX;
    var offsetY = e.offsetY;
    // Check if clicking on a drag point
    dragPointIndex = getDragPointIndex(offsetX, offsetY);
    if (dragPointIndex !== null) {
        isDragging = true;
        return;
    }
    // Otherwise, start a new shape (rectangle only)
    isDrawing = true;
    startX = offsetX;
    startY = offsetY;
    vertices = [];
});
// Draw shape dynamically
canvas.addEventListener('mousemove', function (e) {
    var offsetX = e.offsetX;
    var offsetY = e.offsetY;
    if (isDragging && dragPointIndex !== null) {
        // Update position of dragged point
        vertices[dragPointIndex] = { x: offsetX, y: offsetY };
        redrawCanvas();
        return;
    }
    if (isDrawing) {
        var currentX = offsetX;
        var currentY = offsetY;
        // Handle rectangle specifically (no need for conditional check as rectangle is the only shape)
        vertices = [
            { x: startX, y: startY },
            { x: currentX, y: startY },
            { x: currentX, y: currentY },
            { x: startX, y: currentY },
        ];
        redrawCanvas();
    }
});
// Stop drawing or dragging
canvas.addEventListener('mouseup', function () {
    isDrawing = false;
    isDragging = false;
    dragPointIndex = null;
});
// Redraw the canvas
function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (vertices.length > 0) {
        drawShape(vertices);
        drawDragPoints(vertices);
    }
}
// Draw the shape (only rectangle)
// Draw the shape (only rectangle)
function drawShape(vertices) {
    ctx.beginPath();
    vertices.forEach(function (vertex, index) {
        index === 0
            ? ctx.moveTo(vertex.x, vertex.y)
            : ctx.lineTo(vertex.x, vertex.y);
    });
    ctx.closePath();
    // Set the color to yellow for the stroke and fill
    ctx.strokeStyle = 'yellow'; // Color of the rectangle's border
    ctx.fillStyle = 'yellow'; // Color to fill the rectangle
    // Fill and stroke the rectangle
    ctx.fill();
    ctx.stroke();
}
// Draw drag points at each vertex
function drawDragPoints(vertices) {
    vertices.forEach(function (vertex) {
        ctx.beginPath();
        ctx.arc(vertex.x, vertex.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = 'blue';
        ctx.fill();
        ctx.closePath();
    });
}
// Get the index of the drag point being clicked
function getDragPointIndex(x, y) {
    for (var i = 0; i < vertices.length; i++) {
        var vertex = vertices[i];
        var distance = Math.sqrt(Math.pow(x - vertex.x, 2) + Math.pow(y - vertex.y, 2));
        if (distance <= 5) {
            return i;
        }
    }
    return null;
}
