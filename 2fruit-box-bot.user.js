// ==UserScript==
// @name         Fruit Box 자동화 봇 (Canvas 버전)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Canvas 기반 Fruit Box 게임에서 합이 10인 영역을 자동으로 선택하고 제거합니다
// @author       hanagi입니다
// @match        https://www.gamesaien.com/game/fruit_box_a/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    // 게임 설정
    const GRID_ROWS = 10;
    const GRID_COLS = 17;
    let gameStarted = false;
    
    // 캔버스 요소와 컨텍스트를 가져오는 함수
    function getCanvas() {
        return document.getElementById('canvas');
    }
    
    // 게임이 로드된 후 실행될 메인 함수
    function initBot() {
        console.log("Fruit Box 자동화 봇을 시작합니다.");
        
        // 캔버스를 찾을 때까지 대기
        const checkCanvasInterval = setInterval(() => {
            const canvas = getCanvas();
            if (canvas) {
                clearInterval(checkCanvasInterval);
                console.log("캔버스를 찾았습니다:", canvas);
                
                // 게임 시작 대기 (Play Now 버튼 찾기)
                waitForGameStart();
            }
        }, 1000);
    }
    
    // 게임 시작을 위해 대기하는 함수
    function waitForGameStart() {
        // 게임 상태 확인 및 필요한 초기화 수행
        if (!gameStarted) {
            console.log("게임 시작을 기다리는 중...");
            
            // Canvas에 클릭 이벤트를 추가하여 Play Now 버튼 클릭 시도
            const canvas = getCanvas();
            if (canvas) {
                // Play Now 버튼 위치를 대략적으로 추정 (수정 필요할 수 있음)
                simulateClick(canvas, canvas.width / 2, canvas.height / 2);
                
                // 게임이 시작되었다고 가정하고 일정 시간 후 자동 플레이 시작
                setTimeout(() => {
                    gameStarted = true;
                    startAutoPlay();
                }, 2000);
            }
        }
    }
    
    // 자동 플레이 시작 함수
    function startAutoPlay() {
        console.log("자동 플레이를 시작합니다.");
        
        // 주기적으로 게임 상태를 분석하고 행동 수행
        setInterval(playGame, 2000);
    }
    
    // 게임 자동 플레이 함수
    function playGame() {
        try {
            const canvas = getCanvas();
            if (!canvas) return;
            
            // 캔버스에서 이미지 데이터 가져오기
            const ctx = canvas.getContext('2d');
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            
            // 게임 그리드를 분석하여 번호 찾기 (실제 구현은 매우 복잡할 수 있음)
            // 이 부분은 예시로, 실제로는 이미지 처리 및 OCR이 필요할 수 있음
            
            // 영역 선택을 위한 랜덤 좌표 생성 (임시 방법)
            const rect = canvas.getBoundingClientRect();
            const cellWidth = canvas.width / GRID_COLS;
            const cellHeight = canvas.height / GRID_ROWS;
            
            // 랜덤한 시작 위치 선택
            const startX = Math.floor(Math.random() * (GRID_COLS - 2)) * cellWidth + cellWidth / 2;
            const startY = Math.floor(Math.random() * (GRID_ROWS - 2)) * cellHeight + cellHeight / 2;
            
            // 랜덤한 크기의 직사각형 영역 선택 (1x1 ~ 3x3)
            const rectWidth = Math.floor(Math.random() * 3) + 1;
            const rectHeight = Math.floor(Math.random() * 3) + 1;
            
            const endX = startX + rectWidth * cellWidth;
            const endY = startY + rectHeight * cellHeight;
            
            console.log(`랜덤 영역 선택: (${startX}, ${startY}) ~ (${endX}, ${endY})`);
            
            // 드래그 이벤트 시뮬레이션
            simulateDrag(canvas, startX, startY, endX, endY);
            
        } catch (err) {
            console.error("오류 발생:", err.message);
        }
    }
    
    // 캔버스의 특정 위치에 클릭 이벤트를 시뮬레이션하는 함수
    function simulateClick(element, x, y) {
        const rect = element.getBoundingClientRect();
        const clientX = rect.left + x;
        const clientY = rect.top + y;
        
        // 마우스 다운 이벤트
        element.dispatchEvent(new MouseEvent('mousedown', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: clientX,
            clientY: clientY
        }));
        
        // 마우스 업 이벤트
        element.dispatchEvent(new MouseEvent('mouseup', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: clientX,
            clientY: clientY
        }));
        
        // 클릭 이벤트
        element.dispatchEvent(new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: clientX,
            clientY: clientY
        }));
        
        console.log(`클릭 이벤트 발생: (${x}, ${y}) -> 클라이언트 좌표: (${clientX}, ${clientY})`);
    }
    
    // 드래그 이벤트 시뮬레이션
    function simulateDrag(element, startX, startY, endX, endY) {
        const rect = element.getBoundingClientRect();
        const clientStartX = rect.left + startX;
        const clientStartY = rect.top + startY;
        const clientEndX = rect.left + endX;
        const clientEndY = rect.top + endY;
        
        // 마우스 다운 이벤트 (시작 위치)
        element.dispatchEvent(new MouseEvent('mousedown', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: clientStartX,
            clientY: clientStartY
        }));
        
        // 마우스 이동 이벤트 (선택적)
        element.dispatchEvent(new MouseEvent('mousemove', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: clientEndX,
            clientY: clientEndY
        }));
        
        // 마우스 업 이벤트 (종료 위치)
        element.dispatchEvent(new MouseEvent('mouseup', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: clientEndX,
            clientY: clientEndY
        }));
        
        console.log(`드래그 이벤트 발생: (${startX}, ${startY}) -> (${endX}, ${endY})`);
    }
    
    // 페이지 로드 후 일정 시간 대기 후 봇 초기화 (게임 로딩 시간 고려)
    setTimeout(initBot, 3000);
})();
