class MypageController < ApplicationController
  before_action :require_login
  before_action :set_user_profile

  def index
  end

  private

  def set_user_profile
    @user_profile = current_user.user_profile || current_user.build_user_profile
  end
end
