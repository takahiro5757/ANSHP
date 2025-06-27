document.addEventListener('DOMContentLoaded', function() {
    // ヘッダーのスクロール制御
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    const heroVideo = document.querySelector('.hero-video');
    const heroOverlay = document.querySelector('.hero-overlay');
    const heroSubtitle = document.querySelector('.hero-subtitle');

    // ヘッダーの初期設定 - heroセクションがない場合は最初からスクロール状態にする
    if (header && !hero) {
        header.classList.add('scrolled');
    }

    // マウス位置追跡のためのイベントリスナー
    if (hero) {
        // マウスイベントをすべて無効化
    }

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollProgress = scrollTop / (window.innerHeight * 0.5); // 50%スクロールで完全に透明に
        
        // ヘッダーの制御
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // ヒーローセクションの要素の透明度を制御
        if (scrollProgress <= 1 && heroVideo && heroOverlay) {
            // 不要なアニメーションを削除
        }
        
        // 番号付きセクションのシーケンシャルアニメーション
        document.querySelectorAll('.section-with-number').forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            const isInView = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
            
            if (isInView) {
                section.classList.add('active');
                // 0.2秒ごとに子要素をアニメーション
                const children = section.querySelectorAll('.animate-child');
                children.forEach((child, childIndex) => {
                    setTimeout(() => {
                        child.classList.add('visible');
                    }, 200 * childIndex);
                });
            }
        });
        
        lastScrollTop = scrollTop;
    });

    // スムーズスクロール
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = header.offsetHeight;
                const elementPosition = target.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // アニメーションのタイプを定義
    const animationTypes = [
        'fade-in', // デフォルトのフェードイン（下から）
        'fade-in-up', // 上からフェードイン
        'fade-in-down', // 下からフェードイン
        'zoom-in', // ズームインしながらフェードイン
        'bounce-in', // バウンスしながらフェードイン
        'rotate-in' // 回転しながらフェードイン
    ];

    // すべてのアニメーション要素を選択
    const allAnimElements = [];
    animationTypes.forEach(type => {
        const elements = document.querySelectorAll(`.${type}`);
        elements.forEach(el => allAnimElements.push(el));
    });

    // Intersection Observerの設定
    const animObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // 遅延を適用するための値を取得
            const element = entry.target;
            const delay = element.dataset.delay ? parseInt(element.dataset.delay) : 0;
            
            if (entry.isIntersecting) {
                // 要素が表示領域に入ったら、少し遅延させてからvisibleクラスを追加
                setTimeout(() => {
                    element.classList.add('visible');
                }, delay);
            } else {
                // 要素が表示領域から出たら、visibleクラスを削除してアニメーションをリセット
                // 削除する際に少し待機するとスムーズに見える
                setTimeout(() => {
                    element.classList.remove('visible');
                }, 100);
            }
        });
    }, {
        threshold: 0.15, // 15%が見えたらアニメーション開始
        rootMargin: '0px 0px -100px 0px' // 下部のマージンを調整して早めに開始
    });

    // すべてのアニメーション要素を監視
    allAnimElements.forEach(element => {
        // ランダムな遅延を追加（同時に複数の要素がアニメーションする場合に効果的）
        const delay = element.dataset.delay ? parseInt(element.dataset.delay) : 0;
        if (delay) {
            element.style.transitionDelay = `${delay}ms`;
        }
        
        animObserver.observe(element);
    });

    // 特別なアニメーション: コンセプトテキスト（順番に表示）
    const conceptTextElements = document.querySelectorAll('.concept-text p');
    if (conceptTextElements.length > 0) {
        const conceptTextObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                // コンセプトテキストが表示領域に入ったら
                conceptTextElements.forEach((el, index) => {
                    // まず全ての要素のvisibleクラスを削除してリセット
                    el.classList.remove('visible');
                    
                    // 順番に表示
                    setTimeout(() => {
                        el.classList.add('visible');
                    }, 500 * index); // 500msごとに順番に表示
                });
            } else {
                // 表示領域から出たら、全ての要素のvisibleクラスを削除
                conceptTextElements.forEach(el => {
                    el.classList.remove('visible');
                });
            }
        }, { threshold: 0.5 });
        
        conceptTextObserver.observe(document.querySelector('.concept-text'));
    }

    // 特別なアニメーション: ページロード時のヒーロー要素
    if (heroContent) {
        // ページロード時にすぐに表示
        heroContent.classList.add('loaded');
        
        // ヒーロータイトルとサブタイトルもすぐに表示
        const heroTitle = document.querySelector('.hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        
        if (heroTitle) {
            heroTitle.classList.add('loaded');
        }
        
        if (heroSubtitle) {
            heroSubtitle.classList.add('loaded');
        }
    }

    // 数値カウントアップアニメーション
    const counterElements = document.querySelectorAll('.counter-up');
    if (counterElements.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const target = parseInt(element.getAttribute('data-target'));
                    let count = 0;
                    const duration = 2000; // 2秒かけてカウントアップ
                    const interval = 50; // 50msごとに更新
                    const increment = target / (duration / interval);
                    
                    const timer = setInterval(() => {
                        count += increment;
                        
                        if (count >= target) {
                            element.textContent = target;
                            clearInterval(timer);
                        } else {
                            element.textContent = Math.ceil(count);
                        }
                    }, interval);
                    
                    // 一度実行したら監視を解除
                    counterObserver.unobserve(element);
                }
            });
        }, { threshold: 0.5 });
        
        counterElements.forEach(element => {
            counterObserver.observe(element);
        });
    }

    // タイピングエフェクト
    const typingElements = document.querySelectorAll('.typing-effect');
    if (typingElements.length > 0) {
        typingElements.forEach(element => {
            const text = element.getAttribute('data-text');
            if (!text) return;
            
            element.textContent = '';
            element.style.visibility = 'visible';
            
            const typeObserver = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    let i = 0;
                    const typeInterval = setInterval(() => {
                        if (i < text.length) {
                            element.textContent += text.charAt(i);
                            i++;
                        } else {
                            clearInterval(typeInterval);
                            element.classList.add('typing-done');
                        }
                    }, 100);
                    
                    typeObserver.unobserve(element);
                }
            }, { threshold: 0.5 });
            
            typeObserver.observe(element);
        });
    }

    // パララックス効果
    const parallaxElements = document.querySelectorAll('.parallax-bg');
    if (parallaxElements.length > 0) {
        window.addEventListener('scroll', () => {
            parallaxElements.forEach(element => {
                // インタビューページのヒーローセクションは除外
                if (element.classList.contains('interview-bg')) {
                    return;
                }
                const speed = element.getAttribute('data-speed') || 0.5;
                const yPos = -(window.scrollY * speed);
                element.style.transform = `translate3d(0px, ${yPos}px, 0px)`;
            });
        });
    }

    // 3Dカードエフェクト
    const card3dElements = document.querySelectorAll('.card-3d');
    if (card3dElements.length > 0) {
        card3dElements.forEach(card => {
            const inner = card.querySelector('.card-3d-inner');
            
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const xRotation = ((y - rect.height / 2) / rect.height) * 20;
                const yRotation = ((x - rect.width / 2) / rect.width) * -20;
                
                inner.style.transform = `rotateX(${xRotation}deg) rotateY(${yRotation}deg)`;
            });
            
            card.addEventListener('mouseleave', () => {
                inner.style.transform = 'rotateX(0) rotateY(0)';
            });
        });
    }

    // スクロールが特定位置に達したら発火するトリガー
    const scrollTriggers = document.querySelectorAll('[data-scroll-trigger]');
    if (scrollTriggers.length > 0) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            
            scrollTriggers.forEach(trigger => {
                const triggerPoint = parseInt(trigger.getAttribute('data-scroll-trigger'));
                
                if (scrollTop >= triggerPoint) {
                    trigger.classList.add('triggered');
                } else {
                    trigger.classList.remove('triggered');
                }
            });
        });
    }

    // モバイルメニューの制御
    const menuButton = document.querySelector('.menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', () => {
            menuButton.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });

        // モバイルメニューのリンクをクリックしたらメニューを閉じる
        document.querySelectorAll('.mobile-menu .nav-link').forEach(link => {
            link.addEventListener('click', () => {
                menuButton.classList.remove('active');
                mobileMenu.classList.remove('active');
            });
        });
    }

    // モバイルメニューのトグル機能
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            this.classList.toggle('active');
        });
    }

    // ドロップダウンメニューのマウスオーバー機能
    const dropdownMenus = document.querySelectorAll('.dropdown');
    if (dropdownMenus.length > 0) {
        dropdownMenus.forEach(dropdown => {
            const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
            const dropdownMenu = dropdown.querySelector('.dropdown-menu');
            
            // PCの場合はマウスオーバーでドロップダウンを表示
            if (window.innerWidth > 991) {
                dropdown.addEventListener('mouseenter', () => {
                    dropdownMenu.classList.add('show');
                    dropdownToggle.setAttribute('aria-expanded', 'true');
                });
                
                dropdown.addEventListener('mouseleave', () => {
                    dropdownMenu.classList.remove('show');
                    dropdownToggle.setAttribute('aria-expanded', 'false');
                });
            } else {
                // モバイルの場合はクリックでドロップダウンを表示
                dropdownToggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    dropdownMenu.classList.toggle('show');
                    const expanded = dropdownToggle.getAttribute('aria-expanded') === 'true' ? 'false' : 'true';
                    dropdownToggle.setAttribute('aria-expanded', expanded);
                });
            }
        });
        
        // ウィンドウリサイズ時の対応
        window.addEventListener('resize', () => {
            if (window.innerWidth > 991) {
                // PCサイズの場合、クリックイベントを除去
                dropdownMenus.forEach(dropdown => {
                    const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
                    dropdownToggle.removeEventListener('click', null);
                });
            }
        });
    }

    initAutoCampaignCarousel();
});

