document.addEventListener('DOMContentLoaded', function() {
    // ===== スライダー機能 =====
    const slider = document.getElementById('hero-slider');
    if (slider) {
      let currentIndex = 0;
      const slides = slider.querySelectorAll('.slider-slide');
      const dots = slider.querySelectorAll('.slider-dot');
      const prevButton = slider.querySelector('.slider-prev');
      const nextButton = slider.querySelector('.slider-next');
      let autoSlideInterval;
  
      // スライドを切り替える関数
      function goToSlide(index) {
        // 自動スライドをリセット
        clearInterval(autoSlideInterval);
        startAutoSlide();
        
        // 現在のスライドとドットからactiveクラスを削除
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => {
          dot.classList.remove('active', 'bg-white', 'opacity-80');
          dot.classList.add('bg-gray-400', 'opacity-60');
        });
        
        // 指定されたスライドとドットにactiveクラスを追加
        slides[index].classList.add('active');
        dots[index].classList.remove('bg-gray-400', 'opacity-60');
        dots[index].classList.add('active', 'bg-white', 'opacity-80');
        
        currentIndex = index;
      }
  
      // 前のスライドに移動
      function goToPrev() {
        const newIndex = currentIndex - 1 < 0 ? slides.length - 1 : currentIndex - 1;
        goToSlide(newIndex);
      }
  
      // 次のスライドに移動
      function goToNext() {
        const newIndex = currentIndex + 1 >= slides.length ? 0 : currentIndex + 1;
        goToSlide(newIndex);
      }
  
      // 自動スライド開始
      function startAutoSlide() {
        autoSlideInterval = setInterval(goToNext, 5000); // 5秒ごと
      }
  
      // イベントリスナーの設定
      prevButton.addEventListener('click', goToPrev);
      nextButton.addEventListener('click', goToNext);
      
      // ドットにイベントリスナーを設定
      dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
      });
  
      // 初期状態の設定と自動スライド開始
      goToSlide(0);
      startAutoSlide();
    }
  
    // ===== モーダル機能 =====
    const demoButton = document.getElementById('demo-button');
    const demoModal = document.getElementById('demo-modal');
    const closeModal = document.getElementById('close-modal');
  
    if (demoButton && demoModal) {
      // モーダルを開く
      demoButton.addEventListener('click', function() {
        demoModal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden'); // スクロール防止
      });
  
      // モーダルを閉じる
      if (closeModal) {
        closeModal.addEventListener('click', function() {
          demoModal.classList.add('hidden');
          document.body.classList.remove('overflow-hidden');
          
          // ビデオが存在する場合は停止
          const video = demoModal.querySelector('video');
          if (video) {
            video.pause();
          }
        });
      }
  
      // モーダル外をクリックしてもモーダルを閉じる
      demoModal.addEventListener('click', function(event) {
        if (event.target === demoModal) {
          demoModal.classList.add('hidden');
          document.body.classList.remove('overflow-hidden');
          
          // ビデオが存在する場合は停止
          const video = demoModal.querySelector('video');
          if (video) {
            video.pause();
          }
        }
      });
  
      // ESCキーでモーダルを閉じる
      document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && !demoModal.classList.contains('hidden')) {
          demoModal.classList.add('hidden');
          document.body.classList.remove('overflow-hidden');
          
          // ビデオが存在する場合は停止
          const video = demoModal.querySelector('video');
          if (video) {
            video.pause();
          }
        }
      });
    }
  
    // ===== スムーススクロール機能 =====
    // ナビゲーションリンクのスムーススクロール
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          window.scrollTo({
            top: targetElement.offsetTop - 80, // ヘッダーの高さを考慮
            behavior: 'smooth'
          });
        }
      });
    });
  
    // ===== トレーニングカードのホバーエフェクト =====
    const trainingCards = document.querySelectorAll('.training-card');
    trainingCards.forEach(card => {
      card.addEventListener('mouseenter', function() {
        this.classList.add('shadow-md');
      });
      
      card.addEventListener('mouseleave', function() {
        this.classList.remove('shadow-md');
      });
    });
  });
  