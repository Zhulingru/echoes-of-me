class DialogSystem {
    constructor() {
        this.dialogBox = document.getElementById('dialog-box');
        this.choicesContainer = document.getElementById('choices-container');
        this.typingSpeed = 50; // 打字速度（毫秒/字符）
    }

    // 顯示對話
    async showDialog(text, speaker = null) {
        if (!this.dialogBox) return;

        // 清空對話框
        this.dialogBox.innerHTML = '';
        if (speaker) {
            const speakerDiv = document.createElement('div');
            speakerDiv.className = 'speaker';
            speakerDiv.textContent = speaker;
            this.dialogBox.appendChild(speakerDiv);
        }

        const textDiv = document.createElement('div');
        textDiv.className = 'dialog-text typing';
        this.dialogBox.appendChild(textDiv);

        // 逐字顯示文本
        for (let char of text) {
            textDiv.textContent += char;
            await new Promise(resolve => setTimeout(resolve, this.typingSpeed));
        }
    }

    // 顯示選項
    showChoices(choices) {
        if (!this.choicesContainer) return;

        // 清空選項容器
        this.choicesContainer.innerHTML = '';

        choices.forEach(choice => {
            const button = document.createElement('button');
            button.className = 'choice-button';
            button.textContent = choice.text;
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
            // TODO: 實現場景轉換邏輯
            console.log(`Moving to: ${choice.next}`);
        }
    }

    // 清空對話框和選項
    clear() {
        if (this.dialogBox) this.dialogBox.innerHTML = '';
        if (this.choicesContainer) this.choicesContainer.innerHTML = '';
    }
}

// 創建全局對話系統實例
const dialogSystem = new DialogSystem(); 