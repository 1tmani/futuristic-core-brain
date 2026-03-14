const canvas = document.getElementById('universe-canvas');
const ctx = canvas.getContext('2d');
let w, h, particles = [], time = 0;

/* PROCEDURAL UNIVERSE INITIALIZATION */
const init = () => {
    w = canvas.width = window.innerWidth * window.devicePixelRatio;
    h = canvas.height = window.innerHeight * window.devicePixelRatio;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    particles = Array.from({length: 120}, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 2 + 1,
        color: getComputedStyle(document.documentElement).getPropertyValue('--primary')
    }));
};

window.addEventListener('resize', init);
init();

/* RENDER LOOP */
const render = () => {
    time += 0.005;
    ctx.fillStyle = '#010101';
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    // NEURAL LIGHT FIELD
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, window.innerWidth);
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary');
    
    gradient.addColorStop(0, primaryColor + '11');
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    // PARTICLE PHYSICS
    ctx.lineWidth = 0.5;
    particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if(p.x < 0 || p.x > window.innerWidth) p.vx *= -1;
        if(p.y < 0 || p.y > window.innerHeight) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = primaryColor + 'aa';
        ctx.fill();

        // NEURAL CONNECTIONS
        for(let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
            if(dist < 150) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = primaryColor + (0.2 * (1 - dist/150)).toString(16).substring(2, 4);
                ctx.stroke();
            }
        }
    });

    requestAnimationFrame(render);
};

render();

/* AUTOMATION ENGINE: SELF EVOLUTION */
setInterval(() => {
    const hue = Math.floor(Math.random() * 360);
    const newPrimary = `hsl(${hue}, 100%, 50%)`;
    document.documentElement.style.setProperty('--primary', newPrimary);
    document.getElementById('evo-status').innerText = 'MUTATING_0x' + hue.toString(16).toUpperCase();
}, 8000);

/* INTERACTION INTELLIGENCE */
window.addEventListener('scroll', () => {
    // Inertia and transition logic could be handled here
    // Section reveal logic managed by CSS snap
});
