import Cell from "./Cell"
import "./styles/Grid.css"
import { useState, useEffect } from "react"
import {
    PriorityQueue,
  } from '@datastructures-js/priority-queue';
// CELL STATES

const START = 1
const END = 2
const WALL = 3
const PATH = 4

class CCell {
    constructor(row, col, state) {
        this.row = row
        this.col = col
        this.state = state
    }
}

function buildGrid(size) {
    let newGrid = []
    for (let rowIdx = 0; rowIdx < size; rowIdx++) {
        let row = []
        for (let colIdx = 0; colIdx < size; colIdx++) {
            row.push(new CCell(rowIdx, colIdx, 0))
        }
        newGrid.push(row)
    }

    for (let state of [START, END]) {
        let randRow = Math.floor(Math.random() * size)
        let randCol = Math.floor(Math.random() * size)
        
        newGrid[randRow][randCol].state = state
    }
    return newGrid
}


function findStartNode(grid) {
    for (let row of grid) {
        for (let cell of row) {
            if (cell.state == START) {
                return cell
            }
        }
    }
}

function fringeNodes(grid, cell, visited) {
    let cellRow = cell.row
    let cellCol = cell.col
    
    let rows = [cellRow - 1, cellRow, cellRow + 1]
    let cols = [cellCol - 1, cellCol, cellCol + 1]
    let fringes = []

    for (let row of rows) {
        for (let col of cols) {
            if (row >= 0 && col >= 0 && row < grid.length && col < grid.length) {
                if (row != cellRow || col != cellCol) fringes.push(grid[row][col])
            }
        }
    }

    return fringes.filter(fringe => fringe.state != WALL && !visited[fringe.row][fringe.col])
}

function pathTo(cell, parents) {
    let current = cell
    let currentParent = parents[current.row][current.col]
    let path = []
    
    while (currentParent != 0) {
        path = [current, ...path]
        current = currentParent
        currentParent = parents[current.row][current.col]
    }

    path = [current, ...path]

    return path
}


function fillGrid(grid, val) {
    let fill = []
    for (let row of grid) {
        let fillRow = []
        for (let col of grid) {
            fillRow.push(val)
        }
        fill.push(fillRow)
    }
    
    return fill
}

async function Dijkstra(grid) {
    let visited = fillGrid(grid, 0)
    let parents = fillGrid(grid, 0)
    let distances = fillGrid(grid, 99999999)
    let startNode = findStartNode(grid)
    distances[startNode.row][startNode.col] = 0

    let fringe = new PriorityQueue((a, b) => distances[a.row][a.col] - distances[b.row][b.col])

    fringe.push(startNode)

    while (!fringe.isEmpty()) {
        let nextCell = fringe.dequeue()

        visited[nextCell.row][nextCell.col] = 1
        let fringes = fringeNodes(grid, nextCell, visited)
        
        for (let f of fringes) {
            let fringeDistance = distances[f.row][f.col]
            let newDistance = distances[nextCell.row][nextCell.col] + 1
        
            if (newDistance < fringeDistance) {
                parents[f.row][f.col] = nextCell
                distances[f.row][f.col] = newDistance
            }

            if (f.state == END) {
                return pathTo(f, parents)
            }

            fringe.push(f)
        }

        // fringe.sort((a, b) => distances[a.row][a.col] - distances[b.row][b.col])
    }

    return []
}

const SIZE = 12
const timer = async (ms) => new Promise(res => setTimeout(res, ms))

function Grid() {
    const [selectState, setState] = useState(0)
    const [grid, setGrid] = useState(buildGrid(SIZE))
    const [computingPath, setComputingPath] = useState(false)

    function updateGrid(row, col, newState, oldState) {
        let gridCopy = [...grid]
        gridCopy[row][col].state = newState
        setGrid(gridCopy)
        setState(oldState)
    }

    function clearGrid() {
        let gridCopy = [...grid]
        let size = gridCopy.length
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                if (gridCopy[row][col].state != START && gridCopy[row][col].state != END) gridCopy[row][col].state = 0
            }
        }
        setGrid(gridCopy)
    }

    function randomMaze() {
        let gridCopy = buildGrid(grid.length)
        let size = gridCopy.length
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                if (gridCopy[row][col].state != START && gridCopy[row][col].state != END) {
                    let rand = Math.random()
                    if (rand < 0.35) {
                        gridCopy[row][col].state = WALL
                    }else {
                        gridCopy[row][col].state = 0
                    }
                }
            }
        }

        setGrid(gridCopy)
    }

    async function visualisePath() {
        setComputingPath(true)
        await timer(200)
        let path = await (() => new Promise(res => res(Dijkstra(grid)) ))()
        await timer(1)
        setComputingPath(false)

        if (path.length == 0) {
            alert("No path")
            return;
        }
        
        let gridCopy = [...grid]
        for (let i = 0; i < path.length; i++) {
            gridCopy = [...gridCopy]
            let node = path[i]
            let nodeRow = node.row
            let nodeCol = node.col
            let currState = node.state

            if (currState != START && currState != END) gridCopy[nodeRow][nodeCol].state = PATH
            setGrid(gridCopy)
            await timer(50);
        }
    }

    return (
        <div className="grid-container">
            <div className="menu">
                <button className="menu-btn" onClick = { async () => await visualisePath() }>Find Path</button>
                <button className="menu-btn" onClick = { randomMaze }>Random Maze</button>
                <button className="menu-btn" onClick = { clearGrid }>Clear</button>
            </div>
            <div className="grid">
                { 
                    grid.map((row, rowIdx) => 
                        <div className="row" key={rowIdx}>
                            { row.map((cell, cellIdx) => <Cell grid={grid} 
                                                    row={cell.row} 
                                                    col={cell.col} 
                                                    state={cell.state}
                                                    getSelectState={ () => selectState }
                                                    updateGrid = { updateGrid } 
                                                    key={cellIdx} />) }
                        </div>
                    )
                }
                { computingPath && <div className="loading">Computing path...</div> }
            </div>
        </div>
    )
}

export default Grid