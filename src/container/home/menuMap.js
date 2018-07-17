const MenuMap = [{
    key: '/home/myArticle',
    link: '/home/myArticle',
    icon: 'file-markdown',
    txt: '我的文章'
},{
    key: '/home/write',
    link: '/home/write',
    icon: 'file-add',
    txt: '文章写作'
},{
    key: '/home/toolUse',
    link: '/home/toolUse',
    icon: 'tool',
    txt: '工具使用'
},{
    key: '/home/bookRecommend',
    link: '/home/bookRecommend',
    icon: 'book',
    txt: '书籍推荐'
},{
    isSubMenu: true,
    key: '/home/YBS',
    title: '依柏诗manage',
    subMenu:[{
        key: '/home/YBS/dayConsume',
        link: '/home/YBS/dayConsume',
        txt: '消费记录'
    },{
        key: '/home/YBS/activeList',
        link: '/home/YBS/activeList',
        txt: '优惠活动表'
    },{
        key: '/home/YBS/clientInfo',
        link: '/home/YBS/clientInfo',
        txt: '客户信息'
    },{
        key: '/home/YBS/stockManage',
        link: '/home/YBS/stockManage',
        txt: '库存管理'
    },{
        key: '/home/YBS/staffInfo',
        link: '/home/YBS/staffInfo',
        txt: '员工信息'
    }]
}];
export default MenuMap;