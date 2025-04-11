class UserProfilesController < ApplicationController
  skip_before_action :require_login, only: %i[new create show]
  def show
  end

  def new
    @profile = UserProfile.new
  end

  def create
    params[:user_profile][:birth_date] = birth_date
    @profile = UserProfile.new(profile_params)

    if @profile.save
      redirect_to user_profiles_path
    else
      render :new
    end
  end

  private
    def profile_params
      params.require(:user_profile).permit(:height, :weight, :goal, :birth_date)
    end

    def birth_date
      year = params[:user_profile]["birth_date(1i)"].to_i
      month = params[:user_profile]["birth_date(2i)"].to_i
      day = params[:user_profile]["birth_date(3i)"].to_i
    end
end
