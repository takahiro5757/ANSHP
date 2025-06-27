/**
 * インタビュー詳細ページ共通JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // ヘッダーとフッターの読み込み
    $("#header-placeholder").load("../../../assets/parts/header.html", function() {
        // ヘッダーの読み込み完了後にインタビューページ用クラスを追加
        const header = document.querySelector('.header');
        if (header) {
            header.classList.add('interview-page');
        }
    });
    $("#footer-placeholder").load("../../../assets/parts/footer.html");
    
    // スクロール時のヘッダースタイル変更
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });
    
    // 拡張されたパララックス効果
    const interviewBg = document.querySelector('.interview-bg');
    const heroDecoration = document.querySelector('.hero-decoration');
    
    // スクロールに基づくパララックス
    if (interviewBg) {
        window.addEventListener('scroll', function() {
            const scrollY = window.scrollY;
            const heroHeight = document.querySelector('.interview-hero').offsetHeight;
            if (scrollY <= heroHeight) {
                const translateY = scrollY * 0.3; // スクロール量の30%だけ動かす
                interviewBg.style.transform = `scale(1.1) translateY(${translateY}px)`;
            }
        });
    }
    
    // マウス移動に基づくパララックス（左側の背景画像のみに適用）
    window.addEventListener('mousemove', function(e) {
        if (!interviewBg || window.innerWidth <= 768) return; // モバイルでは無効
        
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        // 背景画像のパララックス移動
        interviewBg.style.transform = `scale(1.1) translate(${mouseX * -15}px, ${mouseY * -15}px)`;
        
        // ヒーロー装飾のパララックス移動
        if (heroDecoration) {
            heroDecoration.style.transform = `translate(${mouseX * 20}px, ${mouseY * 20}px)`;
        }
    });
    
    // プロフィール画像の境界線アニメーション
    const profileBorder = document.querySelector('.profile-image-border');
    if (profileBorder) {
        setTimeout(() => {
            profileBorder.classList.add('animated');
        }, 500);
    }
    
    // インタビューセクションのスクロールアニメーション
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                // 一度表示されたら監視を終了
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // スクロールインジケーターのクリックイベント
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const contentSection = document.querySelector('.interview-content');
            if (contentSection) {
                contentSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // インタビューセクションのアニメーション設定
    const sections = document.querySelectorAll('.interview-section');
    sections.forEach((section, index) => {
        section.classList.add('section-' + (index + 1));
        observer.observe(section);
    });
    
    // 画像ホバーエフェクト
    const profileImage = document.querySelector('.profile-image-container');
    if (profileImage) {
        profileImage.addEventListener('mouseenter', function() {
            this.classList.add('hover');
            
            // 境界線のエフェクト拡張
            const profileBorder = this.querySelector('.profile-image-border');
            if (profileBorder) {
                profileBorder.style.transform = 'translate(8px, 8px)';
                profileBorder.style.borderColor = 'rgba(58, 123, 213, 1)';
            }
        });
        
        profileImage.addEventListener('mouseleave', function() {
            this.classList.remove('hover');
            
            // 境界線のエフェクト元に戻す
            const profileBorder = this.querySelector('.profile-image-border');
            if (profileBorder) {
                profileBorder.style.transform = '';
                profileBorder.style.borderColor = '';
            }
        });
    }
    
    // 引用部分のハイライト
    const quoteHighlight = document.querySelector('.quote-highlight');
    if (quoteHighlight) {
        window.addEventListener('mousemove', function(e) {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            const moveX = 15 * (x - 0.5);
            const moveY = 15 * (y - 0.5);
            quoteHighlight.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    }
}); 