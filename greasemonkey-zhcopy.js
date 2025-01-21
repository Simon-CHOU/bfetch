// ==UserScript==
// @name         知乎回答复制助手
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  在知乎回答底部添加复制全文按钮，复制时自动清理格式
// @author       Your name
// @match        https://www.zhihu.com/*
// @match        https://www.zhihu.com/question/*
// @match        https://www.zhihu.com/answer/*
// @grant        GM_setClipboard
// ==/UserScript==

(function () {
    'use strict';

    // 添加按钮样式
    const style = document.createElement('style');
    style.textContent = `
        .copy-full-text-btn {
            margin-left: 12px;
            padding: 0;
            color: #8590a6;
            background: none;
            border: none;
            cursor: pointer;
            font-size: 14px;
            display: inline-flex;
            align-items: center;
        }
        .copy-full-text-btn:hover {
            color: #76839b;
        }
        .copy-icon {
            margin-right: 4px;
            display: inline-flex;
            align-items: center;
        }
    `;
    document.head.appendChild(style);

    // 监听页面变化
    const observer = new MutationObserver((mutations) => {
        const actionBars = document.querySelectorAll('.ContentItem-actions');
        actionBars.forEach(actionBar => {
            if (!actionBar.querySelector('.copy-full-text-btn')) {
                addCopyButton(actionBar);
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 添加复制按钮
    function addCopyButton(actionBar) {
        console.log('开始添加复制按钮');
        const button = document.createElement('button');
        button.className = 'Button ContentItem-action copy-full-text-btn FEfUrdfMIKpQDJDqkjte Button--plain Button--withIcon Button--withLabel';
        
        button.innerHTML = `
            <span style="display: inline-flex; align-items: center;" class="copy-icon">
                <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 14H5V6h14v12z"/>
                    <path d="M7 8h10v2H7zm0 4h10v2H7z"/>
                </svg>
            </span>复制全文`;
        
        button.onclick = () => {
            console.log('点击了复制按钮');
            
            // 找到对应的内容区域
            const contentItem = actionBar.closest('.RichContent');
            console.log('找到 RichContent:', contentItem ? '是' : '否');
            if (!contentItem) {
                console.error('未找到 .RichContent 元素');
                return;
            }
            
            const richContentInner = contentItem.querySelector('.RichContent-inner');
            console.log('找到 RichContent-inner:', richContentInner ? '是' : '否');
            if (!richContentInner) {
                console.error('未找到 .RichContent-inner 元素');
                return;
            }

            const richText = richContentInner.querySelector('.RichText');
            console.log('找到 RichText:', richText ? '是' : '否');
            if (!richText) {
                console.error('未找到 .RichText 元素');
                return;
            }

            console.log('原始HTML内容:', richText.innerHTML);

            // 创建一个临时元素来处理内容
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = richText.innerHTML;

            // 删除所有 SVG 元素
            const svgs = tempDiv.getElementsByTagName('svg');
            console.log('需要删除的SVG数量:', svgs.length);
            while (svgs.length > 0) {
                svgs[0].parentNode.removeChild(svgs[0]);
            }

            // 处理链接：保留文本和格式，但移除href属性
            const links = tempDiv.getElementsByTagName('a');
            console.log('需要处理的链接数量:', links.length);
            Array.from(links).forEach(link => {
                const span = document.createElement('span');
                span.innerHTML = link.innerHTML;  // 保留内部HTML
                // 复制所有class以保持样式
                if (link.className) {
                    span.className = link.className;
                }
                // 复制其他样式相关属性
                if (link.style.cssText) {
                    span.style.cssText = link.style.cssText;
                }
                link.parentNode.replaceChild(span, link);
            });

            // 保留特定的HTML标签和属性
            const cleanHtml = tempDiv.innerHTML
                .replace(/<img[^>]*>/g, '') // 移除图片
                .replace(/<iframe[^>]*>.*?<\/iframe>/g, '') // 移除iframe
                .replace(/<script[^>]*>.*?<\/script>/g, '') // 移除脚本
                .replace(/<style[^>]*>.*?<\/style>/g, '') // 移除样式表
                .replace(/class="[^"]*"/g, '') // 移除class属性
                .replace(/id="[^"]*"/g, '') // 移除id属性
                .replace(/data-[^=]*="[^"]*"/g, '') // 移除data属性
                .replace(/style="[^"]*"/g, '') // 移除内联样式
                .replace(/contenteditable="[^"]*"/g, '') // 移除contenteditable属性
                .replace(/tabindex="[^"]*"/g, '') // 移除tabindex属性
                .replace(/<\/?div[^>]*>/g, '\n') // 将div转换为换行
                .replace(/<p[^>]*>/g, '\n') // 段落开始添加换行
                .replace(/<\/p>/g, '\n') // 段落结束添加换行
                .replace(/\n\s*\n/g, '\n\n') // 合并多个换行
                .trim(); // 移除首尾空白

            tempDiv.innerHTML = cleanHtml;
            
            // 获取处理后的文本，保留基本格式
            const cleanText = tempDiv.innerHTML;
            console.log('处理后的文本:', cleanText);
            
            // 复制到剪贴板，使用 text/html 格式
            try {
                // 尝试使用 GM_setClipboard
                GM_setClipboard(cleanText, 'text/html');
                console.log('使用 GM_setClipboard 复制成功');
            } catch (error) {
                console.error('GM_setClipboard 失败:', error);
                try {
                    // 备用方案：使用 navigator.clipboard
                    const clipboardItem = new ClipboardItem({
                        'text/html': new Blob([cleanText], { type: 'text/html' }),
                        'text/plain': new Blob([tempDiv.innerText], { type: 'text/plain' })
                    });
                    navigator.clipboard.write([clipboardItem]).then(() => {
                        console.log('使用 navigator.clipboard 复制成功');
                    }).catch((err) => {
                        console.error('navigator.clipboard 失败:', err);
                        // 最后的备用方案
                        const textarea = document.createElement('textarea');
                        textarea.innerHTML = cleanText;
                        document.body.appendChild(textarea);
                        textarea.select();
                        const success = document.execCommand('copy');
                        document.body.removeChild(textarea);
                        if (success) {
                            console.log('使用 execCommand 复制成功');
                        } else {
                            console.error('所有复制方法都失败了');
                        }
                    });
                } catch (clipboardError) {
                    console.error('所有复制方法都失败了:', clipboardError);
                }
            }
            
            // 更新按钮文本提示
            button.innerHTML = `
                <span style="display: inline-flex; align-items: center;" class="copy-icon">
                    <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                    </svg>
                </span>已复制！`;
            console.log('更新按钮状态为"已复制"');
            
            setTimeout(() => {
                button.innerHTML = `
                    <span style="display: inline-flex; align-items: center;" class="copy-icon">
                        <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 14H5V6h14v12z"/>
                            <path d="M7 8h10v2H7zm0 4h10v2H7z"/>
                        </svg>
                    </span>复制全文`;
                console.log('重置按钮状态为"复制全文"');
            }, 2000);
        };

        actionBar.appendChild(button);
        console.log('复制按钮添加完成');
    }

    // 初始化：为页面上已有的操作栏添加复制按钮
    const existingActionBars = document.querySelectorAll('.ContentItem-actions');
    existingActionBars.forEach(actionBar => {
        addCopyButton(actionBar);
    });
})();