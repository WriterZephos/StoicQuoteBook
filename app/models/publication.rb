class Publication < ApplicationRecord
    belongs_to :person
    has_many :quotes
    has_many :translations

    accepts_nested_attributes_for :translations, allow_destroy: true, reject_if: proc { |attributes| attributes['translator'].blank? }

    def as_app_json
        hash = as_json
        hash[:person] = person.as_app_json if person
        hash[:translations_attributes] = translations.map(&:as_app_json)
        hash
    end

end