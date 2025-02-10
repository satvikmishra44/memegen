import { Dialog, DialogContent, DialogTitle, TextField, Button } from '@mui/material';
import html2canvas from 'html2canvas';
import React, { useEffect, useState } from 'react';
import Draggable from 'react-draggable';

function MemeEditor() {

  const [memes, setMemes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [top, setTop] = useState("");
  const [bottom, setBottom] = useState("");
  const [open, setOpen] = useState(false);
  const [searched, setSearched] = useState("");
  const [addedText, setAddedText] = useState([]);
  const [newText, setNewText] = useState("");
  const [clickedIndex, setClickedIndex] = useState(null);

  useEffect(() => {
    fetch("https://api.imgflip.com/get_memes")
    .then((res) => res.json())
    .then((data) => setMemes(data.data.memes));
  }, [])

  const openModal = (meme) => {
    setSelected(meme);
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
    setTop("");
    setBottom("");
    setAddedText([]);
  }


  const downloadMeme = () => {
    const memeElement = document.getElementById("meme");
    const memeImage = memeElement.querySelector("img");

    memeImage.onload = () => {
      html2canvas(memeElement, {
        useCORS: true,
        backgroundColor: null,
        logging: true
      }).then((canvas) => {
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "meme.png";
        link.click();
      })
    };

    if(memeImage.complete){
      memeImage.onload();
    }
  }
  
  const addNewText = () => {
    setAddedText([...addedText, newText]);
    setNewText("");
  }

  const removeText = (index) => {
    setAddedText(addedText.filter((_, i) => i != index));
  }

  const filteredMemes = memes.filter((meme) => {
    return meme.name.toLowerCase().includes(searched.toLowerCase())
  })

  const handleTextClick = (index) => {
    setClickedIndex(clickedIndex === index ? null : index);
  }

  return (
    <div style={{textAlign:"center", width:"100vw"}}>

      <div style={{height:"20%", width:"100%", top:"0", display:"flex", textAlign:"center", alignItems:"center", flexDirection:"column", position:"absolute"}}>
        <h1>MemeGen</h1>

      {/* Search Bar */}
        <TextField fullWidth margin='normal' label="Search" value={searched} variant='outlined' onChange={e => setSearched(e.target.value)} style={{width:"50%", margin: "auto"}} />
      </div>
     
        {/* Meme Grid */}

    <div style={{
      columnCount: 4,  // You can adjust this value to control the number of columns
      columnGap: "10px", 
      padding: "10px",
      marginTop:"50%"
    }}>
      {filteredMemes.map((meme) => (
        <img
          key={meme.id}
          src={meme.url}
          alt={meme.name}
          style={{
            width: "100%",          // Ensures image is responsive and doesn't overflow
            height: "auto",         // Maintains aspect ratio
            objectFit: "cover",     // Ensures images fill their containers without stretching or distorting
            borderRadius: "10px",   // Optional, adds rounded corners for a nice look
            cursor: "pointer",
            breakInside: "avoid",   // Prevents images from being split across columns
          }}
          onClick={() => openModal(meme)}
        />
      ))}
    </div>


      
      {/* Modal For Meme Editing */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Edit Your Meme</DialogTitle>
        <DialogContent style={{textAlign:"center"}}>
          {selected && (
            <div id='meme' style={{position:"relative", display:"inline-block", width:"100%", height:"auto", minHeight:"300px"}}>

            {/* Meme Image */}

            <img src={selected.url} alt="Meme" style={{width:"100%", height:"auto", display:"block", objectFit:"cover"}} />
            <Draggable>
              <p style={{position:"absolute", top:"10px", left:"50%", transform:"translateX(-50%)", fontSize:"24px", color:"black", fontWeight:"bold"}}>
                {top}
              </p>
            </Draggable>

            {addedText.map((text, index) => (
              <Draggable key={index}>
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: "24px", fontWeight: "bold", color: "black"}} onClick={(e) => {e.stopPropagation(); handleTextClick(index); }}>
                  <p>{text}</p>
                  {clickedIndex === index && (
                    <Button variant="contained" color="secondary" onClick={() => removeText(index)} style={{ marginTop: "5px" }}>Delete</Button>
                  )}
                </div>
              </Draggable>
            ))}

            <Draggable>
              <p style={{position:"absolute", bottom:"10px", left:"50%", transform:"translateX(-50%)", fontSize:"24px", color:"black", fontWeight:"bold"}}>
                {bottom}
              </p>
            </Draggable>  
            </div>
          )}
        
        <TextField fullWidth margin="normal" label="Top Text" variant="outlined" value={top} onChange={(e) => setTop(e.target.value)} />
          <TextField fullWidth margin="normal" label="Bottom Text" variant="outlined" value={bottom} onChange={(e) => setBottom(e.target.value)} />
          <TextField fullWidth margin="normal" label="New Text" variant="outlined" value={newText} onChange={(e) => setNewText(e.target.value)} />
          <Button variant="contained" color="primary" onClick={downloadMeme} style={{ margin: "10px" }}>
            Download Meme
          </Button>
          <Button variant="contained" color="secondary" onClick={addNewText} style={{ margin: "10px" }} >Add Text</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default MemeEditor;
