#!/usr/bin/env python2.7
# -*- coding: utf-8 -*-
import requests
import csv
import sys
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

def get_circle_data(input_data):
    """get circle data"""
    circle = []
    count = 0
    for each in input_data:
        p1 = (each[-2], each[-1])
        for item in input_data:
            p2 = (item[-2], item[-1])
            dis = vincenty(p1, p2).meters
            if dis < 500:
                count += 1
            if count > len(input_data)*0.03:
                break

        if count > len(input_data)*0.03:
            tmp = each.copy()
            tmp.append(count)
            circle.append(tmp)
        count = 0
    return circle

if __name__ == '__main__':
    r = requests.get('http://denguefever.csie.ncku.edu.tw/file/dengue_all.csv')
    r.encoding = 'utf-8'
    raw = r.text
    data = []
    print (r.text)
    for item in csv.reader(raw.splitlines()):
        data.append(item)

    new_data = read_json('./data.json')
    d = '2015/9/21'
    now = datetime.strptime(d, '%Y/%m/%d').date()
    end = datetime.strptime(data[-1][1], '%Y/%m/%d').date() + timedelta(days=1)
    row = data[0]
    row[1] = '日期'
    row[2] = '區別'
    row[-2] = 'Latitude'
    row[-1] = 'Longitude'
    header = row
    header.append('count')
    data = data[1:]
    while now < end:
        in_three_days = []
        in_five_days = []
        for row in data:
            event_date = datetime.strptime(row[1], '%Y/%m/%d').date()
            if event_date > now:
                break
            delta = now - event_date
            row[-1], row[-2] = float(row[-1]), float(row[-2])
            if delta.days < 5:
                in_five_days.append(row)
                if delta.days < 3:
                    in_three_days.append(row)
               
        three_cirlce = [header] + get_circle_data(in_three_days)
        five_cirlce = [header] + get_circle_data(in_five_days)
        new_data[now.strftime('%Y/%m/%d')] = {}
        new_data[now.strftime('%Y/%m/%d')]['three'] = three_cirlce
        new_data[now.strftime('%Y/%m/%d')]['five'] = five_cirlce
        print (now)
        now += timedelta(days=1)

    write_json('data.json', new_data)
