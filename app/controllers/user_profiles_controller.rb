class UserProfilesController < ApplicationController
  skip_before_action :require_login, only: %i[new create show]
  def show
  end

  def new
    @profile = UserProfile.new
  end

  def create
    @profile = UserProfile.new(profile_params)
    if @profile.save
      redirect_to user_profiles_path
    else
      render :new
    end
  end

  def show
    @profile = current_user.user_profile
  end

  def edit
    @user = current_user
    @profile = current_user.user_profile
  end

  def update
    @user = current_user
    if @user.update(profile_params_update)
      redirect_to edit_user_profiles_path, notice: "更新に成功しました"
    else
      render :edit
    end
  end

  private
    def profile_params
      user_profile_params = params.require(:user_profile).permit(:height, :weight, :goal).merge(user_id: current_user.id)
    end

    def profile_params_update
      params.require(:user).permit(:first_name, :last_name, :email,
      user_profile_attributes: [ :id, :height, :weight, :goal ])
    end
end
