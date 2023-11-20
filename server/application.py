from flask import Flask
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from .routes import routes
from .config import Config


def create_app():
    app = Flask(__name__, static_url_path='',
                static_folder='../client/build', template_folder='../client/build')
    config = Config()
    # Limit the maximum number of requests
    Limiter(get_remote_address, app=app, default_limits=[
        f"{config.read('Limits', 'MaxConnectionsNumberPerMinute', int)} per minute",
        f"{config.read('Limits', 'MaxConnectionsNumberPerHour', int)} per hour",
        f"{config.read('Limits', 'MaxConnectionsNumberPerDay', int)} per day"
    ])
    # Maximum file size for uploading
    app.config['MAX_CONTENT_LENGTH'] = config.read(
        'Limits', 'MaxContentSize', int)
    app.register_blueprint(routes)
    return app
