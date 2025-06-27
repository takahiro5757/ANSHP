#!/bin/bash

# 写真フォルダのパスを修正
find . -type f -name "*.html" -o -name "*.css" -o -name "*.js" | xargs sed -i '' 's|写真フォルダ/hero|assets/images/hero|g'
find . -type f -name "*.html" -o -name "*.css" -o -name "*.js" | xargs sed -i '' 's|写真フォルダ/インタビュー|assets/images/interviews|g'
find . -type f -name "*.html" -o -name "*.css" -o -name "*.js" | xargs sed -i '' 's|写真フォルダ/代表写真|assets/images/ceo|g'

# キャンペーンガールのパスを修正
find . -type f -name "*.html" -o -name "*.css" -o -name "*.js" | xargs sed -i '' 's|キャンペーンガール/|assets/images/campaign-girls/|g'

# 絶対パスで始まる参照を修正
find . -type f -name "*.html" -o -name "*.css" -o -name "*.js" | xargs sed -i '' 's|url(\"/|url(\"|g'

echo "画像パスの修正が完了しました" 