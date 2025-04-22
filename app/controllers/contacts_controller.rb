class ContactsController < ApplicationController
  skip_before_action :require_login
  before_action :set_footer_flag, only: %i[new]

  def complete
    @message = session.delete(:contact_message)
  end

  def new
    @contact = Contact.new
  end

  def create
    @contact = Contact.new(contact_params)
    if @contact.valid?
      ContactMailer.send_contact_email(@contact).deliver_now
      flash[:notice] = "お問い合わせが送信されました。"
      redirect_to root_path
    else
      flash.now[:alert] = "送信に失敗しました。入力内容を確認してください。"
      render :new
    end
  end

  private

  def contact_params
    params.require(:contact).permit(:name, :email, :message)
  end

  def set_footer_flag
    @show_footer = true
  end
end
