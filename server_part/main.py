from flask import Flask
from flask.globals import request
from flask_cors import CORS
import sqlite3
import json

app = Flask(__name__)
CORS(app)


@app.route('/')  # for level dowload
def main():
    c = sqlite3.connect('levels.db')
    cur = c.cursor()
    first = request.args.get('f')
    second = request.args.get('s')
    try:
        data = cur.execute('SELECT * from levels WHERE f = ? and s = ?', [first, second]).fetchall()[0]
        response = {'height': data[3], 'field': list(data[2]), 'start_size': data[4]}
    except IndexError:
        response = {}
    response = json.dumps(response)
    return response, 200


@app.route('/level_category')  # for adding new level
def count_category():
    c = sqlite3.connect('levels.db')
    cur = c.cursor()
    x = request.args.get('f')
    response = json.dumps(cur.execute('SELECT COUNT() FROM levels GROUP BY f HAVING f=?', x).fetchall()[0])
    return response, 200


app.run()
