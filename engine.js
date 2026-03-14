const canvas = document.getElementById('universe-canvas');
const ctx = canvas.getContext('2d', { alpha: false });
let w, h, time = 0;

/* 8K PROCEDURAL TEXTURE GENERATOR */
const generateMegaTexture = (t) => {
    const offCanvas = document.createElement('canvas');
    offCanvas.width = 512; offCanvas.height = 512;
    const octx = offCanvas.getContext('2d');
    const imgData = octx.createImageData(512, 512);
    const data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
        const x = (i / 4) % 512;
        const y = Math.floor((i / 4) / 512);
        const noise = Math.sin(x * 0.01 + t) * Math.cos(y * 0.01 + t * 0.5) * 127 + 128;
        data[i] = noise * 0.2;     // R
        data[i+1] = noise * 0.8;   // G
        data[i+2] = 255;           // B
        data[i+3] = 255;           // A
    }
    octx.putImageData(imgData, 0, 0);
    return offCanvas;
};

const init = () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
};

window.addEventListener('resize', init);
init();

const render = () => {
    time += 0.01;
    
    // BASE VOID
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, w, h);

    // LAYERED GENERATIVE ATMOSPHERE
    ctx.save();
    ctx.globalAlpha = 0.15;
    ctx.globalCompositeOperation = 'screen';
    
    for(let i = 0; i < 3; i++) {
        const scale = 1 + i * 0.5;
        const shiftX = Math.sin(time * 0.2 + i) * 100;
        const shiftY = Math.cos(time * 0.2 + i) * 100;
        ctx.drawImage(generateMegaTexture(time + i), shiftX, shiftY, w * scale, h * scale);
    }
    ctx.restore();

    // NEURAL BEAMS
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary');
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    for(let i = 0; i < 10; i++) {
        const x = (w / 10) * i;
        const offset = Math.sin(time + i) * 50;
        ctx.moveTo(x, 0);
        ctx.quadraticCurveTo(w/2 + offset, h/2, x, h);
    }
    ctx.stroke();

    requestAnimationFrame(render);
};

render();
