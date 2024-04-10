import { useEffect, useState } from "react"
import "./styles/cell.css"

let isMouseDown = false

window.onmousedown = (e) => {
    isMouseDown = true
}

window.onmouseup = (e) => {
    isMouseDown = false
}

function Cell(props) {
    const [state, setState] = useState(props.state)
    const { grid, row, col, getSelectState, updateGrid } = props

    useEffect(() => setState(props.state), [props.state])

    function updateCellState() {
        if (state == 3) return;

        let selectState = getSelectState()
        let cellState = grid[row][col].state
        updateGrid(row, col, selectState, cellState)
    }

    function addWallOver(e) {
        e.preventDefault()
        
        if (!e.ctrlKey) return;

        if (state == 0 && isMouseDown) {
            updateGrid(row, col, 3, 0)
        }else if (state == 3 && isMouseDown) {
            updateGrid(row, col, 0, 0)
        }
    }

    function addWallDown(e) {
        e.preventDefault()

        if (!e.ctrlKey) return;

        if (state == 0) {
            updateGrid(row, col, 3, 0)
        }else if (state == 3) {
            updateGrid(row, col, 0, 0)
        }
    }

    function stopWall(e) {
        if (state == 0) {
            updateGrid(row, col, 3, 0)
        }else if (state == 3) {
            updateGrid(row, col, 0, 0)
        }

        e.preventDefault()
    }

    function computeClass() {
        if (state == 1) return "cell start"
        if (state == 2) return "cell end"
        if (state == 3) return "cell wall"
        if (state == 4) return "cell path"

        return "cell"
    }

    return (
        <div className={ computeClass() } onClick = { updateCellState } onMouseDown = { addWallDown } onMouseOver = { addWallOver }>
        </div>
    )
}

export default Cell