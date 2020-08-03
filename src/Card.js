import React from 'react';

const Card = props => {
  const {frontImg, backImg, flipped, onClick, paused} = props

  const img = flipped ? frontImg : backImg
  function handleClick(event) {
    if (paused) {
      onClick(event)
    }
  }
  return (
    <div className="card" onClick={handleClick}>
      <div>{img}</div>
    </div>
  )
}

export default Card
