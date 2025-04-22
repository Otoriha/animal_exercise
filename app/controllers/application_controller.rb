class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern
  before_action :require_login, :set_layout_flags

  private

  def not_authenticated
    redirect_to login_path
  end

  def set_layout_flags
    @show_header = false
    @show_footer = false
  end
end
