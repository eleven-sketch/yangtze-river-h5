"""Download images from CDP-extracted URLs, name by caption."""
import re, os, urllib.request, json, time

# Image data extracted from CDP
imgs_raw = json.loads(open('imgs_raw.json','r',encoding='utf-8').read()) if os.path.exists('imgs_raw.json') else []

# Captions extracted from article text
captions_text = """长江正源沱沱河的发源地——姜根迪如冰川，位于青藏高原腹地，是万里长江的起点
长江第一峡谷——烟瘴挂峡谷，位于青海玉树通天河段
沱沱河晨韵
格拉丹东冰川
金沙江大拐弯
四川泸州，长江、沱江在此交汇
四川宜宾，金沙江、岷江在此交汇，自此始称长江
重庆，长江、嘉陵江在此交汇
瞿塘峡
巫山县曲池乡柑园村，春风拂岸，桃李花开
湖北宜昌秭归开展渔船拆解与护鱼
湖北宜昌，江豚在此栖息繁衍
湖北宜昌，葛洲坝、三峡大坝两大水利枢纽
宜昌化工关改搬转，田田化工厂拆除与岸线复绿
岳阳东风湖治理，黑臭水体变身生态湖泊
石首麋鹿保护区，天鹅洲长江故道
武汉汉阳江滩改造，仓库区变身江滩公园
武汉，长江与汉江在此交汇
九江滨江大道今昔对比，变身长江文化公园
芜湖十里江湾
元荡桥，连接上海青浦与苏州吴江
晨光中的上海"""

captions = [c.strip() for c in captions_text.strip().split('\n') if c.strip()]

print(f"Captions count: {len(captions)}")
photos_dir = '照片'
os.makedirs(photos_dir, exist_ok=True)

# We'll extract URLs from CDP
# Image URLs from the article - these are the content images (not icons/logos)
# We need to get them from the CDP eval

print("Please run: curl CDP eval to get image URLs")
print("Photo directory ready:", photos_dir)
