import React from "react"
import "./cursor-click.scss"

export default class CursorClick extends React.PureComponent{
    render(){
        let style = null
        if(this.props.click.type === "normal"){
            style = {left: window.innerWidth / 2 + this.props.click.position.x, top: window.innerHeight / 2 + this.props.click.position.y}
        }

        return (
            <div className={"cursor-click cursor-click-" + this.props.click.type} style={style}></div>
        )
    }
}