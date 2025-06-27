#!/bin/bash

# ANSTEYPE ホームページ AWS デプロイメントスクリプト
# S3 + CloudFront を使用した静的サイトホスティング

echo "🚀 ANSTEYPE ホームページ AWS デプロイメント開始"

# 設定変数
BUCKET_NAME="ansteype-homepage-$(date +%s)"
REGION="ap-northeast-1"  # 東京リージョン
CLOUDFRONT_COMMENT="ANSTEYPE Homepage Distribution"

echo "📦 使用するバケット名: $BUCKET_NAME"
echo "🌏 リージョン: $REGION"

# S3バケット作成
echo "1️⃣ S3バケットを作成中..."
aws s3 mb s3://$BUCKET_NAME --region $REGION

if [ $? -eq 0 ]; then
    echo "✅ S3バケット作成完了: $BUCKET_NAME"
else
    echo "❌ S3バケット作成に失敗しました"
    exit 1
fi

# ファイルをS3にアップロード
echo "2️⃣ ファイルをS3にアップロード中..."
aws s3 sync . s3://$BUCKET_NAME --exclude "*.git/*" --exclude "*.DS_Store" --exclude "aws-deploy.sh" --exclude "vercel.json" --exclude "README.md"

if [ $? -eq 0 ]; then
    echo "✅ ファイルアップロード完了"
else
    echo "❌ ファイルアップロードに失敗しました"
    exit 1
fi

# S3バケットポリシー設定（CloudFront用）
echo "3️⃣ S3バケットポリシーを設定中..."
cat > bucket-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowCloudFrontServicePrincipal",
            "Effect": "Allow",
            "Principal": {
                "Service": "cloudfront.amazonaws.com"
            },
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
        }
    ]
}
EOF

aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file://bucket-policy.json

# CloudFront Origin Access Control作成
echo "4️⃣ CloudFront Origin Access Control作成中..."
OAC_CONFIG='{
    "Name": "ANSTEYPE-OAC",
    "Description": "Origin Access Control for ANSTEYPE Homepage",
    "OriginAccessControlConfig": {
        "Name": "ANSTEYPE-OAC",
        "Description": "Origin Access Control for ANSTEYPE Homepage",
        "SigningProtocol": "sigv4",
        "SigningBehavior": "always",
        "OriginAccessControlOriginType": "s3"
    }
}'

OAC_ID=$(aws cloudfront create-origin-access-control --origin-access-control-config "$OAC_CONFIG" --query 'OriginAccessControl.Id' --output text)

echo "✅ Origin Access Control作成完了: $OAC_ID"

# CloudFront Distribution設定
echo "5️⃣ CloudFront Distribution作成中..."
cat > distribution-config.json << EOF
{
    "CallerReference": "ansteype-$(date +%s)",
    "Comment": "$CLOUDFRONT_COMMENT",
    "DefaultRootObject": "index.html",
    "Origins": {
        "Quantity": 1,
        "Items": [
            {
                "Id": "$BUCKET_NAME-origin",
                "DomainName": "$BUCKET_NAME.s3.$REGION.amazonaws.com",
                "S3OriginConfig": {
                    "OriginAccessIdentity": ""
                },
                "OriginAccessControlId": "$OAC_ID"
            }
        ]
    },
    "DefaultCacheBehavior": {
        "TargetOriginId": "$BUCKET_NAME-origin",
        "ViewerProtocolPolicy": "redirect-to-https",
        "TrustedSigners": {
            "Enabled": false,
            "Quantity": 0
        },
        "ForwardedValues": {
            "QueryString": false,
            "Cookies": {
                "Forward": "none"
            }
        },
        "MinTTL": 0,
        "Compress": true
    },
    "Enabled": true,
    "PriceClass": "PriceClass_All"
}
EOF

DISTRIBUTION_ID=$(aws cloudfront create-distribution --distribution-config file://distribution-config.json --query 'Distribution.Id' --output text)

if [ $? -eq 0 ]; then
    echo "✅ CloudFront Distribution作成完了: $DISTRIBUTION_ID"
    
    # Distribution詳細取得
    DOMAIN_NAME=$(aws cloudfront get-distribution --id $DISTRIBUTION_ID --query 'Distribution.DomainName' --output text)
    
    echo ""
    echo "🎉 デプロイメント完了！"
    echo "📋 デプロイメント情報:"
    echo "   S3バケット: $BUCKET_NAME"
    echo "   CloudFront Distribution ID: $DISTRIBUTION_ID"
    echo "   CloudFront URL: https://$DOMAIN_NAME"
    echo ""
    echo "⏰ CloudFrontの配信開始まで5-15分程度お待ちください"
    echo "🌐 サイトURL: https://$DOMAIN_NAME"
    
    # 設定情報をファイルに保存
    cat > aws-deployment-info.txt << EOF
ANSTEYPE ホームページ AWS デプロイメント情報
デプロイ日時: $(date)

S3バケット名: $BUCKET_NAME
リージョン: $REGION
CloudFront Distribution ID: $DISTRIBUTION_ID
CloudFront URL: https://$DOMAIN_NAME
Origin Access Control ID: $OAC_ID

注意: CloudFrontの配信開始まで5-15分程度かかります
EOF
    
    echo "📄 デプロイメント情報を aws-deployment-info.txt に保存しました"
    
else
    echo "❌ CloudFront Distribution作成に失敗しました"
    exit 1
fi

# 一時ファイル削除
rm -f bucket-policy.json distribution-config.json

echo "🧹 一時ファイルを削除しました"
echo "✨ デプロイメント完了！" 