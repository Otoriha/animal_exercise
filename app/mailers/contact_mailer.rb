class ContactMailer < ApplicationMailer
  default to: "t.k.oshihiki@gmail.com" # 自分のメールアドレスを指定

  def send_contact_email(contact)
    @contact = contact
    mail(subject: "お問い合わせが届きました")
  end
end
