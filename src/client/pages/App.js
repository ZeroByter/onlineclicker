import React from 'react';
import './app.scss';
import Cursor from '../components/cursor/cursor';
import ClickMeButton from '../components/buttons/click-me-button';
import BackgroundImage from '../components/background-image';
import CursorClick from '../components/cursor/cursor-click';
import { numberWithCommas, randomString } from '../../shared/essentials';
import SetNameInput from '../components/inputs/set-name-input';
import UpgradesContainer from '../components/upgrades/upgrades-container';
import { Helmet } from 'react-helmet';
import Cookies from "js-cookie"
import { getPointsPerSecond } from '../../shared/upgrades';

const todo = [
	"gotta add upgrades which increase non-linearly in effectiveness/cost"
]

function getNewCursorClick(type, position){
	let obj = {id: randomString(), created: new Date().getTime(), type}

	if(type === "normal"){
		obj.position = position
	}

	return obj
}

export default class App extends React.Component {
	state = {
		pointsData: {
			points: 0,
			upgrades: {}
		},
		cursors: {},
		cursorClicks: []
	}
	handleCleanupInterval = -1

	setPlayerCursorData = (id, position, name, pointsGiven) => {
		this.setState(oldState => {
			let cursors = oldState.cursors

			if(!(id in cursors)){
				cursors[id] = {id, name, position, pointsGiven}
			}

			if(position != null) cursors[id].position = position
			if(name != null) cursors[id].name = name
			if(pointsGiven != null) cursors[id].pointsGiven = pointsGiven

			return {cursors}
		})
	}

	componentDidMount(){
		window.addEventListener("mousedown", this.handleWindowMouseDown)
		window.addEventListener("mousemove", this.handleWindowMouseMove)

		this.handleCleanupInterval = setInterval(this.handleCleanup, 1000)

		this.props.socket.on("cursorMove", data => {
			this.setPlayerCursorData(data.id, data.newPosition, null, null)
		})

		this.props.socket.on("cursorClick", data => {
			if(data.type === "center"){
				this.setState(oldState => {
					oldState.cursorClicks.push(getNewCursorClick("center"))
					return oldState
				})

				this.setPlayerCursorData(data.id, null, null, data.pointsGiven)
			}else{
				this.setPlayerCursorData(data.id, data.newPosition, null, null)

				this.setState(oldState => {
					oldState.cursorClicks.push(getNewCursorClick("normal", data.newPosition))
					return oldState
				})
			}
		})

		this.props.socket.on("setName", data => {
			this.setPlayerCursorData(data.id, null, data.newName, null)
		})

		this.props.socket.on("pointsData", data => {
			this.setState(oldState => {
				if(Math.abs(data.points - oldState.pointsData.points) > 10 || data.points > oldState.pointsData.points) oldState.pointsData.points = data.points
				oldState.pointsData.upgrades = data.upgrades
				return oldState
			})
		})

		this.props.socket.on("userDisconnect", id => {
			this.setState(oldState => {
				let cursors = oldState.cursors
				delete cursors[id]
				return {cursors}
			})
		})

		let nameCookie = Cookies.get("name")
		if(nameCookie != null) this.props.socket.emit("setName", nameCookie)
	}

	componentWillUnmount(){
		window.addEventListener("mousedown", this.handleWindowMouseDown)
		window.removeEventListener("mousemove", this.handleWindowMouseMove)

		clearInterval(this.handleCleanupInterval)
	}

	getMousePositionData = e => {
		return {x: e.pageX - window.innerWidth / 2, y: e.pageY - window.innerHeight / 2}
	}

	handleWindowMouseDown = e => {
		if(e.target.id !== "click-me-button"){
			this.props.socket.emit("cursorClick", this.getMousePositionData(e))
			this.setState(oldState => {
				oldState.cursorClicks.push(getNewCursorClick("normal", this.getMousePositionData(e)))
				return oldState
			})
		}
	}

	handleWindowMouseMove = e => {
		this.props.socket.emit("cursorMove", this.getMousePositionData(e))
	}

	handleCleanup = () => {
		this.setState(oldState => {
			oldState.cursorClicks = oldState.cursorClicks.filter(click => {
				if(click.type === "center"){
					return new Date().getTime() - click.created < 750
				}else{
					return new Date().getTime() - click.created < 500
				}
			})

			return oldState
		})
	}

	handleClickMeButtonClick = e => {
		this.setState(oldState => {
			oldState.pointsData.points = oldState.pointsData.points + 1
			oldState.cursorClicks.push(getNewCursorClick("center"))
			return oldState
		})
	}

	render() {
		let cursors = Object.entries(this.state.cursors).map(entry => {
			let id = entry[0]
			let data = entry[1]
			return <Cursor key={id} id={id} data={data} />
		})
		let cursorClicks = this.state.cursorClicks.map(click => {
			return <CursorClick key={click.id} click={click} />
		})

		let todoElements = todo.map(todo => {
			return <div key={todo}>- {todo}</div>
		})

		return (
			<div id="main-page">
				<Helmet>
					<title>Online Clicker - {numberWithCommas(Math.round(this.state.pointsData.points))} points!</title>
				</Helmet>

				<BackgroundImage />

				<SetNameInput socket={this.props.socket} />

				<ClickMeButton socket={this.props.socket} onClick={this.handleClickMeButtonClick} />
				<div id="points-text-container">
					<div id="points-text">{numberWithCommas(Math.round(this.state.pointsData.points))} points</div>
					<div id="points-subtext">+{getPointsPerSecond(this.state.pointsData.upgrades)} points per second</div>
				</div>

				<UpgradesContainer socket={this.props.socket} upgrades={this.state.pointsData.upgrades} />

				<div className="todo">
					<div>todo:</div>
					{todoElements}
				</div>

				{cursors}
				{cursorClicks}
			</div>
		);
	}
}
