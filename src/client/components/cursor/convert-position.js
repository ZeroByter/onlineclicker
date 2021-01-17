exports.convertPositionData = position => {
    if(position == null) return null
    return {left: window.innerWidth / 2 + position.x - 2, top: window.innerHeight / 2 + position.y - 2}
}