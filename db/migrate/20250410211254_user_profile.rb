class UserProfile < ActiveRecord::Migration[7.2]
  def change
    create_table :user_profiles do |t|
      t.float  :height
      t.float  :weight
      t.date   :birth_date
      t.string :goal
      t.references :user, foreign_key: true
      t.timestamps                null: false
    end
  end
end
