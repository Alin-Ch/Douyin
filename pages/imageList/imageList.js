Page({
    data: {
        videoUrl: "", //有水印图集地址
        imageList: [],
        videoUrl: "", //https://v.douyin.com/UBurvJ6/
        selected: 1, // 控制哪个选项被选中
    },
    // 去水印
    praseVideo() {
        var that = this
        wx.showLoading({
            title: '正在解析图集',
            mask: true, // 是否显示透明蒙层，防止触摸穿透，默认值为false
        })
        wx.request({
            url: 'https://tenapi.cn/v2/images?url=' + this.data.videoUrl,
            method: 'GET',
            success: function (res) {
                wx.hideLoading()
                // console.log(res.data.data);
                that.setData({
                    imageList: res.data.data.images
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
            data: JSON.stringify(that.data.imageList),
            success: function (res) {
                wx.showToast({
                    title: '复制成功',
                });
            },
            fail: function (res) {
                wx.showToast({
                  title: '复制失败',
                  icon: 'none'
                })
            }
        })
    },
    //下载图集
    /* downloadImageList: function () {
        var that = this;
        for (let i = 0; i < this.data.imageList.length; i++) {
            wx.downloadFile({
                url: this.data.imageList[i],
                success: function (res) {
                    let imagePath = res.tempFilePath;
                    wx.showToast({
                        title: '保存成功！',
                        icon: 'success',
                    })
                },
                fail: function (res) {
                    wx.showToast({
                        title: '保存失败！',
                        icon: 'none',
                    })
                }
            })
        }
    }, */


    // 下载保存图集
    downloadImageList: function () {
        var that = this;
        wx.getSetting({
            success(res) {
                if (!res.authSetting['scope.writePhotosAlbum']) {
                    wx.authorize({
                        scope: 'scope.writePhotosAlbum',
                        success() {
                            that.downloadAndSaveImages();
                        }
                    })
                } else {
                    that.downloadAndSaveImages();
                }
            }
        })
    },
    downloadAndSaveImages: function () {
        // 图片文件列表
        const imageList = this.data.imageList;
        // 显示加载提示框
        wx.showLoading({
            title: '正在保存...',
            mask: true
        });

        imageList.forEach((imageUrl, index) => {
            // 获取图片文件名称
            const imageName = 'image_' + new Date().getTime() + '_' + index + '.jpg';

            wx.downloadFile({
                url: imageUrl,
                success(res) {
                    // 隐藏加载提示框
                    wx.hideLoading();
                    wx.saveImageToPhotosAlbum({
                        filePath: res.tempFilePath,
                        success(res) {
                            console.log('图片文件 ' + imageName + ' 下载成功并保存到相册。');
                            wx.showToast({
                                title: '保存成功',
                                icon: 'success',
                                duration: 2000 // 持续时间2秒
                            });
                        },
                        fail(err) {
                            console.log('保存失败', err);
                            wx.showToast({
                                title: '下载失败',
                                icon: 'none',
                                duration: 2000
                            });
                        }
                    })
                },
                fail(err) {
                    wx.hideLoading();
                    console.log('下载失败', err);
                    wx.showToast({
                        title: '第' + (index + 1) + '张下载失败',
                        icon: 'none',
                        duration: 2000
                    });
                },
                onProgressUpdate(res) {
                    console.log('下载进度', res.progress);
                    wx.showLoading({
                        title: '正在下载第' + (index + 1) + '张图片... ' + res.progress + '%',
                        mask: true
                    });
                }
            })
        });
    },


    //顶部的选项
    onTabSelect: function (e) {
        this.setData({
            selected: parseInt(e.currentTarget.dataset.index)
        })
    },
    //预览封面图片
    previewImage: function (event) {
        var index = event.currentTarget.dataset.index;
        var current = this.data.imageList[index];
        wx.previewImage({
            current: current,
            urls: this.data.imageList,
        })
    },
    previewCover: function (event) {
        wx.previewImage({
            urls: [this.data.imageList[0]],
        })
    },
    //下载封面图片
    downloadImage: function () {
        wx.downloadFile({
            url: this.data.imageList[0],
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