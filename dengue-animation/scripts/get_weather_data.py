#! /usr/bin/env python3
# -*- coding: utf-8 -*-
import json
from bs4 import BeautifulSoup
import requests
from datetime import datetime
from datetime import timedelta
from datetime import date
from lib import csv_io
from lib import json_io

def get_values(html_doc):
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
    
    try:
        temp = round(temp/temp_count, 2)
        rh = round(rh/rh_count, 2)
        precp = round(precp)
    except:
        return temp, rh, precp
    return temp, rh, precp

if __name__=='__main__':
    url_t = "http://e-service.cwb.gov.tw/HistoryDataQuery/DayDataController.do?command=viewMain&station=467410&datepicker="
    now = datetime.strptime('2015/10/20', '%Y/%m/%d').date()
    end = datetime.now().date()
    data = json_io.read_json('../data/weather.json')
    while now < end:
        print (now)
        html_doc_t = requests.get(url_t+now.strftime('%Y-%m-%d')).text
        temp_t, rh_t, precp_t = get_values(html_doc_t)

        data[now.strftime('%Y/%m/%d')] = {'氣溫': temp_t, '相對溼度': rh_t, '降水量': precp_t}
        now += timedelta(days=1)
    json_io.write_json('../data/weather.json', data)
