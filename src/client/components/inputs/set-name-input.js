import React from "react"
import Cookies from "js-cookie"
import "./set-name-input.scss"

export default class SetNameInput extends React.PureComponent{
    handleOnChange = e => {
        let value = e.target.value

        this.props.socket.emit("setName", value)

        Cookies.set("name", value, {expires: 7})
    }

    render(){
        return (
            <input className="set-name-input" placeholder="Choose your name here!" maxLength={12} defaultValue={Cookies.get("name")} onChange={this.handleOnChange} />
        )
    }
}