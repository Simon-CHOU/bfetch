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
        
        button.onclick = async () => {
            console.log('点击了复制按钮');
            
            // 找到分享按钮
            const shareMenuDiv = actionBar.querySelector('.ShareMenu');
            const shareButton = shareMenuDiv?.querySelector('button');
            console.log('找到分享按钮:', shareButton ? '是' : '否');
            
            let shareLink = '';
            if (shareButton) {
                // 保存当前剪贴板内容
                let originalClipboard = '';
                try {
                    originalClipboard = await navigator.clipboard.readText();
                } catch (error) {
                    console.error('读取原始剪贴板内容失败:', error);
                }

                // 模拟点击分享按钮
                shareButton.click();
                console.log('已点击分享按钮');
                
                // 等待分享菜单出现并复制链接
                await new Promise(resolve => setTimeout(resolve, 100));
                
                try {
                    shareLink = await navigator.clipboard.readText();
                    // 验证获取的是分享链接而不是完整内容
                    if (shareLink.includes('发布时间：')) {
                        console.log('获取到的不是分享链接，清空');
                        shareLink = '';
                    } else {
                        console.log('获取到分享链接:', shareLink);
                    }
                    
                    // 恢复原始剪贴板内容
                    if (originalClipboard) {
                        await navigator.clipboard.writeText(originalClipboard);
                    }
                } catch (error) {
                    console.error('获取分享链接失败:', error);
                }
                
                // 关闭分享菜单
                shareButton.click();
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            // 获取正文内容
            const contentItem = actionBar.closest('.RichContent');
            if (!contentItem) {
                console.error('未找到 .RichContent 元素');
                return;
            }
            
            // 获取发布日期
            const timeDiv = contentItem.querySelector('.ContentItem-time span');
            let publishDate = '';
            if (timeDiv) {
                const dateMatch = timeDiv.getAttribute('data-tooltip')?.match(/发布于\s*(.*)/);
                publishDate = dateMatch ? dateMatch[1].trim() : '';
                console.log('找到发布日期:', publishDate);
            } else {
                console.log('未找到发布日期元素');
            }
            
            const richContentInner = contentItem.querySelector('.RichContent-inner');
            if (!richContentInner) {
                console.error('未找到 .RichContent-inner 元素');
                return;
            }

            const richText = richContentInner.querySelector('.RichText');
            if (!richText) {
                console.error('未找到 .RichText 元素');
                return;
            }

            // 每次都从原始内容创建新的临时元素
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = richText.innerHTML;

            // 删除SVG
            const svgs = tempDiv.getElementsByTagName('svg');
            while (svgs.length > 0) {
                svgs[0].parentNode.removeChild(svgs[0]);
            }

            // 处理链接
            const links = tempDiv.getElementsByTagName('a');
            Array.from(links).forEach(link => {
                const span = document.createElement('span');
                span.innerHTML = link.innerHTML;
                if (link.className) {
                    span.className = link.className;
                }
                if (link.style.cssText) {
                    span.style.cssText = link.style.cssText;
                }
                link.parentNode.replaceChild(span, link);
            });

            // 组合内容时使用原始内容
            let combinedContent = tempDiv.innerHTML;
            if (shareLink) {
                combinedContent += `<br><br>分享链接：${shareLink}`;
            }
            if (publishDate) {
                combinedContent += `<br><br>发布时间：${publishDate}`;
            }

            // 复制到剪贴板
            try {
                GM_setClipboard(combinedContent, 'text/html');
                console.log('使用 GM_setClipboard 复制成功');
            } catch (error) {
                console.error('GM_setClipboard 失败:', error);
                try {
                    const clipboardItem = new ClipboardItem({
                        'text/html': new Blob([combinedContent], { type: 'text/html' }),
                        'text/plain': new Blob([tempDiv.innerText + (shareLink ? `\n\n分享链接：${shareLink}` : '') + (publishDate ? `\n\n发布时间：${publishDate}` : '')], { type: 'text/plain' })
                    });
                    await navigator.clipboard.write([clipboardItem]);
                    console.log('使用 navigator.clipboard 复制成功');
                } catch (err) {
                    console.error('navigator.clipboard 失败:', err);
                    const textarea = document.createElement('textarea');
                    textarea.innerHTML = combinedContent;
                    document.body.appendChild(textarea);
                    textarea.select();
                    const success = document.execCommand('copy');
                    document.body.removeChild(textarea);
                    if (success) {
                        console.log('使用 execCommand 复制成功');
                    } else {
                        console.error('所有复制方法都失败了');
                    }
                }
            }

            // 更新按钮状态
            button.innerHTML = `
                <span style="display: inline-flex; align-items: center;" class="copy-icon">
                    <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                    </svg>
                </span>已复制！`;
            
            setTimeout(() => {
                button.innerHTML = `
                    <span style="display: inline-flex; align-items: center;" class="copy-icon">
                        <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 14H5V6h14v12z"/>
                            <path d="M7 8h10v2H7zm0 4h10v2H7z"/>
                        </svg>
                    </span>复制全文`;
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