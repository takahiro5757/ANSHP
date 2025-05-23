<?php
// エラー表示設定
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CSS保存処理
$message = '';
$componentContent = '';
$componentFile = '';
$componentName = '';

// コンポーネントディレクトリパス
$componentsDir = '../../assets/css/components/';

// 利用可能なコンポーネントファイル一覧を取得
$componentFiles = glob($componentsDir . '*.css');

// POSTリクエスト処理（コンポーネント保存）
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['save_component'])) {
    $componentFile = $_POST['component_file'];
    $componentContent = $_POST['component_content'];
    
    // ファイルパスの検証（セキュリティ対策）
    if (strpos($componentFile, '..') !== false) {
        $message = '不正なファイルパスです。';
    } else {
        // ファイルに保存
        $fullPath = $componentsDir . $componentFile;
        if (file_put_contents($fullPath, $componentContent)) {
            $message = 'コンポーネントが保存されました。';
        } else {
            $message = 'コンポーネントの保存に失敗しました。';
        }
    }
}

// GETリクエスト処理（コンポーネント読み込み）
if (isset($_GET['file'])) {
    $requestedFile = $_GET['file'];
    
    // ファイルパスの検証（セキュリティ対策）
    if (strpos($requestedFile, '..') !== false) {
        $message = '不正なファイルパスです。';
    } else {
        $fullPath = $componentsDir . $requestedFile;
        if (file_exists($fullPath)) {
            $componentFile = $requestedFile;
            $componentContent = file_get_contents($fullPath);
            $componentName = pathinfo($requestedFile, PATHINFO_FILENAME);
        } else {
            $message = 'ファイルが見つかりません。';
        }
    }
}
?>

