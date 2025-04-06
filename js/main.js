class Game {
    constructor() {
        this.currentScene = null;
        this.sceneContainer = document.getElementById('scene-container');
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
            // TODO: 從 JSON 檔案載入場景數據
            const sceneData = await this.fetchSceneData(sceneId);
            this.currentScene = sceneData;
            this.renderScene();
        } catch (error) {
            console.error('Error loading scene:', error);
        }
    }

    async fetchSceneData(sceneId) {
        // TODO: 實現場景數據載入
        // 這裡先返回測試數據
        return {
            id: 'S001',
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

        // 設置背景
        if (this.sceneContainer) {
            this.sceneContainer.style.backgroundImage = `url(${this.currentScene.background})`;
        }

        // 顯示對話
        dialogSystem.showDialog(this.currentScene.dialog);

        // 顯示選項
        dialogSystem.showChoices(this.currentScene.choices);
    }
}

// 當文檔載入完成後初始化遊戲
document.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
}); 