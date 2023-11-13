from flask import Flask
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from routes import routes


def create_app():
    app = Flask(__name__, static_url_path='',
                static_folder='../client/build', template_folder='../client/build')
    # Limit the maximum number of requests
    # TODO Move to configuration file
    Limiter(get_remote_address, app=app, default_limits=[
        "10 per minute",
        "50 per hour",
        "100 per day"
    ])
    # Maximum file size for uploading 
    # TODO Move to configuration file
    app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024
    app.register_blueprint(routes)
    return app
