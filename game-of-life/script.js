const grid = document.getElementById('grid');
const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const clearButton = document.getElementById('clear');
const speedSlider = document.getElementById('speed');
const generationDisplay = document.getElementById('generation');

const rows = 30; // Grid size
const cols = 80; // Grid size

let cells = [];
let intervalId;
let intervalTime = 1000 - speedSlider.value;
let generation = 0;

// Create the grid
function createGrid() {
    grid.innerHTML = '';
    cells = [];
    for (let i = 0; i < rows; i++) {
        cells[i] = [];
        for (let j = 0; j < cols; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.addEventListener('click', () => toggleCell(i, j));
            grid.appendChild(cell);
            cells[i][j] = cell;
        }
    }
    generation = 0
    updateGenerationDisplay();
}

// Toggle cell state
function toggleCell(row, col) {
    cells[row][col].classList.toggle('active');
}

// Get the current state of the grid
function getGridState() {
    const state = [];
    for (let i = 0; i < rows; i++) {
        state[i] = [];
        for (let j = 0; j < cols; j++) {
            state[i][j] = cells[i][j].classList.contains('active') ? 1 : 0;
        }
    }
    return state;
}

// Set the state of the grid
function setGridState(state) {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (state[i][j]) {
                cells[i][j].classList.add('active');
            } else {
                cells[i][j].classList.remove('active');
            }
        }
    }
}

// Update the grid based on the Game of Life rules
function updateGrid() {
    const state = getGridState();
    const newState = state.map(arr => arr.slice());

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const aliveNeighbors = countAliveNeighbors(i, j);
            if (state[i][j] === 1) {
                newState[i][j] = (aliveNeighbors === 2 || aliveNeighbors === 3) ? 1 : 0;
            } else {
                newState[i][j] = (aliveNeighbors === 3) ? 1 : 0;
            }
        }
    }
    setGridState(newState);
    generation++;
    updateGenerationDisplay();
}

// Count alive neighbors of a cell
function countAliveNeighbors(row, col) {
    const neighbors = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];
    let count = 0;
    for (const [dx, dy] of neighbors) {
        const newRow = row + dx;
        const newCol = col + dy;
        if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
            count += cells[newRow][newCol].classList.contains('active') ? 1 : 0;
        }
    }
    return count;
}

// Start the simulation
function startSimulation() {
    if (intervalId) return;
    intervalId = setInterval(updateGrid, intervalTime);
}

// Stop the simulation
function stopSimulation() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
}

// Clear the grid
function clearGrid() {
    stopSimulation();
    createGrid();
}

// Adjust simulation speed
function adjustSpeed() {
    intervalTime = 1000 - speedSlider.value;
    if (intervalId) {
        stopSimulation();
        startSimulation();
    }
}

// Update the generation display
function updateGenerationDisplay() {
    generationDisplay.textContent = `Generation: ${generation}`;
}

// Event listeners
startButton.addEventListener('click', startSimulation);
stopButton.addEventListener('click', stopSimulation);
clearButton.addEventListener('click', clearGrid);
speedSlider.addEventListener('input', adjustSpeed);

// Initial setup
createGrid();
