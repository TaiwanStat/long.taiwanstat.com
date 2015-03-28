#!/usr/bin/python
# -*- coding: utf-8 -*-
import csv
import json

months = []
data = []
f = open('data/raw.csv', 'r')

for row in csv.reader(f):
    if len(row) >= 80:
        data.append(row)

del data[0]

header = data[0]
del data[0]

curType = ''
simple = header[:]
for i, h in enumerate(header):
    obj = {}

    if '.' in h:
        if not h.split('.')[0].isdigit():
            curType = h.split('.')[1]
            obj['name'] = h.split('.')[1].decode('big5').encode('utf-8')
            obj['type'] = curType.decode('big5').encode('utf-8')
            simple[i] = obj
            header[i] = {}
            continue

        elif (i+1) != len(header):
            if ')' not in header[i+1]:
                obj['name'] = h.split('.')[1].decode('big5').encode('utf-8')
                obj['type'] = curType.decode('big5').encode('utf-8')
        else:
            obj['name'] = h.split('.')[1].decode('big5').encode('utf-8')
            obj['type'] = curType.decode('big5').encode('utf-8')

    elif ')' in h:
        obj['name'] = h.split(')')[1].decode('big5').encode('utf-8')
        obj['type'] = curType.decode('big5').encode('utf-8')

    header[i] = obj
    simple[i] = obj

result = {}
result2 = {}
for month in data:
    year = month[0].split('M')[0]
    mm = month[0].split('M')[1]

    if int(year) >= 2010:

        a = []
        b = []
        for i, m in enumerate(month):
            if i > 0:
                if len(header[i])>0:

                    obj = {}
                    obj['name'] = header[i]['name']
                    obj['value'] = m
                    obj['type'] = header[i]['type']
                    a.append(obj)

                elif len(simple[i])>0:
                    obj = {}
                    obj['name'] = simple[i]['name']
                    obj['value'] = m
                    obj['type'] = simple[i]['type']
                    b.append(obj)

        if year not in result:
            result[year] = {}
        if year not in result2:
            result2[year] = {}

        result[year][int(mm)] = a
        result2[year][int(mm)] = b

f.close()

tofile = {}
tofile['complicated'] = result
tofile['simple'] = result2
with open('data/summary.json', 'w') as outfile:
    json.dump(tofile, outfile)
