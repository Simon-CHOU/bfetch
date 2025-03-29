# 批量合并从移动端拷贝的B站缓存文件

```bash
在这个目录下，你可以看到当前的目录下，最深的目录有 audio.m4s 和 video.m4s  ，我想把这个目录下的两个文件合并成一个视频文件，并且以 entry.json 中的信息给对应的视频文件命名<title>_<time_create_stamp(时间戳转为yyyy-MM-dd)>_@<owner_name>_<bvid>，。命令是 ffmpeg -hwaccel vulkan -i "audio.m4s" -i "video.m4s" -c copy "<title>_<time_create_stamp(时间戳转为yyyy-MM-dd)>_@<owner_name>_<bvid>.mp4" 。按个运行，并将所有已经合并的视频mp4保存到 output 目录下。 请你好好思考，给我一个可以在 bash 中执行的命令。
```
