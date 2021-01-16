import React from "react"
import cursorImage from "./cursor.png"
import "./cursor.scss"

export default class Cursor extends React.PureComponent{
    render(){
        return (
            <div className="other-user-cursor-container" style={{left: window.innerWidth / 2 + this.props.data.x, top: window.innerHeight / 2 + this.props.data.y}}>
                <img className="cursor-img" src={cursorImage} />
            </div>
        )
    }
}