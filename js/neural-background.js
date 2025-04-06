// 神經網絡背景
let particles = [];        // 儲存所有粒子
let maxParticles = 100;    // 粒子總數
let connectDistance = 150; // 粒子之間產生連接的最大距離
let neuralCanvas;          // p5.js canvas
let welcomeContainer;      // 歡迎容器
let startButton;           // 開始按鈕
let animationStarted = true;  // 標記動畫是否已開始 - 改為默認開始

// 初始化 p5.js
const neuralSketch = function(p) {
  p.setup = function() {
    // 創建一個覆蓋整個窗口的畫布
    neuralCanvas = p.createCanvas(p.windowWidth, p.windowHeight);
    neuralCanvas.position(0, 0);
    neuralCanvas.style('z-index', '-1');
    
    // 初始化粒子
    for (let i = 0; i < maxParticles; i++) {
      particles.push(new Particle(p));
    }
    
    // 創建歡迎界面和開始按鈕
    createWelcomeInterface();
  };
  
  p.draw = function() {
    p.background(0, 20); // 添加輕微的殘影效果
    
    // 更新和顯示所有粒子
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].display();
      
      // 連接附近的粒子
      for (let j = i + 1; j < particles.length; j++) {
        let d = p.dist(
          particles[i].position.x,
          particles[i].position.y,
          particles[j].position.x,
          particles[j].position.y
        );
        
        if (d < connectDistance) {
          // 根據距離調整連線的透明度
          let alpha = p.map(d, 0, connectDistance, 150, 0);
          p.stroke(100, 200, 255, alpha);
          p.strokeWeight(0.5);
          p.line(
            particles[i].position.x,
            particles[i].position.y,
            particles[j].position.x,
            particles[j].position.y
          );
        }
      }
    }
  };
  
  p.windowResized = function() {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
  
  p.mouseMoved = function() {
    for (let i = 0; i < particles.length; i++) {
      if (Math.random() < 0.05) {  // 5%的粒子對滑鼠有反應
        let force = p5.Vector.sub(
          p.createVector(p.mouseX, p.mouseY),
          particles[i].position
        );
        force.setMag(0.3);  // 設置力的大小
        particles[i].applyForce(force);
      }
    }
  };
  
  // 粒子類
  class Particle {
    constructor() {
      this.position = p.createVector(p.random(p.width), p.random(p.height));
      this.velocity = p.createVector(p.random(-0.5, 0.5), p.random(-0.5, 0.5));
      this.acceleration = p.createVector(0, 0);
      this.color = p.color(
        p.random(50, 150),  // R
        p.random(150, 230), // G
        p.random(200, 255)  // B
      );
      this.size = p.random(2, 5);
      this.maxSpeed = p.random(0.5, 1.5);
    }
    
    update() {
      // 更新速度和位置
      this.velocity.add(this.acceleration);
      this.velocity.limit(this.maxSpeed);
      this.position.add(this.velocity);
      this.acceleration.mult(0);
      
      // 邊界檢查 - 從另一側出現
      if (this.position.x < 0) this.position.x = p.width;
      if (this.position.x > p.width) this.position.x = 0;
      if (this.position.y < 0) this.position.y = p.height;
      if (this.position.y > p.height) this.position.y = 0;
    }
    
    applyForce(force) {
      this.acceleration.add(force);
    }
    
    display() {
      p.noStroke();
      p.fill(this.color);
      p.circle(this.position.x, this.position.y, this.size);
      
      // 添加發光效果
      p.fill(red(this.color), green(this.color), blue(this.color), 50);
      p.circle(this.position.x, this.position.y, this.size * 1.5);
    }
  }
  
  // 輔助函數：提取顏色的 RGB 值
  function red(c) { return p.red(c); }
  function green(c) { return p.green(c); }
  function blue(c) { return p.blue(c); }
};

