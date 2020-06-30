import React, {useState, useEffect} from 'react';
import Card from './Card'


export default function GameBoard () {
  let [cards, setCards] = useState(buildCards())
  let [openedCards, setOpenedCard] = useState([])
  let [completed, setCompleted] = useState([])
  let [newGame, setNewGame] = useState(false)
  let [disabled, setDisabled] = useState(false)
  let [counter, setCounter] = useState(72)
  let [paused, setPaused] = useState(false)

  const onCardClick = card => () => {
    if (openedCardsFull(openedCards) || cardAlreadyInOpened(openedCards, card)) return
    const newOpenedCards = [...openedCards, card]
    setOpenedCard(newOpenedCards)
    const openedCardsMatched = validateOpened(newOpenedCards)
    if (openedCardsMatched) {
      setCompleted([...completed, newOpenedCards[0].type])
    }
    if (openedCardsFull(newOpenedCards)) {
      resetOpenedAfter(1000)
    }

    function validateOpened(openedCards){
      return openedCards.length === 2 &&
      openedCards[0].type === openedCards[1].type
    }
    function cardAlreadyInOpened(openedCards, card){
      return openedCards.length === 1 && openedCards[0].id === card.id
    }
    function openedCardsFull(openedCards){
      return openedCards.length === 2
    }
    function resetOpenedAfter(time) {
      setTimeout(() => {
        setOpenedCard([])
      }, time)
    }
  }

  useEffect(() => {
    const newCards = cards.map(card => ({
      ...card,
      flipped:
        openedCards.find(c => c.id === card.id) ||
        completed.includes(card.type),
    }))
    setCards(newCards)
  }, [openedCards, completed])

  function onNewGameBtnClick () {
    setNewGame(true)
    startPauseTimer()
  }
  function onExitBtnClick () {
    setNewGame(false)
    resetTimer()
  }


  useEffect(() => {
    if(paused) {
      let timer = setInterval(() => {
        setCounter(counter => Math.max(counter - 1))
      }, 1000);
      return () => {
        clearInterval(timer);

      };
    }
  }, [paused])

  useEffect(() => {
    if(!paused) {
        setPaused(false)
    }
  }, [paused])

  function startPauseTimer() {
    setPaused(counter ? !paused : false)
  }
  function resetTimer() {
    setPaused(false);
    setCounter(72)
  }
  function disabledClick () {
    if (paused) {
      setDisabled(true)
      console.log(paused)
    }
  }
  return (
    <div>
      {newGame ?
        <div className="time">
          Time Left:
          <span>{counter} s</span>
        </div>
         : <h3>Are you ready?</h3>
      }
      <div className="board">
        {cards.map(card => (
          <Card {...card} onClick={!disabled && onCardClick(card)} key={card.id} aria-disabled={disabledClick}/>
        ))}
      </div>
      {newGame ?
        <div>
          <button onClick={onExitBtnClick}>Exit</button>
          <button type="button" className="btn-play" disabled={!counter} onClick={startPauseTimer}>
            {paused ? <span>Pause</span> : <span>Resume</span>}
          </button>
        </div> :
        <button className="newGame-btn" onClick={onNewGameBtnClick}>new game</button>
      }
    </div>
  )
}


function buildCards() {
  let id = 0
  let arr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l']

  let cards = arr.reduce((result, item) => {
    let createCard = () => ({
      id: id++,
      type: item,
      backImg: '',
      frontImg: item,
      flipped: false
    })

    return [ ...result, createCard(), createCard()]
  }, [])
  return shuffle(cards)
}

function shuffle(arr) {
  let len = arr.length
  for (let i = 0; i < len; i++) {
    let randomIdx = Math.floor(Math.random() * len)
    let copyCurrent = {...arr[i]}
    let copyRandom = {...arr[randomIdx]}
    arr[i] = copyRandom
    arr[randomIdx] = copyCurrent
  }
  return arr
}
