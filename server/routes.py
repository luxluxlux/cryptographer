import io
from flask import Blueprint, request, render_template, send_file
# from .cryptographer import Cryptographer

routes = Blueprint("routes", __name__)
# cryptographer = Cryptographer()


@routes.route('/')
@routes.route('/password')
@routes.route('/success')
@routes.route('/failure')
def index():
    return render_template('index.html')


# @routes.route('/crypt', methods=['POST'])
# def crypt():
#     file = request.files.get('file')
#     password = request.form.get('password')
#     # TODO Handle the exception
#     hash = {
#         'encrypt': cryptographer.encrypt,
#         'decrypt': cryptographer.decrypt
#     }[request.form.get('action')](file, password)
#     return send_file(io.BytesIO(hash), as_attachment=True, mimetype=file.mimetype, download_name=file.filename)
