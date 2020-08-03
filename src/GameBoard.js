import React, {useState, useEffect} from 'react';
import Card from './Card'


export default function GameBoard () {
  let [cards, setCards] = useState(buildCards())
  let [openedCards, setOpenedCard] = useState([])
  let [matches, setMatches] = useState([])

  let [counter, setCounter] = useState(12)
  let [paused, setPaused] = useState(false)

  let [newGame, setNewGame] = useState(false)

  useEffect(() => {
    let timer;
    if (counter > 0 && paused) {
      timer = setTimeout(() => setCounter(c => c - 1), 1000);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [counter, paused]);

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
    setCounter(12)
  }
  function onExitBtnClick() {
    setNewGame(false)
    resetTimer()
  }
  function onNewGameBtnClick() {
    setNewGame(true)
    startPauseTimer()
  }

    const onCardClick = card => () => {
    if (openedCardsFull(openedCards) || cardAlreadyInOpened(openedCards, card)) return
    const newOpenedCards = [...openedCards, card]
    setOpenedCard(newOpenedCards)
    const openedCardsMatched = validateOpened(newOpenedCards)
    if (openedCardsMatched) {
      setMatches([...matches, newOpenedCards[0].type])
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
    setCards(cards.map(card => ({
      ...card,
      flipped:
        openedCards.find(c => c.id === card.id) ||
        matches.includes(card.type),
    })))

  }, [openedCards, matches])

  return (
   <div>
     {newGame ?
       <div className="time">
         Time Left:
         <span>{counter} s {counter > 0 && !paused ? 'Paused' : ''}</span>
       </div>
        : <h3>Are you ready?</h3>
     }
      <div className="board">
       {cards.map(card => (
         <Card card={card} onClick={onCardClick(card)} key={card.id}/>
       ))}
     </div>

     {newGame ?
       <div>
         <button onClick={onExitBtnClick}>Exit</button>
         <button type="button" className="btn-play" disabled={!counter} onClick={startPauseTimer}>
           {counter > 0 && paused ? <span>Pause</span> : <span>Resume</span>}
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
      backImg: '?',
      frontImg: item,
      flipped: false
    })
    return [ ...result, createCard(), createCard()]
  }, [])
  return shuffleArray(cards)
}
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}
