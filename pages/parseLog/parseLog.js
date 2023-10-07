Page({
    data: {
        parseLog: [],
        videoUrl: '',
    },
    //通过正则表达获取分享链接中视频的地址
    getUrl: function () {
        var shareUrl = this.data.videoUrl
        const reg = /(https?:\/\/[\w\-./:]+\.(?:douyin|tiktok)\.com\/\S+)/i; // 正则表达式匹配
        const matched = shareUrl.match(reg); // 获取匹配结果
        if (matched && matched.length > 0) { // 判断匹配结果是否存在并且不为空
            this.data.videoUrl = matched[0]
            return matched[0]; // 返回第一个匹配结果
        }
        return null; // 未匹配到则返回空值
    },
    //点击记录跳转到去水印页面
    parseVideo(index) {
        console.log(index.currentTarget.dataset.index);
        var videoUrl = this.data.parseLog[index.currentTarget.dataset.index]
        this.setData({
            videoUrl: videoUrl
        })
        this.getUrl()
        wx.navigateTo({
            url: '../video/video?videoUrl=' + this.data.videoUrl,
        })
    },
    //加载存储在本地的解析记录
    onLoad(options) {
        const storageData = wx.getStorageSync('parseLog');
        this.setData({
            parseLog: storageData.reverse()
        })
    },

})