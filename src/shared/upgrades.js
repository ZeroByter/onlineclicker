exports.allUpgrades = {
    "trash": {
        name: "Trash Clicker",
        getPointsPerSecond: upgradeCount => {
            return upgradeCount / 10
        },
        getPrice: upgradeCount => {
            return 15 + Math.pow(upgradeCount * 3, 0.85)
        }
    },
    "clickers": {
        name: "clickers",
        getPointsPerSecond: upgradeCount => {
            return 0.15 * (upgradeCount) * 0.8
        },
        getPrice: upgradeCount => {
            return 100 * Math.pow(upgradeCount + 1, 1.1)
        },
    },
    "clickersv2": {
        name: "clickers v2",
        getPointsPerSecond: upgradeCount => {
            return 0.3 * (upgradeCount) * 1.05
        },
        getPrice: upgradeCount => {
            return 120 * Math.pow(upgradeCount + 1, 1.1)
        },
    },
    "clickerbot": {
        name: "Clicker Bot",
        getPointsPerSecond: upgradeCount => {
            return Math.pow(1 * upgradeCount, 1.2)
        },
        getPrice: upgradeCount => {
            return Math.pow(Math.pow(upgradeCount, upgradeCount), 0.002) * 100
        },
    },
    "poop": {
        name: "💩 poop 💩",
        getPointsPerSecond: upgradeCount => {
            return 0.1 * upgradeCount
        },
        getPrice: upgradeCount => {
            return 5000 + Math.pow(upgradeCount, 1.25)
        },
    },
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