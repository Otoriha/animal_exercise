class CreateUserSessions < ActiveRecord::Migration[7.2]
  def change
    create_table :user_sessions do |t|
      t.timestamps
    end
  end
end
