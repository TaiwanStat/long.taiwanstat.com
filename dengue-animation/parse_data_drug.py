#!/usr/bin/env python2.7
# -*- coding: utf-8 -*-
import requests
import csv
from datetime import datetime
from datetime import timedelta
from datetime import date
from geopy.distance import vincenty
import json


def write_json(file_name, content):
    """write json"""
    with open(file_name, 'w') as output_file:
        json.dump(content, output_file)

def write_csv(file_name, content):
    """write csv"""
    with open(file_name, 'w') as output_file:
        writer = csv.writer(output_file)
        writer.writerows(content)

def get_data(raw):
    data = []
    for item in csv.reader(raw.splitlines()):
        # 序號 噴藥 區域 里別 日期 緯度 經度
        data.append([item[0], item[4], item[8], item[9]])
    return data

if __name__ == '__main__':
    r0 = requests.get('http://data.tainan.gov.tw/dataset/4c260d97-e268-4b4a-8b15-c0fc92a25120/resource/316034ad-f2ae-4a8e-bafd-d6d98e388aaa/download/10408.csv')
    r0.encoding = 'utf-8'
    raw0 = r0.text
    r = requests.get('http://data.tainan.gov.tw/dataset/4c260d97-e268-4b4a-8b15-c0fc92a25120/resource/bfc307f5-471f-45eb-a7fe-4ef8927bcdb4/download/10409.csv')
    r.encoding = 'utf-8'
    raw = r.text

    tmp_raw = get_data(raw)
    tmp_raw = tmp_raw[1:]
    data = get_data(raw0) + tmp_raw
    tmp = '2015年' + data[1][1]
    now = datetime.strptime(tmp, '%Y年%m月%d日').date()
    tmp = '2015年' + data[-1][1]
    end = datetime.strptime(tmp, '%Y年%m月%d日').date() + timedelta(days=1)

    row = data[0]
    row[0] = '編號'
    row[2] = '區別'
    row[-2] = 'Latitude'
    row[-1] = 'Longitude'
    header = row
    new_data = {}
    while now < end:
        head = True
        data_tmp = []
        for row in data:
            if head:
                head = False
                data_tmp.append(header)
                continue
            d = '2015年' + row[1]
            event_date = datetime.strptime(d, '%Y年%m月%d日').date()
            if event_date > now:
                break
            delta = abs(now-event_date)
            row[-1], row[-2] = float(row[-1]), float(row[-2])
            if delta.days < 7:
                data_tmp.append(row)

        print (now)
        new_data[now.strftime('%Y/%m/%d')] = data_tmp
        now += timedelta(days=1)

    write_json('drug_data.json', new_data)
