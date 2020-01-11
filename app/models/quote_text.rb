class QuoteText < ApplicationRecord
    belongs_to :quote
    belongs_to :translation, optional: true

    validates :quote, presence: true
    validates :text, presence: true
    validates :approved, inclusion: { in: [ true, false ] }

    def as_app_json
        as_json
    end
end