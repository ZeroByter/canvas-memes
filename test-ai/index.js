//game: coop or cheat
//multiple turns (10 turns for starters)
//inputs: lastOpponentAction(0=coop, 1=cheat)
//4x4 evolutionary neural net
//outputs: action: (0=coop, 1=cheat)

const netWidth = 4
const netHeight = 4

const numberOfGames = 1//50
const turns = 10

function generateDefaultNet(defaultValue) {
    let net = []

    for (let i = 0; i < netWidth * netHeight; i++) {
        net[i] = defaultValue()
    }

    return net
}

function generateNetFromNet(oldNet) {
    let net = []

    for (let i = 0; i < netWidth * netHeight; i++) {
        net[i] = oldNet[i] += Math.random() * 0.1 - 0.1 / 2
    }

    return net
}

function netToString(net) {
    let result = ""

    for (let y = 0; y < netHeight; y++) {
        let values = []

        for (let x = 0; x < netWidth; x++) {
            values.push(net[x + y * netWidth])
        }

        result += `${values.join(" ")}\n\n`
    }

    return result
}

class PlayerNet {
    net;

    constructor(oldNet) {
        if (oldNet) {
            this.net = generateNetFromNet(oldNet.net)
        } else {
            this.net = generateDefaultNet(() => Math.random())
        }
    }

    calculate = lastOpponentAction => {
        let values = generateDefaultNet(() => 0.5)

        for (let i = 0; i < netWidth; i++) {
            values[i] = lastOpponentAction
        }

        for (let y = 0; y < netHeight; y++) {
            for (let x = 0; x < netWidth; x++) {

                if (y < netHeight - 1) {
                    for (let i = 0; i < netHeight; i++) {
                        const index = i + (y + 1) * netWidth

                        values[index] = this.net[i + (y + 1) * netWidth] * values[x + y * netWidth]
                    }
                } else {
                    console.log(netToString(this.net))
                    console.log(netToString(values))

                    return Math.round(values[x + y * netWidth])
                }
            }
        }

        return 0
    }
}

class Game {
    player1;
    player2;

    player1Score = 0
    player2Score = 0

    playerActions = new Array(turns * 2)

    constructor(pastGame) {
        if (pastGame == null) {
            this.player1 = new PlayerNet()
            this.player2 = new PlayerNet()
        } else {
            this.player1 = new PlayerNet(pastGame.player1)
            this.player2 = new PlayerNet(pastGame.player2)
        }

        let lastPlayerChoice = 1

        for (let i = 0; i < turns; i++) {
            lastPlayerChoice = this.player1.calculate(lastPlayerChoice)
            let player1Choice = lastPlayerChoice
            this.playerActions[i * 2] = lastPlayerChoice

            lastPlayerChoice = this.player2.calculate(lastPlayerChoice)
            let player2Choice = lastPlayerChoice
            this.playerActions[i * 2 + 1] = lastPlayerChoice

            if (player1Choice == 1 && player2Choice == 0) {
                this.player1Score += 10
            } else if (this.player1 == 1 && player2Choice == 1) {
                this.player1Score += 5
                this.player2Score += 5
            } else if (this.player1 == 0 && player2Choice == 1) {
                this.player2Score += 10
            }
        }

        console.log(this.player1Score, this.player2Score)
    }
}

class GamesManager {
    playedGames = []

    constructor() {
        for (let i = 0; i < numberOfGames; i++) {
            let lastGame = this.playedGames[i - 1]

            this.playedGames[i] = new Game(lastGame)
        }

        console.log(this.playedGames)
    }
}

new GamesManager()