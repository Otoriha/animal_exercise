class UserProfilesController < ApplicationController
  skip_before_action :require_login, only: %i[new create show]
  def show
  end

  def new
    @profile = UserProfile.new
  end

  def create
    @profile = UserProfile.new(profile_params)
    binding.pry
    if @profile.save
      redirect_to user_profiles_path
    else
      render :new
    end
  end

  private
    def profile_params
      user_profile_params = params.require(:user_profile).permit(:height, :weight, :goal).merge(user_id: current_user.id)
      user_profile_params[:height] = user_profile_params[:height].to_f
      user_profile_params[:weight] = user_profile_params[:weight].to_f
      user_profile_params
    end
end
