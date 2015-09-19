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
                #print (dis, each[2], item[2])
                count += 1
        if count > len(input_data)*0.03:
            #print (circle)
            tmp = each.copy()
            tmp.append(count)
            circle.append(tmp)
        count = 0
    return circle

if __name__ == '__main__':
    r = requests.get('http://data.tainan.gov.tw/dataset/558392bb-96cc-4924-a6b0-1e4d223c0a57/resource/5f154e10-a504-4ce4-9455-28ad7cd0c9ed/download/2015denguefeverendenmiccases.csv') 
    r.encoding = 'big5'
    raw = r.text
    data = []
    for item in csv.reader(raw.splitlines()):
        data.append(item)

    data.pop(1) # remove 103 year
    #now = datetime.now().date()
    new_data = read_json('./data.json')
    d = '2015/9/14'
    now = datetime.strptime(d, '%Y/%m/%d').date()
    end = date(2015, 9, 15)
    row = data[0]
    row[1] = '日期'
    row[2] = '區別'
    row[-2] = 'Latitude'
    row[-1] = 'Longitude'
    header = row
    header.append('count')
    while now < end:
        head = True
        now += timedelta(days=1)
        in_three_days = []
        in_five_days = []
        for row in data:
            if head:
                head = False
                continue
            # date convert 104 convert 105
            if '.' in row[1]:
                y, m, d = row[1].split('.')
                y = '2015'
                m = str(int(m))
                d = str(int(d))
                row[1] = '/'.join([y, m, d])
                row[4] += '里'
            
            event_date = datetime.strptime(row[1], '%Y/%m/%d').date()
            if event_date > now:
                break
            delta = abs(now-event_date)
            row[-1], row[-2] = float(row[-1]), float(row[-2])
            if delta.days < 3:
                in_three_days.append(row)
            if delta.days < 5:
                in_five_days.append(row)
               
        new_data[now.strftime('%Y/%m/%d')] = {}
        three_cirlce = get_circle_data(in_three_days)
        five_cirlce = get_circle_data(in_five_days)
        print (now)
        three_cirlce = [header] + three_cirlce
        five_cirlce = [header] + five_cirlce
        new_data[now.strftime('%Y/%m/%d')]['three'] = three_cirlce
        new_data[now.strftime('%Y/%m/%d')]['five'] = five_cirlce

    write_json('data.json', new_data)
