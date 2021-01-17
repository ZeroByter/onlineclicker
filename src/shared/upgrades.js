exports.allUpgrades = {
    "clickers": {
        name: "clickers",
        getPointsPerSecond: upgradeCount => {
            return +(0.15 * (upgradeCount) * 0.8).toFixed(2)
        },
        getPrice: upgradeCount => {
            return Math.round(+(100 * Math.pow(upgradeCount + 1, 1.1)).toFixed(2))
        },
    },
    "clickersv2": {
        name: "clickers v2",
        getPointsPerSecond: upgradeCount => {
            return +(0.3 * (upgradeCount) * 1.05).toFixed(2)
        },
        getPrice: upgradeCount => {
            return Math.round(+(120 * Math.pow(upgradeCount + 1, 1.1)).toFixed(2))
        },
    }
}

exports.getUpgradeCount = (data, id) => {
    if(!(id in data)) return 0

    return data[id].count
}

exports.purchaseUpgrade = (data, id) => {
    if(!(id in data)) data[id] = { count: 0 }
    data[id].count += 1
}

exports.getPointsPerSecond = data => {
    let points = 0

    Object.entries(this.allUpgrades).forEach(entry => {
        let id = entry[0]
        let upgrade = entry[1]

        points += upgrade.getPointsPerSecond(this.getUpgradeCount(data, id))
    })

    return points
}