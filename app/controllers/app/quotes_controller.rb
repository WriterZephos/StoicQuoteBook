module App
    class QuotesController < ApplicationController

        def index
          offset = (params["page"].to_i - 1) * params["page_limit"].to_i
          quotes = Quote.all.includes(:person,:publication,:quote_texts).limit(100).offset(0).map(&:as_app_json)
          render json: quotes
        end

        def show
          quote = Quote.find(params[:id])
          render json: quote.as_app_json
        end

        def create
          quote = Quote.new(quote_params)
          if quote.save
              render json: quote.as_app_json
          elsif
              render json: quote.as_app_json
          end
        end

        def update
          quote = Quote.find(params[:id])
          quote.update(quote_params)
          render json: quote.as_app_json
        end

        def quote_params
          params.require(:quote).permit(:id, :person_id, :publication_id, :key_words, { quote_texts_attributes: [:id, :text, :translation_id], :citation => []})
        end

    end
end
