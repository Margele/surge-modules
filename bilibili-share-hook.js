function sendGet(url) {
	return new Promise((resolve) => {
		$httpClient.get(url, (error, response, data) => {
			resolve(data);
		})
	});
}

async function processShare() {
    const params = new URLSearchParams($request.body);
    const result = await sendGet("https://api.bilibili.com/x/web-interface/view?aid=" + params.get('oid'));
    const videoDetails = JSON.parse(result).data;
    const videoStatus = videoDetails.stat;

    const timestamp = videoDetails.pubdate * 1000;
    const date = new Date(timestamp);

    var resp = {
        code: 0,
        message: "0",
        ttl: 1,
        data: {
        content: "标题: " + videoDetails.title + 
                    "\nUP主: " + videoDetails.owner.name + 
                    "\n时间: " +  date.toLocaleString() + 
                    "\n播放: " + videoStatus.view + " 弹幕: " + videoStatus.danmaku + " 评论: " + videoStatus.reply +
                    "\n点赞: " + videoStatus.like + " 投币: " + videoStatus.coin + " 收藏: " + videoStatus.favorite + 
                    "\n\n链接: https://b23.tv/" + videoDetails.bvid,
        count: 0
        }
    };
  
    $done({
        response: {
            body: JSON.stringify(resp)
        }
    });
}

async function processChannels() {
    var resp = {
        code: 0,
        message: "0",
        ttl: 1,
        data: {
            above_channels: [
                {
                    name: "动态",
                    picture: "https://i0.hdslb.com/bfs/share/80f8068a2c7388e69d8aee278fa906027988c049.png",
                    share_channel: "biliDynamic"
                },
                {
                    name: "消息",
                    picture: "https://i0.hdslb.com/bfs/share/d4f0cc59313083fee8a759b76b193c87ab7bba80.png",
                    share_channel: "biliIm"
                }
            ],
            below_channels: [
                {
                    name: "图片分享",
                    picture: "https://i0.hdslb.com/bfs/share/f40ff0f6c56fd23d3d5e688b79458e6bddb6081a.png",
                    share_channel: "PIC"
                },
                {
                    name: "下载分享",
                    picture: "https://i0.hdslb.com/bfs/share/26711df4a685b757b43199e67ed72be9f2ae71c5.png",
                    share_channel: "SYS_DOWNLOAD"
                },
                {
                    name: "复制链接",
                    picture: "https://i0.hdslb.com/bfs/share/9f7ce8985eff2927c265d1b7b02221170b74106f.png",
                    share_channel: "COPY"
                },
                {
                    name: "更多",
                    picture: "https://i0.hdslb.com/bfs/share/1273b5b39c7d12f8960ace566f2db90a34ad3c19.png",
                    share_channel: "GENERIC"
                }
            ],
            text: "分享",
            extra: {
                quick_message_on: true
            }
        }
    }

    $done({
        response: {
            body: JSON.stringify(resp)
        }
    });
}

if ($request.url.includes("share/click")) {
    processShare();
} else if ($request.url.includes("/share/channels")) {
    processChannels();
}
