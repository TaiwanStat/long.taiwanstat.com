#! /usr/bin/env python
# -*- coding: utf-8 -*-
#coding=utf-8
import csv

def read_csv(file_name):
    data = [] 
    with open(file_name, 'r') as input_file:
        reader = csv.reader(input_file)
        for row in reader:
            data.append(row)
    return data[0] if len(data) == 1 else data
def write_csv(file_name, content):
    with open(file_name, 'w') as output_file:
        writer = csv.writer(output_file)  
        writer.writerows(content)  

import json
  
def write_json(file_name, content):
    with open(file_name, 'w') as output_file:
        json.dump(content, output_file, indent=4, sort_keys=True)

def read_json(file_name):
    with open(file_name, 'r') as input_file:
        return json.load(input_file)

import sys

codebook = read_csv(sys.argv[1])
country_order = read_csv(sys.argv[2])
bed_data = read_csv(sys.argv[3])
human_data = read_csv(sys.argv[4])
population = read_json(sys.argv[5])

new_codebook = {}

for i in range(1, len(codebook)):
    if codebook[i][0][:2] not in new_codebook:
        tmp = codebook[i][1].decode('big5').encode('utf-8')[:9]
        new_codebook[codebook[i][0][:2]] = tmp

new_bed_data = {}
for i in range(1, len(bed_data)):
    code = bed_data[i][0]
    country = new_codebook[code]
    if country == '桃園縣':
        country = '桃園市'
    if country not in new_bed_data:
        new_bed_data[country] = {}
        new_bed_data[country]['hospNumber'] = 0
        new_bed_data[country]['hospBedNumber'] = 0
    new_bed_data[country]['hospNumber'] += int(bed_data[i][2])
    new_bed_data[country]['hospBedNumber'] += int(bed_data[i][3])

new_human_data = {}
for i in range(1, len(human_data)):
    code = human_data[i][0]
    country = new_codebook[code]
    if country == '桃園縣':
        country = '桃園市'
    if country not in new_human_data:
        new_human_data[country] = {}
        new_human_data[country]['hospHumanNumber'] = 0
    new_human_data[country]['hospHumanNumber'] += int(human_data[i][3])


data = []
order = 0
for country in country_order:
    country = country[0]
    print country
    print population
    data.append( { \
            'order': order,
            'country': country, \
            'hospHumanNumber': new_human_data[country]['hospHumanNumber'],\
            'hospNumber': new_bed_data[country]['hospNumber'], \
            'hospBedNumber': new_bed_data[country]['hospBedNumber'], \
            'population': population[country.decode('utf-8')],
            'hospHumanRate': "%0.1f" %  (float(new_human_data[country]['hospHumanNumber'])/population[country.decode('utf-8')]*1000), \
            'hospBedRate': "%0.1f" %  (float(new_bed_data[country]['hospBedNumber'])/population[country.decode('utf-8')]*1000) })
    order += 1
data = sorted(data, key=lambda k: k['order']) 
write_json('data.json', data)
