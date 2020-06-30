import React, {useState} from "react"
import GameBoard from "./GameBoard";
import buildCards from "./GameBoard"

export default function Tabs() {
  let [page, setPage] = useState(window.location.hash.replace("#", ""))
  return <div className="p-4">
    <Menu page={page} setPage={setPage}/>
    {
      page == ""      ? <GamePage/>  :
      page == "help" ? <HelpPage/>: null

    }
  </div>
}
function Menu({page, setPage}) {
  return <div>
    <a href="/#" onClick={_ => setPage("")}>
      {page == "" ? <b>Game</b> : "Game" }
    </a>
    {" | "}
    <a href="/#help" onClick={_ => setPage("help")}>
      {page == "help" ? <b>Help</b> : "Help" }
    </a>
  </div>
}
function GamePage({page}) {
  let cards = buildCards()
  return <GameBoard cards={cards} />
}

function HelpPage({page}) {
  return <div>
    <h2>Game Rules</h2>
    <p>You can consequently flip two cards, turning them face up.
      If both cards are equal, they are removed from the game.
      If they are different, they are turned face down again.</p>
    <p>You win if all cards are removed in time. You lose otherwise.</p>
  </div>
}

