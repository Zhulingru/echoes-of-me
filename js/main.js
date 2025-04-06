class Game {
    constructor() {
        console.log('Game constructor initialized');
        this.currentScene = null;
        this.sceneContainer = document.getElementById('scene-container');
        if (!this.sceneContainer) {
            console.error('Scene container not found!');
        }
        
        this.loadedScenes = {};
        this.loadedMemories = {};
        
        // 確保 DOM 完全加載後再初始化
        if (document.readyState === 'loading') {
            console.log('Document still loading, waiting for DOMContentLoaded');
            document.addEventListener('DOMContentLoaded', () => {
                console.log('DOMContentLoaded fired, initializing game');
                this.init();
            });
        } else {
            console.log('Document already loaded, initializing immediately');
            this.init();
        }
    }

    async init() {
        console.log('Game initializing...');
        try {
            // 檢查 DOM 元素
            this.checkDomElements();
            
            // 初始化變數顯示
            console.log('Updating UI with initial variables');
            gameVars.updateUI();
            
            // 綁定按鈕事件
            console.log('Binding buttons');
            this.bindButtons();
            
            // 載入初始場景
            console.log('Loading initial scene: S001');
            await this.loadScene('S001');
            
            console.log('Game initialization complete');
        } catch (error) {
            console.error('Error during initialization:', error);
        }
    }
    
    checkDomElements() {
        const dialogBox = document.getElementById('dialog-box');
        const choicesContainer = document.getElementById('choices-container');
        const statusBar = document.getElementById('status-bar');
        
        if (!dialogBox) console.error('Dialog box not found!');
        if (!choicesContainer) console.error('Choices container not found!');
        if (!statusBar) console.error('Status bar not found!');
        
        console.log('DOM elements check complete');
    }
    
    bindButtons() {
        // 綁定探索、戰鬥、記憶按鈕
        const exploreBtn = document.getElementById('explore-btn');
        const battleBtn = document.getElementById('battle-btn');
        const memoryBtn = document.getElementById('memory-btn');
        
        if (exploreBtn) {
            exploreBtn.addEventListener('click', () => this.switchMode('explore'));
        }
        
        if (battleBtn) {
            battleBtn.addEventListener('click', () => this.switchMode('battle'));
        }
        
        if (memoryBtn) {
            memoryBtn.addEventListener('click', () => this.openMemoryList());
        }
    }
    
    switchMode(mode) {
        if (!mode) {
            console.error('No mode specified');
            return;
        }

        console.log(`Switching to ${mode} mode`);
        
        if (mode === 'explore') {
            console.log('進入探索模式');
            if (window.explorationSystem) {
                window.explorationSystem.showExplorationMenu();
            } else {
                console.error('Exploration system not initialized');
            }
            
            // 播放探索模式音樂
            if (window.audioSystem) {
                window.audioSystem.playExplorationMusic();
            }
        } else if (mode === 'battle') {
            console.log('進入戰鬥模式 - 尚未實現');
            // TODO: 實現戰鬥系統
        } else {
            console.warn('Unknown game mode:', mode);
        }
    }
    
    openMemoryList() {
        console.log('Opening memory list');
        // TODO: 實現記憶列表顯示
    }

    async loadScene(sceneId) {
        if (!sceneId) {
            console.error('No scene ID provided');
            return;
        }

        try {
            // 檢查是否已經載入過
            let sceneData;
            if (this.loadedScenes[sceneId]) {
                sceneData = this.loadedScenes[sceneId];
            } else {
                // 從 JSON 檔案載入場景數據
                sceneData = await this.fetchSceneData(sceneId);
                if (!sceneData) {
                    console.error('Failed to load scene data for:', sceneId);
                    return;
                }
                this.loadedScenes[sceneId] = sceneData;
            }
            
            this.currentScene = sceneData;
            this.renderScene();
            
            // 播放場景音樂
            if (sceneData.music && window.audioSystem) {
                window.audioSystem.playSceneMusic(sceneData.music);
            }
        } catch (error) {
            console.error('Error loading scene:', error);
        }
    }

    async fetchSceneData(sceneId) {
        // 首先檢查是否有預定義的場景數據
        if (window.gameScenes && window.gameScenes[sceneId]) {
            console.log(`Loading scene ${sceneId} from predefined data`);
            return window.gameScenes[sceneId];
        }

        // 如果沒有預定義數據，嘗試從 JSON 檔案載入
        try {
            console.log(`Attempting to load scene ${sceneId} from JSON file`);
            const response = await fetch(`data/scenes/${sceneId}.json`);
            if (response.ok) {
                return await response.json();
            }
        } catch (e) {
            console.warn(`Failed to load scene from JSON: ${e}`);
        }
        
        // 如果都沒有找到，返回預設場景
        console.warn(`No scene data found for ${sceneId}, using default scene`);
        return {
            id: sceneId,
            name: '未知場景',
            background: './assets/images/scene/placeholder.png',
            speaker: null,
            dialog: '場景數據未找到。',
            choices: []
        };
    }

    renderScene() {
        if (!this.currentScene) {
            console.error('No current scene to render');
            return;
        }

        if (!this.sceneContainer) {
            console.error('Scene container not found');
            return;
        }

        // 檢查必要的場景數據
        if (!this.currentScene.background) {
            console.error('Scene background not specified');
            return;
        }

        console.log('Rendering scene:', this.currentScene.id);
        console.log('Background path:', this.currentScene.background);

        // 清除現有內容
        if (window.dialogSystem) {
            window.dialogSystem.clear();
        }

        // 設置初始狀態
        this.sceneContainer.style.opacity = '0';
        
        // 預加載背景圖片
        const bgImage = new Image();
        
        bgImage.onload = () => {
            console.log('Background image loaded successfully:', this.currentScene.background);
            console.log('Image dimensions:', bgImage.width, 'x', bgImage.height);
            
            // 移除開頭的點號，確保路徑正確
            const backgroundPath = this.currentScene.background.replace(/^\.\//, '');
            
            requestAnimationFrame(() => {
                // 設置背景
                this.sceneContainer.style.backgroundImage = `url("${backgroundPath}")`;
                this.sceneContainer.style.backgroundColor = 'var(--primary-color)';
                console.log('Applied background image style:', this.sceneContainer.style.backgroundImage);
                // 使用 requestAnimationFrame 確保背景設置後再顯示
                requestAnimationFrame(() => {
                    this.sceneContainer.style.opacity = '1';
                });
            });
        };
        
        bgImage.onerror = (error) => {
            console.error('Failed to load background image:', this.currentScene.background);
            console.error('Error details:', error);
            // 嘗試直接獲取圖片以查看具體錯誤
            const backgroundPath = this.currentScene.background.replace(/^\.\//, '');
            fetch(backgroundPath)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    console.log('Image fetch successful');
                })
                .catch(e => {
                    console.error('Image fetch failed:', e);
                });
            // 設置備用背景顏色
            this.sceneContainer.style.backgroundImage = 'none';
            this.sceneContainer.style.backgroundColor = 'var(--primary-color)';
            this.sceneContainer.style.opacity = '1';
        };
        
        // 開始加載圖片
        console.log('Starting to load background image:', this.currentScene.background);
        // 移除開頭的點號，確保路徑正確
        const backgroundPath = this.currentScene.background.replace(/^\.\//, '');
        bgImage.src = backgroundPath;

        // 確保UI容器可以接收事件
        const uiContainer = document.getElementById('ui-container');
        if (uiContainer) {
            uiContainer.style.pointerEvents = 'auto';
        }

        // 檢查對話系統
        if (!window.dialogSystem) {
            console.error('Dialog system not initialized');
            return;
        }

        // 顯示對話
        window.dialogSystem.showDialog(this.currentScene.dialog, this.currentScene.speaker);

        // 顯示選項
        if (this.currentScene.choices && Array.isArray(this.currentScene.choices)) {
            window.dialogSystem.showChoices(this.currentScene.choices);
        } else {
            console.warn('No valid choices in current scene');
        }

        // 更新變數顯示
        if (window.gameVars) {
            window.gameVars.updateUI();
        }
    }
    
    async triggerMemory(memoryId) {
        try {
            // 顯示記憶加載效果
            document.body.classList.add('memory-loading');
            
            // 獲取記憶數據
            let memoryData;
            if (this.loadedMemories[memoryId]) {
                memoryData = this.loadedMemories[memoryId];
            } else {
                memoryData = await this.fetchMemoryData(memoryId);
                this.loadedMemories[memoryId] = memoryData;
            }
            
            // 顯示記憶內容
            this.showMemory(memoryData);
        } catch (error) {
            console.error('Error triggering memory:', error);
        } finally {
            // 移除加載效果
            setTimeout(() => {
                document.body.classList.remove('memory-loading');
            }, 1000);
        }
    }
    
    async fetchMemoryData(memoryId) {
        // 嘗試從 JSON 檔案載入記憶數據
        try {
            const response = await fetch(`data/memories/${memoryId}.json`);
            if (response.ok) {
                return await response.json();
            }
        } catch (e) {
            console.warn(`Failed to load memory from JSON: ${e}`);
        }
        
        // 如果 JSON 未找到，使用預設數據
        switch(memoryId) {
            case 'M001':
                return {
                    id: 'M001',
                    name: '墜落瞬間',
                    background: 'assets/images/falling.jpg',
                    content: '你感覺自己正在墜落...\n\n周圍的空氣刺痛著你的皮膚，耳邊是嘈雜的數據流聲。\n\n「模擬程序崩潰中，請勿斷開連接」，一個機械的聲音迴盪在你的意識中。',
                    next: 'S002'
                };
            case 'M034-A':
                return {
                    id: 'M034-A',
                    name: '鏡前之女（初遇）',
                    background: 'assets/images/mirror-girl.jpg',
                    content: '鏡中的女子微微歪頭，似乎對你的問題感到好奇。\n\n「我是你嗎？有趣的問題。」她輕聲回應，聲音在走廊中輕輕迴盪。\n\n「也許我們曾是同一個人，但現在...誰知道呢？」',
                    next: 'S002'
                };
            default:
                return {
                    id: memoryId,
                    name: '未知記憶',
                    background: 'assets/images/placeholder.jpg',
                    content: '無法檢索到該記憶片段。',
                    next: null
                };
        }
    }
    
    showMemory(memoryData) {
        // 先清空當前內容
        dialogSystem.clear();
        
        // 設置背景
        if (this.sceneContainer) {
            // 先添加過渡效果
            this.sceneContainer.style.opacity = '0';
            
            setTimeout(() => {
                // 設置背景圖
                this.sceneContainer.style.backgroundImage = `url(${memoryData.background})`;
                // 淡入效果
                this.sceneContainer.style.opacity = '1';
                
                // 顯示記憶內容
                dialogSystem.showDialog(memoryData.content, memoryData.name);
                
                // 添加繼續按鈕
                if (memoryData.next) {
                    dialogSystem.showChoices([{
                        text: '繼續',
                        next: memoryData.next
                    }]);
                }
            }, 300);
        }
    }
}

// 創建全局遊戲實例
console.log('Creating global game instance');
window.game = new Game();

// 背景音樂控制
function setupMusicControl() {
    // 創建音樂控制按鈕
    const musicBtn = document.createElement('button');
    musicBtn.id = 'music-control-btn';
    musicBtn.innerHTML = '🔊'; // 初始為有聲圖標
    musicBtn.style.position = 'fixed';
    musicBtn.style.bottom = '10px';
    musicBtn.style.left = '10px';
    musicBtn.style.zIndex = '1000';
    musicBtn.style.background = 'rgba(0, 0, 0, 0.5)';
    musicBtn.style.color = 'white';
    musicBtn.style.border = '1px solid #666';
    musicBtn.style.borderRadius = '50%';
    musicBtn.style.width = '40px';
    musicBtn.style.height = '40px';
    musicBtn.style.fontSize = '20px';
    musicBtn.style.cursor = 'pointer';
    musicBtn.style.display = 'flex';
    musicBtn.style.alignItems = 'center';
    musicBtn.style.justifyContent = 'center';
    
    // 設置音樂開關狀態
    let musicOn = true;
    
    // 添加點擊事件
    musicBtn.addEventListener('click', function() {
        const bgmPlayer = document.getElementById('bgm-player');
        
        if (musicOn) {
            // 靜音
            if (bgmPlayer) {
                // 保存當前音量以便恢復
                bgmPlayer.dataset.lastVolume = bgmPlayer.volume;
                bgmPlayer.volume = 0;
            }
            musicBtn.innerHTML = '🔇';
            musicOn = false;
        } else {
            // 取消靜音
            if (bgmPlayer) {
                // 恢復之前的音量或設為默認值
                const lastVolume = bgmPlayer.dataset.lastVolume || 0.4;
                bgmPlayer.volume = parseFloat(lastVolume);
            }
            musicBtn.innerHTML = '🔊';
            musicOn = true;
        }
    });
    
    document.body.appendChild(musicBtn);
}

// 當文檔加載完成後設置音樂控制
document.addEventListener('DOMContentLoaded', function() {
    setupMusicControl();
}); 