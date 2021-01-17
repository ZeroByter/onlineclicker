import React from 'react';
import "./upgrade.scss"

export default class Upgrade extends React.PureComponent {
    handleOnClick = e => {
        this.props.socket.emit("purchaseUpgrade", this.props.id)
    }

    render() {
        let price = this.props.upgrade.getPrice(this.props.upgradeCount)

        let classes = ["upgrade-container"]
        if(this.props.points < price) classes.push("upgrade-container-too-expensive")

        return (
            <div className={classes.join(" ")} onClick={this.handleOnClick}>
                <div>{this.props.upgrade.name} ({this.props.upgradeCount})</div>
                <div>{this.props.upgrade.getPointsPerSecond(this.props.upgradeCount + 1)} clicks per second</div>
                <div>{price} points</div>
            </div>
        )
    }
}