import React from 'react'

export default function Dice(props) {

    const styles = {
        backgroundColor: props.isHeld ? '#59E391' : '#FFFFFF'
    }

    return (
        <div className="dice" onClick={() => props.holdDice(props.id)} style={styles}>
            {props.value}
        </div>
    )
}