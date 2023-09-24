console.log('content.js');
(function() {
    let record = '';
    let stepNum = 0;
    let pageInfo = {
        url: history.length < 3 ? document.URL : '',
        width: window.innerWidth,
        height: window.innerHeight,
    }
    chrome.storage.local.get(['persistedData'], (result)=> {
        if (result.persistedData) {
            record = result.persistedData;
        }
    });
    chrome.storage.local.get(['stepNum'], (result)=> {
        if (result.stepNum) {
            stepNum = result.stepNum;
        }
    });
    chrome.storage.local.get(['openURL'], (result)=> {
        if (result.openURL) {
            pageInfo.url = result.openURL;
        } else {
            pageInfo.url = document.URL;
            chrome.storage.local.set({ 'openURL': pageInfo.url });
        }
    });

    document.onkeydown = (event) => {
        if (event.key === 'F4') {
            chrome.storage.local.set({ 'persistedData': '' }, () => {
                chrome.storage.local.set({ 'stepNum': 0 }, () => {
                    chrome.storage.local.set({ 'openURL': '' }, () => {
                        alert('开始录制');
                    });
                });
            });
            return;
        }
        if (event.key === 'F5') {
            alert('结束录制，并且导出JavaScript');
            exportFile();
            return;
        }
        if (event.key === 'Backspace' || event.key === 'Enter' || event.key === 'Shif' || event.key === 'Shift' || event.key === 'CapsLock' || event.key === 'Tab' || event.key === 'ArrowLeft') {
            record += `await page.keyboard.press('${event.key}');\n`;
        } else {
            record += `await page.keyboard.type('${event.key}');\n`;
        }
        chrome.storage.local.set({ 'persistedData': record });
    };

    document.onmousedown = (event) => {
        stepNum++;
        chrome.storage.local.set({ 'stepNum': stepNum });
        if (pageInfo.url !== document.URL) {
            record += `
            await page.waitForFunction(() => document.readyState === 'complete');
            await page.evaluate(() => {
                if (!document.getElementById('mask')) {
                    let body = document.body;
                    let mask = document.createElement('div');
                    mask.setAttribute('id', 'mask');
                    mask.style.position = 'absolute',
                    mask.style.top = '0px',
                    mask.style.left = '0px',
                    mask.style.width = '${pageInfo.width}px',
                    mask.style.height = '${pageInfo.height}px',
                    mask.style.backgroundColor = 'rgba(0, 0, 0, .35)',
                    mask.style.zIndex = 9999999;
                    mask.style.pointerEvents = 'none',
                    body.appendChild(mask);
                    let arrowsGuide = document.createElement('div');
                    arrowsGuide.setAttribute('id', 'arrowsGuide');
                    arrowsGuide.style.position = 'absolute',
                    arrowsGuide.style.top = '0px',
                    arrowsGuide.style.left = '0px',
                    arrowsGuide.style.width = '20px';
                    arrowsGuide.style.height = '20px';
                    arrowsGuide.style.border = 'solid 1px #000';
                    arrowsGuide.style.backgroundColor = 'rgba(0, 0, 0, .35)';
                    arrowsGuide.style.borderRadius = '20px';
                    mask.appendChild(arrowsGuide);
                    let progressBar = document.createElement('div');
                    progressBar.style.position = 'absolute',
                    progressBar.style.top = '0px',
                    progressBar.style.left = '0px',
                    progressBar.style.margin = '5px';
                    progressBar.style.backgroundColor = 'rgba(0, 0, 0, .35)';
                    mask.appendChild(progressBar);
                    let stepText = document.createElement('p');
                    stepText.setAttribute('id', 'stepText');
                    stepText.style.color = '#fff';
                    stepText.style.margin = '0px';
                    stepText.innerText = 0;
                    progressBar.appendChild(stepText);
                }
            });\n`;
        }
        record += `
        await page.waitForFunction(() => document.readyState === 'complete');
        await page.evaluate(() => {
            document.getElementById('arrowsGuide').style.top = '${event.clientY}px';
            document.getElementById('arrowsGuide').style.left = '${event.clientX}px';
            document.getElementById('stepText').innerText = '第${stepNum}步';
        });
        await page.waitForTimeout(3000);
        await page.mouse.click(${event.clientX},${event.clientY});
        `;
        chrome.storage.local.set({ 'persistedData': record });
    }

    function exportFile() {
        // 在控制台中输出记录
        const log = `const puppeteer = require("puppeteer");
        const fs = require('fs');
        (async () => {
            console.log("开始：",new Date());
            const browser = await puppeteer.launch({
                executablePath:"./Chromium.app/Contents/MacOS/Chromium",
                headless: false,
                defaultViewport: {
                    width: ${pageInfo.width}, height: ${pageInfo.height}, //页面大小
                },
            })
            const page = await browser.newPage();
            await page.goto("${pageInfo.url}");
            await page.evaluate(() => {
                let body = document.body;
                let mask = document.createElement('div');
                mask.setAttribute('id', 'mask');
                mask.style.position = 'absolute',
                mask.style.top = '0px',
                mask.style.left = '0px',
                mask.style.width = '${pageInfo.width}px',
                mask.style.height = '${pageInfo.height}px',
                mask.style.backgroundColor = 'rgba(0, 0, 0, .35)',
                mask.style.zIndex = 9999999;
                mask.style.pointerEvents = 'none',
                body.appendChild(mask);
                let arrowsGuide = document.createElement('div');
                arrowsGuide.setAttribute('id', 'arrowsGuide');
                arrowsGuide.style.position = 'absolute',
                arrowsGuide.style.top = '0px',
                arrowsGuide.style.left = '0px',
                arrowsGuide.style.width = '20px';
                arrowsGuide.style.height = '20px';
                arrowsGuide.style.border = 'solid 1px #000';
                arrowsGuide.style.backgroundColor = 'rgba(0, 0, 0, .35)';
                arrowsGuide.style.borderRadius = '20px';
                mask.appendChild(arrowsGuide);
                let progressBar = document.createElement('div');
                progressBar.style.position = 'absolute',
                progressBar.style.top = '0px',
                progressBar.style.left = '0px',
                progressBar.style.margin = '5px';
                progressBar.style.backgroundColor = 'rgba(0, 0, 0, .35)';
                mask.appendChild(progressBar);
                let stepText = document.createElement('p');
                stepText.setAttribute('id', 'stepText');
                stepText.style.color = '#fff';
                stepText.style.margin = '0px';
                stepText.innerText = 0;
                progressBar.appendChild(stepText);
            });
            await page.waitForFunction(() => document.readyState === 'complete');
            await page.waitForTimeout(1500);
            // 操作部分开始
            ${record}
            // 操作部分结束
            console.log("结束：",new Date());
            await page.waitForFunction(() => document.readyState === 'complete');
            await page.evaluate(() => {
                if (document.getElementById('mask')) {
                    document.getElementById('stepText').innerText = document.getElementById('stepText').innerText + '/结束';
                } else {
                    alert('结束');
                }
            });
            await page.waitForTimeout(1500);
        })();
        `;
        // alert(`操作内容：\n${record}`);
        downloadFullLog(log);
    }


    function downloadFullLog (log) {
        fetch('').then((resp) => resp.arrayBuffer()).then(() => {
            const blob = new Blob([log]);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'indexStart.js';
            a.click();
        });
    }

})();