#!/usr/bin/env python2.7
# -*- coding: utf-8 -*-
import requests
from datetime import datetime
from datetime import timedelta
from datetime import date
from geopy.distance import vincenty
from lib import json_io
from lib import csv_io

url = 'http://denguefever.csie.ncku.edu.tw/file/dengue_all.csv'
data = csv_io.req_csv(url, 'utf-8')
weather_data = json_io.read_json('../data/weather.json')

def format_data(current_date, value):
    d = datetime.strptime(current_date, '%Y/%m/%d').date().strftime('%Y/%m/%d')
    return {\
            'date': current_date, \
            'value': value, \
            '氣溫': weather_data[d]['氣溫'], \
            '相對溼度': weather_data[d]['相對溼度'], \
            '降水量': weather_data[d]['降水量'] \
           }

def insert_village_data(village_data, village_values, current_date):
    d = datetime.strptime(current_date, '%Y/%m/%d').date()
    rain, rain_day = 0, -1
    for i in range(0, 3): 
        if int(weather_data[d.strftime('%Y/%m/%d')]['降水量']) > 0:
            rain += weather_data[d.strftime('%Y/%m/%d')]['降水量']
            rain_day = i + 1
        d -= timedelta(days=1)

    for v in village_values:
        if v not in village_data:
            village_data[v] = []
        village_data[v].append({\
                'date': current_date, \
                'value': village_values[v], \
                '降水量': rain, \
                'rain_day': rain_day\
                })


if __name__ == '__main__':
    # from 6m
    value = 0
    data = data[5:]
    data = sorted(data, key = lambda x: datetime.strptime(x[1], '%Y/%m/%d').date())
    current_date = data[0][1]
    output_data = []
    village_data = {}
    village_values = {}
    for item in data:
        key = item[2].replace(' ', '') + item[3]
        if key not in village_values:
            village_values[key] = 0

        event_date = item[1]
        if current_date == event_date:
            value += 1
            village_values[key] += 1
        else:
            output_data.append(format_data(current_date, value))
            insert_village_data(village_data, village_values, current_date)
            current_date = event_date
            value = 1
            village_values = {}
   
    output_data.append(format_data(current_date, value))
    insert_village_data(village_data, village_values, current_date)
    json_io.write_json('../data/village_bar_data.json', village_data)
    json_io.write_json('../data/bar_data.json', output_data)
    print (output_data[-1], 'done.')
