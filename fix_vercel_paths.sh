#!/bin/bash

# Vercel用の画像パス修正スクリプト

echo "画像パスを絶対パスに修正中..."

# HTMLファイル内の相対パスを絶対パスに変更
find . -name "*.html" -type f -exec sed -i '' \
    -e 's|src="assets/images/|src="/assets/images/|g' \
    -e 's|src="../../assets/images/|src="/assets/images/|g' \
    -e 's|src="../../../assets/images/|src="/assets/images/|g' \
    -e 's|src="../../../../assets/images/|src="/assets/images/|g' \
    {} \;

# CSSファイル内の相対パスを絶対パスに変更
find . -name "*.css" -type f -exec sed -i '' \
    -e 's|url('\''../../images/|url('\''/assets/images/|g' \
    -e 's|url('\''../../../images/|url('\''/assets/images/|g' \
    -e 's|url('\''../../../../images/|url('\''/assets/images/|g' \
    -e 's|url("../../images/|url("/assets/images/|g' \
    -e 's|url("../../../images/|url("/assets/images/|g' \
    -e 's|url("../../../../images/|url("/assets/images/|g' \
    {} \;

echo "修正完了！" 