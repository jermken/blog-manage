import React, { Component } from "react";
import { Input, Button, Form, Row, Col, Modal } from "antd";
import "./index.scss";
import marked from "marked";
import request from "../../server/server.js";

const { TextArea } = Input;

export default class Write extends Component {
  constructor(props) {
    super(props);
    let _id = window.location.search
      .replace(/\?/, "")
      .split("&")[0]
      .split("=")[1];
    this.state = {
      data: {
        _id: _id || "",
        content: "",
        title: "",
        label: "",
        author: ""
      }
    };
  }

  componentWillMount() {
    this.state.data._id ? this.fetchData() : void 0;
  }

  fetchData() {
    let that = this;
    request.reqGET("articlelist", { _id: that.state.data._id }, res => {
      let resData = res.data[0];
      that.setState({ data: resData });
      that.refs.title.input.value = resData.title;
      that.refs.label.input.value = resData.label;
      that.refs.type.input.value = resData.type;
      that.refs.author.input.value = resData.author;
    });
  }

  onSubmit() {
    const title = this.refs.title.input.value,
      label = this.refs.label.input.value,
      type = this.refs.type.input.value,
      author = this.refs.author.input.value,
      content = this.state.data.content;
    if (!title || !label || !type || !author || !content) {
      return Modal.error({
        title: "请将信息填写完整！",
        okText: "确定"
      });
    } else {
      let obj = { title, label, type, author, content },
        _id = this.state.data._id;
      _id
        ? request.reqPOST("updateArticle", { ...obj, _id }, res => {
            if (!res.code) {
              Modal.success({
                title: "编辑成功！",
                okText: "确定",
                onOk: () => {}
              });
            } else {
              Modal.error({
                title: "",
                content: res.msg
              });
            }
          })
        : request.reqPOST("addArticle", { ...obj }, res => {
            if (!res.code) {
              Modal.success({
                title: "新增成功！",
                okText: "确定",
                onOk: () => {
                  window.location.href = "/home/myArticle";
                }
              });
            } else {
              Modal.error({
                title: "",
                content: res.msg
              });
            }
          });
    }
  }

  clearQuery() {
    this.refs.title.input.value = "";
    this.refs.label.input.value = "";
    this.refs.type.input.value = "";
    this.refs.author.input.value = "";
  }

  inputChange(e) {
    this.setState({
      data: { ...this.state.data, content: e.target.value }
    });
  }

  render() {
    const that = this;
    let content = marked(that.state.data.content)
      .replace(/<\/script/g, "<\\/script")
      .replace(/<!--/g, "<\\!--");
    return (
      <div className="write-page">
        <Form className="page-from">
          <Row>
            <Col span={4}>
              <Form.Item
                label="标题"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 16 }}
              >
                <Input ref="title" />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                label="标签"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 16 }}
              >
                <Input ref="label" />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                label="类型"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 16 }}
              >
                <Input ref="type" />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                label="作者"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 16 }}
              >
                <Input ref="author" />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item>
                <Button
                  onClick={that.clearQuery.bind(this)}
                  className="clear-btn"
                >
                  清除
                </Button>
                <Button onClick={that.onSubmit.bind(this)} type="primary">
                  提交
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <div className="write-content">
          <TextArea
            value={that.state.data.content}
            onChange={that.inputChange.bind(this)}
            placeholder="请输入markdown格式文本"
            autosize={{ minRows: 24, maxRows: 24 }}
          />
        </div>
        <div
          className="article-show"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    );
  }
}
