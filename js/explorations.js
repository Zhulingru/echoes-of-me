class ExplorationSystem {
    constructor() {
        this.currentMap = null;
        this.maps = {
            'explore1': {
                name: '記憶廢墟島',
                image: 'assets/images/exploration/explore1.png',
                description: '殘缺的記憶碎片散落在這座小島上，像是被遺棄的舊相片。'
            },
            'explore2': {
                name: '聲音故障區',
                image: 'assets/images/exploration/explore2.png',
                description: '錯亂的聲音與不完整的對話在空間中迴響，像是壞掉的錄音帶。'
            },
            'explore3': {
                name: '失落軀體花園',
                image: 'assets/images/exploration/explore3.png',
                description: '身體的感覺在這裡以植物的形態呈現，有些枯萎，有些盛開。'
            },
            'explore4': {
                name: '觀察者坐標層',
                image: 'assets/images/exploration/explore4.png',
                description: '一個觀測系統的核心，可以從這裡看到整個記憶網絡的運作。'
            }
        };
        
        this.movementPoints = 3; // 每天的移動點數
        this.exploreResults = []; // 儲存探索結果
        
        this.bindExplorationButton();
    }
    
    bindExplorationButton() {
        const exploreBtn = document.getElementById('explore-btn');
        if (exploreBtn) {
            exploreBtn.addEventListener('click', () => this.showExplorationMenu());
        }
    }
    
    showExplorationMenu() {
        // 清空現有對話和選項
        dialogSystem.clear();
        
        // 創建探索選單容器
        const menuContainer = document.createElement('div');
        menuContainer.className = 'exploration-menu';
        
        // 添加標題
        const title = document.createElement('h2');
        title.textContent = '探索地圖';
        title.className = 'exploration-title';
        menuContainer.appendChild(title);
        
        // 添加移動點數信息
        const pointsInfo = document.createElement('div');
        pointsInfo.textContent = `移動點數: ${this.movementPoints} / 3`;
        pointsInfo.className = 'exploration-points';
        menuContainer.appendChild(pointsInfo);
        
        // 創建地圖選擇區域
        const mapsContainer = document.createElement('div');
        mapsContainer.className = 'exploration-maps';
        
        // 添加每個地圖選項
        Object.entries(this.maps).forEach(([id, mapData]) => {
            const mapItem = document.createElement('div');
            mapItem.className = 'exploration-map-item';
            mapItem.onclick = () => this.selectMap(id);
            
            const mapImage = document.createElement('div');
            mapImage.className = 'exploration-map-image';
            mapImage.style.backgroundImage = `url(${mapData.image})`;
            
            const mapInfo = document.createElement('div');
            mapInfo.className = 'exploration-map-info';
            
            const mapName = document.createElement('h3');
            mapName.textContent = mapData.name;
            
            const mapDesc = document.createElement('p');
            mapDesc.textContent = mapData.description;
            
            mapInfo.appendChild(mapName);
            mapInfo.appendChild(mapDesc);
            mapItem.appendChild(mapImage);
            mapItem.appendChild(mapInfo);
            
            mapsContainer.appendChild(mapItem);
        });
        
        menuContainer.appendChild(mapsContainer);
        
        // 添加返回按鈕
        const backButton = document.createElement('button');
        backButton.textContent = '返回';
        backButton.className = 'exploration-back-btn';
        backButton.onclick = () => {
            // 立即移除所有探索相關的介面
            const containers = [
                '.exploration-container',
                '.exploration-interface-container',
                '.exploration-result-container',
                '.exploration-message'
            ];
            
            // 先清除對話框內容
            if (window.dialogSystem) {
                window.dialogSystem.clear();
            }
            
            // 移除所有探索相關的介面
            containers.forEach(selector => {
                const element = document.querySelector(selector);
                if (element) {
                    element.remove();
                }
            });
            
            // 等待一個極短暫的時間確保介面完全移除
            setTimeout(() => {
                // 返回當前場景
                if (window.game.currentScene) {
                    window.game.renderScene();
                }
            }, 50);
        };
        menuContainer.appendChild(backButton);
        
        // 創建外層容器並添加到UI
        const container = document.createElement('div');
        container.className = 'exploration-container';
        container.appendChild(menuContainer);
        
        document.getElementById('ui-container').appendChild(container);
    }
    
    selectMap(mapId) {
        if (!mapId || !this.maps[mapId]) {
            console.error('Invalid map ID:', mapId);
            return;
        }

        if (this.movementPoints <= 0) {
            this.showMessage('你今天的移動點數已用完。');
            return;
        }
        
        this.currentMap = mapId;
        const mapData = this.maps[mapId];
        
        // 檢查當前UI狀態
        const existingContainer = document.querySelector('.exploration-container');
        if (existingContainer) {
            existingContainer.remove();
        }
        
        // 顯示地圖
        this.showMap(mapData);
    }
    
    showMap(mapData) {
        if (!mapData) {
            console.error('Invalid map data');
            return;
        }

        // 設置背景
        const sceneContainer = document.getElementById('scene-container');
        if (!sceneContainer) {
            console.error('Scene container not found');
            return;
        }

        sceneContainer.style.opacity = '0';
        
        setTimeout(() => {
            sceneContainer.style.backgroundImage = `url(${mapData.image})`;
            sceneContainer.style.opacity = '1';
            
            // 顯示探索信息
            this.showExplorationInterface(mapData);
        }, 300);
    }
    
    showExplorationInterface(mapData) {
        // 創建探索界面
        const interfaceContainer = document.createElement('div');
        interfaceContainer.className = 'exploration-interface';
        
        // 添加地圖名稱
        const mapTitle = document.createElement('h2');
        mapTitle.textContent = mapData.name;
        interfaceContainer.appendChild(mapTitle);
        
        // 添加探索按鈕
        const exploreButton = document.createElement('button');
        exploreButton.textContent = '探索';
        exploreButton.className = 'explore-action-btn';
        exploreButton.onclick = () => this.explore();
        interfaceContainer.appendChild(exploreButton);
        
        // 添加返回按鈕
        const backButton = document.createElement('button');
        backButton.textContent = '返回地圖選擇';
        backButton.className = 'exploration-back-btn';
        backButton.onclick = () => {
            document.querySelector('.exploration-interface-container').remove();
            this.showExplorationMenu();
        };
        interfaceContainer.appendChild(backButton);
        
        // 創建外層容器並添加到UI
        const container = document.createElement('div');
        container.className = 'exploration-interface-container';
        container.appendChild(interfaceContainer);
        
        document.getElementById('ui-container').appendChild(container);
    }
    
    explore() {
        if (this.movementPoints <= 0) {
            this.showMessage('你今天的移動點數已用完。');
            return;
        }
        
        // 減少移動點數
        this.movementPoints--;
        
        // 根據當前地圖獲取探索結果
        this.getExplorationResult(this.currentMap);
    }
    
    async getExplorationResult(mapId) {
        try {
            // 嘗試從JSON文件加載探索結果
            const response = await fetch(`data/explorations/${mapId}.json`);
            if (response.ok) {
                const resultData = await response.json();
                const randomIndex = Math.floor(Math.random() * resultData.results.length);
                const result = resultData.results[randomIndex];
                this.showExplorationResult(result);
                return;
            }
        } catch (e) {
            console.warn(`Failed to load exploration data: ${e}`);
        }
        
        // 如果沒有JSON文件，使用默認結果
        const defaultResults = {
            'explore1': [
                { text: '你發現了一塊記憶碎片，上面有些模糊的影像。', effects: { memory: 1 } },
                { text: '你在廢墟中找到了一個舊相框，但照片已經褪色。', effects: { sadness: 1 } }
            ],
            'explore2': [
                { text: '你聽到了一段熟悉的旋律，喚起了一些情感。', effects: { joy: 1 } },
                { text: '刺耳的雜音讓你感到不適，但似乎隱藏著某種信息。', effects: { anger: 1 } }
            ],
            'explore3': [
                { text: '你觸摸到一朵花，感受到了久違的溫暖。', effects: { stable: 1 } },
                { text: '枯萎的植物讓你想起了失去的感覺。', effects: { sadness: 1 } }
            ],
            'explore4': [
                { text: '你看到了系統運作的一角，理解了某些規則。', effects: { memory: 1, stable: 1 } },
                { text: '複雜的數據流讓你感到困惑，但也給了你新的視角。', effects: { memory: 1, joy: 1 } }
            ]
        };
        
        const results = defaultResults[mapId] || [{ text: '你在這裡探索，但沒有發現什麼特別的東西。', effects: {} }];
        const randomIndex = Math.floor(Math.random() * results.length);
        this.showExplorationResult(results[randomIndex]);
    }
    
    showExplorationResult(result) {
        // 先清除探索界面
        document.querySelector('.exploration-interface-container').remove();
        
        // 創建結果顯示容器
        const resultContainer = document.createElement('div');
        resultContainer.className = 'exploration-result';
        
        // 添加結果文本
        const resultText = document.createElement('p');
        resultText.textContent = result.text;
        resultContainer.appendChild(resultText);
        
        // 如果有效果，顯示效果
        if (result.effects && Object.keys(result.effects).length > 0) {
            const effectsContainer = document.createElement('div');
            effectsContainer.className = 'exploration-effects';
            
            Object.entries(result.effects).forEach(([variable, value]) => {
                // 更新變數
                gameVars.updateVariable(variable, value);
                
                // 創建效果顯示
                const effectItem = document.createElement('div');
                effectItem.className = 'exploration-effect-item';
                
                const effectName = document.createElement('span');
                effectName.className = 'effect-name';
                effectName.textContent = this.getVariableName(variable) + ': ';
                
                const effectValue = document.createElement('span');
                effectValue.className = value > 0 ? 'effect-positive' : (value < 0 ? 'effect-negative' : 'effect-neutral');
                effectValue.textContent = value > 0 ? '+' + value : value;
                
                effectItem.appendChild(effectName);
                effectItem.appendChild(effectValue);
                effectsContainer.appendChild(effectItem);
            });
            
            resultContainer.appendChild(effectsContainer);
        }
        
        // 添加返回按鈕
        const backButton = document.createElement('button');
        backButton.textContent = '返回';
        backButton.className = 'exploration-back-btn';
        backButton.onclick = () => this.closeExplorationResult();
        resultContainer.appendChild(backButton);
        
        // 創建外層容器並添加到UI
        const container = document.createElement('div');
        container.className = 'exploration-result-container';
        container.appendChild(resultContainer);
        
        document.getElementById('ui-container').appendChild(container);
    }
    
    // 關閉探索結果
    closeExplorationResult() {
        const resultContainer = document.querySelector('.exploration-result-container');
        if (resultContainer) {
            resultContainer.remove();
        }
        
        // 檢查移動點數
        if (this.movementPoints <= 0) {
            // 如果沒有移動點數了，返回當前場景
            if (window.game && window.game.currentScene) {
                window.game.renderScene();
            }
        } else {
            // 還有移動點數，顯示探索選單
            this.showExplorationMenu();
        }
    }
    
    getVariableName(variable) {
        const variableNames = {
            'memory': '記憶',
            'anger': '憤怒',
            'joy': '喜悅',
            'sadness': '悲傷',
            'stable': '穩定'
        };
        
        return variableNames[variable] || variable;
    }
    
    showMessage(message) {
        // 創建消息容器
        const msgContainer = document.createElement('div');
        msgContainer.className = 'exploration-message';
        msgContainer.textContent = message;
        
        // 添加到UI
        document.getElementById('ui-container').appendChild(msgContainer);
        
        // 3秒後自動移除
        setTimeout(() => {
            msgContainer.remove();
        }, 3000);
    }
}

// 初始化探索系統
window.explorationSystem = new ExplorationSystem(); 