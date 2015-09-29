from lib import csv_io
from datetime import datetime

data = csv_io.read_csv('./sheet.csv')
new = [['日期', '里別', 'Latitude', 'Longitude']]
data = data[1:]
for item in data:        
    item[6] = datetime.strptime('2015/'+item[6], '%Y/%m/%d').date()

data = sorted(data, key = lambda x: x[6])

for item in data:
    if item[-3] == '陽性':
        item[6] = item[6].strftime('%Y/%m/%d')
        new.append([item[6], item[3], item[-2], item[-1]])
csv_io.write_csv('dengue.csv', new)
