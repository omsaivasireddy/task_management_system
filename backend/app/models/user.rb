class User < ApplicationRecord
    has_secure_password
    
    has_many :tasks, dependent: :destroy
    
    validates :email, presence: true, uniqueness: true,
              format: { with: URI::MailTo::EMAIL_REGEXP }
    validates :name, presence: true
    validates :password, presence: true, length: { minimum: 6 }, on: :create
  end