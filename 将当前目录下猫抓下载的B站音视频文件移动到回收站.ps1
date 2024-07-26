# 将当前目录下猫抓下载的B站音视频文件移动到回收站
# 删除猫抓下载的B站音视频文件（已合并，没用了）
# @author zzh 
# @since 20240726
# https://www.doubao.com/thread/wa4e46e16b028f0df 好使但是没有移动到回收站，而是直接删了
# 定义正则表达式模式
#$pattern = '\d{10}-\d-\d{5}.\w\w4'  这里想的是mp4 但是 还有的格式是 m4s
#$pattern = '\d{10}-\d-\d{5}.(mp4|m4s)'  遇到特殊case   545677085-1-30112.m4s    841662915-1-30080.m4s  前面不够10位，只有9位
#$pattern = '^\d{9,}-\d-\d{5}.(mp4|m4s)$'   # 还有特殊case带下划线 562014495_nb2-1-30080.m4s   562014495_nb2-1-30280.m4s
$pattern = '^\d{9,}(_\w+)?-\d-\d{5}.(mp4|m4s)$'

#调试regexp 在 https://regex101.com/

# 获取当前目录下的文件
$files = Get-ChildItem -File

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