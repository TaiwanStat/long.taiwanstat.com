#! /usr/bin/env python
# -*- coding: utf-8 -*-
import json
from bs4 import BeautifulSoup
import requests
import csv
import sys
from datetime import datetime
from datetime import timedelta
from datetime import date

def read_csv(file_name):
    data = [] 
    with open(file_name, 'r') as input_file:
        reader = csv.reader(input_file)
        for row in reader:
            data.append(row)
    return data[0] if len(data) == 1 else data

def write_csv(file_name, content):
    """write csv"""
    with open(file_name, 'w') as output_file:
        writer = csv.writer(output_file)
        writer.writerows(content)

def write_json(file_name, content):
    """write json"""
    with open(file_name, 'w') as output_file:
        json.dump(content, output_file)



def getValues(html_doc):
    soup = BeautifulSoup(html_doc)
    body = soup.select('table tr')[3:]
    temp = 0
    rh = 0
    precp = 0
    temp_count = 0
    rh_count = 0
    precp_count = 0
    for row in body:
        tds = row.select('td')
        try:
            temp += float(tds[3].text)
            temp_count += 1
        except:
            pass

        try:
            rh += float(tds[5].text)
            rh_count += 1 
        except:
            pass

        try:
            precp += float(tds[10].text)
            precp_count += 1
        except:
            pass

    temp = round(temp/temp_count, 2)
    rh = round(rh/rh_count, 2)
    precp = round(precp)
    return temp, rh, precp

if __name__=='__main__':

    url_t = "http://e-service.cwb.gov.tw/HistoryDataQuery/DayDataController.do?command=viewMain&station=467410&datepicker="
    now = datetime.strptime('2015/06/01', '%Y/%m/%d').date()
    end = datetime.now().date()

    data = {}

    while now < end:
        html_doc_t = requests.get(url_t+now.strftime('%Y-%m-%d')).text
        temp_t, rh_t, precp_t = getValues(html_doc_t)

        data[now.strftime('%Y/%m/%d')] = {'氣溫': temp_t, '相對溼度': rh_t, '降水量': precp_t}
        now += timedelta(days=1)
        print (now)
    write_json('weather.json', data)
