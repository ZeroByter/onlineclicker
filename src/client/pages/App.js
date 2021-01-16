import React from 'react';
import './app.scss';
import Cursor from '../components/cursor/cursor';
import ClickMeButton from '../components/buttons/click-me-button';
import BackgroundImage from '../components/background-image';
import CursorClick from '../components/cursor/cursor-click';
import { randomString } from '../../shared/essentials';

const todo = [
	"gotta add upgrades which increase non-linearly in effectiveness/cost",
	"usernames"
]

function numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
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

	componentDidMount(){
		window.addEventListener("mousedown", this.handleWindowMouseDown)
		window.addEventListener("mousemove", this.handleWindowMouseMove)

		this.handleCleanupInterval = setInterval(this.handleCleanup, 1000)

		this.props.socket.on("cursorMove", data => {
			this.setState(oldState => {
				let cursors = oldState.cursors
				cursors[data.id] = data.newPosition
				return {cursors}
			})
		})

		this.props.socket.on("cursorClick", data => {
			if(data.type === "center"){
				this.setState(oldState => {
					oldState.cursorClicks.push({id: randomString(), created: new Date().getTime(), type: "center"})
					return oldState
				})
			}else{
				this.setState(oldState => {
					oldState.cursors[data.id] = data.newPosition
					oldState.cursorClicks.push({id: randomString(), created: new Date().getTime(), type: "normal", position: data.newPosition})
					return oldState
				})
			}
		})

		this.props.socket.on("userDisconnect", id => {
			this.setState(oldState => {
				let cursors = oldState.cursors
				delete cursors[id]
				return {cursors}
			})
		})

		this.props.socket.on("pointsData", data => {
			this.setState(oldState => {
				if(Math.abs(data - oldState.pointsData.points) > 10 || data > oldState.pointsData.points) oldState.pointsData.points = data
				return oldState
			})
		})
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
				oldState.cursorClicks.push({id: randomString(), created: new Date().getTime(), type: "normal", position: this.getMousePositionData(e)})
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
			oldState.cursorClicks.push({id: randomString(), created: new Date().getTime(), type: "center"})
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
				<BackgroundImage />
				<ClickMeButton socket={this.props.socket} onClick={this.handleClickMeButtonClick} />
				<div id="points-text">{numberWithCommas(this.state.pointsData.points)} points</div>

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
