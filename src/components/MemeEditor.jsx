import React, { useState, useEffect } from "react";
import html2canvas from "html2canvas";
import { Dialog, DialogTitle, DialogContent, TextField, Button } from "@mui/material";
import Draggable from 'react-draggable'; // Import react-draggable

const MemeEditor = () => {
  const [memes, setMemes] = useState([]);
  const [selectedMeme, setSelectedMeme] = useState(null);
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Added state for search term

  useEffect(() => {
    fetch("https://api.imgflip.com/get_memes")
      .then((res) => res.json())
      .then((data) => setMemes(data.data.memes));
  }, []);

  const openModal = (meme) => {
    setSelectedMeme(meme);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setTopText("");
    setBottomText("");
  };

  const downloadMeme = () => {
    const memeElement = document.getElementById("meme-canvas");
    const memeImage = memeElement.querySelector("img"); // Grab the meme image

    // Ensure the meme image is loaded before proceeding
    memeImage.onload = () => {
      html2canvas(memeElement, {
        useCORS: true, // Ensure external images are captured
        backgroundColor: null, // Remove any unwanted background
        logging: true, // Helps debug if necessary
      }).then((canvas) => {
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "meme.png";
        link.click();
      });
    };

    // Trigger the image loading process if already loaded
    if (memeImage.complete) {
      memeImage.onload();
    }
  };

  // Filter memes based on search term
  const filteredMemes = memes.filter((meme) =>
    meme.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Meme Generator</h1>

      {/* Search Bar */}
      <TextField
        fullWidth
        margin="normal"
        label="Search Memes"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: "20px", width: "300px", margin: "0 auto" }}
      />

      {/* Meme Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "10px",
        }}
      >
        {filteredMemes.map((meme) => (
          <img
            key={meme.id}
            src={meme.url}
            alt={meme.name}
            style={{ width: "100%", cursor: "pointer" }}
            onClick={() => openModal(meme)}
          />
        ))}
      </div>

      {/* Modal for Meme Editing */}
      <Dialog open={open} onClose={closeModal} fullWidth maxWidth="sm">
        <DialogTitle>Edit Your Meme</DialogTitle>
        <DialogContent style={{ textAlign: "center" }}>
          {selectedMeme && (
            <div
              id="meme-canvas"
              style={{
                position: "relative",
                display: "inline-block",
                width: "100%",
                height: "auto",
                minHeight: "300px", // Set a minimum height to ensure it looks good
              }}
            >
              {/* Meme Image */}
              <img
                src={selectedMeme.url}
                alt="Meme"
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                  objectFit: "cover",
                }}
              />
              {/* Draggable Top Text */}
              <Draggable>
                <p
                  style={{
                    position: "absolute",
                    top: "10px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "white",
                    textShadow: "2px 2px 4px black",
                  }}
                >
                  {topText}
                </p>
              </Draggable>
              {/* Draggable Bottom Text */}
              <Draggable>
                <p
                  style={{
                    position: "absolute",
                    bottom: "10px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "white",
                    textShadow: "2px 2px 4px black",
                  }}
                >
                  {bottomText}
                </p>
              </Draggable>
            </div>
          )}

          <TextField
            fullWidth
            margin="normal"
            label="Top Text"
            variant="outlined"
            value={topText}
            onChange={(e) => setTopText(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Bottom Text"
            variant="outlined"
            value={bottomText}
            onChange={(e) => setBottomText(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={downloadMeme}
            style={{ marginTop: "10px" }}
          >
            Download Meme
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MemeEditor;