// 創建歡迎界面
function createWelcomeInterface() {
  welcomeContainer = document.createElement('div');
  welcomeContainer.id = 'welcome-container';
  welcomeContainer.style.position = 'fixed';
  welcomeContainer.style.top = '0';
  welcomeContainer.style.left = '0';
  welcomeContainer.style.width = '100vw';
  welcomeContainer.style.height = '100vh';
  welcomeContainer.style.display = 'flex';
  welcomeContainer.style.flexDirection = 'column';
  welcomeContainer.style.justifyContent = 'center';
  welcomeContainer.style.alignItems = 'center';
  welcomeContainer.style.zIndex = '1000';
  document.body.appendChild(welcomeContainer);
  
  // 添加遊戲標題
  const gameTitle = document.createElement('div');
  gameTitle.textContent = 'ECHOES OF ME';
  gameTitle.style.color = '#32c5ff';
  gameTitle.style.fontSize = '4rem';
  gameTitle.style.fontWeight = 'bold';
  gameTitle.style.marginBottom = '3rem';
  gameTitle.style.fontFamily = 'monospace, sans-serif';
  gameTitle.style.letterSpacing = '10px';
  gameTitle.style.textShadow = '0 0 15px rgba(50, 197, 255, 0.8)';
  welcomeContainer.appendChild(gameTitle);
  
  // 添加開始按鈕
  startButton = document.createElement('button');
  startButton.id = 'start-button';
  startButton.textContent = 'DIVE IN';
  startButton.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
  startButton.style.color = '#32c5ff';
  startButton.style.border = '2px solid #32c5ff';
  startButton.style.padding = '15px 40px';
  startButton.style.fontSize = '1.5rem';
  startButton.style.fontWeight = 'bold';
  startButton.style.borderRadius = '50px';
  startButton.style.cursor = 'pointer';
  startButton.style.transition = 'all 0.3s ease';
  startButton.style.boxShadow = '0 0 20px rgba(50, 197, 255, 0.4)';
  startButton.style.letterSpacing = '3px';
  
  // 添加懸停效果
  startButton.onmouseover = function() {
    this.style.backgroundColor = 'rgba(50, 197, 255, 0.2)';
    this.style.boxShadow = '0 0 30px rgba(50, 197, 255, 0.7)';
  };
  
  startButton.onmouseout = function() {
    this.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
    this.style.boxShadow = '0 0 20px rgba(50, 197, 255, 0.4)';
  };
  
  // 添加點擊事件
  startButton.addEventListener('click', function() {
    // 創建過渡效果元素
    const transitionOverlay = document.createElement('div');
    transitionOverlay.style.position = 'fixed';
    transitionOverlay.style.top = '0';
    transitionOverlay.style.left = '0';
    transitionOverlay.style.width = '100vw';
    transitionOverlay.style.height = '100vh';
    transitionOverlay.style.backgroundColor = 'black';
    transitionOverlay.style.zIndex = '1500';
    transitionOverlay.style.opacity = '0';
    transitionOverlay.style.transition = 'opacity 2.5s ease';
    document.body.appendChild(transitionOverlay);
    
    // 淡入黑色覆蓋層
    setTimeout(() => {
      transitionOverlay.style.opacity = '1';
      
      // 完全淡入後
      setTimeout(() => {
        // 移除歡迎界面
        welcomeContainer.remove();
        
        // 啟動開場動畫
        startIntroSequence();
        
        // 延遲後淡出覆蓋層
        setTimeout(() => {
          transitionOverlay.style.opacity = '0';
          
          // 完全淡出後移除覆蓋層
          setTimeout(() => {
            transitionOverlay.remove();
          }, 2500);
        }, 1000);
      }, 2500);
    }, 200);
  });
  
  welcomeContainer.appendChild(startButton);
}

// 開始開場動畫序列
function startIntroSequence() {
  new IntroSequence();
}

// 當頁面載入完成後初始化
document.addEventListener('DOMContentLoaded', function() {
  // 隱藏遊戲容器，直到開場動畫結束
  const gameContainer = document.getElementById('game-container');
  if (gameContainer) {
    gameContainer.style.display = 'none';
  }
  
  // 初始化 p5.js 草圖
  new p5(neuralSketch);
}); 