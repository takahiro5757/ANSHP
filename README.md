# ANSTEYPE ホームページ

ANSTEYPEの公式ホームページです。

## プロジェクト概要

多様性を認め合える世界へ向けて、かけがえのない仲間との出会いが次の未来を創り出すことをコンセプトとした企業サイトです。

## 技術スタック

- HTML5
- CSS3
- JavaScript (ES6+)
- Bootstrap 5
- jQuery
- GSAP (アニメーション)
- AOS (スクロールアニメーション)
- Font Awesome

## ファイル構成

```
/
├── index.html              # トップページ
├── pages/                  # 各種ページ
│   ├── about/             # 会社概要
│   ├── contact/           # お問い合わせ
│   ├── interview/         # インタビュー
│   └── recruit/           # 採用情報
├── assets/                # 静的ファイル
│   ├── css/              # スタイルシート
│   ├── js/               # JavaScript
│   ├── images/           # 画像ファイル
│   └── videos/           # 動画ファイル
└── buckpu0516/           # バックアップ
```

## 開発環境

### ローカルサーバーの起動

```bash
# Python 3を使用
python3 -m http.server 8000

# または別のポート
python3 -m http.server 8001
```

ブラウザで `http://localhost:8000` にアクセス

### CSS管理ルール

- `/assets/css/base/` - 基本設定（変数、リセット、タイポグラフィ）
- `/assets/css/components/` - 共通コンポーネント
- `/assets/css/pages/` - ページ固有スタイル
- `responsive.css` - メディアクエリを集約

### 主な機能

- レスポンシブデザイン
- スクロールアニメーション
- 動画背景
- インタラクティブなカード効果
- モバイル対応ナビゲーション

## デプロイ

静的サイトのため、以下のサービスでホスティング可能：

- GitHub Pages
- Netlify
- Vercel
- AWS S3 + CloudFront

## ライセンス

© 2024 ANSTEYPE. All rights reserved. 