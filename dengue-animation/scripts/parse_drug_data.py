#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from datetime import datetime
from datetime import timedelta
from datetime import date
from lib import json_io
from lib import csv_io

def filter_data(input_):
    data = []
    for item in input_:
        data.append([item[4], item[8], item[9]])
    return data

if __name__ == '__main__':
    url = 'http://denguefever.csie.ncku.edu.tw/file/drug_all.csv'
    data = csv_io.req_csv(url, 'utf-8')
    data = filter_data(data)

    data = data[1:]
    now = '2015年' + data[1][0]
    now = datetime.strptime(now, '%Y年%m月%d日').date()
    end = '2015年' + data[-1][0]
    end = datetime.strptime(end, '%Y年%m月%d日').date() + timedelta(days=1)

    header = ['日期', 'Latitude', 'Longitude']
    output_data = {}
    while now < end:
        data_tmp = []
        for row in data:
            d = '2015年' + row[0]
            event_date = datetime.strptime(d, '%Y年%m月%d日').date()
            if event_date > now:
                break
            delta = now - event_date
            try:
                row[-1], row[-2] = float(row[-1]), float(row[-2])
            except ValueError:
                continue
            if delta.days < 7:
                data_tmp.append(row)
        data_tmp.insert(0, header)
        output_data[now.strftime('%Y/%m/%d')] = data_tmp
        now += timedelta(days=1)

    json_io.write_json('../data/drug_data.json', output_data)
    print (data_tmp, 'done')
