class Game {
    constructor() {
        this.currentScene = null;
        this.sceneContainer = document.getElementById('scene-container');
        this.sceneTitle = document.getElementById('scene-title');
        this.init();
    }

    async init() {
        // 載入初始場景
        await this.loadScene('S001');
        // 初始化變數顯示
        gameVars.updateUI();
    }

    async loadScene(sceneId) {
        try {
            const sceneData = await this.fetchSceneData(sceneId);
            this.currentScene = sceneData;
            this.renderScene();
        } catch (error) {
            console.error('Error loading scene:', error);
        }
    }

    async fetchSceneData(sceneId) {
        // TODO: 從 JSON 檔案載入場景數據
        return {
            id: 'S001',
            title: '記憶引渡站',
            background: 'assets/images/memory-station.jpg',
            dialog: '系統啟動中...',
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
                    next: 'S002'
                }
            ]
        };
    }

    renderScene() {
        if (!this.currentScene) return;

        // 更新場景標題
        if (this.sceneTitle) {
            this.sceneTitle.textContent = this.currentScene.title;
        }

        // 設置背景
        if (this.sceneContainer) {
            this.sceneContainer.style.backgroundImage = `url(${this.currentScene.background})`;
        }

        // 顯示對話
        dialogSystem.showDialog(this.currentScene.dialog);

        // 顯示選項
        dialogSystem.showChoices(this.currentScene.choices);
    }

    // 主要功能按鈕
    explore() {
        console.log('探索模式');
        // TODO: 實現探索功能
    }

    battle() {
        console.log('戰鬥模式');
        // TODO: 實現戰鬥功能
    }

    memory() {
        console.log('記憶模式');
        // TODO: 實現記憶功能
    }
}

// 當文檔載入完成後初始化遊戲
document.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
}); 