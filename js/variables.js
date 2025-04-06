class GameVariables {
    constructor() {
        // 初始化遊戲變數
        this.variables = {
            memory: 0,  // 記憶值
            anger: 0,   // 憤怒
            joy: 0,     // 喜悅
            sadness: 0, // 悲傷
            stable: 5   // 穩定值
        };
        
        this.statusBar = document.getElementById('status-bar');
        if (!this.statusBar) {
            console.error('Status bar element not found!');
        }
    }
    
    // 獲取變數值
    getVariable(name) {
        if (name in this.variables) {
            return this.variables[name];
        }
        console.warn(`Unknown variable: ${name}`);
        return 0;
    }
    
    // 設置變數值
    setVariable(name, value) {
        if (name in this.variables) {
            this.variables[name] = value;
            this.updateUI();
            return true;
        }
        console.warn(`Cannot set unknown variable: ${name}`);
        return false;
    }
    
    // 更新變數值（增加或減少）
    updateVariable(name, delta) {
        if (name in this.variables) {
            this.variables[name] += delta;
            console.log(`${name} 變更: ${delta > 0 ? '+' : ''}${delta}, 當前值: ${this.variables[name]}`);
            this.updateUI();
            return true;
        }
        console.warn(`Cannot update unknown variable: ${name}`);
        return false;
    }
    
    // 更新UI顯示
    updateUI() {
        if (!this.statusBar) return;
        
        // 清空狀態欄
        this.statusBar.innerHTML = '';
        
        // 為每個變數創建顯示元素
        Object.entries(this.variables).forEach(([name, value]) => {
            const item = document.createElement('div');
            item.className = 'status-item';
            
            const label = document.createElement('span');
            label.className = 'status-label';
            label.textContent = this.getDisplayName(name);
            
            const valueSpan = document.createElement('span');
            valueSpan.className = 'status-value';
            valueSpan.textContent = value;
            
            item.appendChild(label);
            item.appendChild(valueSpan);
            
            this.statusBar.appendChild(item);
        });
    }
    
    // 獲取變數的顯示名稱
    getDisplayName(name) {
        const displayNames = {
            memory: '記憶',
            anger: '憤怒',
            joy: '喜悅',
            sadness: '悲傷',
            stable: '穩定'
        };
        
        return displayNames[name] || name;
    }
}

// 創建全局變數系統實例
console.log('Creating game variables system');
window.gameVars = new GameVariables();

// 初始化UI
document.addEventListener('DOMContentLoaded', () => {
    gameVars.updateUI();
}); 