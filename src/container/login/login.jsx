import React, { Component } from "react";
import { Form, Icon, Input, Button, Modal } from "antd";
import request from "../../server/server.js";
import "./login.scss";

const FormItem = Form.Item;
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      password: "",
      isLoading: false
    };
  }
  componentWillMount() {}

  componentDidMount() {}

  loginSubmit() {
    let that = this;
    let { userName, password} = that.state;
    if (!userName || !password) {
        return Modal.error({
            title: "请将信息填写完整！",
            okText: "确定"
        });
    }
    that.setState({
      isLoading: true
    });
    request.reqPOST("login", {name:userName, password:password}, res => {
      if (!res.code) {
        Modal.success({
          title: "登陆成功",
          width: "400px",
          onOk: () => (window.location.href = "/home")
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
    });
  }

  inputChange(e) {
    const type = e.target.dataset.type;
    const val = e.target.value;
    if (type === "userName") {
      this.setState({
        userName: val
      });
    } else {
      this.setState({
        password: val
      });
    }
  }

  render() {
    const that = this;
    const { userName, password, isLoading } = that.state;
    return (
      <div className="login-page__bg">
        <div className="form-wrap">
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
                    onPressEnter={that.loginSubmit}
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
                onPressEnter={that.loginSubmit}
              />
            </FormItem>
            <FormItem>
              <Button
                loading={isLoading}
                onClick={that.loginSubmit.bind(that)}
                type="primary"
                htmlType="submit"
                className="login-form-btn"
              >
                登陆
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}
