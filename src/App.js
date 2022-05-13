import React from 'react'
import Dice from './Components/Dice'
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'

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
    const [ tenzies, setTenzies ] = React.useState(false)
    const [rolls, setRolls] = React.useState(0)
    const [ pbRolls, setPbRolls ] = React.useState(JSON.parse(localStorage.getItem('pbRolls')) || null)

    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const allSameValue = dice.every(die => die.value === dice[0].value)
        if(allHeld && allSameValue) {
            setTenzies(true)
        }
    }, [dice])

    React.useEffect(() => {
        if(!pbRolls || pbRolls < rolls) {
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

    const newDiceElements = dice.map(die => {
        return <Dice value={die.value} key={die.id} id={die.id} holdDice={holdDice} isHeld={die.isHeld} />
    })

    return (
        <main className="main">
            {tenzies && <Confetti width={400} height={420} />}
            <h3 className="title">Tenzies</h3>
            <section className="stats">
                <h4 className="rolls">Rolls: {rolls}</h4>
                <h4 className="pb-rolls">{pbRolls ? `PB: ${pbRolls} Rolls` : `PB: N/A`}</h4>
            </section>
            <div className="description">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</div>
            <div className="dice-section">
                {newDiceElements}
            </div>
            <button className="roll-dice" onClick={rollDice}>{tenzies ? "New Game" : "Roll Dice"}</button>
        </main>
    )
};