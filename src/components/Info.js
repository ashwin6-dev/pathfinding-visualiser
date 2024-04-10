import "./styles/info.css"

function Info(props) {
    const { title, text, color, img } = props
    return (
        <div id="container" style={{ backgroundColor: color }}>
            <div id="title-section">
                <div id="color" ></div>
                <div id="title">{ title }</div>
            </div>
            <img src={ img } alt="start"/>
            <br />
            <div id="text-section">{ text }</div>
        </div>
    )
}

export default Info