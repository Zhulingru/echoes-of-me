// 開場動畫控制器
class IntroSequence {
    constructor() {
        this.currentSlide = 0;
        this.slides = [
            {
                image: 'assets/images/intro/memory year.png',
                text: '在2157年，人類的記憶已經可以被數據化...'
            },
            {
                image: 'assets/images/intro/language break.png',
                text: '隨著科技進步，語言和意識的界限越來越模糊...'
            },
            {
                image: 'assets/images/intro/echoes system.png',
                text: 'ECHOES系統讓我們可以訪問那些遺失的記憶片段...'
            },
            {
                image: 'assets/images/intro/Mira looks.png',
                text: '而我，米拉，則負責引導你進入自己的記憶深處...'
            }
        ];
        
        this.loadedImages = 0;
        this.audio = null;
        this.preloadImages();
    }

    preloadImages() {
        const totalImages = this.slides.length;
        console.log(`開始預加載 ${totalImages} 張圖片`);
        
        // 創建一個暫時容器來顯示加載信息
        const loadingContainer = document.createElement('div');
        loadingContainer.id = 'loading-container';
        loadingContainer.style.position = 'fixed';
        loadingContainer.style.top = '0';
        loadingContainer.style.left = '0';
        loadingContainer.style.width = '100vw';
        loadingContainer.style.height = '100vh';
        loadingContainer.style.backgroundColor = 'black';
        loadingContainer.style.color = 'white';
        loadingContainer.style.display = 'flex';
        loadingContainer.style.justifyContent = 'center';
        loadingContainer.style.alignItems = 'center';
        loadingContainer.style.zIndex = '2000';
        loadingContainer.textContent = '正在載入開場動畫...';
        document.body.appendChild(loadingContainer);

        // 預加載音樂
        this.preloadAudio('assets/music/echoes music.mp3');

        // 預加載所有圖片
        this.slides.forEach((slide, index) => {
            const img = new Image();
            
            img.onload = () => {
                this.loadedImages++;
                console.log(`圖片 ${index + 1}/${totalImages} 已加載: ${slide.image}`);
                loadingContainer.textContent = `正在載入開場動畫... ${this.loadedImages}/${totalImages}`;
                
                // 所有圖片加載完成後開始動畫
                if (this.loadedImages === totalImages) {
                    console.log('所有圖片加載完成，開始動畫');
                    loadingContainer.remove();
                    this.initIntro();
                    this.playAudio(); // 直接播放音樂，因為用戶已經通過點擊歡迎界面的按鈕授權了
                    this.showSlide(0); // 直接開始顯示幻燈片
                }
            };
            
            img.onerror = (err) => {
                console.error(`圖片加載失敗 ${slide.image}:`, err);
                this.loadedImages++;
                loadingContainer.textContent = `正在載入開場動畫... ${this.loadedImages}/${totalImages} (錯誤)`;
                
                // 即使有錯誤也繼續嘗試啟動動畫
                if (this.loadedImages === totalImages) {
                    console.log('圖片加載完成但有錯誤，嘗試開始動畫');
                    loadingContainer.remove();
                    this.initIntro();
                    this.playAudio();
                    this.showSlide(0);
                }
            };
            
            // 開始加載圖片
            img.src = slide.image;
        });
    }
    
    preloadAudio(audioPath) {
        this.audio = new Audio(audioPath);
        this.audio.preload = 'auto';
        this.audio.loop = true;
        this.audio.volume = 0;  // 初始音量為0，然後淡入
        
        // 加載音樂文件
        this.audio.load();
        console.log('開始加載背景音樂');
        
        this.audio.addEventListener('canplaythrough', () => {
            console.log('背景音樂加載完成');
        });
        
        this.audio.addEventListener('error', (e) => {
            console.error('背景音樂加載失敗:', e);
        });
    }
    
