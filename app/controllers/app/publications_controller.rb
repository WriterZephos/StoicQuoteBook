module App
    class PublicationsController < ApplicationController

        def index
            # TODO Implement pagination
            offset = (params["page"].to_i - 1) * params["page_limit"].to_i
            publications = Publication.includes(:person).includes(:translations).limit(100).offset(0).map(&:as_app_json)
            render json: publications
        end

        def publications_by
            publications = Publication.includes(:person).includes(:translations).where(person_id: params[:person_id]).map(&:as_app_json)
            render json: publications
        end
    
        def show
            publication = Publication.includes(:translations).find(params[:id])
            render json: publication.as_app_json
        end
    
        def create
            publication = Publication.new(publication_params)
            if publication.save
                render json: publication.as_app_json
            elsif
                render json: publication.as_app_json
            end
        end

        def update
            publication = Publication.find(params[:id])
            publication.update(publication_params)
            render json: publication.as_app_json
        end

        def destroy
            publication = Publication.find(params[:id])
            if publication.destroy
                render json: {result: true}
            else
                render json: {result: false}
            end
        end
    
        def publication_params
            params.require(:publication).permit(:title, :description, :person_id, :wikipedia_link, :is_translated, { translations_attributes: [:id, :translator, :description]}, :citation_fields => [])
        end
    
        def search_params
            params[:q] ? params[:q] : {}
        end
    
    end
end
