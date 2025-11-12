from flask import Blueprint, render_template, request
from user_agents import parse


errors = Blueprint("errors", __name__)


@errors.app_errorhandler(404)
def page_not_found(err):
    return render_template('404.html'), 404
