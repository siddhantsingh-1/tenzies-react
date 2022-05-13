import React from 'react'
import Dice from './Components/Dice'
import { nanoid } from 'nanoid'

export default function App() {

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

    const [ dice, setDice ] = React.useState(allNewDice())

    function rollDice() {
        setDice(oldDice => oldDice.map(die => {
            return die.isHeld ? die : generateNewDie()
        }))
    }

    function holdDice(diceId) {
        setDice(oldDice => oldDice.map(die => {
                return die.id === diceId ? {...die, isHeld: !die.isHeld} : die
            })
        )
    }

    const newDiceElements = dice.map(die => {
        return <Dice value={die.value} key={die.id} id={die.id} holdDice={holdDice} isHeld={die.isHeld} />
    })

    return (
        <main className="main">
            <h3 className="title">Tenzies</h3>
            <div className="description">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</div>
            <div className="dice-section">
                {newDiceElements}
            </div>
            <button className="roll-dice" onClick={rollDice}>Roll Dice</button>
        </main>
    )
};