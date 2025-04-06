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
            }
            // 待添加更多幻燈片
        ];
        
        this.initIntro();
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
            
            // 預加載圖片以確保正確顯示
            const img = new Image();
            img.onload = () => {
                slideDiv.style.backgroundImage = `url(${slide.image})`;
                console.log(`Loaded image: ${slide.image}`);
            };
            img.onerror = () => {
                console.error(`Failed to load image: ${slide.image}`);
                // 使用純色背景作為備用
                slideDiv.style.backgroundColor = '#000';
            };
            img.src = slide.image;
            
            const textDiv = document.createElement('div');
            textDiv.className = 'intro-text';
            textDiv.textContent = slide.text;
            
            slideDiv.appendChild(textDiv);
            introContainer.appendChild(slideDiv);
        });
        
        // 添加 intro-playing 類到 body
        document.body.classList.add('intro-playing');
        
        // 開始播放幻燈片
        setTimeout(() => this.showSlide(0), 500);
    }
    
    showSlide(index) {
        // 移除所有活動幻燈片的 active 類
        const slides = document.querySelectorAll('.intro-slide');
        slides.forEach(slide => slide.classList.remove('active'));
        
        // 設置當前幻燈片為 active
        if (slides[index]) {
            slides[index].classList.add('active');
            
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
        
        this.endIntro();
    }
    
    endIntro() {
        const introContainer = document.getElementById('intro-container');
        if (introContainer) {
            introContainer.classList.add('fade-out');
            
            // 動畫結束後移除元素
            setTimeout(() => {
                introContainer.remove();
                document.body.classList.remove('intro-playing');
                
                // 觸發遊戲初始化
                this.startGame();
            }, 1500);
        }
    }
    
    startGame() {
        // 確保遊戲容器可見
        const gameContainer = document.getElementById('game-container');
        if (gameContainer) {
            gameContainer.style.display = 'block';
        }
        
        console.log('開場動畫結束，遊戲開始');
        // 這裡可以添加開始遊戲的代碼
    }
}

// 頁面加載後啟動開場動畫
document.addEventListener('DOMContentLoaded', () => {
    // 檢查是否已經看過開場動畫（可以使用本地存儲）
    const introShown = localStorage.getItem('introShown');
    
    if (!introShown) {
        new IntroSequence();
        // localStorage.setItem('introShown', 'true'); // 取消註釋以便只顯示一次
    }
}); 