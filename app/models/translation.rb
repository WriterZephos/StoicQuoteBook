class Translation < ApplicationRecord
    belongs_to :publication
    has_many :quote_texts

    def as_app_json
        as_json
    end
    
end