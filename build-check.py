#!/usr/bin/env python3
"""
ANSTEYPE ホームページ ビルド検証スクリプト
"""

import os
import sys
from pathlib import Path

def check_file_exists(file_path, description):
    """ファイルの存在をチェック"""
    if os.path.exists(file_path):
        print(f"✓ {description}: {file_path}")
        return True
    else:
        print(f"✗ {description}: {file_path} が見つかりません")
        return False

def check_directory_exists(dir_path, description):
    """ディレクトリの存在をチェック"""
    if os.path.isdir(dir_path):
        print(f"✓ {description}: {dir_path}")
        return True
    else:
        print(f"✗ {description}: {dir_path} が見つかりません")
        return False

def main():
    """メイン検証処理"""
    print("ANSTEYPE ホームページ ビルド検証開始\n")
    
    errors = 0
    
    # 必須HTMLファイルのチェック
    print("=== HTMLファイルチェック ===")
    html_files = [
        ("index.html", "トップページ"),
        ("pages/about/index.html", "会社概要ページ"),
        ("pages/contact/index.html", "お問い合わせページ"),
        ("pages/recruit/index.html", "採用情報ページ"),
        ("pages/interview/index.html", "インタビューページ"),
    ]
    
    for file_path, description in html_files:
        if not check_file_exists(file_path, description):
            errors += 1
    
    # 必須CSSファイルのチェック
    print("\n=== CSSファイルチェック ===")
    css_files = [
        ("assets/css/base/variables.css", "CSS変数"),
        ("assets/css/base/reset.css", "CSSリセット"),
        ("assets/css/components/header.css", "ヘッダーCSS"),
        ("assets/css/components/footer.css", "フッターCSS"),
        ("assets/css/pages/home.css", "ホームページCSS"),
        ("assets/css/footer-override.css", "フッター上書きCSS"),
        ("assets/css/hero-title-override.css", "ヒーロータイトル上書きCSS"),
    ]
    
    for file_path, description in css_files:
        if not check_file_exists(file_path, description):
            errors += 1
    
    # 必須JavaScriptファイルのチェック
    print("\n=== JavaScriptファイルチェック ===")
    js_files = [
        ("assets/js/main.js", "メインJavaScript"),
        ("assets/js/common.js", "共通JavaScript"),
    ]
    
    for file_path, description in js_files:
        if not check_file_exists(file_path, description):
            errors += 1
    
    # 必須画像ファイルのチェック
    print("\n=== 画像ファイルチェック ===")
    image_files = [
        ("assets/images/backgrounds/blue-gradient.webp", "青いグラデーション背景"),
        ("assets/images/logo_loading.png", "ロゴ画像"),
    ]
    
    for file_path, description in image_files:
        if not check_file_exists(file_path, description):
            errors += 1
    
    # ディレクトリ構造のチェック
    print("\n=== ディレクトリ構造チェック ===")
    directories = [
        ("assets", "アセットディレクトリ"),
        ("assets/css", "CSSディレクトリ"),
        ("assets/js", "JavaScriptディレクトリ"),
        ("assets/images", "画像ディレクトリ"),
        ("pages", "ページディレクトリ"),
    ]
    
    for dir_path, description in directories:
        if not check_directory_exists(dir_path, description):
            errors += 1
    
    # 結果表示
    print(f"\n=== 検証結果 ===")
    if errors == 0:
        print("✓ すべてのチェックが正常に完了しました！")
        print("ビルドの準備ができています。")
        return 0
    else:
        print(f"✗ {errors}個のエラーが見つかりました。")
        print("エラーを修正してから再度実行してください。")
        return 1

if __name__ == "__main__":
    sys.exit(main()) 