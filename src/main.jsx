import React, { useState, useMemo, useEffect } from "react";
import { createRoot } from "react-dom/client";

const tilesImages = [
  "mateo.jpg", 
  "chimpansini.jpg", 
  "trippitropi.jpg", 
  "tungtungsahur.jpg"
];

function Tile({ image, style = {}, onClick, id, isImageVisible, isMatched }) {
  const defaultStyle = {
    width: 100,
    height: 120,
    backgroundColor: isMatched ? "red" : (isImageVisible ? "transparent" : "black"),
    backgroundImage: isImageVisible ? `url(/assets/images/${image})` : "none",
    backgroundSize: "cover",
    borderRadius: 5,
    cursor: isMatched ? "not-allowed" : "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center", // Centering the tile content
    fontSize: 16,
    color: "white", // For visible tile text (optional)
  };

  return <div style={{ ...defaultStyle, ...style }} onClick={() => !isMatched && onClick(id)} />;
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
  const [cards, setCards] = useState(8);
  const [play, setPlay] = useState(false);
  const [randomImages, setRandomImages] = useState([]);
  const [clickedTiles, setClickedTiles] = useState([]); // Store clicked tile indices
  const [isWaiting, setIsWaiting] = useState(false); // To prevent further clicks during waiting
  const [matchedTiles, setMatchedTiles] = useState([]); // Store matched tiles (red)
  const [gameOver, setGameOver] = useState(false); // To track if game is over

  const increase = () => setCards((v) => Math.min(8, v + 2));
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

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  function generateRandomImages(images, totalCards) {
    let availableImages = [];
    let selectedImages = [];
    let imagesCount = totalCards / 2;

    while (selectedImages.length < imagesCount) {
      let randomImage = images[getRandomInt(images.length)];
      if (!selectedImages.includes(randomImage)) {
        selectedImages.push(randomImage);
        availableImages.push(randomImage, randomImage);
      }
    }
    availableImages = availableImages.sort(() => Math.random() - 0.5);
    setRandomImages(availableImages);
  }

  const { cols, rows } = useMemo(() => {
    let best = 1;
    for (let i = 1; i * i <= cards; i++) {
      if (cards % i === 0) best = i;
    }
    return { cols: best, rows: cards / best };
  }, [cards]);

  useEffect(() => {
    if (play) {
      generateRandomImages(tilesImages, cards);
    }
  }, [play, cards]);

  // Handle tile clicks
  const handleTileClick = (index) => {
    if (isWaiting || clickedTiles.length >= 2 || matchedTiles.includes(index)) return; // Prevent clicks while waiting or if already matched
    setClickedTiles((prev) => [...prev, index]);

    // If two tiles are clicked, check if they match
    if (clickedTiles.length === 1) {
      const firstTileIndex = clickedTiles[0];
      const secondTileIndex = index;
      
      if (randomImages[firstTileIndex] === randomImages[secondTileIndex]) {
        // Mark as matched
        setMatchedTiles((prev) => [...prev, firstTileIndex, secondTileIndex]);
      }

      setIsWaiting(true);
      setTimeout(() => {
        // Reset clicked tiles and continue
        setIsWaiting(false);
        setClickedTiles([]);
      }, 3000);
    }
  };

  // Check if the game is over
  useEffect(() => {
    if (matchedTiles.length === cards) {
      setGameOver(true);
    }
  }, [matchedTiles, cards]);

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

  return (
    <>
      <Button text="Exit" style={exitStyle} onClick={() => setPlay(false)} />
      {gameOver && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "36px",
            color: "green",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Gratulacje! Gra zakończona!
        </div>
      )}
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
        {randomImages.map((image, i) => (
          <Tile
            key={i}
            image={image}
            onClick={handleTileClick}
            id={i}
            isImageVisible={clickedTiles.includes(i)}
            isMatched={matchedTiles.includes(i)}
          />
        ))}
      </div>
    </>
  );
}

createRoot(document.getElementById("root")).render(<Header />);
