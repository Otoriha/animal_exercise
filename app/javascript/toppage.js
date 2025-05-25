console.log('=== toppage.js読み込み開始 ===');

// 重複実行を防ぐためのフラグ
let isInitialized = false;

// DOMが読み込まれた後に実行
document.addEventListener('DOMContentLoaded', function() {
  console.log('=== DOMContentLoaded イベント発火 ===');
  if (!isInitialized) {
    initTopPageFeatures();
  }
});

// Turbo対応
document.addEventListener('turbo:load', function() {
  console.log('=== Turbo:load イベント発火 ===');
  // Turboの場合は毎回初期化が必要
  isInitialized = false;
  initTopPageFeatures();
});

function initTopPageFeatures() {
  if (isInitialized) {
    console.log('=== 既に初期化済みのためスキップ ===');
    return;
  }

  console.log('=== 機能初期化開始 ===');
  isInitialized = true;

  // スライダー機能
  const slider = document.getElementById('hero-slider');
  console.log('スライダー要素:', slider);
  
  if (slider) {
    let currentIndex = 0;
    const slides = slider.querySelectorAll('.slider-slide');
    const dots = slider.querySelectorAll('.slider-dot');
    const prevButton = slider.querySelector('.slider-prev');
    const nextButton = slider.querySelector('.slider-next');
    let autoSlideInterval;

    console.log('スライド数:', slides.length);
    console.log('ドット数:', dots.length);

    if (slides.length === 0) {
      console.log('⚠️ スライドが見つかりません');
      return;
    }

    function goToSlide(index) {
      console.log(`スライド${index}に切り替え`);
      
      if (autoSlideInterval) clearInterval(autoSlideInterval);
      
      // 全てのスライドから active クラスを削除
      slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (i === index) {
          // 少し遅延させてからactiveクラスを追加（スムーズなトランジション）
          setTimeout(() => {
            slide.classList.add('active');
          }, 50);
        }
      });
      
      // ドットの状態を更新
      dots.forEach((dot, i) => {
        if (i === index) {
          dot.style.backgroundColor = 'white';
          dot.style.opacity = '0.8';
        } else {
          dot.style.backgroundColor = '#9ca3af';
          dot.style.opacity = '0.6';
        }
      });
      
      currentIndex = index;
      startAutoSlide();
    }

    function goToNext() {
      const newIndex = (currentIndex + 1) % slides.length;
      goToSlide(newIndex);
    }

    function goToPrev() {
      const newIndex = currentIndex - 1 < 0 ? slides.length - 1 : currentIndex - 1;
      goToSlide(newIndex);
    }

    function startAutoSlide() {
      if (slides.length > 1) {
        autoSlideInterval = setInterval(() => {
          console.log('自動スライド実行');
          goToNext();
        }, 5000);
      }
    }

    // イベントリスナー設定（クリーンアップ機能付き）
    if (prevButton) {
      prevButton.onclick = function(e) {
        e.preventDefault();
        console.log('前ボタンクリック');
        goToPrev();
      };
      console.log('前ボタンイベント設定完了');
    }

    if (nextButton) {
      nextButton.onclick = function(e) {
        e.preventDefault();
        console.log('次ボタンクリック');
        goToNext();
      };
      console.log('次ボタンイベント設定完了');
    }

    // ドットのイベントリスナー
    dots.forEach((dot, index) => {
      dot.onclick = function(e) {
        e.preventDefault();
        console.log(`ドット${index}クリック`);
        goToSlide(index);
      };
    });
    console.log('ドットイベント設定完了');

    // 初期化
    console.log('スライダー初期化実行');
    goToSlide(0);
  } else {
    console.log('⚠️ スライダー要素が見つかりません');
  }

  // モーダル機能
  const demoButton = document.getElementById('demo-button');
  const demoModal = document.getElementById('demo-modal');
  const closeModal = document.getElementById('close-modal');

  console.log('モーダル要素:', {
    demoButton: !!demoButton,
    demoModal: !!demoModal,
    closeModal: !!closeModal
  });

  if (demoButton && demoModal) {
    function closeModalFunction() {
      console.log('モーダルを閉じます');
      demoModal.style.display = 'none';
      document.body.style.overflow = '';
    }

    // デモボタンクリック
    demoButton.onclick = function(e) {
      e.preventDefault();
      console.log('デモボタンクリック');
      demoModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    };
    console.log('デモボタンイベント設定完了');

    // 閉じるボタン
    if (closeModal) {
      closeModal.onclick = function(e) {
        e.preventDefault();
        console.log('閉じるボタンクリック');
        closeModalFunction();
      };
      console.log('閉じるボタンイベント設定完了');
    }

    // モーダル外クリック
    demoModal.onclick = function(e) {
      if (e.target === demoModal) {
        console.log('モーダル外クリック');
        closeModalFunction();
      }
    };

    // ESCキー
    document.onkeydown = function(e) {
      if (e.key === 'Escape' && demoModal.style.display === 'flex') {
        console.log('ESCキー押下');
        closeModalFunction();
      }
    };
    
    console.log('モーダル機能設定完了');
  } else {
    console.log('⚠️ モーダル要素が見つかりません');
  }

  // ===== スムーススクロール =====
  const navLinks = document.querySelectorAll('a[href^="#"]');
  console.log('スムーススクロール対象:', navLinks.length);
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });

  // ===== ホバー効果 =====
  const trainingCards = document.querySelectorAll('.training-card');
  console.log('トレーニングカード:', trainingCards.length);
  
  trainingCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.boxShadow = '';
    });
  });

  console.log('=== 機能初期化完了 ===');
}
  