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
export default class DayConsume extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [],
      validateStatus: {
        userName: false,
        projectName: false,
        paymentWay: false,
        serverName: false,
        amount: false
      },
      detailVisble: false,
      projectList: [
        {
          text: "洗脸",
          value: "1"
        },
        {
          text: "美甲",
          value: "2"
        },
        {
          text: "脱毛",
          value: "3"
        },
        {
          text: "化妆",
          value: "4"
        },
        {
          text: "修眉",
          value: "5"
        }
      ],
      dataList: [
        {
          time: "2018-06-22",
          userName: "客户1",
          sexual: "1",
          serverName: "李阳婕",
          project: ["做手指甲", "脱毛"],
          amount: "230",
          paymentWay: ["wechat", "cash"],
          desc:
            "这是第二次进店，这是第三次进店，这是第四次进店这是第二次进店，这是第三次进店，这是第四次进店",
          id: "erwen23432432n"
        },
        {
          time: "2018-06-22",
          userName: "客户1",
          sexual: "1",
          serverName: "邱婷",
          project: ["洗脸"],
          amount: "230",
          paymentWay: ["card"],
          desc:
            "这是第二次进店，这是第三次进店，这是第四次进店这是第二次进店，这是第三次进店，这是第四次进店",
          id: "erwen2343332432n"
        }
      ],
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
      detailData: {
        userName: "",
        projectList: [],
        serverName: "",
        amount: "",
        paymentWay: [],
        desc: ""
      }
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
        width: 150,
        render: (text, row, index) => {
          return <span>{text}</span>;
        }
      },
      {
        title: "项目",
        dataIndex: "project",
        width: 250,
        render: (text, row, index) => {
          return (
            <span>
              {text.map(val => (
                <Tag color="volcano" key={val}>
                  {val}
                </Tag>
              ))}
            </span>
          );
        }
      },
      {
        title: "金额",
        dataIndex: "amount",
        width: 150,
        render: (text, row, index) => {
          return <span>{"￥" + text}</span>;
        }
      },
      {
        title: "付款方式",
        dataIndex: "paymentWay",
        width: 200,
        render: (text, row, index) => {
          return (
            <span>
              {text.map(val => (
                <Tag key={val} color={that.transPaymentWay(val).color}>
                  {that.transPaymentWay(val).text}
                </Tag>
              ))}
            </span>
          );
        }
      },
      {
        title: "服务人",
        dataIndex: "serverName",
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
                onClick={() => that.showDetail(row.id)}
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
  showDetail(id) {
    let detailData = this.state.detailData;
    detailData = {
      userName: "客户1",
      projectList: ["1"],
      serverName: "1",
      amount: "350",
      paymentWay: ["wechat"],
      desc: "这是备注这是备注这是备注这是备注这是备注"
    };
    this.setState({ detailVisble: true, detailData: detailData });
  }
  transPaymentWay(str) {
    var obj;
    switch (str) {
      case "wechat":
        obj = {
          text: "微信",
          color: "green"
        };
        break;
      case "alipay":
        obj = {
          text: "支付宝",
          color: "cyan"
        };
        break;
      case "cash":
        obj = {
          text: "现金",
          color: "blue"
        };
        break;
      case "card":
        obj = {
          text: "刷卡",
          color: "gold"
        };
        break;
      default:
        obj = {
          text: "其他",
          color: "purple"
        };
    }
    return obj;
  }
  datePickerChange() {}

  selectChange() {}

  queryTableList() {}

  pageChange() {}
  addConsume() {
    let detailData = this.state.detailData;
    detailData = {
        userName: "",
        projectList: [],
        serverName: "",
        amount: "",
        paymentWay: [],
        desc: ""
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
    detailData.serverName = e;
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
      <div className="dayconsume-page">
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
                label="服务人"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
              >
                <Select
                  value={queryParams.serverName}
                  onChange={that.selectChange.bind(that)}
                >
                  <Option value="html">服务人1</Option>
                  <Option value="node">服务人2</Option>
                  <Option value="js">服务人3</Option>
                  <Option value="css">服务人4</Option>
                  <Option value="tool">服务人5</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                label="性别"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
              >
                <Select
                  value={queryParams.sexual}
                  onChange={that.selectChange.bind(that)}
                >
                  <Option value="1">女士</Option>
                  <Option value="2">男士</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
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
                  onClick={that.addConsume.bind(that)}
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
              <Input
                value={detailData.userName}
                placeholder="请输入客户姓名"
                data-type="userName"
                onChange={that.detailIptChange.bind(that)}
              />
            </Form.Item>
            <Form.Item
              label="项目"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              required={true}
              validateStatus={validateStatus.projectName ? "error" : ""}
              help={validateStatus.projectName ? "请选择项目" : ""}
            >
              <Select
                onChange={that.detailProjectChange.bind(that)}
                value={detailData.projectList}
                mode="multiple"
              >
                {projectList.map(i => (
                  <Option key={i.value} value={i.value}>
                    {i.text}
                  </Option>
                ))}
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
                <Option value="wechat">微信</Option>
                <Option value="alipay">支付宝</Option>
                <Option value="card">刷卡</Option>
                <Option value="cash">现金</Option>
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
              <Select
                onChange={that.detailServerNameChange.bind(that)}
                value={detailData.serverName}
              >
                <Option value="1">小李子</Option>
                <Option value="2">小婷子</Option>
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
              <InputNumber value={detailData.amount} min={0} precision={1} />
            </Form.Item>
            <Form.Item
              label="备注"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 16 }}
            >
              <TextArea
                onChange={that.detailIptChange.bind(that)}
                data-type="desc"
                value={detailData.desc}
                rows={4}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}
