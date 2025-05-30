#!/bin/bash
# 输出 HTTP 头部
echo "Content-Type: text/plain; charset=utf-8"
echo "" # 空行分隔头部和主体

# 输出响应主体
echo "脚本成功执行！"
echo "QUERY_STRING was: $QUERY_STRING"


# 修改为绝对路径（关键修复）
POSTS_DIR="/Users/bytedance/Desktop/work/fun/dragonclouder.github.io/_posts"

# 获取当前日期(格式：YYYY-MM-DD)
DATE=$(date +'%Y-%m-%d-%H:%M:%S %z')

# 从URL参数提取标题(支持中文)
title=$(echo "$QUERY_STRING" | sed -n 's/.*title=\([^&]*\).*/\1/p' | sed 's/+/ /g' | iconv -f utf-8 -t utf-8)

# URL解码处理
title=$(printf "%b" "${title//%/\\x}")

# 设置默认标题
[ -z "$title" ] && title="新帖子"

# 生成规范化文件名
FILENAME=$(echo "$title" | 
    iconv -t utf-8 |  # 确保字符编码正确
    tr ' ' '-' |      # 空格转连字符
    tr '[:upper:]' '[:lower:]') # 转小写

# 构建完整文件路径
FULL_PATH="$POSTS_DIR/$DATE-$FILENAME.md"

# 创建Markdown文件(包含Jekyll Front Matter)
cat << EOF > "$FULL_PATH"
---
layout: post
title: "$title"
date: $(date +'%Y-%m-%d %H:%M:%S %z')
categories: [默认分类]
pin: false
---

## 主要内容
<!-- 开始编写您的内容 -->
EOF

# 修改后的输出部分
if [ -f "$FULL_PATH" ]; then
    echo "新文章已创建：$FULL_PATH"
else
    echo "Status: 500 Internal Server Error"
    echo "Content-Type: text/plain; charset=utf-8"
    echo ""
    echo "文件创建失败：检查目录权限和路径配置"
    exit 1
fi

# 添加环境变量验证（调试用）
echo "DEBUG: DOCUMENT_ROOT=$DOCUMENT_ROOT" 1>&2
echo "DEBUG: SCRIPT_FILENAME=$SCRIPT_FILENAME" 1>&2
echo "DEBUG: WORKSPACE_FOLDER=$WORKSPACE_FOLDER" 1>&2