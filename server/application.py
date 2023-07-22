from flask import Flask
from routes import routes


def create_app():
    app = Flask(__name__, static_url_path='',
                static_folder='../client/build', template_folder='../client/build')
    app.register_blueprint(routes)
    return app
