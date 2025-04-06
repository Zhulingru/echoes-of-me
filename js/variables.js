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

        this.labels = {
            anger: "憤怒",
            stable: "穩定",
            block: "封閉"
        };
    }

    // 更新變數值
    updateVariable(name, value) {
        if (name in this.variables) {
            const oldValue = this.variables[name];
            const newValue = Math.max(0, Math.min(oldValue + value, this.limits[name]));
            this.variables[name] = newValue;
            
            // 觸發視覺效果
            this.triggerUpdateEffect(name, oldValue, newValue);
            
            this.checkTriggers();
            this.updateUI();
        }
    }

    // 觸發更新效果
    triggerUpdateEffect(name, oldValue, newValue) {
        const statusBar = document.querySelector(`#${name}-bar .status-bar-fill`);
        if (statusBar) {
            // 添加閃爍效果
            statusBar.classList.add('update-flash');
            setTimeout(() => statusBar.classList.remove('update-flash'), 500);

            // 如果是顯著變化，添加特殊效果
            if (Math.abs(newValue - oldValue) >= 2) {
                const container = document.querySelector(`#${name}-container`);
                if (container) {
                    container.classList.add('significant-change');
                    setTimeout(() => container.classList.remove('significant-change'), 1000);
                }
            }
        }
    }

    // 更新UI顯示
    updateUI() {
        const statusBar = document.getElementById('status-bar');
        if (statusBar) {
            statusBar.innerHTML = Object.entries(this.variables)
                .map(([name, value]) => `
                    <div class="status-item" id="${name}-container">
                        <div class="status-label">${this.labels[name]}</div>
                        <div class="status-bar" id="${name}-bar">
                            <div class="status-bar-fill" style="width: ${(value / this.limits[name]) * 100}%"></div>
                        </div>
                        <div class="status-value">${value}</div>
                    </div>
                `).join('');

            // 添加裝飾元素
            const corners = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
            corners.forEach(position => {
                const corner = document.createElement('div');
                corner.className = `cyber-corner ${position}`;
                statusBar.appendChild(corner);
            });
        }
    }

    // 檢查觸發條件
    checkTriggers() {
        // 檢查憤怒值
        if (this.variables.anger >= 3) {
            this.triggerMemory('M001');
        }

        // 檢查穩定度
        if (this.variables.stable < 0) {
            this.triggerChaos();
        }

        // 檢查封閉值
        if (this.variables.block >= 2) {
            this.blockInteractions();
        }

        // 檢查複合條件
        if (this.variables.anger >= 4 && this.variables.block >= 2) {
            this.triggerMemory('M003');
        }
    }

    // 觸發記憶片段
    triggerMemory(memoryId) {
        console.log(`Triggering memory: ${memoryId}`);
        // 添加視覺效果
        document.body.classList.add('memory-trigger');
        setTimeout(() => document.body.classList.remove('memory-trigger'), 1000);
    }

    // 觸發混亂狀態
    triggerChaos() {
        console.log('Chaos mode activated');
        document.body.classList.add('chaos-mode');
        setTimeout(() => document.body.classList.remove('chaos-mode'), 1000);
    }

    // 封鎖互動
    blockInteractions() {
        console.log('Interactions blocked');
        const buttons = document.querySelectorAll('.choice-button');
        buttons.forEach(button => {
            if (button.dataset.requiresInteraction === 'true') {
                button.disabled = true;
                button.classList.add('blocked');
            }
        });
    }
}

// 創建全局遊戲變數實例
const gameVars = new GameVariables();

// 初始化UI
document.addEventListener('DOMContentLoaded', () => {
    gameVars.updateUI();
}); 