<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>コンポーネント編集 | ANSTEYPE</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- CodeMirror CSS -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/theme/dracula.min.css">
    <!-- Custom CSS -->
    <link rel="stylesheet" href="/assets/css/base/reset.css">
    <link rel="stylesheet" href="/assets/css/base/variables.css">
    <link rel="stylesheet" href="/assets/css/base/typography.css">
    <style>
        body {
            background-color: #f8f9fa;
            padding: 50px 0;
        }
        .editor-container {
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
            padding: 30px;
            margin-bottom: 30px;
        }
        .editor-title {
            margin-bottom: 30px;
            color: var(--primary-color);
            font-weight: 700;
            font-size: 2rem;
        }
        .component-list {
            list-style-type: none;
            padding-left: 0;
        }
        .component-list li {
            margin-bottom: 10px;
        }
        .component-list a {
            display: block;
            padding: 10px 15px;
            background-color: #f8f9fa;
            border-radius: 5px;
            color: var(--primary-color);
            text-decoration: none;
            transition: all 0.3s ease;
        }
        .component-list a:hover, 
        .component-list a.active {
            background-color: var(--primary-color);
            color: #ffffff;
        }
        .code-editor {
            border: 1px solid #ddd;
            border-radius: 5px;
            min-height: 500px;
        }
        .CodeMirror {
            height: 500px;
            font-family: monospace;
            font-size: 14px;
        }
        .preview-area {
            padding: 30px;
            border: 1px solid #ddd;
            border-radius: 5px;
            min-height: 300px;
            background-color: #ffffff;
            margin-top: 20px;
        }
        .dark-preview {
            background-color: #343a40;
            color: #ffffff;
        }
        .success-message {
            background-color: #d4edda;
            color: #155724;
            padding: 10px 15px;
            border-radius: 5px;
            margin-bottom: 15px;
        }
        .error-message {
            background-color: #f8d7da;
            color: #721c24;
            padding: 10px 15px;
            border-radius: 5px;
            margin-bottom: 15px;
        }
        .save-button {
            background-color: var(--primary-color);
            color: #ffffff;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .save-button:hover {
            background-color: var(--secondary-color);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="row">
            <div class="col-lg-3">
                <div class="editor-container">
                    <h3>コンポーネント一覧</h3>
                    <ul class="component-list">
                        <?php foreach ($componentFiles as $file): ?>
                            <?php $filename = basename($file); ?>
                            <li>
                                <a href="?file=<?php echo $filename; ?>" <?php echo ($componentFile === $filename) ? 'class="active"' : ''; ?>>
                                    <?php echo pathinfo($filename, PATHINFO_FILENAME); ?>
                                </a>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                    <div class="mt-4">
                        <a href="components.html" class="btn btn-secondary w-100">コンポーネント一覧へ</a>
                    </div>
                </div>
            </div>
            
            <div class="col-lg-9">
                <div class="editor-container">
                    <h1 class="editor-title">
                        <?php if ($componentName): ?>
                            <?php echo $componentName; ?> コンポーネント編集
                        <?php else: ?>
                            コンポーネント編集
                        <?php endif; ?>
                    </h1>
                    
                    <?php if ($message): ?>
                        <div class="<?php echo strpos($message, '失敗') !== false ? 'error-message' : 'success-message'; ?>">
                            <?php echo $message; ?>
                        </div>
                    <?php endif; ?>
                    
                    <?php if ($componentFile): ?>
                        <form method="post" action="">
                            <input type="hidden" name="component_file" value="<?php echo htmlspecialchars($componentFile); ?>">
                            
                            <div class="code-editor">
                                <textarea id="css-editor" name="component_content"><?php echo htmlspecialchars($componentContent); ?></textarea>
                            </div>
                            
                            <div class="d-flex justify-content-between mt-3">
                                <button type="submit" name="save_component" class="save-button">
                                    <i class="fas fa-save mr-2"></i> 保存
                                </button>
                                
                                <div>
                                    <button type="button" id="toggle-preview" class="btn btn-outline-secondary">
                                        プレビュー表示
                                    </button>
                                    <button type="button" id="toggle-dark-mode" class="btn btn-outline-dark">
                                        ダークモード
                                    </button>
                                </div>
                            </div>
                        </form>
                        
                        <div class="preview-area mt-4" id="preview-area" style="display: none;">
                            <h3>プレビュー</h3>
                            <div id="preview-content"></div>
                        </div>
                    <?php else: ?>
                        <div class="alert alert-info">
                            左側のリストからコンポーネントを選択してください。
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>
    
    <!-- JavaScript -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <!-- CodeMirror JS -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/css/css.min.js"></script>
    <script>
        // CodeMirrorエディタの初期化
        const cssEditor = document.getElementById('css-editor');
        if (cssEditor) {
            const editor = CodeMirror.fromTextArea(cssEditor, {
                mode: "css",
                theme: "dracula",
                lineNumbers: true,
                indentUnit: 2,
                lineWrapping: true,
                autoCloseBrackets: true
            });
            
            // プレビュー機能
            const togglePreviewBtn = document.getElementById('toggle-preview');
            const previewArea = document.getElementById('preview-area');
            const previewContent = document.getElementById('preview-content');
            
            togglePreviewBtn.addEventListener('click', function() {
                if (previewArea.style.display === 'none') {
                    previewArea.style.display = 'block';
                    togglePreviewBtn.textContent = 'プレビュー非表示';
                    updatePreview();
                } else {
                    previewArea.style.display = 'none';
                    togglePreviewBtn.textContent = 'プレビュー表示';
                }
            });
            
            // ダークモード切り替え
            const toggleDarkModeBtn = document.getElementById('toggle-dark-mode');
            toggleDarkModeBtn.addEventListener('click', function() {
                previewArea.classList.toggle('dark-preview');
            });
            
            // エディタ内容が変更されたときにプレビューを更新
            editor.on('change', function() {
                if (previewArea.style.display !== 'none') {
                    updatePreview();
                }
            });
            
            // プレビュー更新関数
            function updatePreview() {
                const cssCode = editor.getValue();
                const styleEl = document.createElement('style');
                styleEl.textContent = cssCode;
                
                // プレビューコンテンツをクリアして新しいスタイルを適用
                previewContent.innerHTML = '';
                previewContent.appendChild(styleEl);
                
                // コンポーネント名に基づいてプレビュー要素を追加
                const componentName = '<?php echo $componentName; ?>';
                
                switch(componentName) {
                    case 'buttons':
                        addButtonsPreviews();
                        break;
                    case 'cards':
                        addCardsPreviews();
                        break;
                    case 'header':
                        addHeaderPreviews();
                        break;
                    case 'footer':
                        addFooterPreviews();
                        break;
                    case 'sections':
                        addSectionsPreviews();
                        break;
                    case 'page-hero':
                        addPageHeroPreviews();
                        break;
                    default:
                        previewContent.innerHTML += '<div class="alert alert-warning">このコンポーネントのプレビューは利用できません。</div>';
                        break;
                }
            }
            
            // 各コンポーネントのプレビュー生成関数
            function addButtonsPreviews() {
                previewContent.innerHTML += `
                    <div class="mb-3">
                        <button class="btn">基本ボタン</button>
                    </div>
                    <div class="mb-3">
                        <button class="btn btn-primary">プライマリボタン</button>
                    </div>
                    <div class="mb-3">
                        <button class="btn-animated btn-primary">アニメーションボタン</button>
                    </div>
                    <div class="mb-3">
                        <a href="#" class="btn-animated-link">詳細を見る <i class="fas fa-arrow-right"></i></a>
                    </div>
                    <div class="mb-3">
                        <a href="#" class="btn-contact">お問い合わせ</a>
                    </div>
                `;
            }
            
            function addCardsPreviews() {
                previewContent.innerHTML += `
                    <div class="row">
                        <div class="col-md-6 mb-4">
                            <div class="card">
                                <div class="card-body">
                                    <h5 class="card-title">基本カード</h5>
                                    <p class="card-text">基本的なカードコンポーネントです。</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 mb-4">
                            <div class="card-effect">
                                <h3 class="card-title-modern">カードエフェクト</h3>
                                <p>ホバー時に特殊なエフェクトを持つカードです。</p>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4 mb-4">
                            <div class="business-card">
                                <div class="business-card-icon">
                                    <i class="fas fa-handshake"></i>
                                </div>
                                <div class="business-card-circle"></div>
                                <h3 class="business-card-title">ビジネスカード</h3>
                                <p>ビジネスカードのサンプルテキストです。</p>
                            </div>
                        </div>
                    </div>
                `;
            }
            
            function addHeaderPreviews() {
                previewContent.innerHTML += `
                    <div style="background-color: #343a40; padding: 20px; margin-bottom: 20px;">
                        <div class="header" style="position: relative;">
                            <div class="container">
                                <div class="d-flex justify-content-between align-items-center">
                                    <a href="/" class="navbar-brand">
                                        <span style="color: white; font-weight: bold;">ANSTEYPE</span>
                                    </a>
                                    <div class="d-flex align-items-center">
                                        <div class="navbar-nav d-flex flex-row">
                                            <a class="nav-link" href="#">ホーム</a>
                                            <a class="nav-link active" href="#">会社概要</a>
                                            <a class="nav-link" href="#">サービス</a>
                                            <a class="nav-link" href="#">お問い合わせ</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="mb-3">
                        <button class="menu-button">
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    </div>
                `;
            }
            
            function addFooterPreviews() {
                previewContent.innerHTML += `
                    <div class="footer" style="padding: 30px; background-color: #000000 !important;">
                        <div class="container">
                            <div class="row">
                                <div class="col-md-4">
                                    <h3>ANSTEYPE</h3>
                                    <p>ANSTEYPEは、人と企業の架け橋となり、新たな価値を創造する会社です。</p>
                                </div>
                                <div class="col-md-4">
                                    <h3>リンク</h3>
                                    <ul class="footer-links">
                                        <li><a href="#">ホーム</a></li>
                                        <li><a href="#">会社概要</a></li>
                                        <li><a href="#">サービス</a></li>
                                        <li><a href="#">採用情報</a></li>
                                    </ul>
                                </div>
                                <div class="col-md-4">
                                    <div class="social-icons">
                                        <a href="#"><i class="fab fa-facebook-f"></i></a>
                                        <a href="#"><i class="fab fa-twitter"></i></a>
                                        <a href="#"><i class="fab fa-instagram"></i></a>
                                        <a href="#"><i class="fab fa-linkedin-in"></i></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }
            
            function addSectionsPreviews() {
                previewContent.innerHTML += `
                    <div class="demo-section">
                        <div class="section-title-wrapper">
                            <h2 class="section-title concept-section-title">SECTION TITLE</h2>
                            <p class="section-subtitle">
                                <span class="refined-concept">セクションのサブタイトルが入ります。</span>
                            </p>
                        </div>
                    </div>
                    <div class="mt-4">
                        <div class="section-divider"></div>
                    </div>
                `;
            }
            
            function addPageHeroPreviews() {
                previewContent.innerHTML += `
                    <div class="page-title" style="height: 200px !important; background: linear-gradient(135deg, rgba(0,0,0,0.7), rgba(74, 144, 226, 0.6)), url('/assets/images/hero/assets_task_01jv471sbnewdb6btek38bfyh9_1747119645_img_1.webp');">
                        <div class="container">
                            <h1>ページタイトル</h1>
                            <p class="lead">ページの説明文がここに入ります。</p>
                        </div>
                    </div>
                `;
            }
        }
    </script>
</body>
</html> 