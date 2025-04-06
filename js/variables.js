class GameVariables {
    constructor() {
        this.variables = {
            anger: 0,
            stable: 0,
            block: 0
        };
        
        this.limits = {
            anger: 10,
            stable: 10,
            block: 10
        };
    }

    // 更新變數值
    updateVariable(name, value) {
        if (name in this.variables) {
            const newValue = this.variables[name] + value;
            this.variables[name] = Math.max(0, Math.min(newValue, this.limits[name]));
            this.checkTriggers();
            this.updateUI();
        }
    }

    // 檢查觸發條件
    checkTriggers() {
        // 檢查憤怒值
        if (this.variables.anger >= 3) {
            // 觸發 M001 記憶
            this.triggerMemory('M001');
        }

        // 檢查穩定度
        if (this.variables.stable < 0) {
            // 觸發混亂選項
            this.triggerChaos();
        }

        // 檢查封閉值
        if (this.variables.block >= 2) {
            // 封鎖特定選項
            this.blockInteractions();
        }
    }

    // 更新UI顯示
    updateUI() {
        const statusBar = document.getElementById('status-bar');
        if (statusBar) {
            statusBar.innerHTML = `
                <div>憤怒: ${this.variables.anger}</div>
                <div>穩定: ${this.variables.stable}</div>
                <div>封閉: ${this.variables.block}</div>
            `;
        }
    }

    // 觸發記憶片段
    triggerMemory(memoryId) {
        // TODO: 實現記憶觸發邏輯
        console.log(`Triggering memory: ${memoryId}`);
    }

    // 觸發混亂狀態
    triggerChaos() {
        // TODO: 實現混亂狀態邏輯
        console.log('Chaos mode activated');
    }

    // 封鎖互動
    blockInteractions() {
        // TODO: 實現互動封鎖邏輯
        console.log('Interactions blocked');
    }
}

// 創建全局遊戲變數實例
const gameVars = new GameVariables(); 