// index.js
// 获取应用实例
const app = getApp()
Page({
    data: {
        shareUrl: "",
        videoUrl: "",
        clear: false,
        params: {},
        parseLog: [], // 存储解析记录的数组
        selected: 0,
    },
    //顶部的选项
    onTabSelect: function (e) {
        this.setData({
            selected: parseInt(e.currentTarget.dataset.index)
        })
    },
    //粘贴链接
    pasteUrl: function () {
        var that = this
        wx.getClipboardData({
            success(res) {
                that.setData({
                    shareUrl: res.data,
                    clear: true
                })
            },
            fail(err) {
                console.log('获取粘贴板内容失败', err)
            }
        })
    },
    //清除输入框内容
    clearInput() {
        this.setData({
            shareUrl: '',
            clear: false
        })
    },
    //通过正则表达获取分享链接中视频的地址
    getUrl: function () {
        var shareUrl = this.data.shareUrl
        const reg = /(https?:\/\/[\w\-./:]+\.(?:douyin|tiktok)\.com\/\S+)/i; // 正则表达式匹配
        const matched = shareUrl.match(reg); // 获取匹配结果
        if (matched && matched.length > 0) { // 判断匹配结果是否存在并且不为空
            this.data.videoUrl = matched[0]
            return matched[0]; // 返回第一个匹配结果
        }
        return null; // 未匹配到则返回空值
    },
    // 监听输入框内的内容变化
    onInputChange: function (event) {
        this.setData({
            shareUrl: event.detail.value, // 动态获取输入框的值
        });
        if (this.data.shareUrl) {
            this.setData({
                clear: true
            })
        } else {
            this.setData({
                clear: false
            })
        }
        // console.log('输入框的值为：', this.data.shareUrl);
    },
    // 点击按钮进行页面间的跳转
    submit: function () {
        this.data.videoUrl = this.getUrl()
        const inputContent = this.data.shareUrl;
        const regExp = /^https?:\/\/(?:www\.)?douyin\.com\/(?:video\/|[^\/]+?\/)?(\w{19})(?:[\?\&][\w=]*)?$/
        const shareUrl = this.data.shareUrl
        if (!inputContent || !shareUrl.includes('https://v.douyin.com/')) {
            wx.showToast({
                title: '请输入正确的抖音链接',
                icon: 'none'
            });
            return;
        }
        this.addParseLog(shareUrl); //将解析记录加入数组并保存到本地缓存
        if (this.data.selected == 0) {
            wx.navigateTo({
                url: '../video/video?videoUrl=' + encodeURIComponent(this.data.videoUrl) // 拼接参数
            })
        } else {
            wx.navigateTo({
                url: '../imageList/imageList?videoUrl=' + encodeURIComponent(this.data.videoUrl) // 拼接参数
            })
        }

    },
    //查看解析页面
    goParse() {
        wx.navigateTo({
            url: '../parseLog/parseLog',
        })
    },
    //存储解析的记录
    addParseLog(shareUrl) {
        const existedLog = wx.getStorageSync('parseLog') || []; // 先获取已有的记录
        if (existedLog.includes(shareUrl)) { // 存在相同记录
            console.log(`Duplicate parse record found: ${shareUrl.data}`);
            return;
        }
        const newLog = [...existedLog, shareUrl];
        wx.setStorageSync('parseLog', newLog); // 将新增记录和已有记录进行合并，并存储到本地缓存
        this.setData({
            parseLog: newLog
        });
    },
    onLoad() {
        const parseLog = wx.getStorageSync('parseLog') || [];
        this.setData({
            parseLog: parseLog
        });
    },
    // 分享功能
    onShareAppMessage: function () {
        wx.showShareMenu({
            withShareTicket: true,
            success(res) {
                console.log('已启用分享菜单', res)
            }
        })
        return {
            title: '这个小程序不错哟',
            path: '/pages/index/index'
        }
    },
});