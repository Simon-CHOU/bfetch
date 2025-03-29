#!/bin/bash

# 获取脚本所在目录的绝对路径
script_dir=$(cd "$(dirname "$0")" && pwd)
output_dir="$script_dir/output"

# 创建output目录
mkdir -p "$output_dir"

# 遍历所有包含entry.json的目录
find . -name "entry.json" | while read json_file; do
    dir_path=$(dirname "$json_file")
    if ! cd "$dir_path" 2>/dev/null; then
        echo "错误: 无法进入目录 $dir_path"
        continue
    fi

    # 解析entry.json获取元数据
    title=$(jq -r '.title' entry.json)
    time_create_stamp=$(jq -r '.time_create_stamp' entry.json)
    owner_name=$(jq -r '.owner_name' entry.json)
    bvid=$(jq -r '.bvid' entry.json)

    # 转换时间戳为yyyy-MM-dd格式
    create_date=$(date -d "@$(($time_create_stamp/1000))" +"%Y-%m-%d")

    # 构建安全的输出文件名（替换特殊字符）
    safe_title=$(echo "$title" | sed 's/[\\\/:*?"<>|]//g')
    output_filename="${safe_title}_${create_date}_@${owner_name}_${bvid}.mp4"

    # 查找音频和视频文件（检查所有可能的子目录）
    audio_file=$(find . -name "audio.m4s" -print -quit)
    video_file=$(find . -name "video.m4s" -print -quit)

    # 检查是否存在音频和视频文件
    if [[ -f "$audio_file" && -f "$video_file" ]]; then
        # 使用绝对路径输出文件，强制覆盖已存在文件
        ffmpeg -y -hwaccel vulkan -i "$audio_file" -i "$video_file" -c copy "$output_dir/$output_filename"
        echo "已合并: $output_filename"
    else
        echo "警告: $dir_path 缺少音频或视频文件"
    fi

    cd - >/dev/null || exit
done

echo "所有视频处理完成，已保存到 $output_dir"