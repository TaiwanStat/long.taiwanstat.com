#!/usr/bin/env python2.7
# -*- coding: utf-8 -*-
import requests
import csv
from datetime import datetime
from datetime import timedelta
from datetime import date
from geopy.distance import vincenty
import json

def read_json(file_name):
    with open(file_name, 'r') as input_file:
        return json.load(input_file)

def write_csv(file_name, content):
    """write csv"""
    with open(file_name, 'w') as output_file:
        writer = csv.writer(output_file)
        writer.writerows(content)

def write_json(file_name, content):
    """write json"""
    with open(file_name, 'w') as output_file:
        json.dump(content, output_file)



if __name__ == '__main__':
    r = requests.get('http://denguefever.csie.ncku.edu.tw/file/dengue_all.csv')
    r.encoding = 'utf-8'
    raw = r.text
    data = []
    for item in csv.reader(raw.splitlines()):
        data.append(item)

    weather = read_json('./weather.json')
    data = data[5:]
    data = sorted(data, key = lambda x: datetime.strptime(x[1], '%Y/%m/%d').date())
    current_date = data[0][1]
    count = 0
    new_data = []
    for row in data:
        event_date = row[1]
        if current_date == event_date:
            count += 1
        else:
            d = datetime.strptime(current_date, '%Y/%m/%d').date().strftime('%Y/%m/%d')
            w = weather[d]
            new_data.append({'date': current_date, 'value': count, \
                    '氣溫': w['氣溫'], '相對溼度': w['相對溼度'], '降水量': w['降水量']})
            count = 1
            current_date = event_date
    
    d = datetime.strptime(current_date, '%Y/%m/%d').date().strftime('%Y/%m/%d')
    w = weather[d]
    new_data.append({'date': current_date, 'value': count, \
        '氣溫': w['氣溫'], '相對溼度': w['相對溼度'], '降水量': w['降水量']})
    write_json('./bar-data.json', new_data)
