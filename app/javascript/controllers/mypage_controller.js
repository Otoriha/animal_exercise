import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [ "tab", "content" ]
  static values = { defaultTab: String } // デフォルトタブ名をvalueとして受け取る

  connect() {
    // valueで指定されたタブ、もしくはターゲットが見つかれば最初のタブをデフォルト表示
    const initialTabName = this.hasDefaultTabValue ? this.defaultTabValue : (this.hasTabTarget ? this.tabTargets[0].dataset.tab : null);
    if (initialTabName) {
      console.log(`MypageController: Initializing with tab: ${initialTabName}`);
      this.showTab(initialTabName);
    } else {
      console.warn("MypageController: No tabs found or default tab specified.");
    }
  }

  switchTab(event) {
    const selectedTabName = event.currentTarget.dataset.tab;
    console.log(`MypageController: Switching to tab: ${selectedTabName}`);
    this.showTab(selectedTabName);
  }

  showTab(tabName) {
    console.log(`MypageController: Showing tab: ${tabName}`);
    this.contentTargets.forEach(content => {
      const isTargetContent = content.dataset.tabContent === tabName;
      console.log(`  - Content target ${content.id}: isTarget=${isTargetContent}, current hidden=${content.classList.contains('hidden')}`);
      content.classList.toggle('hidden', !isTargetContent); // 対象ならhiddenを削除、そうでなければ追加
      console.log(`    -> Toggled hidden. New hidden state: ${content.classList.contains('hidden')}`);
      content.dataset.state = isTargetContent ? "active" : "inactive";
    });

    this.tabTargets.forEach(tab => {
      const isTargetTab = tab.dataset.tab === tabName;
      console.log(`  - Tab target ${tab.dataset.tab}: isTarget=${isTargetTab}`);
      tab.dataset.state = isTargetTab ? "active" : "inactive";
      // CSSでのスタイリングのために、アクティブ状態をクラスで示すことも検討できます。
      // tab.classList.toggle('active-tab-class', isTargetTab);
    });
  }
} 