    playAudio() {
        if (this.audio) {
            // 嘗試播放，並處理可能的錯誤
            try {
                // 淡入音樂效果
                const playPromise = this.audio.play();
                
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        console.log('背景音樂開始播放');
                        
                        // 淡入音樂
                        let currentVolume = 0;
                        const targetVolume = 0.6;
                        const fadeInterval = setInterval(() => {
                            currentVolume += 0.05;
                            if (currentVolume >= targetVolume) {
                                this.audio.volume = targetVolume;
                                clearInterval(fadeInterval);
                            } else {
                                this.audio.volume = currentVolume;
                            }
                        }, 100);
                        
                    }).catch(err => {
                        console.error('背景音樂播放失敗:', err);
                    });
                }
            } catch (e) {
                console.error('音樂播放出現異常:', e);
            }
        }
    }
    
    stopAudio() {
        if (this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0;
        }
    }
    
    initIntro() {
        // 創建開場動畫容器
        const introContainer = document.createElement('div');
        introContainer.id = 'intro-container';
        document.body.appendChild(introContainer);
        
        // 添加跳過按鈕
        const skipButton = document.createElement('button');
        skipButton.id = 'skip-intro';
        skipButton.textContent = '跳過';
        skipButton.addEventListener('click', () => this.skipIntro());
        introContainer.appendChild(skipButton);
        
        // 創建所有幻燈片
        this.slides.forEach((slide, index) => {
            const slideDiv = document.createElement('div');
            slideDiv.className = 'intro-slide';
            // 使用內嵌樣式直接設置背景，確保圖片路徑正確
            slideDiv.style.backgroundImage = `url("${slide.image}")`;
            
            const textDiv = document.createElement('div');
            textDiv.className = 'intro-text';
            textDiv.textContent = slide.text;
            
            slideDiv.appendChild(textDiv);
            introContainer.appendChild(slideDiv);
        });
        
        // 添加 intro-playing 類到 body
        document.body.classList.add('intro-playing');
    }
    
    showSlide(index) {
        // 移除所有活動幻燈片的 active 類
        const slides = document.querySelectorAll('.intro-slide');
        slides.forEach(slide => slide.classList.remove('active'));
        
        // 設置當前幻燈片為 active
        if (slides[index]) {
            slides[index].classList.add('active');
            console.log(`顯示幻燈片 ${index + 1}/${this.slides.length}`);
            
            // 設置下一幻燈片的計時器
            this.currentSlide = index;
            if (index < this.slides.length - 1) {
                this.timer = setTimeout(() => this.showSlide(index + 1), 5000);
            } else {
                // 最後一張幻燈片後結束序列
                setTimeout(() => this.endIntro(), 5000);
            }
        }
    }
    
    skipIntro() {
        // 清除任何活動的計時器
        if (this.timer) {
            clearTimeout(this.timer);
        }
        
        // 創建過渡效果元素
        const transitionOverlay = document.createElement('div');
        transitionOverlay.style.position = 'fixed';
        transitionOverlay.style.top = '0';
        transitionOverlay.style.left = '0';
        transitionOverlay.style.width = '100vw';
        transitionOverlay.style.height = '100vh';
        transitionOverlay.style.backgroundColor = 'black';
        transitionOverlay.style.zIndex = '1500';
        transitionOverlay.style.opacity = '0';
        transitionOverlay.style.transition = 'opacity 2s ease';
        document.body.appendChild(transitionOverlay);
        
        // 淡入黑色覆蓋層
        setTimeout(() => {
            transitionOverlay.style.opacity = '1';
            
            // 淡出音樂
            if (this.audio) {
                const fadeInterval = setInterval(() => {
                    if (this.audio.volume > 0.05) {
                        this.audio.volume -= 0.05;
                    } else {
                        clearInterval(fadeInterval);
                        this.stopAudio();
                    }
                }, 100);
            }
            
            // 完全淡入後
            setTimeout(() => {
                // 移除開場動畫容器
                const introContainer = document.getElementById('intro-container');
                if (introContainer) {
                    introContainer.remove();
                    document.body.classList.remove('intro-playing');
                }
                
                // 顯示遊戲容器
                this.startGame();
                
                // 延遲後淡出覆蓋層
                setTimeout(() => {
                    transitionOverlay.style.opacity = '0';
                    
                    // 完全淡出後移除覆蓋層
                    setTimeout(() => {
                        transitionOverlay.remove();
                    }, 2000);
                }, 500);
            }, 2000);
        }, 100);
    }
    
    endIntro() {
        // 創建過渡效果元素
        const transitionOverlay = document.createElement('div');
        transitionOverlay.style.position = 'fixed';
        transitionOverlay.style.top = '0';
        transitionOverlay.style.left = '0';
        transitionOverlay.style.width = '100vw';
        transitionOverlay.style.height = '100vh';
        transitionOverlay.style.backgroundColor = 'black';
        transitionOverlay.style.zIndex = '1500';
        transitionOverlay.style.opacity = '0';
        transitionOverlay.style.transition = 'opacity 2s ease';
        document.body.appendChild(transitionOverlay);
        
        // 淡入黑色覆蓋層
        setTimeout(() => {
            transitionOverlay.style.opacity = '1';
            
            // 淡出音樂
            if (this.audio) {
                const fadeInterval = setInterval(() => {
                    if (this.audio.volume > 0.05) {
                        this.audio.volume -= 0.05;
                    } else {
                        clearInterval(fadeInterval);
                        this.stopAudio();
                    }
                }, 100);
            }
            
            // 完全淡入後
            setTimeout(() => {
                // 移除開場動畫容器
                const introContainer = document.getElementById('intro-container');
                if (introContainer) {
                    introContainer.remove();
                    document.body.classList.remove('intro-playing');
                }
                
                // 顯示遊戲容器
                this.startGame();
                
                // 延遲後淡出覆蓋層
                setTimeout(() => {
                    transitionOverlay.style.opacity = '0';
                    
                    // 完全淡出後移除覆蓋層
                    setTimeout(() => {
                        transitionOverlay.remove();
                    }, 2000);
                }, 500);
            }, 2000);
        }, 100);
    }
    
    startGame() {
        // 確保遊戲容器可見
        const gameContainer = document.getElementById('game-container');
        if (gameContainer) {
            gameContainer.style.display = 'block';
        }
        
        // 播放主遊戲背景音樂
        this.playBackgroundMusic();
        
        console.log('開場動畫結束，遊戲開始');
        // 這裡可以添加開始遊戲的代碼
    }
    
    playBackgroundMusic() {
        // 創建新的音樂播放器
        const bgMusic = new Audio('assets/music/background.mp3');
        bgMusic.loop = true; // 設置循環播放
        bgMusic.volume = 0; // 初始音量為0，然後淡入
        
        // 設置 ID 以便後續控制
        bgMusic.id = 'bgm-player';
        
        // 將音樂元素添加到 DOM 中，以便全局訪問
        document.body.appendChild(bgMusic);
        
        // 加載並播放
        try {
            const playPromise = bgMusic.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log('主遊戲背景音樂開始播放');
                    
                    // 淡入音樂效果
                    let currentVolume = 0;
                    const targetVolume = 0.4; // 背景音樂音量稍低一些
                    const fadeInterval = setInterval(() => {
                        currentVolume += 0.02; // 更緩慢的淡入
                        if (currentVolume >= targetVolume) {
                            bgMusic.volume = targetVolume;
                            clearInterval(fadeInterval);
                        } else {
                            bgMusic.volume = currentVolume;
                        }
                    }, 100);
                    
                }).catch(err => {
                    console.error('主遊戲背景音樂播放失敗:', err);
                });
            }
        } catch (e) {
            console.error('主遊戲背景音樂播放錯誤:', e);
        }
    }
}

// 移除舊的頁面載入代碼，現在由 neural-background.js 控制流程 