// pages/video/video.js
Page({
    data: {
        videoUrl: "", //有水印视频地址
        url: "", //无水印视频地址
        title: "", //视频文案
        avatar: "", //用户头像
        cover: "", //视频封面
        musicAvatar: "", //视频的BGM
        musicUrl: "", //视频BGM的地址
        selected: 1, // 控制哪个选项被选中
        audio: null,
        isVedio: false,
        isImage: false,
    },
    // 去水印
    praseVideo() {
        var that = this
        wx.showLoading({
            title: '正在解析视频',
            mask: true, // 是否显示透明蒙层，防止触摸穿透，默认值为false
        })
        wx.request({
            url: 'https://tenapi.cn/v2/video?url=' + this.data.videoUrl,
            method: 'GET',
            success: function (res) {
                wx.hideLoading()
                // console.log(res.data.data);
                that.setData({
                    url: res.data.data.url,
                    title: res.data.data.title,
                    avatar: res.data.data.avatar,
                    cover: res.data.data.cover,
                    musicAvatar: res.data.data.music.avatar,
                    musicUrl: res.data.data.music.url
                })
            },
            fail: function (err) {
                console.log(err.errMsg);
            },
        })
    },
    //复制视频链接
    copyUrl: function () {
        var that = this;
        wx.setClipboardData({
            data: that.data.url,
            success: function (res) {
                wx.showToast({
                    title: '复制成功',
                });
            }
        })
    },
    //下载视频
    // 在需要下载视频的页面中引入以下代码

    // 下载视频函数
    downloadVideo: function (url) {
        wx.showLoading({
            title: '下载中...',
        })
        wx.downloadFile({
            url: this.data.url,
            success: function (res) {
                if (res.statusCode === 200) {
                    // 下载成功，保存到本地相册
                    wx.saveVideoToPhotosAlbum({
                        filePath: res.tempFilePath,
                        success: function () {
                            wx.showToast({
                                title: '下载成功',
                                icon: 'success',
                                duration: 2000
                            });
                        },
                        fail: function (error) {
                            wx.showToast({
                                title: '保存失败',
                                icon: 'none',
                                duration: 2000
                            });
                        }
                    });
                } else {
                    wx.showToast({
                        title: '下载失败',
                        icon: 'none',
                        duration: 2000
                    });
                }
                wx.hideLoading()
            },
            fail: function (error) {
                wx.showToast({
                    title: '下载失败',
                    icon: 'none',
                    duration: 2000
                });
                wx.hideLoading()
            }
        });
    },


    //下载视频
    downloadVideo1: function () {
        var that = this;
        wx.getSetting({
            success(res) {
                if (!res.authSetting['scope.writePhotosAlbum']) {
                    wx.authorize({
                        scope: 'scope.writePhotosAlbum',
                        success() {
                            that.downloadAndSaveVideo();
                        }
                    })
                } else {
                    that.downloadAndSaveVideo();
                }
            }
        })
    },
    downloadAndSaveVideo: function () {
        // 视频文件 URL
        const videoUrl = this.data.url;
        // 视频文件名称
        const videoName = 'video_' + new Date().getTime() + '.mp4';
        // 显示加载提示框
        wx.showLoading({
            title: '正在下载...',
            mask: true
        });
        wx.downloadFile({
            url: videoUrl, // 视频下载链接
            header: {},
            success(res) {
                // 隐藏加载提示框
                wx.hideLoading();
                // 保存到相册
                wx.saveVideoToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success(res) {
                        // 下载并保存成功时，在控制台输出成功信息
                        console.log('视频文件 ' + videoName + ' 下载成功并保存到相册了。');
                        wx.showToast({
                            title: '下载成功',
                            icon: 'success'
                        });
                    },
                    fail(err) {
                        console.log('保存失败', err);
                        // 显示下载失败提示框
                        wx.showToast({
                            title: '下载失败',
                            icon: 'none'
                        });
                    }
                })
            },
            fail(err) {
                // 隐藏加载提示框
                wx.hideLoading();
                console.log('下载失败', err);
                // 显示下载失败提示框
                wx.showToast({
                    title: '下载失败',
                    icon: 'none'
                });
            },
            // 监听下载进度，每次更新加载提示框的进度条
            onProgressUpdate(res) {
                console.log('下载进度', res.progress);
                wx.showLoading({
                    title: '正在下载... ' + res.progress + '%',
                    mask: true
                });
            }
        })
    },
    //顶部的选项
    onTabSelect: function (e) {
        this.setData({
            selected: parseInt(e.currentTarget.dataset.index)
        })
    },
    //预览封面图片
    previewImage: function (e) {
        wx.previewImage({
            urls: [this.data.cover],
        })
    },
    //下载封面图片
    downloadImage: function () {
        wx.downloadFile({
            url: this.data.cover,
            success(res) {
                if (res.statusCode === 200) {
                    wx.saveImageToPhotosAlbum({
                        filePath: res.tempFilePath,
                        success() {
                            wx.showToast({
                                title: '保存成功'
                            })
                        },
                        fail() {
                            wx.showToast({
                                icon: 'none',
                                title: '保存失败，请重试'
                            })
                        }
                    })
                } else {
                    wx.showToast({
                        icon: 'none',
                        title: '下载图片失败，请重试'
                    })
                }
            }
        })
    },
    //复制文案
    onCopyTap: function () {
        var textToCopy = this.data.title;
        wx.setClipboardData({
            data: textToCopy,
            success: function () {
                wx.showToast({
                    title: '已复制到剪贴板'
                })
            }
        })
    },

    //下载BGM
    downloadMusic: function () {
        wx.downloadFile({
            url: this.data.musicUrl,
            success(res) {
                if (res.statusCode === 200) {
                    // 下载成功后，将音频文件保存到本地
                    wx.saveFile({
                        tempFilePath: res.tempFilePath,
                        success(res) {
                            console.log(res.savedFilePath);
                            wx.showToast({
                                title: '保存成功',
                            });
                        },
                        fail(err) {
                            console.log(err);
                        },
                    });
                }
            },
        });
    },
    // 接受从其它页面跳转到本页面携带的参数
    onLoad(options) {
        const videoUrl = decodeURIComponent(options.videoUrl); // 解码参数
        console.log('视频链接为：', videoUrl);
        this.setData({
            videoUrl: videoUrl
        })
        this.praseVideo()
    },
})