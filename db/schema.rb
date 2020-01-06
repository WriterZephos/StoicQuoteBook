# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2019_05_30_042718) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "people", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.string "wikipedia_link"
    t.boolean "approved"
  end

  create_table "publications", force: :cascade do |t|
    t.string "title"
    t.text "description"
    t.string "wikipedia_link"
    t.json "citation_fields", default: "[]"
    t.boolean "is_translated"
    t.boolean "approved"
    t.bigint "person_id"
    t.index ["person_id"], name: "index_publications_on_person_id"
  end

  create_table "quote_texts", force: :cascade do |t|
    t.text "text"
    t.integer "length"
    t.boolean "approved"
    t.bigint "translation_id"
    t.bigint "quote_id"
    t.index ["quote_id"], name: "index_quote_texts_on_quote_id"
    t.index ["translation_id"], name: "index_quote_texts_on_translation_id"
  end

  create_table "quotes", force: :cascade do |t|
    t.text "key_words"
    t.integer "rating_count"
    t.integer "rating"
    t.json "citation", default: "{}"
    t.boolean "approved"
    t.bigint "publication_id"
    t.bigint "person_id"
    t.index ["person_id"], name: "index_quotes_on_person_id"
    t.index ["publication_id"], name: "index_quotes_on_publication_id"
  end

  create_table "translations", force: :cascade do |t|
    t.string "translator"
    t.string "description"
    t.bigint "publication_id"
    t.index ["publication_id"], name: "index_translations_on_publication_id"
  end

  add_foreign_key "publications", "people"
  add_foreign_key "quote_texts", "quotes"
  add_foreign_key "quote_texts", "translations"
  add_foreign_key "quotes", "people"
  add_foreign_key "quotes", "publications"
  add_foreign_key "translations", "publications"
end
