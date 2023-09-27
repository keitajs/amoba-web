const FIELDS = { Empty: " ", Player: "X", Bot: "O" }
const Game = document.getElementById("game")
const Menu = document.getElementById("menu")
const Message = document.getElementById("msg")
let MAP = []
let NextPlayer = true

function addElement(element, x, y) {
    if ((MAP[x][y] != FIELDS.Empty) || (element == FIELDS.Player && !NextPlayer) || (element == FIELDS.Bot && NextPlayer)) return false

    MAP[x][y] = element
    NextPlayer = !NextPlayer

    DrawMap()
    if (isWinner(element)) {
        Stop(element)
        return false
    }
    if (isFull(MAP)) {
        Stop(0)
        return false
    }
    return true
}

async function PlayerStep(x, y) {
    if (Message.textContent != "​") return

    if (addElement(FIELDS.Player, x, y)) {
        setTimeout(() => {
            BotStep()
        }, 200)
    }
}

function BotStep() {
    if (Message.textContent != "​") return

    SetHaszonMap()
    let X = 0
    let Y = 0

    for (let x = 0; x < 20; x++)
        for (let y = 0; y < 20; y++)
            if (HaszonMap[X][Y] < HaszonMap[x][y] && MAP[x][y] == FIELDS.Empty) {
                X = x
                Y = y
            }

    if (addElement(FIELDS.Bot, X, Y)) DrawMap()
    else BotStep()
}

function isFull(map) {
    for (let x = 0; x < 20; x++) {
        for (let y = 0; y < 20; y++) {
            if (map[x][y] == FIELDS.Empty)
                return false
        }
    }
    return true
}

function isWinner(field) {
    for (let x = 0; x < 20; x++) {
        for (let y = 0; y < 20; y++) {
            if (MAP[x][y] == field) {
                let inLine = [ 1, 1, 1, 1 ]
                if (x > 15)
                    inLine[0] = inLine[2] = inLine[3] = 0
                else
                if (y < 5)
                    inLine[3] = 0
                else
                if (y > 15)
                    inLine[1] = inLine[2] = 0

                for (let i = 1; i < 6; i++) {
                    if (inLine[0] == i && MAP[x + i][y] == field)
						inLine[0] += 1

					if (inLine[1] == i && MAP[x][y + i] == field)
						inLine[1] += 1

					if (inLine[2] == i && MAP[x + i][y + i] == field)
						inLine[2] += 1

					if (inLine[3] == i && MAP[x + i][y - i] == field)
						inLine[3] += 1
                }

                for (let i = 0; i < inLine.length; i++) {
                    if (inLine[i] == 5) {
                        return true
                    }
                }
            }
        }
    }
    return false
}

function CreateMap() {
    for (let x = 0; x < 20; x++) {
        let row = []
        for (let y = 0; y < 20; y++)
            row.push(FIELDS.Empty)
        MAP.push(row)
    }

    for (let x = 0; x < 20; x++) {
        let row = []
        for (let y = 0; y < 20; y++)
            row.push(0)
        HaszonMap.push(row)
    }
}

function DrawMap() {
    let Map = ""

    for (let x = 0; x < 20; x++) {
        let row = ""
        for (let y = 0; y < 20; y++)
            row += `<div class="cell ${MAP[x][y]}" onclick="PlayerStep(${x}, ${y})">${MAP[x][y]}</div>`
        Map += `<div class="row">${row}</div>`
    }

    Game.innerHTML = Map
}

function ClearMap() {
    for (let x = 0; x < 20; x++)
        for (let y = 0; y < 20; y++)
            MAP[x][y] = FIELDS.Empty
}

function Start() {
    Menu.classList.add("hide")
    Game.style.pointerEvents = "all"
    Message.textContent = "​"
    NextPlayer = true
    ClearMap()
    DrawMap()
}

function Stop(winner) {
    Menu.classList.remove("hide")
    Game.style.pointerEvents = "none"

    if (winner == 0) Message.textContent = `Ez a kör döntetlen lett!`
    else Message.textContent = `Ezt a kört a ${{'X': 'Játékos', 'O': 'Bot'}[winner]} nyerte!`
}

document.addEventListener("DOMContentLoaded", () => {
    CreateMap()
})











let HaszonNekem = [ 0, 3, 50, 200, 6000 ]
let HaszonNeki = [ 0, 2, 49, 199, 5999 ]
let HaszonMap = []

function SetHaszonMap() {
    // Hasznok nullázása
    for (let x = 0; x < 20; x++)
        for (let y = 0; y < 20; y++)
            HaszonMap[x][y] = 0

    // Horizontáis
    for (let x = 0; x < 20 - 4; x++)
        for (let y = 0; y < 20; y++)
			Haszon5H(x, y)
	
	// Vertikális
	for (let x = 0; x < 20; x++)
		for (let y = 0; y < 20 - 4; y++)
			Haszon5V(x, y)

	// Főátló
	for (let x = 0; x < 20 - 4; x++)
		for (let y = 0; y < 20 - 4; y++)
			Haszon5Z(x, y)

	// Mellékátló
	for (let x = 4; x < 20; x++)
		for (let y = 0; y < 20 - 4; y++)
			Haszon5Y(x, y)
}

function Haszon5H(x, y) {
    let nekem = 0, neki = 0, h = 0, c

    for (let n = x; n < x + 5; n++) {
        c = MAP[n][y]

        if (c == FIELDS.Player) nekem++
        if (c == FIELDS.Bot) neki++
    }

    if (nekem == 0) h = HaszonNeki[neki]
    if (neki == 0) h = HaszonNekem[nekem]

    for (let n = x; n < x + 5; n++) {
        if (MAP[n][y] == FIELDS.Empty) {
            HaszonMap[n][y] += h
        }
    }
}

function Haszon5V(x, y) {
    let nekem = 0, neki = 0, h = 0, c

    for (let n = y; n < y + 5; n++) {
        c = MAP[x][n]

        if (c == FIELDS.Player) nekem++
        if (c == FIELDS.Bot) neki++
    }

    if (nekem == 0) h = HaszonNeki[neki]
    if (neki == 0) h = HaszonNekem[nekem]

    for (let n = y; n < y + 5; n++) {
        if (MAP[x][n] == FIELDS.Empty) {
            HaszonMap[x][n] += h
        }
    }
}

function Haszon5Z(x, y) {
    let nekem = 0, neki = 0, h = 0, c

    for (let n = 0; n < 5; n++) {
        c = MAP[x + n][y + n]

        if (c == FIELDS.Player) nekem++
        if (c == FIELDS.Bot) neki++
    }

    if (nekem == 0) h = HaszonNeki[neki]
    if (neki == 0) h = HaszonNekem[nekem]

    for (let n = 0; n < 5; n++) {
        if (MAP[n][y] == FIELDS.Empty) {
            HaszonMap[x + n][y + n] += h
        }
    }
}

function Haszon5Y(x, y) {
    let nekem = 0, neki = 0, h = 0, c

    for (let n = 0; n < 5; n++) {
        c = MAP[x - n][y + n]

        if (c == FIELDS.Player) nekem++
        if (c == FIELDS.Bot) neki++
    }

    if (nekem == 0) h = HaszonNeki[neki]
    if (neki == 0) h = HaszonNekem[nekem]

    for (let n = 0; n < 5; n++) {
        if (MAP[n][y] == FIELDS.Empty) {
            HaszonMap[x - n][y + n] += h
        }
    }
}