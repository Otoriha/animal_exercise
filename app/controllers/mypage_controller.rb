class MypageController < ApplicationController
  before_action :require_login
  before_action :set_user_profile
  before_action :set_header_flag, only: %i[index]

  def index
    # 本来はデータベースなどから取得しますが、ここではダミーデータを使用します。
    @user_data = {
      username: "トレーニング太郎",
      last_login: "2025-04-10T15:30:00"
    }.to_json

    @pet_data = {
      name: "トレーニングパートナー",
      level: 5,
      experience_points: 450,
      points_to_next_level: 100,
      evolution_name: "初級猫トレーナー",
      evolution_description: "トレーニングを始めたばかりの初心者猫。基本的な動きをマスターし始めています。",
      image_url: "https://via.placeholder.com/160", # Placeholder image
      parameters: {
        arm: { level: 5, experience: 85, next_level_exp: 100 },
        belly: { level: 6, experience: 30, next_level_exp: 120 },
        leg: { level: 4, experience: 60, next_level_exp: 80 }
      },
      next_evolution: {
        required_arm_level: 8,
        required_belly_level: 7,
        required_leg_level: 6
      }
    }.to_json

    @rewards_data = {
      unviewed_count: 2
    }.to_json

    @exercises_data = [
      {
        id: 1,
        name: "腕立て伏せ",
        description: "胸と腕を鍛える基本トレーニング",
        target_muscle: "腕",
        thumbnail_url: "https://via.placeholder.com/64",
        measurement_type: "回数型",
        reps_per_set: 10
      },
      {
        id: 2,
        name: "スクワット",
        description: "下半身を鍛える基本トレーニング",
        target_muscle: "脚",
        thumbnail_url: "https://via.placeholder.com/64",
        measurement_type: "回数型",
        reps_per_set: 15
      },
      {
        id: 3,
        name: "プランク",
        description: "コアを鍛えるトレーニング",
        target_muscle: "お腹",
        thumbnail_url: "https://via.placeholder.com/64",
        measurement_type: "時間型",
        reps_per_set: 30
      },
      {
        id: 4,
        name: "腹筋",
        description: "腹部を鍛える基本トレーニング",
        target_muscle: "お腹",
        thumbnail_url: "https://via.placeholder.com/64",
        measurement_type: "回数型",
        reps_per_set: 12
      }
    ].to_json

    # トレーニング統計データ (これも本来は動的に生成)
    @training_stats = {
      weekly_sessions: 3,
      total_time_minutes: 45,
      average_form_accuracy: 87
    }.to_json
  end

  private

  def set_user_profile
    Rails.logger.debug "Current User in set_user_profile (before access): #{current_user.inspect}"
    @user_profile = current_user.user_profile || current_user.build_user_profile
  end

  def set_header_flag
    @show_header = true
  end
end
