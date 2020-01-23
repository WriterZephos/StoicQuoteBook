Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  root 'index#index'

  get '/service-worker.js' => "service_workers#service_worker"
  get '/manifest.json' => "service_workers#manifest"

  namespace :api do 
  end

  namespace :app do
    resources :quotes, only: [:index, :create, :update, :show, :destroy]
    resources :people, only: [:index, :create, :update, :show, :destroy]
    resources :publications, only: [:index, :create, :update, :show, :destroy]
    get '/publications_by/:person_id' => 'publications#publications_by'
  end

  get '*path' => 'index#index'

end
