/**
 * Battle Sound Effects using Web Audio API
 * Simple 8-bit style sound effects
 */

class BattleSounds {
    constructor() {
        this.audioContext = null;
        this.enabled = true;
        this.initAudio();
    }

    initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported');
            this.enabled = false;
        }
    }

    /**
     * Play a tone with specified frequency and duration
     */
    playTone(frequency, duration, type = 'sine') {
        if (!this.enabled || !this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = type;

        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    /**
     * Attack sound effect
     */
    playAttack() {
        if (!this.enabled) return;

        // Quick swoosh sound
        this.playTone(800, 0.1, 'sawtooth');
        setTimeout(() => this.playTone(1200, 0.1, 'sawtooth'), 50);
    }

    /**
     * Hit/damage sound effect
     */
    playHit() {
        if (!this.enabled) return;

        // Impact sound
        this.playTone(200, 0.15, 'square');
        setTimeout(() => this.playTone(150, 0.1, 'square'), 50);
    }

    /**
     * Critical hit sound
     */
    playCritical() {
        if (!this.enabled) return;

        // Higher pitched hit
        this.playTone(1000, 0.1, 'square');
        setTimeout(() => this.playTone(1500, 0.1, 'square'), 80);
        setTimeout(() => this.playTone(2000, 0.15, 'square'), 160);
    }

    /**
     * Super effective sound
     */
    playSuperEffective() {
        if (!this.enabled) return;

        // Rising tone
        this.playTone(400, 0.15, 'sine');
        setTimeout(() => this.playTone(600, 0.15, 'sine'), 100);
        setTimeout(() => this.playTone(800, 0.2, 'sine'), 200);
    }

    /**
     * Not very effective sound
     */
    playNotEffective() {
        if (!this.enabled) return;

        // Falling tone
        this.playTone(600, 0.15, 'sine');
        setTimeout(() => this.playTone(400, 0.2, 'sine'), 100);
    }

    /**
     * Victory fanfare
     */
    playVictory() {
        if (!this.enabled) return;

        const notes = [523, 587, 659, 698, 784, 880];
        notes.forEach((freq, index) => {
            setTimeout(() => this.playTone(freq, 0.3, 'sine'), index * 150);
        });
    }

    /**
     * Defeat sound
     */
    playDefeat() {
        if (!this.enabled) return;

        const notes = [440, 392, 349, 330, 294];
        notes.forEach((freq, index) => {
            setTimeout(() => this.playTone(freq, 0.25, 'sine'), index * 120);
        });
    }

    /**
     * HP low warning
     */
    playLowHP() {
        if (!this.enabled) return;

        this.playTone(800, 0.1, 'square');
        setTimeout(() => this.playTone(800, 0.1, 'square'), 200);
    }

    /**
     * Faint sound
     */
    playFaint() {
        if (!this.enabled) return;

        // Descending tone
        const startFreq = 800;
        const endFreq = 100;
        const duration = 0.8;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.setValueAtTime(startFreq, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(
            endFreq,
            this.audioContext.currentTime + duration
        );

        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    /**
     * Button click sound
     */
    playClick() {
        if (!this.enabled) return;

        this.playTone(600, 0.05, 'sine');
    }

    /**
     * Heal sound
     */
    playHeal() {
        if (!this.enabled) return;

        this.playTone(523, 0.1, 'sine');
        setTimeout(() => this.playTone(659, 0.1, 'sine'), 80);
        setTimeout(() => this.playTone(784, 0.15, 'sine'), 160);
    }

    /**
     * Level up sound
     */
    playLevelUp() {
        if (!this.enabled) return;

        const notes = [523, 659, 784, 1047];
        notes.forEach((freq, index) => {
            setTimeout(() => this.playTone(freq, 0.2, 'sine'), index * 100);
        });
    }

    /**
     * Toggle sounds on/off
     */
    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    /**
     * Set volume
     */
    setVolume(volume) {
        // Volume is handled by gainNode in each sound
        this.volume = Math.max(0, Math.min(1, volume));
    }
}

// Create global instance
window.battleSounds = new BattleSounds();
