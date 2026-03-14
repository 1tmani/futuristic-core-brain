/* NEURAL AUDIO ENGINE V32 */
class NeuralAudio {
    constructor() {
        this.ctx = null;
        this.osc = null;
        this.gain = null;
        this.active = false;
    }

    init() {
        if (this.active) return;
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.osc = this.ctx.createOscillator();
        this.gain = this.ctx.createGain();
        
        this.osc.type = 'sine';
        this.osc.frequency.setValueAtTime(55, this.ctx.currentTime); // Low A drone
        
        this.gain.gain.setValueAtTime(0, this.ctx.currentTime);
        this.gain.gain.linearRampToValueAtTime(0.05, this.ctx.currentTime + 2);

        this.osc.connect(this.gain);
        this.gain.connect(this.ctx.destination);
        
        this.osc.start();
        this.active = true;
        console.log('🔊 Neural Audio Engine Online');
    }

    updateFrequency(val) {
        if (!this.active) return;
        const freq = 55 + (val * 2);
        this.osc.frequency.setTargetAtTime(freq, this.ctx.currentTime, 0.1);
    }
}

const audio = new NeuralAudio();

window.addEventListener('click', () => audio.init(), { once: true });
window.addEventListener('touchstart', () => audio.init(), { once: true });
