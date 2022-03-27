const USERNAME_COOKIE = 'io-game-username'
const state = {
	username: null,
	keys: {
		'ArrowRight': false,
		'ArrowLeft': false,
		'ArrowUp': false,
		'ArrowDown': false,
	}
}
const sanitizeUserInput = (originalString) => {
	return originalString.replace(/(<([^>]+)>)/gi, "");
}
const connect = (username) => {
	// connect to server
	var socket = io();
	socket.emit('join', username)
	let game = { players:  [] } // [{ id: 'TEST_ID', x: 250, y: 250, size: 50 }] }

	let app = new PIXI.Application({ resizeTo: window, clearBeforRender: true });
	document.querySelector('#game-container').appendChild(app.view)
	const graphics = new PIXI.Graphics();
	const addCircle = (player) => {
		graphics.lineStyle(2, 0xFEEB77, 1);
		graphics.beginFill(0x650A5A, 1);
		graphics.drawCircle(player.x, player.y, player.size);
		graphics.endFill();
		app.stage.addChild(graphics);
	}
	let elapsed = 0.0;
	socket.on('update', function(updatedGame){
		if (JSON.stringify(game) !== JSON.stringify(updatedGame)){
			game = updatedGame
			app.ticker.add(((game) => {
				return (delta) => {
					game.players.forEach(each => {
						addCircle(each)
					})
					elapsed += delta;
				}
			})(game));
		}
	})

	document.addEventListener('keydown', (e) => {
		if (state.keys.hasOwnProperty(e.key)){
			state.keys[e.key] = true
			socket.emit('keys', state.keys)
		}
	})
	document.addEventListener('keyup', (e) => {
		if (state.keys.hasOwnProperty(e.key)){
			state.keys[e.key] = false
			socket.emit('keys', state.keys)
		}
	})

	socket.on('disconnect', function () {
		addMessage('disconnected from server', true)
	});

	socket.on('serverMsg', (msg) => {
		addMessage(msg, true)
	})

	socket.on('message', (msg) => {
		addMessage(msg)
	})

	const sendMessage = () => {
		const messageFormInput = document.querySelector('#message-form input');
		socket.emit('message', sanitizeUserInput(messageFormInput.value))
		messageFormInput.value = ""
	}
	const usernameFormInput = document.querySelector('#message-form input');
	const usernameFormSubmit = document.querySelector('#message-form-submit')
	usernameFormSubmit.addEventListener('click', sendMessage)
	usernameFormInput.addEventListener('keypress', (e) => {
		if (e.code === 'Enter'){
			sendMessage()
		}
	})

}

const addMessage = (msg, server = false) => {
	const li = document.createElement('li')
	if (server) {
		li.classList.add('server')
	}
	li.innerText = msg
	document.querySelector('ul#messages').prepend(li)
}

window.addEventListener('DOMContentLoaded', (event) => {
	state.username = getCookie('io-game-username')
    if (!state.username){
		showUsernamePrompt(true)
	} else {
		connect(state.username)
		showUsernamePrompt(false)
	}

	const handleUsernameFormSumbit = () => {
		const usernameFormInput = document.querySelector('#username-form input');
		setUsername(sanitizeUserInput(usernameFormInput.value))
	}

	const usernameFormInput = document.querySelector('#username-form input');
	const usernameFormSubmit = document.querySelector('#username-form-submit')
	usernameFormSubmit.addEventListener('click', handleUsernameFormSumbit)
	usernameFormInput.addEventListener('keypress', (e) => {
		if (e.code === 'Enter'){
			handleUsernameFormSumbit()
		}
	})
});

/**
 * set the users choice in state and in a browser cookie
 * @param {string} username 
 */
const setUsername = (username) => {
	// update state
	state.username = username
	// set cookie
	setCookie(USERNAME_COOKIE, username)
	// show game
	showUsernamePrompt(false)
	// connect to server
	connect(username)
}

function setCookie(name,value,days = 2) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

/**
 * Show username prompt ui
 * @param {boolean} show
 */
const showUsernamePrompt = (show = true) => {
	let prompt, game
	if (show) {
		prompt = 'flex'
		game = 'none'
	} else {
		prompt = 'none'
		game = 'flex'
	}
	document.querySelector('#username-screen').style.display = prompt
	document.querySelector('#game-screen').style.display = game
}

