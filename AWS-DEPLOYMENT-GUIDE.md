# 🚀 ANSTEYPE ホームページ AWS デプロイメントガイド

## 📋 概要
このガイドでは、ANSTEYPE ホームページをAWS S3 + CloudFrontを使用して静的サイトホスティングする方法を説明します。

## 🛠️ 必要な準備

### 1. AWS CLIのインストール
```bash
# macOSの場合
brew install awscli

# または公式インストーラーを使用
curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
sudo installer -pkg AWSCLIV2.pkg -target /
```

### 2. AWS認証情報の設定
```bash
aws configure
```

以下の情報を入力してください：
- **AWS Access Key ID**: あなたのアクセスキー
- **AWS Secret Access Key**: あなたのシークレットキー
- **Default region name**: `ap-northeast-1` (東京リージョン)
- **Default output format**: `json`

### 3. 必要なAWS権限
以下の権限が必要です：
- S3: フルアクセス
- CloudFront: フルアクセス
- IAM: 読み取り権限

## 🚀 デプロイメント手順

### 自動デプロイメント（推奨）
```bash
# スクリプトに実行権限を付与
chmod +x aws-deploy.sh

# デプロイメント実行
./aws-deploy.sh
```

### 手動デプロイメント

#### 1. S3バケット作成
```bash
# バケット名を設定（ユニークな名前にしてください）
BUCKET_NAME="ansteype-homepage-$(date +%s)"

# バケット作成
aws s3 mb s3://$BUCKET_NAME --region ap-northeast-1
```

#### 2. ファイルアップロード
```bash
# ファイルをS3にアップロード
aws s3 sync . s3://$BUCKET_NAME \
  --exclude "*.git/*" \
  --exclude "*.DS_Store" \
  --exclude "aws-deploy.sh" \
  --exclude "vercel.json" \
  --exclude "README.md"
```

#### 3. CloudFront Distribution作成
```bash
# Origin Access Control作成
aws cloudfront create-origin-access-control \
  --origin-access-control-config file://oac-config.json

# Distribution作成
aws cloudfront create-distribution \
  --distribution-config file://distribution-config.json
```

## 📊 デプロイメント後の確認

### 1. S3バケットの確認
```bash
# バケット一覧表示
aws s3 ls

# バケット内容確認
aws s3 ls s3://your-bucket-name --recursive
```

### 2. CloudFront Distributionの確認
```bash
# Distribution一覧表示
aws cloudfront list-distributions

# Distribution詳細確認
aws cloudfront get-distribution --id YOUR_DISTRIBUTION_ID
```

## 🔧 設定詳細

### S3バケット設定
- **リージョン**: ap-northeast-1 (東京)
- **パブリックアクセス**: ブロック（CloudFront経由のみアクセス可能）
- **バージョニング**: 無効
- **暗号化**: AES-256

### CloudFront設定
- **Origin**: S3バケット
- **キャッシュ動作**: 圧縮有効
- **ビューアープロトコルポリシー**: HTTPS リダイレクト
- **価格クラス**: 全エッジロケーション
- **デフォルトルートオブジェクト**: index.html

## 🌐 カスタムドメイン設定（オプション）

### 1. Route 53でドメイン管理
```bash
# ホストゾーン作成
aws route53 create-hosted-zone --name yourdomain.com --caller-reference $(date +%s)
```

### 2. SSL証明書取得（ACM）
```bash
# 証明書リクエスト（us-east-1リージョンで実行）
aws acm request-certificate \
  --domain-name yourdomain.com \
  --domain-name www.yourdomain.com \
  --validation-method DNS \
  --region us-east-1
```

### 3. CloudFrontにカスタムドメイン設定
- CloudFrontコンソールでDistributionを編集
- Alternate Domain Names (CNAMEs)に独自ドメインを追加
- SSL証明書を選択

## 💰 料金について

### S3料金
- ストレージ: 約¥3/GB/月
- リクエスト: GET 約¥0.04/1000リクエスト

### CloudFront料金
- データ転送: 約¥12/GB（最初の10TB）
- リクエスト: 約¥0.12/10000リクエスト

### 月間予想料金（小規模サイト）
- **S3**: ¥50-100/月
- **CloudFront**: ¥100-500/月
- **合計**: ¥150-600/月

## 🔄 更新手順

### ファイル更新時
```bash
# ファイルをS3に同期
aws s3 sync . s3://your-bucket-name \
  --exclude "*.git/*" \
  --exclude "*.DS_Store" \
  --delete

# CloudFrontキャッシュ無効化
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

## 🛡️ セキュリティ設定

### 1. S3バケットポリシー
CloudFront Origin Access Control (OAC) を使用してS3への直接アクセスを制限

### 2. CloudFront設定
- HTTPS強制リダイレクト
- セキュリティヘッダー追加
- WAF設定（オプション）

## 🚨 トラブルシューティング

### よくある問題

#### 1. 403 Forbidden エラー
- S3バケットポリシーを確認
- Origin Access Control設定を確認

#### 2. ファイルが更新されない
- CloudFrontキャッシュを無効化
- TTL設定を確認

#### 3. CSS/JSが読み込まれない
- ファイルパスを確認（相対パス使用）
- MIMEタイプ設定を確認

### ログ確認
```bash
# CloudFrontアクセスログ有効化
aws cloudfront get-distribution-config --id YOUR_DISTRIBUTION_ID
```

## 📞 サポート

### AWS サポート
- [AWS ドキュメント](https://docs.aws.amazon.com/)
- [AWS サポートセンター](https://console.aws.amazon.com/support/)

### 緊急時の対応
1. CloudFront Distribution無効化
2. S3バケットのパブリックアクセス確認
3. Route 53 DNS設定確認

---

**注意**: このガイドは2024年12月時点の情報です。AWS サービスの仕様変更により手順が変わる可能性があります。 