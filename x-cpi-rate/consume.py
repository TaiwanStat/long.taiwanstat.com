# https://docs.python.org/2/library/xml.etree.elementtree.html
# encoding: utf-8

import re
import xml.etree.ElementTree as ET
import pandas as pd
import matplotlib.pyplot as plt
from matplotlib.font_manager import FontProperties

pd.options.display.mpl_style = 'default'

tree = ET.parse('consume.xml')
root = tree.getroot()
plt.figure()
fig, axes= plt.subplots(nrows=4, sharex=True, sharey=True)

def plot_consume(i):
	count = 0
	df_obs = pd.DataFrame()
	# Datasets
	flr = i * 8
	ceil = (i + 1) * 8
	for dataset in root[1][flr: ceil]:
		# raw data of consumer rate
		raw = dataset[1]
		time_period = []
		obs_val = []

		for detail in raw:
			time = re.split('M', detail.get('TIME_PERIOD'))
			time_period.append(pd.datetime(int(time[0]), int(time[1]), 1))
			# Pandas only supports float and integer as numeric types, Use anything else, and it becomes an "object."
			if (detail.get('OBS_VALUE') == ""):
				obs_float = float(0)
			else:
				obs_float = float(detail.get('OBS_VALUE'))
			obs_val.append(obs_float)

		df_obs.insert(count, dataset.get('ITEM')[:-12][5:], obs_val)
		count += 1

	df_obs.insert(count, u'時間', time_period)
	df_obs = df_obs.set_index(u'時間')
	return df_obs

i = 0
fontP = FontProperties()
fontP.set_size('small')

while i < 4:
	df = plot_consume(i)

	if(i == 0):
		axes[i].set_title(u'台灣全體家庭：所得層級別消費者物價指數（年增率）')
	elif(i == 1):
		axes[i].set_title(u'台灣最低所得 20 %：所得層級別消費者物價指數（年增率）')
	elif(i == 2):
		axes[i].set_title(u'台灣中間所得 60 %：所得層級別消費者物價指數（年增率）')
	elif(i == 3):
		axes[i].set_title(u'台灣最高所得 20 %：所得層級別消費者物價指數（年增率）')
	
	df.plot(ax=axes[i]).legend(bbox_to_anchor=(1.05, 1), loc=2, borderaxespad=0., prop=fontP)
	
	i += 1


