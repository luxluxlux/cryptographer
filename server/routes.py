from flask import Blueprint, render_template, request
from user_agents import parse

routes = Blueprint("routes", __name__)


@routes.route('/')
@routes.route('/secure')
@routes.route('/download')
def index():
    ua_string = request.headers.get('User-Agent', '')
    ua = parse(ua_string)
    prefix = 'mobile/' if ua.is_mobile else ''

    popup = request.args.get('popup')
    if popup in ['how-it-works', 'faq', 'about', 'license-agreement']:
        return render_template(f'{prefix}{popup}/index.html')

    return render_template(f'{prefix}index.html')
