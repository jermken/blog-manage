import React, { Component } from "react";
import { Form, Icon, Input, Button, Modal } from "antd";
import request from "../../server/server.js";
import "./loginup.scss";
import md5 from "js-md5";
const FormItem = Form.Item;
export default class LoginUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      password: "",
      repassword: "",
      recommendnum: null,
      isLoading: false
    };
  }
  componentWillMount() {}

  componentDidMount() {}

  loginUpSubmit() {
    let that = this;
    let { userName, password, repassword, recommendnum } = that.state;
    if (!userName || !password || !repassword) {
      return Modal.error({
        title: "请将信息填写完整！",
        okText: "确定"
      });
    }
    if (password !== repassword) {
      return Modal.error({
        title: "两次密码输入不一致，请重试",
        okText: "确定"
      });
    }
    that.setState({
      isLoading: true
    });
    request.reqPOST(
      "loginup",
      { name: userName, password: md5(password), recommendnum: recommendnum },
      res => {
        if (!res.code) {
          Modal.success({
            title: "注册成功，去登陆",
            width: "400px",
            onOk: () => (window.location.href = "/login")
          });
        } else {
          Modal.error({
            title: "",
            content: res.msg
          });
        }
        that.setState({
          isLoading: false
        });
      }
    );
  }

  inputChange(e) {
    const type = e.target.dataset.type;
    const val = e.target.value;
    switch (type) {
      case "userName":
        this.setState({
          userName: val
        });
        break;
      case "password":
        this.setState({
          password: val
        });
        break;
      case "repassword":
        this.setState({
          repassword: val
        });
        break;
      case "recommendnum":
        this.setState({
          recommendnum: val
        });
        break;
    }
  }

  gotoLogin() {
      window.location.href = '/login';
  }

  render() {
    const that = this;
    const { userName, password, repassword, recommendnum, isLoading } = that.state;
    return (
      <div className="login-page__bg">
        <div className="loginup-form-wrap">
          <div className="form-name">jermken博客管理系统</div>
          <Form>
            <FormItem>
              <Input
                value={userName}
                data-type="userName"
                onChange={that.inputChange.bind(that)}
                placeholder="请输入用户名"
                prefix={
                  <Icon
                    type="user"
                    style={{ color: "rgba(0,0,0,.25)" }}
                    onPressEnter={that.loginUpSubmit}
                  />
                }
              />
            </FormItem>
            <FormItem>
              <Input
                value={password}
                data-type="password"
                onChange={that.inputChange.bind(that)}
                placeholder="请输入密码"
                prefix={
                  <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                type="password"
                onPressEnter={that.loginUpSubmit}
              />
            </FormItem>
            <FormItem>
              <Input
                value={repassword}
                data-type="repassword"
                onChange={that.inputChange.bind(that)}
                placeholder="请再次输入密码"
                prefix={
                  <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                type="password"
                onPressEnter={that.loginUpSubmit}
              />
            </FormItem>
            <FormItem className="input-bottom">
              <Input
                value={recommendnum}
                data-type="recommendnum"
                onChange={that.inputChange.bind(that)}
                placeholder="请输入推荐码"
                prefix={
                  <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                type="password"
                onPressEnter={that.loginUpSubmit}
                className="recommend-num"
              />
              <Button
                loading={isLoading}
                onClick={that.loginUpSubmit.bind(that)}
                type="primary"
                htmlType="submit"
                className="loginup-form-btn"
              >
                注册
              </Button>
            </FormItem>
            <a className="aLink" onClick={that.gotoLogin}>已注册，去登陆</a>
          </Form>
        </div>
      </div>
    );
  }
}
