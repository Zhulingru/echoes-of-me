class DialogSystem {
    constructor() {
        this.dialogBox = document.getElementById('dialog-box');
        this.choicesContainer = document.getElementById('choices-container');
        this.typingSpeed = 30; // 打字速度（毫秒/字符）
        this.currentTypingInterval = null;
    }

    // 顯示對話
    showDialog(text, speaker = null) {
        if (!this.dialogBox) return;

        // 存儲完整文本用於立即完成時使用
        this.fullText = text;
        
        // 清空對話框
        this.dialogBox.innerHTML = '';
        
        // 添加科幻風格裝飾
        const corners = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
        corners.forEach(position => {
            const corner = document.createElement('div');
            corner.className = `cyber-corner ${position}`;
            this.dialogBox.appendChild(corner);
        });
        
        if (speaker) {
            const speakerDiv = document.createElement('div');
            speakerDiv.className = 'speaker';
            speakerDiv.textContent = speaker;
            this.dialogBox.appendChild(speakerDiv);
        }

        const textDiv = document.createElement('div');
        textDiv.className = 'dialog-text';
        textDiv.textContent = '';
        this.dialogBox.appendChild(textDiv);

        // 清除之前的打字效果
        if (this.currentTypingInterval) {
            clearInterval(this.currentTypingInterval);
        }

        // 逐字顯示文本
        let index = 0;
        this.currentTypingInterval = setInterval(() => {
            if (index < text.length) {
                textDiv.textContent += text.charAt(index);
                index++;
            } else {
                clearInterval(this.currentTypingInterval);
                this.currentTypingInterval = null;
                // 完成打字效果後顯示選項
                if (this.pendingChoices) {
                    this.showChoices(this.pendingChoices);
                    this.pendingChoices = null;
                }
            }
        }, this.typingSpeed);
    }

    // 顯示選項
    showChoices(choices) {
        if (!this.choicesContainer) return;
        
        // 如果正在打字中，先存儲選項
        if (this.currentTypingInterval) {
            this.pendingChoices = choices;
            return;
        }

        // 清空選項容器
        this.choicesContainer.innerHTML = '';

        choices.forEach(choice => {
            const button = document.createElement('button');
            button.className = 'choice-button';
            button.textContent = choice.text;
            
            // 添加數據屬性
            if (choice.requiresInteraction) {
                button.dataset.requiresInteraction = 'true';
            }
            
            button.onclick = () => this.handleChoice(choice);
            this.choicesContainer.appendChild(button);
        });
    }

    // 處理選項選擇
    handleChoice(choice) {
        // 更新變數
        if (choice.effects) {
            Object.entries(choice.effects).forEach(([variable, value]) => {
                gameVars.updateVariable(variable, value);
            });
        }

        // 觸發下一個對話或場景
        if (choice.next) {
            if (choice.next.startsWith('S')) {
                // 場景轉換
                window.game.loadScene(choice.next);
            } else if (choice.next.startsWith('M')) {
                // 記憶片段觸發
                window.game.triggerMemory(choice.next);
            }
        }
    }

    // 清空對話框和選項
    clear() {
        if (this.dialogBox) this.dialogBox.innerHTML = '';
        if (this.choicesContainer) this.choicesContainer.innerHTML = '';
        
        if (this.currentTypingInterval) {
            clearInterval(this.currentTypingInterval);
            this.currentTypingInterval = null;
        }
    }
    
    // 立即完成打字
    completeTyping() {
        if (this.currentTypingInterval) {
            clearInterval(this.currentTypingInterval);
            this.currentTypingInterval = null;
            
            const textDiv = this.dialogBox.querySelector('.dialog-text');
            if (textDiv && this.fullText) {
                textDiv.textContent = this.fullText;
            }
            
            // 完成打字效果後顯示選項
            if (this.pendingChoices) {
                this.showChoices(this.pendingChoices);
                this.pendingChoices = null;
            }
        }
    }
}

// 創建全局對話系統實例
const dialogSystem = new DialogSystem();

// 點擊對話框立即完成打字
document.addEventListener('DOMContentLoaded', () => {
    const dialogBox = document.getElementById('dialog-box');
    if (dialogBox) {
        dialogBox.addEventListener('click', () => {
            dialogSystem.completeTyping();
        });
    }
}); 