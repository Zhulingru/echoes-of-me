// 場景配置
const scenes = {
    S001: {
        id: 'S001',
        name: '記憶引渡站',
        background: './assets/images/scene/S001.png',
        music: './assets/music/s001.mp3',
        speaker: 'System',
        dialog: '系統啟動中...\n\n記憶序列檢測完成。\n\n語言模組異常，無法開口。\n\n請從以下三段模糊的記憶中選擇其一：',
        choices: [
            {
                id: 'CH001',
                text: '一段關於墜落的記憶',
                effects: { anger: 2 },
                next: 'M001'
            },
            {
                id: 'CH002',
                text: '一段關於等待的記憶',
                effects: { stable: 2 },
                next: 'M002'
            },
            {
                id: 'CH003',
                text: '一段關於離別的記憶',
                effects: { joy: -1 },
                next: 'M003'
            }
        ]
    },
    S002: {
        id: 'S002',
        name: '鏡前走廊',
        background: './assets/images/scene/S002.png',
        music: './assets/music/s002.mp3',
        speaker: 'Mira',
        dialog: '你還記得……為什麼選這段記憶嗎？\n\n每個鏡子都映出不同版本的你，但哪一個才是真實的？',
        choices: [
            {
                id: 'CH004-A',
                text: '點頭',
                effects: { stable: 2 },
                next: 'M034-A'
            },
            {
                id: 'CH004-B',
                text: '沉默',
                effects: { block: 1 },
                next: 'S003'
            },
            {
                id: 'CH005',
                text: '搖頭',
                effects: { anger: 1 },
                next: 'S003'
            }
        ]
    },
    S003: {
        id: 'S003',
        name: '語義殘層',
        background: './assets/images/scene/S003.png',
        music: './assets/music/s003.mp3',
        speaker: 'Mira',
        dialog: '這不是錯誤，這是預設。\n\n兩段記憶重疊在一起，你只能選擇其中一段。\n\n但選擇後，兩段都會消失。',
        choices: [
            {
                id: 'CH006',
                text: '選擇第一段記憶',
                effects: { memory: 1, stable: 1 },
                next: 'M002'
            },
            {
                id: 'CH007',
                text: '選擇第二段記憶',
                effects: { memory: 1, block: -1 },
                next: 'S004'
            },
            {
                id: 'CH008',
                text: '拒絕選擇',
                effects: { anger: 2 },
                next: 'S004'
            }
        ]
    },
    S004: {
        id: 'S004',
        name: '反射空間',
        background: './assets/images/scene/S004.png',
        music: './assets/music/s004.mp3',
        speaker: 'Mira',
        dialog: '他們也選擇了你現在的選擇。\n\n每一個失敗者都曾站在這裡，做出相似的決定。\n\n你想怎麼處理這些過去的選擇？',
        choices: [
            {
                id: 'CH009',
                text: '刪除過去的選擇紀錄',
                effects: { block: 2, stable: -1 },
                next: 'M003'
            },
            {
                id: 'CH010',
                text: '保留作為比較資料',
                effects: { stable: 1, block: -1 },
                next: 'S005'
            },
            {
                id: 'CH011',
                text: '質疑這些選擇的真實性',
                effects: { anger: 1, block: 1 },
                next: 'S005'
            }
        ]
    },
    S005: {
        id: 'S005',
        name: '角色初始化模擬艙',
        background: './assets/images/scene/S005.png',
        music: './assets/music/s005.mp3',
        speaker: 'Mira',
        dialog: '歡迎來到角色初始化模擬艙。\n\n請選擇三句描述來定義你的存在主張。\n\n注意：選擇完成後才會揭示完整語意。',
        choices: [
            {
                id: 'CH012',
                text: '「我選擇...」',
                effects: { stable: 2 },
                next: 'M004'
            },
            {
                id: 'CH013',
                text: '「我拒絕...」',
                effects: { anger: 2 },
                next: 'M004'
            },
            {
                id: 'CH014',
                text: '「我懷疑...」',
                effects: { block: 1 },
                next: 'M004'
            }
        ]
    }
};

// 導出場景配置
window.gameScenes = scenes; 