import urllib2

url = "http://opendata.epa.gov.tw/ws/Data/RainTenMin/?format=json"
content = urllib2.urlopen(url)
data = content.read()
fout = open("rain.json", "w")
fout.write(data)

url = "http://m.coa.gov.tw/OpenData/DebrisAlertService/GetDebrisVillInfo.aspx"
content = urllib2.urlopen(url)
data = content.read()
fout = open("data.json", "w")
fout.write(data)
