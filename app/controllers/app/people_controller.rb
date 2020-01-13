module App
    class PeopleController < ApplicationController
    
        def index
            offset = (params["page"].to_i - 1) * params["page_limit"].to_i
            people = Person.all.limit(100).offset(0).map do |person|
                hash = person.as_app_json
            end
            render json: people
        end

        def show
            render json: {person: Person.find(params[:id]).as_app_json}
        end
    
        def create
            person = Person.new(person_params)
            if person.save
                render json: {successful: true, person: person.as_app_json}
            elsif
                render json: {successful: false, errors: person.errors.full_messages}, status: 422
            end
        end

        def update
            person = Person.find(params[:id])
            if person.update(person_params)
                render json: {successful: true, person: person.as_app_json}
            elsif
                render json: {successful: false, errors: person.errors.full_messages}, status: 422
            end
            
        end
    
        def destroy
            person = Person.find(params[:id])
            if person.destroy
                render json: {successful: true}
            else
                render json: {successful: false, errors: person.errors.full_messages}, status: 422
            end
        end

        def person_params
            params[:person].permit(:name, :description, :wikipedia_link, :approved)
        end
        
    end
end
