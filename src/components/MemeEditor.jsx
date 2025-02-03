import React, { useEffect, useState } from 'react';
import MemeCanvas from './MemeCanvas';

function MemeEditor() {
    const [top, setTop] = useState("");
    const [bottom, setBottom] = useState("");
    const [image, setImage] = useState(null);
    const [memes, setMemes] = useState([]);
    const [searchq, setSearchq] = useState("");

    const fetchMemes = (query) => {
        fetch("https://api.imgflip.com/get_memes")
        .then((res) => res.json())
        .then((data) => {
            const filteredmemes = data.data.memes.filter((meme) => meme.name.toLowerCase().includes(query.toLowerCase()));
            setMemes(filteredmemes);
            setImage(filteredmemes[0]?.url);
        }).catch((err) => console.error(err));
    }

    useEffect(() => {
        fetchMemes("");
    }, []);

    return (
        <div className='bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg w-full'>
            <h1 className='text-2xl font-bold mb-4 text-white'>Meme Generator</h1>
            
            <input type="text" placeholder='Search Memes...' value={searchq} onChange={(e) => {
                setSearchq(e.target.value);
                fetchMemes(e.target.value);
            }} className='w-full p-2 mb-3 rounded bg-gray-700 text-white' />

            <input type="text" placeholder='Top Text' value={top} onChange={(e) => setTop(e.target.value)} />
            <input type="text" placeholder='Bottom Text' value={bottom} onChange={(e) => setBottom(e.target.value)} className='w-full p-2 mb-3 rounded bg-gray-700 text-white' />

            {/* Meme Thumbnails */}
            {memes.length > 0 ? (
                <div className='flex flex-wrap'>
                    {memes.map((meme) => (
                        <img key={meme.id} src={meme.url} alt={meme.name} className='w-full rounded-md cursor-pointer' onClick={() => setImage(meme.url)} />
                    ))}
                </div>
            ) : (
                <p className='text-white'>No Memes Found</p>
            )}

            {/* Meme Canvas */}
            {image && <MemeCanvas image={image} top={top} bottom={bottom} />}
        </div>
    );
}

export default MemeEditor;