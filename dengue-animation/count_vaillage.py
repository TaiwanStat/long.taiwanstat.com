#!/usr/bin/env python2.7
# -*- coding: utf-8 -*-
import requests
import csv
from datetime import datetime
from datetime import timedelta
from datetime import date
from geopy.distance import vincenty
import json
from lib import json_io
from lib import csv_io

if __name__ == '__main__':
    r = requests.get('http://denguefever.csie.ncku.edu.tw/file/dengue_all.csv')
    r.encoding = 'utf-8'
    raw = r.text
    data = []
    for item in csv.reader(raw.splitlines()):
        data.append(item)

    weather = json_io.read_json('./weather.json')
    data = data[5:]
    data = sorted(data, key = lambda x: datetime.strptime(x[1], '%Y/%m/%d').date())
    current_date = data[0][1]
    count = 0
    new_data = {}
    tmp = {}
    for row in data:
        if row[3] not in tmp:
            tmp[row[3]] = 0

        event_date = row[1]
        if current_date == event_date:
            tmp[row[3]] += 1
        else:
            d = datetime.strptime(current_date, '%Y/%m/%d').date()
            rain = 0
            rain_day = -1
            for i in range(0, 4): 
                if int(weather[d.strftime('%Y/%m/%d')]['降水量']) > 0:
                    rain = weather[d.strftime('%Y/%m/%d')]['降水量']
                    rain_day = i
                d = d - timedelta(days=1)

            for v in tmp:
                if v not in new_data:
                    new_data[v] = []
                new_data[v].append({'date': current_date, 'value': tmp[row[3]], \
                        '降水量': rain, 'rain_day': rain_day})
            tmp = {}
            tmp[row[3]] = 1
            current_date = event_date
    
    d = datetime.strptime(current_date, '%Y/%m/%d').date()
    rain = 0
    for i in range(0, 4): 
        if int(weather[d.strftime('%Y/%m/%d')]['降水量']) > 0:
            rain = weather[d.strftime('%Y/%m/%d')]['降水量']
            rain_day = i
            break
        d = d - timedelta(days=1)

    for v in tmp:
        if v not in new_data:
            new_data[v] = []
        new_data[v].append({'date': current_date, 'value': tmp[row[3]], \
                '降水量': rain, 'rain_day': rain_day})
    json_io.write_json('./village-bar-data.json', new_data)
