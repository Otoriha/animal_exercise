Rails.application.routes.draw do
  get "toppage/index"
  get "posts/index"
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/*
  get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker
  get "manifest" => "rails/pwa#manifest", as: :pwa_manifest

  # Defines the root path route ("/")
  root "toppage#index"

  # Mypage routes
  get "mypage", to: "mypage#index", as: :mypage

  get "login", to: "user_sessions#new"
  post "login", to: "user_sessions#create"
  delete "logout", to: "user_sessions#destroy"

  get "/help",    to: "pages#help"
  get "/terms",   to: "pages#terms"
  get "/privacy", to: "pages#privacy"

  resources :users, only: %i[new create]
  resource :user_profiles, only: %i[new create show edit update]
  resources :contacts, only: %i[new create] do
    collection do
      get :complete
    end
  end

  if Rails.env.development?
    mount LetterOpenerWeb::Engine, at: "/letter_opener"
  end
end
