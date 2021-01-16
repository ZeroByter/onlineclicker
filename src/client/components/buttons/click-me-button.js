import React from "react"
import "./click-me-button.scss"

export default class ClickMeButton extends React.PureComponent{
    handleOnClick = e => {
        this.props.socket.emit("mainClick")
        this.props.onClick(e)
    }

    render(){
        return (
            <button id="click-me-button" onClick={this.handleOnClick}>Click Me!</button>
        )
    }
}