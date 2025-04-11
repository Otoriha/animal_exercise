class Contact < ApplicationRecord
  validates :message, presence: true
end
