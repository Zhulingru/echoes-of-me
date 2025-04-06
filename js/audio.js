class AudioSystem {
    constructor() {
        this.bgm = new Audio();
        this.bgm.loop = true;
        this.currentTrack = null;
        this.volume = 0.5;
        this.bgm.volume = this.volume;
    }

    playSceneMusic(musicPath) {
        if (this.currentTrack === musicPath) return;
        
        // 淡出當前音樂
        this.fadeOut().then(() => {
            this.bgm.src = musicPath;
            this.currentTrack = musicPath;
            this.bgm.play().catch(error => {
                console.warn('Music autoplay failed:', error);
            });
            this.fadeIn();
        });
    }

    playExplorationMusic() {
        this.playSceneMusic('assets/music/background.mp3');
    }

    fadeOut() {
        return new Promise(resolve => {
            if (!this.bgm.src) {
                resolve();
                return;
            }

            const fadeInterval = setInterval(() => {
                if (this.bgm.volume > 0.1) {
                    this.bgm.volume -= 0.1;
                } else {
                    this.bgm.pause();
                    this.bgm.volume = 0;
                    clearInterval(fadeInterval);
                    resolve();
                }
            }, 100);
        });
    }

    fadeIn() {
        this.bgm.volume = 0;
        const fadeInterval = setInterval(() => {
            if (this.bgm.volume < this.volume) {
                this.bgm.volume = Math.min(this.bgm.volume + 0.1, this.volume);
            } else {
                clearInterval(fadeInterval);
            }
        }, 100);
    }

    setVolume(value) {
        this.volume = Math.max(0, Math.min(1, value));
        this.bgm.volume = this.volume;
    }

    stop() {
        this.fadeOut().then(() => {
            this.bgm.pause();
            this.bgm.currentTime = 0;
            this.currentTrack = null;
        });
    }
}

// 創建音頻系統的全局實例
window.audioSystem = new AudioSystem();

// 在文檔加載完成後初始化音頻系統
document.addEventListener('DOMContentLoaded', () => {
    // 添加音量控制UI
    const volumeControl = document.createElement('div');
    volumeControl.id = 'volume-control';
    volumeControl.innerHTML = `
        <label for="volume-slider">音量</label>
        <input type="range" id="volume-slider" min="0" max="100" value="50">
    `;
    document.body.appendChild(volumeControl);

    // 綁定音量控制事件
    const slider = document.getElementById('volume-slider');
    slider.addEventListener('input', (e) => {
        window.audioSystem.setVolume(e.target.value / 100);
    });
}); 