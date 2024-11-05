from flask import Blueprint, render_template

routes = Blueprint("routes", __name__)


@routes.route('/')
@routes.route('/password')
@routes.route('/success')
@routes.route('/failure')
def index():
    return render_template('index.html')
