// ==UserScript==
// @name         Fruit Box 자동화 봇
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Fruit Box 게임의 그리드에서 합이 10인 영역을 자동으로 선택하고 제거합니다
// @author       hanagi입니다
// @match        https://www.gamesaien.com/game/fruit_box_a/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    // 게임 설정
    const GRID_ROWS = 10;
    const GRID_COLS = 17;
    
    // 게임이 로드된 후 실행될 메인 함수
    function initBot() {
        console.log("Fruit Box 자동화 봇을 시작합니다.");
        
        // 게임 그리드 요소 찾기 (게임 페이지에 맞게 선택자 수정 필요)
        const gameGrid = document.querySelector('.game-grid'); // 실제 게임의 그리드 선택자로 변경 필요
        
        if (!gameGrid) {
            console.error("게임 그리드를 찾을 수 없습니다. 페이지가 완전히 로드되었는지 확인하세요.");
            return;
        }
        
        // 일정 간격으로 자동 플레이 실행
        setInterval(playGame, 2000);
    }
    
    // 게임 자동 플레이 함수
    function playGame() {
        try {
            // 현재 게임 그리드의 숫자들을 읽어 2차원 배열로 변환
            const grid = parseGameGrid();
            
            if (!grid) {
                console.error("그리드 파싱에 실패했습니다.");
                return;
            }
            
            // 합이 10인 직사각형 영역 찾기
            const rectangle = findValidRectangle(grid);
            
            if (rectangle) {
                console.log(`유효 영역 발견! 좌표: (${rectangle.x1}, ${rectangle.y1}) ~ (${rectangle.x2}, ${rectangle.y2})`);
                
                // 찾은 영역 선택하기 (게임에 맞는 DOM 이벤트 발생)
                selectRectangleInGame(rectangle);
            } else {
                console.log("합이 10인 영역을 찾지 못했습니다.");
            }
        } catch (err) {
            console.error("오류 발생:", err.message);
        }
    }
    
    // 게임 그리드 파싱 함수
    function parseGameGrid() {
        // 게임 페이지 구조에 맞게 셀 요소 선택자 수정 필요
        const cells = document.querySelectorAll('.cell-number'); // 실제 게임의 셀 선택자로 변경 필요
        
        if (cells.length !== GRID_ROWS * GRID_COLS) {
            console.error(`셀 수가 일치하지 않습니다. 예상: ${GRID_ROWS * GRID_COLS}, 실제: ${cells.length}`);
            return null;
        }
        
        const grid = Array(GRID_ROWS).fill().map(() => Array(GRID_COLS).fill(0));
        
        let index = 0;
        for (let i = 0; i < GRID_ROWS; i++) {
            for (let j = 0; j < GRID_COLS; j++) {
                const value = parseInt(cells[index].textContent, 10);
                grid[i][j] = isNaN(value) ? 0 : value;
                index++;
            }
        }
        
        return grid;
    }
    
    // 합이 10이 되는 직사각형 영역 찾기
    function findValidRectangle(grid) {
        for (let y1 = 0; y1 < GRID_ROWS; y1++) {
            for (let x1 = 0; x1 < GRID_COLS; x1++) {
                for (let y2 = y1; y2 < GRID_ROWS; y2++) {
                    for (let x2 = x1; x2 < GRID_COLS; x2++) {
                        let sum = 0;
                        for (let i = y1; i <= y2; i++) {
                            for (let j = x1; j <= x2; j++) {
                                sum += grid[i][j];
                            }
                        }
                        if (sum === 10) {
                            return { x1, y1, x2, y2 };
                        }
                    }
                }
            }
        }
        return null;
    }
    
    // 게임에서 직사각형 영역 선택하기
    function selectRectangleInGame(rect) {
        // 게임의 구현에 따라 적절한 DOM 요소를 찾아 이벤트 발생
        const cells = document.querySelectorAll('.cell-number'); // 실제 게임의 셀 선택자로 변경 필요
        
        // 시작 셀과 끝 셀 계산
        const startCellIdx = rect.y1 * GRID_COLS + rect.x1;
        const endCellIdx = rect.y2 * GRID_COLS + rect.x2;
        
        if (startCellIdx >= 0 && startCellIdx < cells.length && 
            endCellIdx >= 0 && endCellIdx < cells.length) {
            
            const startCell = cells[startCellIdx];
            const endCell = cells[endCellIdx];
            
            // 시작 위치에서 마우스 다운 이벤트 발생
            simulateMouseEvent(startCell, 'mousedown');
            
            // 끝 위치에서 마우스 업 이벤트 발생
            simulateMouseEvent(endCell, 'mouseup');
            
            console.log("직사각형 선택 완료");
        } else {
            console.error("잘못된 셀 인덱스:", startCellIdx, endCellIdx);
        }
    }
    
    // 마우스 이벤트 시뮬레이션 함수
    function simulateMouseEvent(element, eventType) {
        const event = new MouseEvent(eventType, {
            view: window,
            bubbles: true,
            cancelable: true
        });
        element.dispatchEvent(event);
    }
    
    // 페이지 로드 후 봇 초기화
    window.addEventListener('load', initBot);
})();
