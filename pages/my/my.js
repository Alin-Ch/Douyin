const app = getApp()
Page({
    data: {
        userInfo: {
            avatarUrl: "../../images/长草1.jpg"
        },
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        canIUseGetUserProfile: false,
        canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') // 如需尝试获取用户信息可改为false
    },
    // 事件处理函数
    bindViewTap() {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    onLoad() {
        if (wx.getUserProfile) {
            this.setData({
                canIUseGetUserProfile: true
            })
        }
    },
    getUserProfile(e) {
        // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
        wx.getUserProfile({
            desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            success: (res) => {
                console.log(res)
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        })
    },
    getUserInfo: function (e) {
        // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
        // console.log(e)
        if (e.detail.userInfo) {
            wx.cloud.callFunction({
                name: 'login',
                success: res => {
                    console.log('云函数login返回：', res.result)
                    // TODO: 将openid等信息进行处理、传递等操作
                },
                fail: err => {
                    console.error('云函数login调用失败！', err)
                }
            })
        } else {
            console.log('用户拒绝授权')
        }

        // this.setData({
        //     userInfo: e.detail.userInfo,
        //     hasUserInfo: true
        // })
    },
    //清除缓存
    clearCache() {
        this.setData({
            userInfo: {}
        })
        wx.removeStorageSync("userInfo");
        wx.removeStorageSync("parseLog");
        wx.showToast({
            title: '清除成功',
            icon: 'none',
            duration: 2000
        })
    },
    //使用帮助
    help() {
        wx.navigateTo({
            url: '../help/help',
        })
    },
    //关于我们
    aboutUs() {
        wx.showModal({
            title: '',
            content: '本小程序只供学习使用，切勿用于商业用途，程序员应秉持开源精神，使用过程有任何问题皆可联系我们。QQ群号：617545186',
            confirmText: '复制群号',
            confirmColor: 'blue',
            success: function (res) {
                if (res.confirm) {
                    wx.setClipboardData({
                        data: '617545186',
                        success: function (res) {
                            wx.showToast({
                                title: '复制成功',
                                icon: 'none'
                            })
                        }
                    })
                } else if (res.cancel) {}
            }
        })
    },
})