class Translation < ApplicationRecord
    belongs_to :publication
    has_many :quote_texts, dependent: :destroy

    validates :publication, presence: true
    validates :translator, presence: true
    validates :description, presence: true
    validates_uniqueness_of :publication, scope: :translator

    def as_app_json
        as_json
    end
    
end