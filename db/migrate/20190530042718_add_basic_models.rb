class AddBasicModels < ActiveRecord::Migration[5.2]
  def change

    create_table :people do |t|
      t.string :name
      t.text :description
      t.string :wikipedia_link
      t.boolean :approved
    end

    create_table :publications do |t|
      t.string :title
      t.text :description
      t.string :wikipedia_link
      t.json :citation_fields, default: "[]"
      t.boolean :is_translated
      t.boolean :approved
    end
    add_reference :publications, :person, index: true, foreign_key: true

    create_table :translations do |t|
      t.string :translator
      t.string :description
    end
    add_reference :translations, :publication, index: true, foreign_key: true
    
    create_table :quotes do |t|
      t.text :key_words
      t.integer :rating_count
      t.integer :rating
      t.json :citation, default: "{}"
      t.boolean :approved
    end
    add_reference :quotes, :publication, index: true, foreign_key: true
    add_reference :quotes, :person, index: true, foreign_key: true

    create_table :quote_texts do |t|
      t.text :text
      t.integer :length
      t.boolean :approved
    end
    add_reference :quote_texts, :translation, index: true, foreign_key: true
    add_reference :quote_texts, :quote, index: true, foreign_key: true


  end
end
