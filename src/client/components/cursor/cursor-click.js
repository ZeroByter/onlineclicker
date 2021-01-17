import React from "react"
import { convertPositionData } from "./convert-position"
import "./cursor-click.scss"

export default class CursorClick extends React.PureComponent{
    render(){
        let style = null
        if(this.props.click.type === "normal"){
            style = convertPositionData(this.props.click.position)
        }

        return (
            <div className={"cursor-click cursor-click-" + this.props.click.type} style={style}></div>
        )
    }
}