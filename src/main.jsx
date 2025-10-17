import React, { useState, useMemo } from "react";
import { createRoot } from "react-dom/client";

const tilesImages = ["mateo.jpg", "chimpansini.jpg", "trippitropi.jpg", "tungtungsahur.jpg"];

function Tile({ image, style = {} }) {
  const defaultStyle = {
    width: 100, 
    height: 120,
    backgroundColor: "white",
    backgroundImage: "url(/assets/images/"+image+")",
    backgroundSize: "cover",
    borderRadius: 5,
  };

  return <div style={{ ...defaultStyle, ...style }} />;
}

function Button({ text, onClick, style = {} }) {
  const defaultStyle = {
    width: 120,
    height: 50,
    fontSize: 24,
    backgroundColor: "lightgray",
    borderRadius: 7,
    border: "1px solid #333",
    fontFamily: "Cardana",
    cursor: "pointer",
  };
  const buttonStyle = { ...defaultStyle, ...style };
  return (
    <button style={buttonStyle} onClick={onClick}>
      {text}
    </button>
  );
}

function Header() {
  const [cards, setCards] = useState(10);
  const [play, setPlay] = useState(false);

  const increase = () => setCards((v) => Math.min(20, v + 2));
  const decrease = () => setCards((v) => Math.max(4, v - 2));

  const headerStyle = {
    marginTop: "100px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    fontSize: 30,
    fontFamily: "Cardana",
    gap: 20,
  };

  const buttonsStyle = {
    display: "flex",
    gap: 50,
    marginBottom: 10,
  };

  const playStyle = {
    backgroundColor: "#61ad5c",
    color: "white",
    width: 270,
    height: 120,
    marginTop: 20,
    fontSize: 28,
  };

  const exitStyle = {
    backgroundColor: "#c23c3c",
    color: "white",
    margin: 20,
  };
  
  const randomTilesImages = tilesImages;

  function mostSquareDimenstions(cards) {
    let best = 1;
    for (let i = 1; i * i <= cards; i++) {
      if (cards % i === 0) best = i;
    }
    return { cols: best, rows: cards / best };
  }
  const {cols,rows} = useMemo(() => mostSquareDimenstions(cards), [cards]);

  if (!play) {
    return (
      <div style={headerStyle}>
        <h1>Memory</h1>
        <div style={buttonsStyle}>
          <Button text="+2" onClick={increase} />
          <Button text="-2" onClick={decrease} />
        </div>
        <div>Cards: {cards}</div>
        <Button text="Play" style={playStyle} onClick={() => setPlay(true)} />
      </div>
    );
  }

  function getRandomImage() {

  }

  return (
    <>
      <Button text="Exit" style={exitStyle} onClick={() => setPlay(false)} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: 12,
          padding: 20,
          maxWidth: 900,
          margin: "0 auto",
        }}
      >
        {Array.from({length: cards}).map((_, i) => (
          <Tile key={i} image={tilesImages[0]}/>
        ))}
      </div>
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <>
    <Header />
  </>
);