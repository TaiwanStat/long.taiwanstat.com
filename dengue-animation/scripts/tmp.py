from lib import csv_io

data = csv_io.read_csv('./sheet.csv')
new = [['日期', '里別', 'Latitude', 'Longitude']]
data = data[1:]
from datetime import datetime
for item in data:
    if item[-5] == '陽性':
        item[7] = datetime.strptime('2015/'+item[7], '%Y/%m/%d').date()
        item[7] = item[7].strftime('%Y/%m/%d')
        new.append([item[7], item[4], item[-2], item[-1]])
csv_io.write_csv('dengue.csv', new)
