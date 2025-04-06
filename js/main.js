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
            
            // 載入初始場景
            console.log('Loading initial scene: S001');
            await this.loadScene('S001');
            
            // 初始化變數顯示
            console.log('Updating UI with initial variables');
            gameVars.updateUI();
            
            // 綁定按鈕事件
            console.log('Binding buttons');
            this.bindButtons();
            
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
        console.log(`Switching to ${mode} mode`);
        // TODO: 實現模式切換邏輯
    }
    
    openMemoryList() {
        console.log('Opening memory list');
        // TODO: 實現記憶列表顯示
    }

    async loadScene(sceneId) {
        try {
            // 檢查是否已經載入過
            let sceneData;
            if (this.loadedScenes[sceneId]) {
                sceneData = this.loadedScenes[sceneId];
            } else {
                // 從 JSON 檔案載入場景數據
                sceneData = await this.fetchSceneData(sceneId);
                this.loadedScenes[sceneId] = sceneData;
            }
            
            this.currentScene = sceneData;
            this.renderScene();
        } catch (error) {
            console.error('Error loading scene:', error);
        }
    }

    async fetchSceneData(sceneId) {
        // 嘗試從 JSON 檔案載入場景數據
        try {
            const response = await fetch(`data/scenes/${sceneId}.json`);
            if (response.ok) {
                return await response.json();
            }
        } catch (e) {
            console.warn(`Failed to load scene from JSON: ${e}`);
        }
        
        // 如果 JSON 未找到，使用預設數據
        // 這裡先返回測試數據
        switch(sceneId) {
            case 'S001':
                return {
                    id: 'S001',
                    name: '記憶引渡站',
                    background: 'assets/images/memory-station.jpg',
                    speaker: 'System',
                    dialog: '系統啟動中...\n\n記憶序列檢測完成。\n\n是否開始回溯？',
                    choices: [
                        {
                            id: 'CH001',
                            text: '點擊是',
                            effects: { anger: 1 },
                            next: 'M001'
                        },
                        {
                            id: 'CH002',
                            text: '點擊否',
                            effects: { stable: 2 },
                            next: null
                        },
                        {
                            id: 'CH003',
                            text: '觸碰螢幕',
                            effects: { stable: -1 },
                            requiresInteraction: true,
                            next: 'S002'
                        }
                    ]
                };
            case 'S002':
                return {
                    id: 'S002',
                    name: '鏡前走廊',
                    background: 'assets/images/mirror-corridor.jpg',
                    speaker: null,
                    dialog: '一條昏暗的金屬走廊延伸至遠方，牆上的霓虹燈閃爍著微弱的藍光。\n\n走廊盡頭有一面半透明的鏡子，你看到一個模糊的身影。',
                    choices: [
                        {
                            id: 'CH004-A',
                            text: '你輕聲說：「妳是我嗎？」',
                            effects: { anger: 1 },
                            next: 'M034-A'
                        },
                        {
                            id: 'CH004-B',
                            text: '「那不是窗外的我嗎……」你低聲喃喃。',
                            effects: { anger: 1, stable: 1 },
                            next: 'M035'
                        },
                        {
                            id: 'CH005',
                            text: '嘲諷她：「你是我拋出來的幻想嗎？」',
                            effects: { anger: 1, stable: -1 },
                            next: 'M034-B'
                        }
                    ]
                };
            default:
                return {
                    id: sceneId,
                    name: '未知場景',
                    background: 'assets/images/placeholder.jpg',
                    speaker: null,
                    dialog: '場景數據未找到。',
                    choices: []
                };
        }
    }

    renderScene() {
        if (!this.currentScene) return;

        // 設置背景
        if (this.sceneContainer) {
            // 先添加過渡效果
            this.sceneContainer.style.opacity = '0';
            
            setTimeout(() => {
                // 設置背景圖
                this.sceneContainer.style.backgroundImage = `url(${this.currentScene.background})`;
                // 淡入效果
                this.sceneContainer.style.opacity = '1';
            }, 300);
        }

        // 顯示對話
        dialogSystem.showDialog(this.currentScene.dialog, this.currentScene.speaker);

        // 顯示選項
        dialogSystem.showChoices(this.currentScene.choices);
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