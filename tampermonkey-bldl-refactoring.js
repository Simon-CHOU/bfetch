// ==UserScript==
// @name       快速复制B站视频元信息
// @namespace    http://tampermonkey.net/
// @version      2024-04-26
// @description  快速复制B站视频元信息
// @author       You
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/list/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const WAIT_TIME = 3250;
    
    function getUpName() {
        // up主名称
        const upNameElements = document.getElementsByClassName("up-name");
        if (upNameElements.length === 0) { // 联合投稿
            //k = document.getElementsByClassName("staff-name is-vip")  // 联合投稿一例 e.g. BV1UJ4m1a7PA
            return document.getElementsByClassName("staff-name")[0].childNodes[0].textContent; // 联合投稿一例 e.g. BV1Li421h7Kt 只保留第一个
        }
        return upNameElements[0].innerText;
    }

    function getPublishDate() {
        // 发布时间
        const dateClasses = ["pubdate-text", "pubdate", "pubdate-ip-text"];
        let dateElement;
        
        for (const className of dateClasses) {
            dateElement = document.getElementsByClassName(className);
            if (dateElement.length > 0) break;
            // 有的视频日期class是pubdate，eg.BV1Fa4y1B7HB
            // 有的视频日期class是pubdate-ip-text，eg.BV1tt42137gD
        }
        
        return dateElement[0].innerText.substring(0, 10);
    }

    function getBVNumber() {
        // BV号
        return window.location.href.match(/video\/([^/?]+)/)[1];
    }

    function getDescription() {
        // 简介
        const descElement = document.getElementsByClassName("desc-info-text");
        return descElement.length > 0 ? descElement[0].innerHTML : ''; // 有的视频没有简介，故需要判空 e.g. BV11r42187W6
        // 有的简介有多行，如果.innerText则不能正确换行 e.g. BV1N1421Q78o
    }

    function getVideoTitle() {
        // 视频标题
        return document.getElementsByClassName("video-title")[0].innerText;
    }

    function createOutputString(includeUrl = false) {
        const upname = getUpName();
        const title = getVideoTitle();
        const datef = getPublishDate();
        const bv = getBVNumber();
        
        // 拼接出文件名
        let output = `${title}_${datef}_@${upname}_${bv}`;
        
        if (includeUrl) {
            const desc = getDescription();
            output += `\r\n${desc}\r\nhttps://www.bilibili.com/video/${bv}`;
        }
        
        return output;
    }

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text)
            .then(() => console.log('复制成功！'))
            .catch(err => console.error('复制失败：', err));
    }

    function createButton(text, withUrl) {
        // 创建一个新的button元素
        const button = document.createElement('button');
        // 设置button的文本为"下载"
        button.textContent = text;
        button.addEventListener('click', () => {
            console.log('当前处在B站视频页');
            const output = createOutputString(withUrl);
            console.log(output);
            copyToClipboard(output);
        });
        return button;
    }

    function init() {
        console.log('进入猫抓油猴脚本-等待开始');
        
        setTimeout(() => {
            console.log('进入猫抓油猴脚本-等待结束');
            
            const currentUrl = window.location.href;
            if (currentUrl.includes('www.bilibili.com/video')) {
                // 获取ID为"share-btn-outer"的元素
                const shareBtnOuter = document.getElementById('share-btn-outer');
                
                if (shareBtnOuter) {
                    const downloadButton = createButton('下载', false);
                    const downloadWithUrlButton = createButton('下载带URL', true);
                    
                    // 将新创建的button元素添加到shareBtnOuter元素之后
                    shareBtnOuter.insertAdjacentElement('afterend', downloadButton);
                    shareBtnOuter.insertAdjacentElement('afterend', downloadWithUrlButton);
                }
            }
        }, WAIT_TIME);
    }

    init();
})();