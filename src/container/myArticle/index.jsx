import React, { Component } from "react";
import {
  Table,
  Form,
  Input,
  Pagination,
  Row,
  Col,
  Button,
  Select,
  DatePicker
} from "antd";
import moment from "moment";
import request from "../../server/server";
import "./index.scss";

const Option = Select.Option;
const { RangePicker } = DatePicker;
let that;
export default class MyArticle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [],
      dataList: [],
      queryParams: {
        page: 1,
        pageSize: 8,
        begin_date: "",
        end_date: "",
        label: "",
        title: "",
        author: localStorage.getItem("author")
      },
      total: 0,
      current: 1,
      pageSize: 8
    };
    that = this;
  }

  componentWillMount() {
    const columns = this.initColumns();
    const queryParams = this.state.queryParams;
    this.fetchData(queryParams);
    this.setState({
      columns: columns
    });
  }

  fetchData(queryParams) {
    if (!queryParams.begin_date) {
      queryParams.begin_date = 0;
    } else {
      queryParams.begin_date = new Date(queryParams.begin_date).getTime();
    }
    if (!queryParams.end_date) {
      queryParams.end_date = new Date().getTime();
    } else {
      queryParams.end_date = new Date(queryParams.end_date).getTime();
    }
    request.reqGET("articlelist", { ...queryParams }, res => {
      if (!res.code) {
        that.setState({
          dataList: res.data[0],
          queryParams: queryParams,
          total: res.data[2],
          current: queryParams.page
        });
      }
    });
  }

  initColumns() {
    return [
      {
        title: "日期",
        dataIndex: "date",
        render: (text, row, index) => {
          return <span>{text}</span>;
        }
      },
      {
        title: "标题",
        dataIndex: "title",
        render: (text, row, index) => {
          return <span>{text}</span>;
        }
      },
      {
        title: "标签",
        dataIndex: "label",
        render: (text, row, index) => {
          return <span>{text}</span>;
        }
      },
      {
        title: "作者",
        dataIndex: "author",
        render: (text, row, index) => {
          return <span>{text}</span>;
        }
      },
      {
        title: "操作",
        render: (text, row, index) => {
          return (
            <span>
              <a
                className="action-aLink"
                href="javascript:;"
                onClick={() => that.goToPageDetail(row._id)}
              >
                编辑
              </a>
              <span className="gap-line" />
              <a
                className="action-aLink"
                href="javascript:;"
                onClick={() => that.deleteArticle(row)}
              >
                删除
              </a>
            </span>
          );
        }
      }
    ];
  }

  goToPageDetail(id) {
    window.location.href = `/home/write?articleId=${id}`;
  }

  deleteArticle(item) {
    let that = this;
    request.reqPOST("deleteArticle", { ...item }, res => {
      let queryParams = this.state.queryParams;
      that.fetchData(queryParams);
    });
  }

  selectChange(val) {
    let queryParams = this.state.queryParams;
    queryParams.label = val;
    this.fetchData(queryParams);
  }

  datePickerChange(date, str) {
    let queryParams = this.state.queryParams;
    queryParams.begin_date = str[0];
    queryParams.end_date = str[1];
    this.fetchData(queryParams);
  }

  queryArticle() {
    let queryParams = this.state.queryParams;
    queryParams.title = this.refs.label.input.value;
    this.fetchData(queryParams);
  }
  pageChange(page, pageSize) {
    let queryParams = this.state.queryParams;
    queryParams.page = page;
    queryParams.pageSize = pageSize;
    this.fetchData(queryParams);
  }
  render() {
    let that = this;
    let { total, current, pageSize, queryParams } = that.state;
    return (
      <div className="myArticle-page">
        <Form className="page-from">
          <Row>
            <Col span={6}>
              <Form.Item
                label="日期"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 16 }}
              >
                <RangePicker onChange={that.datePickerChange.bind(that)} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="标签"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 16 }}
              >
                <Select value={queryParams.label} onChange={that.selectChange.bind(that)}>
                  <Option value="html">html</Option>
                  <Option value="node">node</Option>
                  <Option value="js">js</Option>
                  <Option value="css">css</Option>
                  <Option value="tool">tool</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="标题"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 16 }}
              >
                <Input
                  placeholder="请输入标题"
                  ref="label"
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item>
                <Button
                  type="primary"
                  className="search-btn"
                  onClick={that.queryArticle.bind(that)}
                >
                  查询
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Table
          size="small"
          columns={that.state.columns}
          dataSource={this.state.dataList}
          loading={false}
          pagination={false}
        />
        <div className="pagination-wrap">
          <Pagination
            style={{ margin: "0 auto" }}
            total={total}
            onChange={that.pageChange.bind(this)}
            current={current}
            pageSize={pageSize}
            defaultCurrent={1}
          />
        </div>
      </div>
    );
  }
}
