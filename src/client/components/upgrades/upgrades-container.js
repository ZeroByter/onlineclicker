import React from 'react';
import { allUpgrades, getUpgradeCount } from '../../../shared/upgrades';
import Upgrade from './upgrade';
import "./upgrades-container.scss"

export default class UpgradesContainer extends React.PureComponent {
    render() {
        let upgrades = []
        upgrades.push(...Object.entries(allUpgrades).map(entry => {
            let id = entry[0]
            let upgrade = entry[1]
            return <Upgrade key={id} id={id} socket={this.props.socket} upgrade={upgrade} upgradeCount={getUpgradeCount(this.props.upgrades, id)} />
        }))

        return (
            <div className="upgrades-container">
                {upgrades}
            </div>
        )
    }
}