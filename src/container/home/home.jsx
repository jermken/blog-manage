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
import ActiveList from '../activeList';
import StaffInfo from '../staffInfo';
import StockManage from '../stockManage';
import request from "../../server/server.js";
import MenuMap from './menuMap';
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
            {
              MenuMap.map((i) => {
                if (i.isSubMenu) {
                  return <SubMenu key={i.key} title={<span>{i.title}</span>}>
                    {
                      i.subMenu.map((j) => {
                        return <Menu.Item key={j.key}>
                          <Link to={j.link}>
                            <span>{j.txt}</span>
                          </Link>
                        </Menu.Item>
                      })
                    }
                  </SubMenu>
                } else {
                  return <Menu.Item key={i.key}>
                          <Link to={i.link}>
                          {
                            i.icon? <Icon type={i.icon}/> : ''
                          }
                          <span>{i.txt}</span>
                          </Link>
                        </Menu.Item>
                }
              })
            }
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
              <Route path="/home/YBS/active" component={ActiveList} />
              <Route path="/home/YBS/staffInfo" component={StaffInfo} />
              <Route path="/home/YBS/stockManage" component={StockManage} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
