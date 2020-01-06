class Quote < ApplicationRecord
    belongs_to :person
    belongs_to :publication
    has_many :quote_texts

    accepts_nested_attributes_for :quote_texts, allow_destroy: true, reject_if: :quote_text_invalid

    def quote_text_invalid(attributes)
        attributes['text'].blank?
    end

    def as_app_json
        hash = as_json
        hash[:person] = person.as_app_json if person
        hash[:publication] = publication.as_app_json if publication
        hash[:formatted_citation] = formatted_citation
        hash[:quote_texts_attributes] = quote_texts.map(&:as_app_json)
        hash
    end

    def formatted_citation
        return "" unless publication
        field_citaiton = citation.map do |field_name, value|
            "#{field_name}: #{value}"
        end.join(",")
        "#{person.name}. #{publication.title}. (" + field_citaiton + ")"
    end

end