from flask import Flask, request, jsonify, g, abort
import os
import json
import sqlite3
from pymongo import MongoClient
import hashlib
import time
import requests
import uuid
import logging
from sys import getsizeof

app = Flask(__name__)

log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)
log.disabled = True

def init_db_sqlite3():
    db = get_db_sqlite3()
    sql = """
CREATE TABLE IF NOT EXISTS `sensor` (
 `id` bigint PRIMARY KEY,
 `device` varchar(128) NOT NULL,
 `ts` double NOT NULL,
 `seq` bigint NOT NULL,
 `dsize` int NOT NULL,
 `dhash` varchar(128) NOT NULL
)
"""
    cursor = db.cursor()
    cursor.execute(sql)
    db.commit()
    cursor.close()


def get_db_sqlite3():
    if 'db' not in g:
        g.db = sqlite3.connect("iot.db")
        init_db_sqlite3()

    return g.db


def insert_record_sqlite3(r):
    m = hashlib.md5()
    m.update(r["sensor_data"].encode('utf-8'))
    dhash = m.hexdigest()[:30]

    db = get_db_sqlite3()
    sql = """
INSERT INTO `sensor` (device, ts, seq, dsize, dhash) 
VALUES (?,?,?,?,?)
"""
    cursor = db.cursor()
    cursor.execute(sql, (r["dev_id"], r["ts"], r["seq_no"], r["data_size"], dhash))
    db.commit()
    cursor.close()


def query_record_sqlite3(page):
    sql = """
SELECT * FROM `sensor` LIMIT 10 OFFSET %d
""" % (page * 10,)
    db = get_db_sqlite3()
    cursor = db.cursor()
    rows = cursor.execute(sql)
    records = []
    for row in rows:
        records.append({'id': row[0], 'device': row[1], 'ts': row[2], 'seq': row[3], 'size': row[4], 'hash': row[5]})
    db.commit()
    cursor.close()
    return records


def get_db_mongo():
    if 'db' not in g:
        user = os.environ.get("ME_CONFIG_MONGODB_ADMINUSERNAME")
        passwd = os.environ.get("ME_CONFIG_MONGODB_ADMINPASSWORD")
        g.mg_client = MongoClient("mongodb://%s:%s@%s:27017/" % (user, passwd, "db"))
        g.db = g.mg_client.iot
        print(user, passwd, g.mg_client, g.db)
    return g.db


def insert_record_mongo(r):
    m = hashlib.md5()
    m.update(r["sensor_data"].encode('utf-8'))
    dhash = m.hexdigest()[:30]

    url = "http://service.localhost:3000/invoke"
    args = [str(r["dev_id"]), str(r["sensor_data"][0:256])]

    payload = {"function": "Write", "args": args}
    # print("send data: ")
    # print(str(r["sensor_data"][0:128]))
    # print("bytes:")
    #print(getsizeof(str(r["sensor_data"][0:256])))
    headers = {'content-type': "application/json"}
    # payload = { "record_id":uuid.uuid4().hex, "device": str(r["dev_id"]), "ts": str(r["ts"]), "seq": str(r["seq_no"]), "ddata": str(r["sensor_data"][0:128]), "dsize": str(r["data_size"]), "dhash": str(dhash) }
    response = requests.request("POST", url, data=json.dumps(payload), headers=headers)
    # reply = json.loads(response.status_code)
    if response.status_code == 200:
        return 1
    return 0


def query_record_mongo(page):
    db = get_db_mongo()
    records = []
    for r in db.sensors.find().limit(10).skip(page * 10):
        records.append(r)
    return records


@app.route("/sensor/add", methods=['POST'])
def add_sensor_record():
    data = json.loads(request.get_data())
    status = insert_record_mongo(data)
    if status == 1:
        return jsonify({"status": status})
    abort(400)


@app.route("/sensor/query/<int:page>")
def query_sensor_record(page):
    return jsonify(query_record_mongo(page))


if __name__ == "__main__":
    # Only for debugging while developing
    app.run(host="0.0.0.0", debug=False, port=80)