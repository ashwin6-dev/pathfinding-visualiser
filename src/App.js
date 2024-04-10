import Grid from "./components/Grid"
import Info from "./components/Info"
import "./App.css"
import { useState } from "react";


import startImg from "./components/assets/start-node.png"
import endImg from "./components/assets/end-node.png"
import wallImg from "./components/assets/walls.png"

function App() {
  const [help, setHelp] = useState(false)

  return (
    <div className="container">
        <div className="help-btn" onClick = { () => setHelp(true) }>?</div>
        <div id="grid-container">
          <Grid />
        </div>
        { help &&
          <div id="help-overlay">
            <div id="close" onClick = { () => setHelp(false) }>x</div>
            <div id="help-title">Pathfinding Visualiser</div>
            <div id="cards">
              <Info img={startImg} title="Moving the start node" text="Click on the start node then click on another square to move it." color="rgb(8, 255, 8)"/>
              <Info img={endImg} title="Moving the end node" text="Click on the end node then click on another square to move it." color="rgb(255, 94, 0)"/>
              <Info img={wallImg} title="Placing walls" text="Hold CTRL and drag the mouse across the map to place/remove walls." color="rgb(13, 90, 254)"/>
            </div>
          </div>
        }
    </div>

  );
}

export default App;
