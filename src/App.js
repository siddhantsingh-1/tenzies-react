import React from 'react'
import Dice from './Components/Dice'
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'

export default function App() {

    const [ dice, setDice ] = React.useState(allNewDice())
    const [ tenzies, setTenzies ] = React.useState(false)
    const [rolls, setRolls] = React.useState(0)
    const [ pbRolls, setPbRolls ] = React.useState(JSON.parse(localStorage.getItem('pbRolls')) || null)
    const [time, setTime] = React.useState(0)
    const [pbTime, setPbTime] = React.useState(JSON.parse(localStorage.getItem('pbTime')) || null)
    const [gameOn, setGameOn] = React.useState(false)

    function generateNewDie() {
        const randomNum = Math.ceil(Math.random()*6)
        return {
            value: randomNum,
            isHeld: false,
            id: nanoid()
        }
    }

    function allNewDice() {
        const newDie = []
        for(let i = 0; i < 10; ++i) {
            newDie.push(generateNewDie())
        }
        return newDie
    }

    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const allSameValue = dice.every(die => die.value === dice[0].value)
        if(allHeld && allSameValue) {
            setTenzies(true)
        }
    }, [dice])

    React.useEffect(() => {
        if(tenzies && (!pbRolls || rolls < pbRolls)) {
            setPbRolls(rolls)
            localStorage.setItem('pbRolls', rolls)
        }
    }, [tenzies])

    function rollDice() {
        if(!tenzies)
        {
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? die : generateNewDie()
            }))
            setRolls(oldRolls => oldRolls + 1)
        }
        else {
            setDice(allNewDice())
            setTenzies(false)
            setRolls(0)
        }
    }

    function holdDice(diceId) {
        setDice(oldDice => oldDice.map(die => {
                return die.id === diceId ? {...die, isHeld: !die.isHeld} : die
            })
        )
    }

    // Timer Functionality:-
    React.useEffect(() => {

        const noneHeld = dice.every(die => !(die.isHeld))

        if(!noneHeld || rolls === 1) {
            setGameOn(true)
        }

        if(rolls === 0) {
            setTime(0)
        }

        if(tenzies) {
            setGameOn(false)
        }

    }, [rolls, tenzies, dice])

    React.useEffect(() => {
        let interval = null

        if(gameOn) {
            interval = setInterval(() => {
                setTime(prevTime => prevTime + 10)
            }, 10)
        } else {
            if(tenzies && (!pbTime || time < pbTime)) {
                setPbTime(time)
                localStorage.setItem('pbTime', time)
            }
            clearInterval(interval)
        }

        return () => clearInterval(interval)
    }, [gameOn])

    let formattedPbTime = pbTime ? `${("0" + Math.floor(pbTime / 60000) % 60).slice(-2)}:${("0" + Math.floor(pbTime / 1000) % 60).slice(-2)}:${("0" + Math.floor(pbTime / 10) % 100).slice(-2)}` : 'N/A'


    // Making Dice JSX Elements:-
    const newDiceElements = dice.map(die => {
        return <Dice value={die.value} key={die.id} id={die.id} holdDice={holdDice} isHeld={die.isHeld} />
    })

    return (
        <main className="main">
            {tenzies && <Confetti width={400} height={420} />}
            <h3 className="title">Tenzies</h3>
            <section className="stats">
                <h4 className="time">Time: <span>{("0" + Math.floor(time / 60000) % 60).slice(-2)}:</span>
                    <span>{("0" + Math.floor(time / 1000) % 60).slice(-2)}:</span>
                    <span>{("0" + Math.floor(time / 10) % 100).slice(-2)}</span>
                </h4>
                <h4 className="pb-time">PB: {formattedPbTime}</h4>
            </section>
            <div className="description">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</div>
            <div className="dice-section">
                {newDiceElements}
            </div>
            <button className="roll-dice" onClick={rollDice}>{tenzies ? "New Game" : "Roll Dice"}</button>
        </main>
    )
};