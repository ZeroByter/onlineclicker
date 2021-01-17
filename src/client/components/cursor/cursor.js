import React from "react"
import cursorImage from "./cursor.png"
import { convertPositionData } from "./convert-position"
import "./cursor.scss"
import { numberWithCommas } from "../../../shared/essentials"

export default class Cursor extends React.Component{
    render(){
        let pointsGiven = "0"
        if(this.props.data.pointsGiven != null) pointsGiven = numberWithCommas(this.props.data.pointsGiven)

        return (
            <div className="other-user-cursor-container" style={convertPositionData(this.props.data.position)}>
                <div className="other-user-cursor-name">{this.props.data.name}</div>
                <div className="other-user-cursor-points-given">{pointsGiven}</div>
                
                <img className="cursor-img" src={cursorImage} />
            </div>
        )
    }
}