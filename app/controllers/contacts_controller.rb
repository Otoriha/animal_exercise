class ContactsController < ApplicationController
  skip_before_action :require_login
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
      session[:contact_message] = @contact.message
      redirect_to complete_contacts_path
    else
      flash.now[:alert] = "送信に失敗しました。入力内容を確認してください。"
      render :new
    end
  end

  private

  def contact_params
    params.require(:contact).permit(:name, :message)
  end
end