function initAutoCampaignCarousel() {
    const carousel = document.querySelector('.campaign-carousel');
    if (!carousel) return;

    const carouselInner = carousel.querySelector('.campaign-carousel-inner');
    const cards = carouselInner.querySelectorAll('.campaign-card');
    
    // すべてのカードをクローンしてループを実現
    if (cards.length > 0) {
        // 全てのカードをクローンして追加（無限ループ用）
        cards.forEach(card => {
            const clone = card.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            carouselInner.appendChild(clone);
        });
    }
    
    // Responsive handling
    function adjustCarouselForScreenSize() {
        const width = window.innerWidth;
        let cardWidth, cardMargin;
        
        if (width >= 1200) {
            cardWidth = 350;
            cardMargin = 40;
        } else if (width >= 768) {
            cardWidth = 300;
            cardMargin = 30;
        } else {
            cardWidth = 260;
            cardMargin = 20;
        }
        
        // カード枚数に応じてアニメーション速度を調整
        // カード1枚あたりの移動時間を2秒とする
        const baseSpeed = 2;  // カード1枚の表示時間（秒）
        const animationDuration = cards.length * baseSpeed;
        
        // スクロール距離を計算（カード全体の幅）
        const scrollDistance = (cardWidth + cardMargin) * cards.length;
        
        // CSS変数を設定
        document.documentElement.style.setProperty('--animation-duration', `${animationDuration}s`);
        document.documentElement.style.setProperty('--scroll-distance', `-${scrollDistance}px`);
        
        // カルーセル内側のスタイルを直接設定
        carouselInner.style.animationDuration = `${animationDuration}s`;
    }
    
    // Initial setup
    adjustCarouselForScreenSize();
    
    // Update on resize
    window.addEventListener('resize', adjustCarouselForScreenSize);
    
    // Pause animation on hover
    carousel.addEventListener('mouseenter', () => {
        carouselInner.style.animationPlayState = 'paused';
    });
    
    carousel.addEventListener('mouseleave', () => {
        carouselInner.style.animationPlayState = 'running';
    });
} 