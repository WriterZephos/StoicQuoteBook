class QuoteText < ApplicationRecord
    belongs_to :quote
    belongs_to :translation

    def as_app_json
        as_json
    end
end