class Person < ApplicationRecord
    has_many :publications, dependent: :destroy
    has_many :quotes, dependent: :destroy

    validates :name, presence: true, uniqueness: true
    validates :description, presence: true
    validates :wikipedia_link, presence: true, uniqueness: true
    validates :approved, inclusion: { in: [ true, false ] }

    def as_app_json
        as_json
    end

end