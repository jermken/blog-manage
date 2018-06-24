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
  DatePicker,
  Modal,
  Tooltip,
  Tag,
  InputNumber
} from "antd";
import "./index.scss";
const Option = Select.Option;
const { RangePicker } = DatePicker;
export default class ClientInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [],
      validateStatus: {
        
      },
      detailVisble: false,
      dataList: [],
      tableLoading: false,
      queryParams: {
        startT: "",
        endT: "",
        userName: "",
        sexual: "1",
        serverName: ""
      },
      total: 1,
      current: 1,
      pageSize: 10,
      detailData: {}
    };
  }
  componentWillMount() {
    this.initColumns();
  }
  formatTime(timeStamp) {
    return timeStamp;
  }
  initColumns() {
    let that = this;
    let columns = [
      {
        title: "日期",
        dataIndex: "time",
        width: 200,
        render: (text, row, index) => {
          return <span>{that.formatTime(text)}</span>;
        }
      },
      {
        title: "客户姓名",
        dataIndex: "userName",
        width: 100,
        render: (text, row, index) => {
          return <span>{text}</span>;
        }
      },
      {
        title: "联系方式",
        dataIndex: "contact",
        width: 200,
        render: (text, row, index) => {
          return (
            <span>
              {text.map(val => (
                <Tag color="volcano" key={val.value}>
                  {val.text}
                </Tag>
              ))}
            </span>
          );
        }
      },
      {
        title: "性别",
        dataIndex: "sexual",
        width: 150,
        render: (text, row, index) => {
          return <span>{"￥" + text}</span>;
        }
      },
      {
        title: "是否会员",
        dataIndex: "vip",
        width: 150,
        render: (text, row, index) => {
          return <span>{text}</span>;
        }
      },
      {
        title: "余额",
        dataIndex: "balance",
        width: 150,
        render: (text, row, index) => {
          return <span>{text}</span>;
        }
      },
      {
        title: "活动",
        dataIndex: "activeList",
        width: 150,
        render: (text, row, index) => {
          return <span>{text}</span>;
        }
      },
      {
        title: "备注",
        dataIndex: "desc",
        width: 250,
        render: (text, row, index) => {
          return (
            <Tooltip title={text}>
              <span className="table-desc">{text}</span>
            </Tooltip>
          );
        }
      },
      {
        title: "操作",
        width: 150,
        render: (text, row, index) => {
          return (
            <span>
              <a
                className="action-aLink"
                href="javascript:;"
                onClick={() => that.showDetail(row)}
              >
                编辑
              </a>
              <span className="gap-line" />
              <a
                className="action-aLink"
                href="javascript:;"
                onClick={() => that.deleteList(row.id)}
              >
                删除
              </a>
            </span>
          );
        }
      }
    ];
    that.setState({ columns: columns });
  }
  showDetail(row) {
    let detailData = this.state.detailData;
    detailData = {
      
    };
    this.setState({ detailVisble: true, detailData: detailData });
  }
  datePickerChange() { }

  selectChange() { }

  queryTableList() { }

  pageChange() { }
  addUser() {
    let detailData = this.state.detailData;
    detailData = {
      
    };
    this.setState({ detailVisble: true, detailData: detailData });
  }
  handleEdit() {
    this.setState({ detailVisble: false });
  }
  editCancel() {
    this.setState({ detailVisble: false });
  }
  detailIptChange(e) {
    let val = e.target.value,
      type = e.target.dataset.type,
      detailData = this.state.detailData;
    detailData[type] = val;
    this.setState({ detailData: detailData });
  }
  detailProjectChange(e) {
    let detailData = this.state.detailData;
    detailData.projectList = e;
    this.setState({ detailData: detailData });
  }
  detailPaymentWayChange(e) {
    let detailData = this.state.detailData;
    detailData.paymentWay = e;
    this.setState({ detailData: detailData });
  }
  detailServerNameChange(e) {
    let detailData = this.state.detailData;
    detailData.serverName.value = e;
    this.setState({ detailData: detailData });
  }
  render() {
    let that = this;
    let {
      columns,
      dataList,
      tableLoading,
      queryParams,
      total,
      current,
      pageSize,
      detailVisble,
      projectList,
      validateStatus,
      detailData
    } = that.state;
    const { TextArea } = Input;
    return (
      <div className="clientInfo-page">
        <Form className="page-from">
          <Row>
            <Col span={5}>
              <Form.Item
                label="日期"
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 18 }}
              >
                <RangePicker onChange={that.datePickerChange.bind(that)} />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                label="客户姓名"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
              >
                <Input placeholder="请输入客户姓名" ref="userName" />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                label="会员vip"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
              >
                <Input placeholder="请输入会员号" ref="vipCode" />
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item
                label="开卡人"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
              >
                <Select
                  value={queryParams.serverName}
                  onChange={that.selectChange.bind(that)}
                >
                </Select>
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item
                label="性别"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
              >
                <Select
                  value={queryParams.sexual}
                  onChange={that.selectChange.bind(that)}
                >
                  
                </Select>
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item>
                <Button
                  type="primary"
                  className="search-btn"
                  onClick={that.queryTableList.bind(that)}
                >
                  查询
                </Button>
                <Button
                  className="search-btn"
                  onClick={that.addUser.bind(that)}
                >
                  新增
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Table
          size="small"
          columns={columns}
          dataSource={dataList}
          loading={tableLoading}
          pagination={false}
          rowKey={record => record.id}
        />
        <div className="pagination-wrap">
          <Pagination
            style={{ margin: "0 auto" }}
            total={total}
            onChange={that.pageChange.bind(that)}
            current={current}
            pageSize={pageSize}
            defaultCurrent={1}
          />
        </div>
        <Modal
          title="消费详情"
          visible={detailVisble}
          onOk={that.handleEdit.bind(that)}
          onCancel={that.editCancel.bind(that)}
          okText="确定"
          cancelText="取消"
          maskClosable={false}
        >
          <Form>
            <Form.Item
              label="客户姓名"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 10 }}
              required={true}
              validateStatus={validateStatus.userName ? "error" : ""}
              help={validateStatus.userName ? "请输入客户姓名" : ""}
            >

            </Form.Item>
            <Form.Item
              label="项目"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              required={true}
              validateStatus={validateStatus.projectName ? "error" : ""}
              help={validateStatus.projectName ? "请选择项目" : ""}
            >
              <Select>
               
              </Select>
            </Form.Item>
            <Form.Item
              label="付款方式"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 16 }}
              required={true}
              validateStatus={validateStatus.paymentWay ? "error" : ""}
              help={validateStatus.paymentWay ? "请选择付款方式" : ""}
            >
              <Select
                onChange={that.detailPaymentWayChange.bind(that)}
                value={detailData.paymentWay}
                mode="multiple"
              >
              </Select>
            </Form.Item>
            <Form.Item
              label="服务人"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 16 }}
              required={true}
              validateStatus={validateStatus.serverName ? "error" : ""}
              help={validateStatus.serverName ? "请输入服务人员" : ""}
            >
              <Select>
                
              </Select>
            </Form.Item>
            <Form.Item
              label="金额"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 14 }}
              required={true}
              validateStatus={validateStatus.amount ? "error" : ""}
              help={validateStatus.amount ? "请输入消费金额" : ""}
            >

            </Form.Item>
            <Form.Item
              label="备注"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 16 }}
            >

            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}
