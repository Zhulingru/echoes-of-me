class DialogSystem {
    constructor() {
        // 獲取 DOM 元素
        this.dialogBox = document.getElementById('dialog-box');
        this.choicesContainer = document.getElementById('choices-container');
        
        // 初始化狀態
        this.isTyping = false;
        this.typingSpeed = 20; // 打字速度(毫秒)
        this.currentText = '';
        this.targetText = '';
        this.textIndex = 0;
        this.currentSpeaker = null;
    }
    
    clear() {
        // 清除對話框內容
        if (this.dialogBox) {
            this.dialogBox.style.display = 'none';
            this.dialogBox.innerHTML = '';
        }
        
        // 清除選項
        if (this.choicesContainer) {
            this.choicesContainer.style.display = 'none';
            this.choicesContainer.innerHTML = '';
        }
    }
    
    showDialog(text, speaker = null) {
        if (!this.dialogBox) return;
        
        // 設置對話框顯示
        this.dialogBox.style.display = 'block';
        
        // 清空現有內容
        this.dialogBox.innerHTML = '';
        
        // 如果有說話者，添加說話者頭部
        if (speaker) {
            const speakerElement = document.createElement('div');
            speakerElement.className = 'dialog-speaker';
            speakerElement.innerText = speaker;
            this.dialogBox.appendChild(speakerElement);
        }
        
        // 創建文本容器
        const textContainer = document.createElement('div');
        textContainer.className = 'dialog-text';
        this.dialogBox.appendChild(textContainer);
        
        // 設置打字狀態
        this.isTyping = true;
        this.targetText = text;
        this.currentText = '';
        this.textIndex = 0;
        this.currentSpeaker = speaker;
        
        // 開始打字效果
        this.typeText(textContainer);
        
        // 添加點擊跳過打字效果
        this.dialogBox.onclick = () => {
            if (this.isTyping) {
                // 如果正在打字，點擊直接顯示全部文本
                this.isTyping = false;
                textContainer.innerHTML = this.formatText(this.targetText);
            }
        };
    }
    
    typeText(container) {
        if (!this.isTyping) return;
        
        if (this.textIndex < this.targetText.length) {
            this.currentText += this.targetText.charAt(this.textIndex);
            container.innerHTML = this.formatText(this.currentText);
            this.textIndex++;
            
            // 處理換行符和標點符號的延遲
            const nextChar = this.targetText.charAt(this.textIndex - 1);
            let delay = this.typingSpeed;
            
            if (nextChar === '\n') delay = this.typingSpeed * 5;
            else if ('.!?。！？'.includes(nextChar)) delay = this.typingSpeed * 3;
            else if (',:;，：；'.includes(nextChar)) delay = this.typingSpeed * 2;
            
            setTimeout(() => this.typeText(container), delay);
        } else {
            // 打字完成
            this.isTyping = false;
        }
    }
    
    formatText(text) {
        // 將\n轉換為<br>
        return text.replace(/\n/g, '<br>');
    }
    
    showChoices(choices) {
        if (!this.choicesContainer || !choices || choices.length === 0) return;
        
        // 清空現有選項
        this.choicesContainer.innerHTML = '';
        
        // 顯示選項容器
        this.choicesContainer.style.display = 'flex';
        
        // 創建每個選項按鈕
        choices.forEach(choice => {
            const choiceButton = document.createElement('button');
            choiceButton.className = 'choice-button';
            choiceButton.innerText = choice.text;
            
            // 添加點擊事件
            choiceButton.addEventListener('click', () => {
                console.log('Choice clicked:', choice);
                this.handleChoice(choice);
            });
            
            this.choicesContainer.appendChild(choiceButton);
        });
    }
    
    // 處理選項選擇
    handleChoice(choice) {
        console.log('處理選擇:', choice);
        
        // 更新變數
        if (choice.effects) {
            Object.entries(choice.effects).forEach(([variable, value]) => {
                gameVars.updateVariable(variable, value);
            });
        }
        
        // 觸發下一個對話或場景
        if (choice.next) {
            console.log('下一個目標:', choice.next);
            
            if (choice.next.startsWith('S')) {
                // 場景轉換
                console.log('加載場景:', choice.next);
                window.game.loadScene(choice.next);
            } else if (choice.next.startsWith('M')) {
                // 記憶片段觸發
                console.log('觸發記憶:', choice.next);
                window.game.triggerMemory(choice.next);
            } else {
                console.warn('未知的下一個目標類型:', choice.next);
            }
        } else {
            console.log('沒有下一個目標，保持當前場景');
        }
    }
}

// 創建對話系統的全局實例
console.log('Creating dialog system');
window.dialogSystem = new DialogSystem(); 