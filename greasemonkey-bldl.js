// ==UserScript==
// @name     快速复制B站视频元信息
// @version  1
// @grant    none
// ==/UserScript==
// 例如，延迟 2 秒后执行（避免油猴脚本创建div不生效）
console.log('进入猫抓油猴脚本-等待开始')
setTimeout(function () {
  console.log('进入猫抓油猴脚本-等待结束')
    // 在这里编写创建 div 的代码

    var currentUrl = window.location.href;
    var regex = /video\/(.*?)\//; 
    var match = currentUrl.match(regex);
    if (match) { var extractedSubstring = match[1]; console.log(extractedSubstring); } else { console.log("未找到匹配的子串（BV号)"); }
  

    if (currentUrl.includes('www.bilibili.com/video')) {
        // 获取ID为"share-btn-outer"的元素
        var shareBtnOuter = document.getElementById('share-btn-outer');

        // 创建一个新的button元素
        var newButton = document.createElement('button');

        // 设置button的文本为"下载"
        newButton.textContent = '下载';

        // 为button添加点击事件监听器
        newButton.addEventListener('click', function () {

            console.log('当前处在B站视频页')
            //up主名称
            var k = document.getElementsByClassName("up-name")
            if (k.length === 0) { // 联合投稿
                k = document.getElementsByClassName("staff-name is-vip")  // 联合投稿一例 e.g. BV1UJ4m1a7PA
            }            
            var upname = k[0].innerText

            //视频标题
            var t = document.getElementsByClassName("video-title")
            var title = t[0].innerText
            //发布时间
            var r = document.getElementsByClassName("pubdate-text")
            if (r.length === 0) { 
                r = document.getElementsByClassName("pubdate") // 有的视频日期class是pubdate，eg.BV1Fa4y1B7HB
            }
            if (r.length === 0) { 
                r = document.getElementsByClassName("pubdate-ip-text") // 有的视频日期class是pubdate-ip-text，eg.BV1tt42137gD
            }
            var date = r[0].innerText
            var datef = date.substring(0, 10)

            //BV号
            var bv = window.location.href.match( /video\/(.*?)\//)[1];

            //拼接出文件名。
            var output = title.concat('_', datef, '_@', upname, '_', bv)
            console.log(output)
            navigator.clipboard.writeText(output)
                .then(function () {
                    console.log('复制成功！');
                })
                .catch(function (err) {
                    console.error('复制失败：', err);
                });

        });

        // 将新创建的button元素添加到shareBtnOuter元素之后
        shareBtnOuter.insertAdjacentElement('afterend', newButton);
      
       var newButtonWithUrl = document.createElement('button');

        // 设置button的文本为"下载"
        newButtonWithUrl.textContent = '下载带URL';
        newButtonWithUrl.addEventListener('click', function () {

            console.log('当前处在B站视频页')
            //up主名称
            var k = document.getElementsByClassName("up-name")
            if (k.length === 0) { // 联合投稿
                k = document.getElementsByClassName("staff-name is-vip")
            }
            if (k.length === 0) { // 联合投稿 特殊处理 BV18S421P7uM  document.getElementsByClassName("staff-name")[0].innerText 
                k = document.getElementsByClassName("staff-name")
            }
            var upname = k[0].innerText

            //视频标题
            var t = document.getElementsByClassName("video-title")
            var title = t[0].innerText
            //发布时间
            var r = document.getElementsByClassName("pubdate-text")
            if (r.length === 0) { 
                r = document.getElementsByClassName("pubdate") // 有的视频日期class是pubdate，eg.BV1Fa4y1B7HB
            }
            if (r.length === 0) { 
                r = document.getElementsByClassName("pubdate-ip-text") // 有的视频日期class是pubdate-ip-text，eg.BV1tt42137gD
            }
            var date = r[0].innerText
            var datef = date.substring(0, 10)

            //BV号
            var bv = window.location.href.match( /video\/(.*?)\//)[1];
            //简介
            var deskInfo = document.getElementsByClassName("desc-info-text")
            var desc = deskInfo.length > 0 ? deskInfo[0].innerHTML : ''; //有的视频没有简介，故需要判空 e.g. BV11r42187W6 
            // 有的简介有多行，如果.innerText则不能正确换行 e.g. BV1N1421Q78o

            //拼接出文件名。
            var output = title.concat('_', datef, '_@', upname, '_', bv)
            var outputUrl = output.concat('\r\n', desc, '\r\n', 'https://www.bilibili.com/video/', bv)
            console.log(outputUrl)
            navigator.clipboard.writeText(outputUrl)
                .then(function () {
                    console.log('复制成功！');
                })
                .catch(function (err) {
                    console.error('复制失败：', err);
                });

        });
       shareBtnOuter.insertAdjacentElement('afterend', newButtonWithUrl);
    }
}, 3250);
