import React, { Component } from 'react';
import { Menu, Icon, Avatar, Popconfirm, Modal } from 'antd';
import { Route, Link, Redirect } from 'react-router-dom';
import './home.scss';
import MyIcon from '../../asset/image/my.jpg';
import MyArticle from '../myArticle';
import Write from '../write';
import ToolUse from '../toolUse';
import BookRecommend from '../bookRecommend';

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultSelectedMenu: [window.location.pathname]
        }
    }
    componentWillMount() {
        
    }

    loginOut() {
        setTimeout(() => {
            Modal.success({
                title: '退出成功',
                width: '400px',
                onOk: () => window.location.href = '/login'
            });
        }, 2000)

    }

    render() {
        const that = this;
        
        return <div className="page-container">
            <div className="top-wrap">
                <div className="top-logo"></div>
                <div className="user-info">
                    <Avatar src={MyIcon} size="large"></Avatar>
                    <Popconfirm placement="bottom" title={'确认退出？'} onConfirm={that.loginOut.bind(this)} okText="退出登录" cancelText="取消">
                        <div className="nick-name">jermken</div>
                    </Popconfirm>
                </div>
            </div>
            <div className="main-content">
                <div className="main-left-nav">
                    <Menu theme="dark" defaultSelectedKeys={that.state.defaultSelectedMenu}>
                        <Menu.Item key="/home/myArticle"><Link to="/home/myArticle"><Icon type="file-markdown" /><span>我的文章</span></Link></Menu.Item>
                        <Menu.Item key="/home/write"><Link to="/home/write"><Icon type="file-add" /><span>文章写作</span></Link></Menu.Item>
                        <Menu.Item key="/home/toolUse"><Link to="/home/toolUse"><Icon type="tool" /><span>工具使用</span></Link></Menu.Item>
                        <Menu.Item key="/home/bookRecommend"><Link to="/home/bookRecommend"><Icon type="book" /><span>书籍推荐</span></Link></Menu.Item>
                    </Menu>
                </div>
                <div className="main-right-body">
                    <div className="panel">
                        <Route exact path="/home" render={() => <Redirect to="/home/myArticle" />} />
                        <Route path="/home/myArticle" component={MyArticle}></Route>
                        <Route path="/home/write" component={Write}></Route>
                        <Route path="/home/toolUse" component={ToolUse}></Route>
                        <Route path="/home/bookRecommend" component={BookRecommend}></Route>
                    </div>
                </div>
            </div>
        </div>
    }
}