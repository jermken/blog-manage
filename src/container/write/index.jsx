import React, { Component } from "react";
import { Input, Button, Form, Row, Col, Modal, Select } from "antd";
import "./index.scss";
import marked from "marked";
import request from "../../server/server.js";

const { TextArea } = Input;
const Option = Select.Option;
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
      },
      label: "",
      time: new Date().getTime()
    };
  }

  componentWillMount() {
    this.state.data._id ? this.fetchData() : void 0;
  }

  fetchData() {
    let that = this;
    request.reqGET(
      "articlelist",
      { _id: that.state.data._id, isEdit: 1 },
      res => {
        let resData = res.data[0];
        that.setState({ data: resData, label: resData.label, time: resData.time });
        that.refs.title.input.value = resData.title;
        that.refs.author.input.value = resData.author;
      }
    );
  }

  onSubmit() {
    const title = this.refs.title.input.value,
      author = this.refs.author.input.value,
      content = this.state.data.content,
      label = this.state.label;
    if (!title || !label || !author || !content) {
      return Modal.error({
        title: "请将信息填写完整！",
        okText: "确定"
      });
    } else {
      let time = new Date().getTime();
      let obj = { title, label, author, content },
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
        : request.reqPOST("addArticle", { ...obj, time }, res => {
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

  onSave() {
    const title = this.refs.title.input.value,
      author = this.refs.author.input.value,
      content = this.state.data.content,
      {label,time} = this.state;
    if (!title || !label || !author || !content) {
      return Modal.error({
        title: "请将信息填写完整！",
        okText: "确定"
      });
    } else {
      let obj = { title, label, author, content },
        _id = this.state.data._id;
      request.reqPOST("updateArticle", { ...obj, _id, time }, res => {
        if (!res.code) {
          Modal.success({
            title: "保存成功！",
            okText: "确定",
            onOk: () => {}
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
    this.refs.author.input.value = "";
    this.setState({
      label: ""
    });
  }

  inputChange(e) {
    this.setState({
      data: { ...this.state.data, content: e.target.value }
    });
  }

  labelChange(val) {
    this.setState({
      label: val
    });
  }

  render() {
    const that = this;
    let content = marked(that.state.data.content)
      .replace(/<\/script/g, "<\\/script")
      .replace(/<!--/g, "<\\!--");
    let { label } = that.state;
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
                <Select
                  ref="label"
                  onSelect={that.labelChange.bind(this)}
                  value={label}
                >
                  <Option value="html">html</Option>
                  <Option value="node">node</Option>
                  <Option value="js">js</Option>
                  <Option value="css">css</Option>
                  <Option value="tool">tool</Option>
                </Select>
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
            <Col span={8}>
              <Form.Item>
                <Button
                  onClick={that.clearQuery.bind(this)}
                  className="clear-btn"
                >
                  清除
                </Button>
                <Button
                  disabled={that.state.data._id ? false : true}
                  onClick={that.onSave.bind(this)}
                  className="clear-btn"
                  type="primary"
                >
                  保存
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
