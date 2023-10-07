Page({

    data: {
        selected: 0, // 控制哪个选项被选中
    },
    onTabSelect: function (e) { //顶部的选项
        this.setData({
            selected: parseInt(e.currentTarget.dataset.index)
        })
    },
})