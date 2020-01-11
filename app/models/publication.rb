class Publication < ApplicationRecord
    belongs_to :person
    has_many :quotes, dependent: :destroy
    has_many :translations, dependent: :destroy
    
    validates :person, presence: true
    validates :title, presence: true, uniqueness: true
    validates :description, presence: true
    validates :wikipedia_link, presence: true, uniqueness: true
    validates :is_translated, presence: true
    validates :approved, inclusion: { in: [ true, false ] }
    validates_associated :translations
    validate :validate_translation_uniqueness

    accepts_nested_attributes_for :translations, allow_destroy: true, reject_if: proc { |attributes| attributes['translator'].blank? }

    def validate_translation_uniqueness
        if translations.group_by{ |t| t.translator }.select { |k, v| v.size > 1 }.any?
            errors.add(:translations, "must all be unique.")
        end
    end

    def as_app_json
        hash = as_json
        hash[:person] = person.as_app_json if person
        hash[:translations_attributes] = translations.map(&:as_app_json)
        hash
    end

end