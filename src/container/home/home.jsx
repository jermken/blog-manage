import React, { Component } from "react";
import { Menu, Icon, Avatar, Popconfirm, Modal } from "antd";
import { Route, Link, Redirect } from "react-router-dom";
import "./home.scss";
import MyIcon from "../../asset/image/my.jpg";
import MyArticle from "../myArticle";
import Write from "../write";
import ToolUse from "../toolUse";
import BookRecommend from "../bookRecommend";
import DayConsume from '../dayConsume';
import ClientInfo from '../clientInfo';
import request from "../../server/server.js";

const SubMenu = Menu.SubMenu;
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultSelectedMenu: [window.location.pathname],
      author: localStorage.getItem('author') || ''
    };
  }
  componentWillMount() {}

  loginOut() {
    request.reqPOST(
      "loginout",
      { name: localStorage.getItem("author") },
      res => {
        if (!res.code) {
          Modal.success({
            title: "退出成功",
            width: "400px",
            onOk: () => (window.location.href = "/login")
          });
        } else {
          Modal.error({
            title: "",
            content: res.msg
          });
        }
      }
    );
  }

  render() {
    const that = this;
    let { author } = that.state;
    return (
      <div className="page-container">
        <div className="top-wrap">
          <div className="top-logo" />
          <div className="user-info">
            <Avatar src={MyIcon} size="large" />
            <Popconfirm
              placement="bottom"
              title={"确认退出？"}
              onConfirm={that.loginOut.bind(this)}
              okText="退出登录"
              cancelText="取消"
            >
              <div className="nick-name">{author}</div>
            </Popconfirm>
          </div>
        </div>
        <div className="main-content">
          <div className="main-left-nav">
            <Menu
              theme="dark"
              defaultSelectedKeys={that.state.defaultSelectedMenu}
              mode="inline"
            >
              <Menu.Item key="/home/myArticle">
                <Link to="/home/myArticle">
                  <Icon type="file-markdown" />
                  <span>我的文章</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="/home/write">
                <Link to="/home/write">
                  <Icon type="file-add" />
                  <span>文章写作</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="/home/toolUse">
                <Link to="/home/toolUse">
                  <Icon type="tool" />
                  <span>工具使用</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="/home/bookRecommend">
                <Link to="/home/bookRecommend">
                  <Icon type="book" />
                  <span>书籍推荐</span>
                </Link>
              </Menu.Item>
              <SubMenu key="/home/YBS" title={<span>依柏诗manage</span>}>
                <Menu.Item key="/home/YBS/dayConsume">
                  <Link to="/home/YBS/dayConsume">
                    <span>消费记录</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="/home/YBS/historyActive">
                  <Link to="/home/YBS/historyActive">
                    <span>优惠活动表</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="/home/YBS/clientInfo">
                  <Link to="/home/YBS/clientInfo">
                    <span>客户信息</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="/home/YBS/4">
                  <span>库存管理</span>
                </Menu.Item>
                <Menu.Item key="/home/YBS/5">
                  <span>员工信息</span>
                </Menu.Item>
              </SubMenu>
            </Menu>
          </div>
          <div className="main-right-body">
            <div className="panel">
              <Route
                exact
                path="/home"
                render={() => <Redirect to="/home/myArticle" />}
              />
              <Route path="/home/myArticle" component={MyArticle} />
              <Route path="/home/write" component={Write} />
              <Route path="/home/toolUse" component={ToolUse} />
              <Route path="/home/bookRecommend" component={BookRecommend} />
              <Route path="/home/YBS/dayConsume" component={DayConsume} />
              <Route path="/home/YBS/clientInfo" component={ClientInfo} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
