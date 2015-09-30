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
    data = data[1:]
    data = sorted(data, key = lambda x: datetime.strptime('2015年'+x[4], '%Y年%m月%d日').date())

    for item in data:
        item[4] = datetime.strptime('2015年'+item[4], '%Y年%m月%d日').date().strftime('%Y/%m/%d')

    output_data = {}
    for item in data:
        current_date = item[4]
        village = item[2].replace(' ', '') + item[3]
        if current_date not in output_data:
            output_data[current_date] = []

        if village not in output_data[current_date]:
            output_data[current_date].append(village)

    json_io.write_json('../data/drug_days.json', output_data)
    print ('done.')
