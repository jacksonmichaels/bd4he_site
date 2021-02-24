from flask import render_template, Blueprint, flash
import json
import os
main_blueprint = Blueprint('main', __name__)


@main_blueprint.route('/')
def index():
    return home()


@main_blueprint.route('/bios')
def bios():
    f = open("app/static/data/bios.json", 'r',encoding="utf8")
    bio_data = json.load(f)
    institutions = os.listdir("app/static/images/institutions")
    return render_template('pages/bios.html', faculty=bio_data['faculty'], non_faculty = bio_data['non_faculty'], institutions=institutions)

@main_blueprint.route('/home')
def home():
    f = open("app/static/data/bios.json", 'r',encoding="utf8")
    bio_data = json.load(f)
    f = open("app/static/data/pubs.json", 'r',encoding="utf8")
    pub_data = json.load(f)
    f = open("app/static/data/on_going.json", 'r',encoding="utf8")
    going_data = json.load(f)
    f = open("app/static/data/media.json", 'r',encoding="utf8")
    media_data = json.load(f)
    return render_template('pages/everything.html', pub_data=pub_data, going_data=going_data, media_data=media_data)

