import React from "react"
import "./background-image.scss"

export default class BackgroundImage extends React.PureComponent{
    state = {
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
    }

    componentDidMount(){
        window.addEventListener("resize", this.handleWindowResize)
    }

    componentWillUnmount(){
        window.removeEventListener("resize", this.handleWindowResize)
    }

    handleWindowResize = e => {
        this.setState({windowWidth: window.innerWidth, windowHeight: window.innerHeight})
    }

    render(){
        let maxSize = Math.max(this.state.windowWidth, this.state.windowHeight)
        let minSize = Math.min(this.state.windowWidth, this.state.windowHeight)

        return (
            <div id="background-image-container">
                <div id="background-image" style={{width: maxSize, height: maxSize, transform: "translate(" + Math.floor(maxSize / -2) + "px, " + Math.floor(maxSize / -2) + "px)"}}></div>
            </div>
        )
    }
}