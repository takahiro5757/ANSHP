/**
 * 高さチェック用スクリプト
 */
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        // ページタイトル要素を取得
        const pageTitle = document.querySelector('.page-title');
        
        if (pageTitle) {
            // 実際の高さを取得
            const height = pageTitle.offsetHeight;
            const computedStyle = window.getComputedStyle(pageTitle);
            const cssHeight = computedStyle.getPropertyValue('height');
            
            // スタイル情報
            const styles = {
                height: cssHeight,
                minHeight: computedStyle.getPropertyValue('min-height'),
                maxHeight: computedStyle.getPropertyValue('max-height'),
                paddingTop: computedStyle.getPropertyValue('padding-top'),
                paddingBottom: computedStyle.getPropertyValue('padding-bottom'),
                marginTop: computedStyle.getPropertyValue('margin-top'),
                marginBottom: computedStyle.getPropertyValue('margin-bottom'),
                boxSizing: computedStyle.getPropertyValue('box-sizing'),
                transform: computedStyle.getPropertyValue('transform'),
                display: computedStyle.getPropertyValue('display')
            };
            
            // 実測高さをコンソールに出力
            console.log('===============================');
            console.log('ページタイトル要素の高さ情報:');
            console.log('実際のDOM高さ:', height + 'px');
            console.log('CSS設定高さ:', styles.height);
            console.log('その他のスタイル情報:', styles);
            console.log('===============================');
            
            // 画面にも表示
            const debugDiv = document.createElement('div');
            debugDiv.style.position = 'fixed';
            debugDiv.style.top = '10px';
            debugDiv.style.right = '10px';
            debugDiv.style.backgroundColor = 'rgba(255,255,255,0.8)';
            debugDiv.style.padding = '10px';
            debugDiv.style.borderRadius = '5px';
            debugDiv.style.zIndex = '9999';
            debugDiv.style.fontSize = '12px';
            debugDiv.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
            debugDiv.innerHTML = `
                <div style="font-weight:bold">ヒーロー高さ情報:</div>
                <div>実際の高さ: ${height}px</div>
                <div>CSS設定高さ: ${styles.height}</div>
                <div>transform: ${styles.transform}</div>
            `;
            document.body.appendChild(debugDiv);
        }
    }, 1000); // 1秒後に実行（ページが完全に読み込まれるのを待つ）
}); 