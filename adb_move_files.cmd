@echo off
chcp 65001 > nul


adb shell ls /sdcard/Android/data/tv.danmaku.bili/download #打印出了目标目录中的的文件
adb pull "/sdcard/Android/data/tv.danmaku.bili/download/*" "G:\Realme12Pro+\tv.danmaku.bili\download" #/download/* 要加通配符否则复制整个目录 必须括起来否则+造成参数无效
adb shell rm -r "/sdcard/Android/data/tv.danmaku.bili/download/*"  # /download 会把目录都删除

pause    