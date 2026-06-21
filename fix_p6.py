import re
with open('index.html','r',encoding='utf-8') as f:
    c = f.read()

patterns = [
    r'      <div class="comment-card con stage-item" data-delay="1\.2">\n        "好不容易沅水出现一只江豚，第二天就死在了岸边。"<div class="card-user">—— 湖南网友<span class="card-tag">💭</span></div>\n      </div>\n',
    r'      <div class="comment-card con stage-item" data-delay="1\.5">\n        "禁渔我们都支持，但执行要公平，别让老实人吃亏。"<div class="card-user">—— 江西网友<span class="card-tag">💭</span></div>\n      </div>\n',
    r'      <div class="comment-card con stage-item" data-delay="2\.4">\n        "作为一个退捕渔民，说实话上岸那一年很难。但现在回头看，值了。"<div class="card-user">—— 岳阳<span class="card-tag">💭</span></div>\n      </div>\n',
]
for p in patterns:
    c, n = re.subn(p, '', c)
    print('Removed:', n)

with open('index.html','w',encoding='utf-8') as f:
    f.write(c)
print('done')
