from flask import Blueprint, render_template

routes = Blueprint("routes", __name__)

# TODO: Use universal route for all paths
@routes.route('/')
@routes.route('/password')
@routes.route('/success')
def index():
    return render_template('index.html')
