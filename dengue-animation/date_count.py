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
    r = requests.get('http://data.tainan.gov.tw/dataset/558392bb-96cc-4924-a6b0-1e4d223c0a57/resource/5f154e10-a504-4ce4-9455-28ad7cd0c9ed/download/2015denguefeverendenmiccases.csv') 

    r = requests.get('http://data.tainan.gov.tw/dataset/d3fa6e37-4696-45a4-ab91-8010c77d6724/resource/34f191b3-276c-4232-b413-f5a3a89be4d6/download/092250912731.csv')

    r.encoding = 'utf-8'
    raw = r.text
    data = []
    for item in csv.reader(raw.splitlines()):
        data.append(item)

    data = data[6:]
    d = data[0][1]
    head = True
    current_date = d
    count = 0
    new_data = []
    data = sorted(data, key = lambda x: datetime.strptime(x[1], '%Y/%m/%d').date())
    weather = read_json('./weather.json')
    for row in data:
        if head:
            head = False
            continue
        event_date = row[1]
        if current_date == event_date:
            count += 1
        else:
            d = datetime.strptime(current_date, '%Y/%m/%d').date().strftime('%Y/%m/%d')
            w = weather[d]
            new_data.append({'date': current_date, 'value': count, \
                    '氣溫': w['氣溫'], '相對濕度': w['相對溼度'], '降水量': w['降水量']})
            count = 1
            current_date = event_date
    
    new_data.append({'date': current_date, 'value': count, \
        '氣溫': w['氣溫'], '相對濕度': w['相對溼度'], '降水量': w['降水量']})
    write_json('./bar-data.json', new_data)
