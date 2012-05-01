#!/usr/bin/env python

import json
import sys
import webbrowser

import flask

import pymworks


#MAXEVENTS = 10000000
MAXEVENTS = None

fn = '/home/graham/Repositories/braingram/pymworks/test/error.mwk'
if len(sys.argv) > 1:
    fn = sys.argv[1]
debug = False
if len(sys.argv) > 2:
    debug = True

datafile = pymworks.open_file(fn)

app = flask.Flask(__name__)


def events_to_json(events):
    if (MAXEVENTS is not None) and (len(events) > MAXEVENTS):
        s = slice(0, len(events), len(events) / MAXEVENTS + 1)
    else:
        s = slice(len(events))

    return json.dumps([{'code': e.code, 'time': e.time / float(1E6), \
            'value': e.value, 'name': datafile.to_name(e.code)} \
            for e in events[s]])


@app.route('/events/')
def get_all_events():
    return events_to_json(datafile.get_events())


@app.route('/events/<names>')
def get_events(names):
    return events_to_json(datafile.get_events([str(s) for \
            s in names.split(' ')]))


@app.route('/')
def get_index():
    return flask.render_template('index.html', names=datafile.codec.values())

if not debug:
    webbrowser.open('http://127.0.0.1:5000')
app.run(debug=False)
