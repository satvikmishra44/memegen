import React, { useRef } from 'react';
import html2canvas from 'html2canvas';

function MemeCanvas({image, top, bottom}) {

    const memeref = useRef(null);

    const download = () => {
        html2canvas(memeref.current).then((canvas) => {
            const link = document.createElement('a');
            link.href = canvas.toDataURL("image/png");
            link.download = "meme.png";
            link.click();
        });
    };

    return (
        <div className='relative w-full text-center'>
            <div ref={memeref} className='relative w-full'>
                <img src={image} alt="Meme" className='w-full rounded-md'/>
                <p className='absolute top-2 left-1/2 transform -translate-x-1/2 text-white font-bold text-xl bg-black bg-opacity-50 px-2 py-1'>
                {top}
                </p>
                <p className='absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white font-bold text-xl bg-black bg-opacity-50 px-2 py-1'>
                    {bottom}
                </p>
            </div>
            <button onClick={download} className='mt-4 p-2 bg-blue-600 text-white rounded-lg'>
                Download Meme
            </button>
        </div>
    );
}

export default MemeCanvas;