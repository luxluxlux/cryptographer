from flask import Flask
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_compress import Compress
from .routes import routes
from .errors import errors
from .config import Config

limiter = Limiter(get_remote_address)
compress = Compress()


def create_app():
    app = Flask(__name__, static_url_path='',
                static_folder='../client/build', template_folder='../client/build')
    app.register_blueprint(routes)
    app.register_blueprint(errors)

    config = Config()
    rate_limit = (
        f"{config.read('Limits', 'MaxConnectionsNumberPerMinute', int)} per minute; "
        f"{config.read('Limits', 'MaxConnectionsNumberPerHour', int)} per hour; "
        f"{config.read('Limits', 'MaxConnectionsNumberPerDay', int)} per day"
    )
    app.config['RATELIMIT_APPLICATION'] = rate_limit

    limiter.init_app(app)
    compress.init_app(app)

    return app
