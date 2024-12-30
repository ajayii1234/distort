// Get canvas and context
const canvas = document.getElementById('drawingCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
const shapeSelector = document.getElementById('shape') as HTMLSelectElement;

let isDrawing = false;
let isDragging = false;
let dragPointIndex: number | null = null;
let startX = 0, startY = 0;
let vertices: { x: number, y: number }[] = [];
let selectedShape: string = 'rectangle'; // Only rectangle is allowed

// Start drawing
canvas.addEventListener('mousedown', (e: MouseEvent) => {
    if (isDragging) return;

    const offsetX = e.offsetX;
    const offsetY = e.offsetY;

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
canvas.addEventListener('mousemove', (e: MouseEvent) => {
    const offsetX = e.offsetX;
    const offsetY = e.offsetY;

    if (isDragging && dragPointIndex !== null) {
        // Update position of dragged point
        vertices[dragPointIndex] = { x: offsetX, y: offsetY };
        redrawCanvas();
        return;
    }

    if (isDrawing) {
        const currentX = offsetX;
        const currentY = offsetY;

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
canvas.addEventListener('mouseup', () => {
    isDrawing = false;
    isDragging = false;
    dragPointIndex = null;
});

// Redraw the canvas
function redrawCanvas(): void {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (vertices.length > 0) {
        drawShape(vertices);
        drawDragPoints(vertices);
    }
}

// Draw the shape (only rectangle)
// Draw the shape (only rectangle)
function drawShape(vertices: { x: number, y: number }[]): void {
    ctx.beginPath();
    vertices.forEach((vertex, index) => {
        index === 0
            ? ctx.moveTo(vertex.x, vertex.y)
            : ctx.lineTo(vertex.x, vertex.y);
    });
    ctx.closePath();

    // Set the color to yellow for the stroke and fill
    ctx.strokeStyle = 'black';  // Color of the rectangle's border
    ctx.fillStyle = 'yellow';    // Color to fill the rectangle

    // Fill and stroke the rectangle
    ctx.fill();
    ctx.stroke();
}


// Draw drag points at each vertex
function drawDragPoints(vertices: { x: number, y: number }[]): void {
    vertices.forEach((vertex) => {
        ctx.beginPath();
        ctx.arc(vertex.x, vertex.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = 'blue';
        ctx.fill();
        ctx.closePath();
    });
}

// Get the index of the drag point being clicked
function getDragPointIndex(x: number, y: number): number | null {
    for (let i = 0; i < vertices.length; i++) {
        const vertex = vertices[i];
        const distance = Math.sqrt(Math.pow(x - vertex.x, 2) + Math.pow(y - vertex.y, 2));
        if (distance <= 5) {
            return i;
        }
    }
    return null;
}
