# -*- coding: utf-8 -*-
import csv
import json
import requests
import time

f = open('student.csv', 'r')
result = {}

for row in csv.reader(f):
    year = row[0]
    utype = row[2]
    uname = row[3]
    dep = row[4]
    dclass = row[5]
    total = row[6]
    mnum = row[7]
    fnum = row[8]

    if(uname not in result):
        result[uname] = {}
        result[uname]['prefix'] = row[1]
    if(dep not in result[uname]):
        result[uname][dep] = {}
    if(dclass not in result[uname][dep]):
        result[uname][dep][dclass] = {}
    if(year not in result[uname][dep][dclass]):
        result[uname][dep][dclass][year] = {}

    result[uname][dep][dclass][year]['total'] = total
    result[uname][dep][dclass][year]['mnum'] = mnum
    result[uname][dep][dclass][year]['fnum'] = fnum

    if(year not in result[uname]):
        result[uname][year] = {}
        result[uname][year]['total'] = 0
        result[uname][year]['mnum'] = 0
        result[uname][year]['fnum'] = 0

    result[uname][year]['total'] += int(total)    
    result[uname][year]['mnum'] += int(mnum)    
    result[uname][year]['fnum'] += int(fnum)    

f = open('school.csv', 'r')
count = 1
for row in csv.reader(f):
    count += 1
    uname = row[1]
    # if uname in result:
    #     result[uname]['address'] = row[3]
    #     r = requests.get(''.join(['https://maps.googleapis.com/maps/api/geocode/json?address=', row[3], '&key=AIzaSyAAROQGowMXvauWPdMfV0TFFMDMLDkATzU']))
    #     res = r.json()
    #     lat = res['results'][0]['geometry']['location']['lat']
    #     lng = res['results'][0]['geometry']['location']['lng']
    #     result[uname]['lat'] = lat
    #     result[uname]['lng'] = lng

    #     time.sleep(2)
    #     z = 1
    # else:
    #     print uname

print count


for u in result:
    if 'address' not in result[u]:
        print result[u]['address']

# with open('result.json', 'w') as outfile:
#     json.dump(result, outfile)

f.close()
