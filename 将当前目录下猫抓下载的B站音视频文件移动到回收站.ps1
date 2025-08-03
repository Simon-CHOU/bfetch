# 将当前目录下猫抓下载的B站音视频文件移动到回收站
# 删除猫抓下载的B站音视频文件（已合并，没用了）
# @author zzh 
# @since 20240726
# https://www.doubao.com/thread/wa4e46e16b028f0df 好使但是没有移动到回收站，而是直接删了
# 定义正则表达式模式
#$pattern = '\d{10}-\d-\d{5}.\w\w4'  这里想的是mp4 但是 还有的格式是 m4s
#$pattern = '\d{10}-\d-\d{5}.(mp4|m4s)'  遇到特殊case   545677085-1-30112.m4s    841662915-1-30080.m4s  前面不够10位，只有9位
#$pattern = '^\d{9,}-\d-\d{5}.(mp4|m4s)$'   # 还有特殊case带下划线 562014495_nb2-1-30080.m4s   562014495_nb2-1-30280.m4s
#$pattern = '^\d{9,}(_\w+)?-\d-\d{5}.(mp4|m4s)$' # 重复的下载 文件名有 (1).mp4 1620582175-1-30280 (1).m4s
#$pattern = '^\d{9,}(_\w+)?-\d-\d{5}( \(\w\))?.(mp4|m4s)$'  #无法特殊case 1627954038_sr1-1-100035.mp4 末尾不是5个数，而是六个数
#$pattern = '^\d{9,}(_\w+)?-\d-\d{5,}( \(\w\))?.(mp4|m4s)$' #无法匹配重复下载的文件，末尾带有(1)的文件 28725874410-1-100027(1).m4s
#$pattern = '^\d{9,}(_\w+)?-\d-\d{5,}( \(\w\))?(\(1\))?.(mp4|m4s)$'

# 优化后的正则表达式模式 - 支持更多B站音视频文件格式
# 模式说明：
# ^\d{8,}        : 开头8位或更多数字（视频ID）
# (_[a-zA-Z0-9]+)? : 可选的下划线+字母数字组合（如_nb2, _da2, _x1, _sr1等）
# -\d+           : 连字符+一个或多个数字
# -\d{5,}        : 连字符+5位或更多数字
# ( ?\(\d+\))?   : 可选的空格（可有可无）+括号内数字（重复下载标记，如 (1) 或(1)）
# \.(mp4|m4s)    : 文件扩展名
$pattern = '^\d{8,}(_[a-zA-Z0-9]+)?-\d+-\d{5,}( ?\(\d+\))?\.(mp4|m4s)$'

#调试regexp 在 https://regex101.com/

# 测试模式匹配（可选 - 用于验证正则表达式）
# 取消注释下面的代码块来测试正则表达式
<#
Write-Host "测试正则表达式模式匹配："
$testFiles = @(
    "50106300_da2-1-100027.m4s",
    "67176396_nb2-1-30232.m4s", 
    "81056567-1-30112.m4s",
    "81056726-1-30280 (1).m4s",
    "50106300_da2-1-30280.m4s",
    "67735863_nb2-1-30112.m4s",
    "81056567-1-30280.m4s",
    "81056726-1-30280.m4s",
    "63667809-1-30280.m4s",
    "67735863_nb2-1-30280.m4s",
    "81056645-1-30112.m4s",
    "99672346-1-30064.m4s",
    "63667809_x1-1-30102.m4s",
    "74681816-1-100027.m4s",
    "81056645-1-30280.m4s",
    "99672346-1-30216.m4s",
    "67176396_nb2-1-30064.m4s",
    "74681816_nb2-1-30280.m4s",
    "81056726-1-30112.m4s"
)

foreach ($testFile in $testFiles) {
    if ($testFile -match $pattern) {
        Write-Host "✓ 匹配: $testFile" -ForegroundColor Green
    } else {
        Write-Host "✗ 不匹配: $testFile" -ForegroundColor Red
    }
}
Write-Host "`n继续执行文件删除操作..."
#>

# 获取当前目录下的文件
#$files = Get-ChildItem -File
# 获取指定目录下的文件 下载目录  浏览器插件猫抓下载的音视频文件默认都在此
$files = Get-ChildItem -File -Path "C:\Users\simon\Downloads"
#$files = Get-ChildItem -File -Path "I:\web-videos\"

# 遍历文件
foreach ($file in $files) {
    # 如果文件名匹配正则表达式
    if ($file.Name -match $pattern) {
        # 移动文件到回收站
        #Remove-Item $file.FullName -Recurse -Force -ErrorAction SilentlyContinue
         # https://stackoverflow.com/questions/502002/how-do-i-move-a-file-to-the-recycle-bin-using-powershell  不好使
        #Remove-Item $file.FullName -RecycleBin
        #https://www.google.com/search?client=firefox-b-d&q=powershell+remove-item+to+recycle+bin
        # https://stackoverflow.com/questions/502002/how-do-i-move-a-file-to-the-recycle-bin-using-powershell 安装一个回收模块即可  
        Remove-ItemSafely  $file.FullName
    }
}