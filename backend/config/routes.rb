Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      post '/auth/login', to: 'auth#login'
      post '/auth/register', to: 'auth#register'
      
      resources :tasks do
        resources :subtasks
      end
    end
  end
end