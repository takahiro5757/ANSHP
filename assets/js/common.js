/**
 * 共通JavaScript機能
 * ヘッダーとフッターの挙動制御
 */

document.addEventListener('DOMContentLoaded', function() {
    // ホームページ判定
    const isHomePage = document.body.classList.contains('home-page');
    
    // ヘッダースクロール制御
    const header = document.querySelector('.header');
    
    if (header) {
        // 初期状態をチェック - ページロード時にすでにスクロールされている場合
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else if (isHomePage) {
            // ホームページでスクロールしていない場合は透明背景を確保
            header.classList.add('transparent-bg');
        }
        
        // スクロールイベントリスナー
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
                header.classList.remove('transparent-bg');
            } else {
                header.classList.remove('scrolled');
                if (isHomePage) {
                    header.classList.add('transparent-bg');
                }
            }
        });
        
        // 強制的に一度スクロールイベントをトリガー
        setTimeout(function() {
            window.dispatchEvent(new Event('scroll'));
        }, 100);
    }
    
    // ナビゲーションメニュートグル
    const menuButton = document.querySelector('.menu-button');
    
    if (menuButton) {
        menuButton.addEventListener('click', function() {
            this.classList.toggle('open');
        });
    }
    
    // ナビゲーションメニュークリック外クローズ
    document.addEventListener('click', function(event) {
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse) {
            const menuButton = document.querySelector('.menu-button');
            const isClickInside = navbarCollapse.contains(event.target) || 
                                 (menuButton && menuButton.contains(event.target));
            
            if (!isClickInside && navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
                if (menuButton && menuButton.classList.contains('open')) {
                    menuButton.classList.remove('open');
                }
            }
        }
    });
    
    // 現在のページのナビゲーションリンクをアクティブに
    const currentPage = window.location.pathname;
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (currentPage === href || 
            (href !== '/' && currentPage.startsWith(href))) {
            link.classList.add('active');
        }
    });
}); 