Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  root 'index#index'

  namespace :api do 

  end

  namespace :app do
    resources :quotes, only: [:index, :create, :update, :show]
    resources :people, only: [:index, :create, :update, :show]
    resources :publications, only: [:index, :create, :update, :show]
    get '/publications_by/:person_id' => 'publications#publications_by'
  end

  get '*path' => 'index#index'

end
