class Person < ApplicationRecord
    has_many :publications
    has_many :quotes

    def as_app_json
        as_json
    end

end