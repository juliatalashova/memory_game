import React from 'react';

const Card = props => {
  const {frontImg, backImg, flipped, onClick} = props
  const img = flipped ? frontImg : backImg
  return (
    <div className="card" onClick={onClick}>
      <div>{img}</div>
    </div>
  )
}

export default Card
