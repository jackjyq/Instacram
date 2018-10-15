from flask_restplus import abort
from flask import request

def get_request_json():
    j = request.json
    if not j:
        abort(400, "Expected a JSON object. Make sure you've set the 'Content-Type' header to 'application/json'.")
    return j
