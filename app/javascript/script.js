document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    // body タグの data-* 属性からJSONデータを読み込み、パースする
    const userData = JSON.parse(body.dataset.user || '{}');
    const petData = JSON.parse(body.dataset.pet || '{}');
    const rewardsData = JSON.parse(body.dataset.rewards || '{}');
    const exercisesData = JSON.parse(body.dataset.exercises || '[]');
    const trainingStats = JSON.parse(body.dataset.trainingStats || '{}');

    // ダミーデータ (削除)
    /*
    const userData = { ... };
    const petData = { ... };
    const rewardsData = { ... };
    const exercisesData = [ ... ];
    */

    // ヘルパー関数
    const formatDate = (dateString) => {
        if (!dateString) return '未設定';
        try {
            const date = new Date(dateString);
            return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
        } catch (e) {
            console.error("Invalid date format:", dateString);
            return '無効な日付';
        }
    };

    const paramColors = {
        arm: "bg-blue-500",
        belly: "bg-green-500",
        leg: "bg-purple-500"
    };

    const muscleBadgeColors = {
        '腕': 'bg-blue-100 text-blue-800',
        'お腹': 'bg-green-100 text-green-800',
        '脚': 'bg-purple-100 text-purple-800'
    };

    // 要素への参照を取得
    const usernameEl = document.getElementById('username');
    const lastLoginEl = document.getElementById('last-login');
    const rewardsBadgeEl = document.getElementById('rewards-badge');
    const petImageEl = document.getElementById('pet-image');
    const petEvolutionNameEl = document.getElementById('pet-evolution-name');
    const petEvolutionDescEl = document.getElementById('pet-evolution-description');
    const petLevelEl = document.getElementById('pet-level');
    const petNextLevelPointsEl = document.getElementById('pet-next-level-points');
    const petOverallProgressEl = document.getElementById('pet-overall-progress');
    const petParametersContainer = document.getElementById('pet-parameters');
    const nextEvolutionContainer = document.getElementById('next-evolution');
    const rewardsSectionContainer = document.getElementById('rewards-section');
    const exercisesListContainer = document.getElementById('exercises-list');
    const tabTriggers = document.querySelectorAll('.tab-trigger');
    const tabContents = document.querySelectorAll('[data-tab-content]');
    const trainingStatsWeeklyEl = document.getElementById('training-stats-weekly');
    const trainingStatsTotalEl = document.getElementById('training-stats-total');
    const trainingStatsAccuracyEl = document.getElementById('training-stats-accuracy');

    // データ表示 (nullチェックを追加)
    if (usernameEl) usernameEl.textContent = `${userData.username || 'ゲスト'}さん`;
    if (lastLoginEl) lastLoginEl.textContent = `最終ログイン: ${formatDate(userData.last_login)}`;

    if (rewardsBadgeEl && rewardsSectionContainer) {
        if (rewardsData.unviewed_count > 0) {
            rewardsBadgeEl.textContent = rewardsData.unviewed_count;
            rewardsBadgeEl.classList.remove('hidden');
            rewardsSectionContainer.innerHTML = `
                <div class="mt-2 text-center p-3 bg-yellow-50 rounded border border-yellow-200">
                    <p class="text-sm">新しい報酬が${rewardsData.unviewed_count}つあります！</p>
                    <button class="mt-2 text-sm text-white bg-yellow-500 hover:bg-yellow-600 px-4 py-1 rounded">
                        確認する
                    </button>
                </div>
            `;
        } else {
            rewardsBadgeEl.classList.add('hidden');
            rewardsSectionContainer.innerHTML = `<p class="text-sm text-gray-500 mt-2">新しい報酬はありません</p>`;
        }
    }

    if (petImageEl) {
        petImageEl.src = petData.image_url || 'https://via.placeholder.com/160';
        petImageEl.alt = petData.evolution_name || 'ペット';
    }
    if (petEvolutionNameEl) petEvolutionNameEl.textContent = petData.evolution_name || '進化形態不明';
    if (petEvolutionDescEl) petEvolutionDescEl.textContent = petData.evolution_description || '説明がありません';
    if (petLevelEl) petLevelEl.textContent = `全体レベル: ${petData.level || '-'}`;
    if (petNextLevelPointsEl) petNextLevelPointsEl.textContent = `次のレベルまで: ${petData.points_to_next_level || '-'}ポイント`;

    if (petOverallProgressEl && petData.experience_points !== undefined && petData.points_to_next_level !== undefined) {
        const totalExpForLevel = petData.experience_points + petData.points_to_next_level;
        const overallProgress = totalExpForLevel > 0 ? (petData.experience_points / totalExpForLevel) * 100 : 0;
        petOverallProgressEl.style.width = `${overallProgress}%`;
    } else if (petOverallProgressEl) {
        petOverallProgressEl.style.width = '0%';
    }

    // 部位別パラメータ表示
    if (petParametersContainer && petData.parameters) {
        petParametersContainer.innerHTML = ''; // Clear existing
        Object.entries(petData.parameters).forEach(([part, data]) => {
            const progress = (data.experience !== undefined && data.next_level_exp > 0) ? (data.experience / data.next_level_exp) * 100 : 0;
            const partName = part === 'arm' ? '腕' : part === 'belly' ? 'お腹' : '脚';
            const colorClass = paramColors[part] || 'bg-gray-500'; // Fallback color
            const parameterHtml = `
                <div class="mb-2">
                    <div class="flex justify-between mb-1">
                        <span class="text-sm font-medium capitalize">
                            ${partName} レベル: ${data.level || '-'}
                        </span>
                        <span class="text-sm text-gray-500">
                            ${data.experience !== undefined ? data.experience : '-'}/${data.next_level_exp || '-'}
                        </span>
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-bar ${colorClass}" style="width: ${progress}%;"></div>
                    </div>
                </div>
            `;
            petParametersContainer.insertAdjacentHTML('beforeend', parameterHtml);
        });
    }

    // 次の進化条件表示
    if (nextEvolutionContainer && petData.parameters && petData.next_evolution) {
        nextEvolutionContainer.innerHTML = ''; // Clear existing
        const evolutionHtml = `
            <div class="text-center">
                <div class="font-medium">腕</div>
                <div class="mt-1">
                    <span class="${petData.parameters.arm?.level >= petData.next_evolution.required_arm_level ? 'text-green-600 font-bold' : ''}">
                        ${petData.parameters.arm?.level || '-'}
                    </span>
                    /${petData.next_evolution.required_arm_level || '-'}
                </div>
            </div>
            <div class="text-center">
                <div class="font-medium">お腹</div>
                <div class="mt-1">
                    <span class="${petData.parameters.belly?.level >= petData.next_evolution.required_belly_level ? 'text-green-600 font-bold' : ''}">
                        ${petData.parameters.belly?.level || '-'}
                    </span>
                    /${petData.next_evolution.required_belly_level || '-'}
                </div>
            </div>
            <div class="text-center">
                <div class="font-medium">脚</div>
                <div class="mt-1">
                    <span class="${petData.parameters.leg?.level >= petData.next_evolution.required_leg_level ? 'text-green-600 font-bold' : ''}">
                        ${petData.parameters.leg?.level || '-'}
                    </span>
                    /${petData.next_evolution.required_leg_level || '-'}
                </div>
            </div>
        `;
        nextEvolutionContainer.insertAdjacentHTML('beforeend', evolutionHtml);
    }

    // トレーニングメニュー表示
    if (exercisesListContainer && Array.isArray(exercisesData)) {
        exercisesListContainer.innerHTML = ''; // Clear existing
        exercisesData.forEach(exercise => {
            const badgeColor = muscleBadgeColors[exercise.target_muscle] || 'bg-gray-100 text-gray-800';
            const repsText = exercise.measurement_type === '回数型'
                ? `推奨回数: ${exercise.reps_per_set || '-'}回 × 3セット`
                : `推奨時間: ${exercise.reps_per_set || '-'}秒 × 3セット`;

            const exerciseHtml = `
                <div class="border rounded-lg p-3 flex hover:bg-gray-50 cursor-pointer">
                    <img 
                      src="${exercise.thumbnail_url || 'https://via.placeholder.com/64'}" 
                      alt="${exercise.name || 'トレーニング'}" 
                      class="w-16 h-16 rounded-lg object-cover mr-3"
                    />
                    <div class="flex-1">
                      <div class="flex items-center">
                        <h4 class="font-bold">${exercise.name || '名称未設定'}</h4>
                        <span class="ml-2 text-xs px-2 py-0.5 rounded-full ${badgeColor}">
                          ${exercise.target_muscle || '不明'}
                        </span>
                      </div>
                      <p class="text-sm text-gray-600 mt-1">${exercise.description || '説明なし'}</p>
                      <div class="mt-2 text-xs text-gray-500">
                        ${repsText}
                      </div>
                    </div>
                    <span class="text-gray-400 self-center ml-2">&gt;</span> <!-- ChevronRight placeholder -->
                </div>
            `;
            exercisesListContainer.insertAdjacentHTML('beforeend', exerciseHtml);
        });
    }

    // トレーニング統計表示
    if (trainingStatsWeeklyEl) trainingStatsWeeklyEl.textContent = `${trainingStats.weekly_sessions || 0}回`;
    if (trainingStatsTotalEl) trainingStatsTotalEl.textContent = `${trainingStats.total_time_minutes || 0}分`;
    if (trainingStatsAccuracyEl) trainingStatsAccuracyEl.textContent = `${trainingStats.average_form_accuracy || 0}%`;

    // タブ切り替え機能
    function setActiveTab(targetTab) {
        if (!tabTriggers || !tabContents) return;

        tabTriggers.forEach(trigger => {
            if (trigger.dataset.tab === targetTab) {
                trigger.dataset.state = 'active';
                // Tailwind 3.x data attribute styling
                trigger.classList.add('border-blue-500', 'text-blue-500');
                trigger.classList.remove('border-transparent');
            } else {
                trigger.dataset.state = 'inactive';
                trigger.classList.remove('border-blue-500', 'text-blue-500');
                trigger.classList.add('border-transparent');
            }
        });
        tabContents.forEach(content => {
            if (content.dataset.tabContent === targetTab) {
                content.dataset.state = 'active';
            } else {
                content.dataset.state = 'inactive';
            }
        });
    }

    if (tabTriggers) {
        tabTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                const targetTab = e.currentTarget.dataset.tab; // Use currentTarget
                setActiveTab(targetTab);
            });
        });
    }

    // 初期タブを設定 (例: ペット情報)
    setActiveTab('pet');
});
