import React from 'react';
import "./upgrade.scss"

export default class Upgrade extends React.PureComponent {
    handleOnClick = e => {
        this.props.socket.emit("purchaseUpgrade", this.props.id)
    }

    render() {
        return (
            <div className="upgrade-container" onClick={this.handleOnClick}>
                <div>{this.props.upgrade.name} ({this.props.upgradeCount})</div>
                <div>{this.props.upgrade.getPointsPerSecond(this.props.upgradeCount)} clicks per second</div>
                <div>{this.props.upgrade.getPrice(this.props.upgradeCount)} points</div>
            </div>
        )
    }
}