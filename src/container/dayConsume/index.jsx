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
  InputNumber,
  Radio,
  message
} from "antd";
import "./index.scss";
import request from "../../server/server";
const { Option, OptGroup} = Select;
const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;
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
      detailData: {
        userName: "",
        projectList: '',
        serverName: {},
        amount: "",
        paymentWay: [],
        desc: ""
      },
      userList: [],
      staffList: [],
      isShowToVip: false,
      rechargeToVip: null,
      rechargeVisable: false,
      rechargeBooker: null,
      rechargeUser: '',
      consumeUser: '',
      rechargeUserInfo: {},
      consumeUserInfo: {},
      userType: 1
    };
  }
  componentWillMount() {
    this.initColumns();
    this.fetchStaffList();
  }
  fetchStaffList() {
    request.reqGET('epsStaffList', {name: '', status: 1, page: 1, pageSize: 10}, (res) => {
      if(!res.code) {
          this.setState({
              staffList: res.data[0]
          });
      } else {
          message.error('服务器异常，请稍后重试');
      }
    });
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
        dataIndex: "projectList",
        width: 250,
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
          return <span>{text.text}</span>;
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
      userName: row.userName,
      projectList: row.projectList.join(' '),
      serverName: row.serverName,
      amount: row.amount,
      paymentWay: row.paymentWay,
      desc: row.desc
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
      case "balance":
        obj = {
          text: "扣卡",
          color: "purple"
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
  datePickerChange() { }

  selectChange() { }

  queryTableList() { }

  pageChange() { }
  addConsume() {
    let detailData = this.state.detailData;
    detailData = {
      userName: "",
      projectList: '',
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
  detailPaymentWayChange(e) {
    let detailData = this.state.detailData;
    detailData.paymentWay = e;
    this.setState({ detailData: detailData });
  }
  detailServerNameChange = (e) => {
    let detailData = this.state.detailData;
    detailData.serverName.value = e;
    this.setState({ detailData: detailData });
  }
  recharge = () => {
    this.setState({
      rechargeVisable: true,
      rechargeToVip: null,
      isShowToVip: false,
      rechargeUserInfo: {}
    })
  }
  vipOperation = (e) => {
    this.setState({
      rechargeToVip: e.target.value
    })
  }
  userTypeChange = (e) => {
    this.setState({
      userType: e.target.value
    });
  }
  checkRecharge() {
    return true;
  }
  handleRecharge = () => {
    if (this.checkRecharge()) {
      let { rechargeUserInfo, rechargeToVip } = this.state;
      let update_time = +new Date();
      rechargeUserInfo.balance = rechargeUserInfo.balance * 1 + Number(this.refs.rechargeIpt.input.value);
      rechargeUserInfo.isVip = rechargeToVip || 2;
      request.reqPOST("epsEditUser", {...rechargeUserInfo, update_time}, res => {
        if (!res.code) {
          message.success('充值成功！');
          
        } else {
          message.error(res.msg);
        }
      })
    }
  }
  rechargeCancel = () => {
    this.setState({
      rechargeVisable: false
    })
  }
  rechargeBookerChange = (e) => {
    this.setState({
      rechargeBooker: e
    })
  }
  getUsersName = (e) => {
    request.reqGET("epsUserList", { 
      startT: "",
      endT: "",
      name: e,
      vipCode: "",
      booker: "",
      sexual: "1",
      isVip: 0,
      page: 1,
      pageSize: 8
     }, res => {
      if (!res.code) {
        this.setState({
        userList: res.data[0]
        });
      } else {
        Modal.error({
          title: "",
          content: res.msg
        });
      }
    });
  }
  rechargeUserChange = (e) => {
    let { userList, rechargeUserInfo } = this.state;
    let isShowToVip = false;
    userList.forEach((i) => {
      if (i.name == e) {
        isShowToVip = i.isVip == 1? false : true;
        rechargeUserInfo = i;
      }
    });
    this.setState({
      rechargeUser: e,
      isShowToVip,
      rechargeUserInfo
    });
  }
  consumeUserChange = (e) => {
    let { userList, consumeUserInfo } = this.state;
    userList.forEach((i) => {
      if (i.name == e) {
        consumeUserInfo = i;
      }
    });
    this.setState({
      consumeUserInfo
    });
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
      validateStatus,
      detailData,
      userList,
      staffList,
      rechargeToVip,
      isShowToVip,
      rechargeBooker,
      userType,
      rechargeUser,
      consumeUser,
      rechargeVisable
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
                  {staffList.map(i => (
                  <Option value={i.name} key={i._id}>
                    {i.name}
                  </Option>
                ))}
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
                  className="dayConsume-btn"
                  onClick={that.queryTableList.bind(that)}
                >
                  查询
                </Button>
                <Button
                  type="primary"
                  className="dayConsume-btn"
                  onClick={that.addConsume.bind(that)}
                >
                  新增
                </Button>
                <Button
                  type="primary"
                  className="dayConsume-btn"
                  onClick={that.recharge}
                >
                  充值
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
            label="客户类型"
            labelCol={{span: 4}}
            wrapperCol={{span: 16}}
          >
          <RadioGroup onChange={this.userTypeChange} value={userType}>
            <Radio value={1}>游客</Radio>
            <Radio value={2}>已登记客户</Radio>
            </RadioGroup>
          </Form.Item>
            {userType == 2 ? <Form.Item
              label="客户姓名"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 10 }}
              required={true}
              validateStatus={validateStatus.userName ? "error" : ""}
              help={validateStatus.userName ? "请输入客户姓名" : ""}
            >
              <Select
              showSearch
              value={consumeUser}
              onChange={that.consumeUserChange}
              onSearch={this.getUsersName}
              notFoundContent="未找到"
              >
                {userList.map(i => (
                  <Option value={i.name} key={i._id}>
                    {i.name}
                  </Option>
                ))}
              </Select>
            </Form.Item> : null}
            {userType == 2 ? <Form.Item
              label="参与活动"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 10 }}
              required={true}
            >
              <Select>
                {<OptGroup>
                  {<Option></Option>}
                </OptGroup>}
              </Select>
            </Form.Item> : null}
            <Form.Item
              label="项目"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              required={true}
              validateStatus="warning"
              help="多个项目需以空格隔开"
            >
              <Input placeholder="请输入项目" value={detailData.projectList}/>
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
                <Option value="balance">扣卡</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="登记人"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 16 }}
              required={true}
              validateStatus={validateStatus.serverName ? "error" : ""}
              help={validateStatus.serverName ? "请输入服务人员" : ""}
            >
              <Select
                onChange={that.detailServerNameChange}
                value={detailData.serverName.value}
              >
                {staffList.map(i => (
                  <Option value={i.name} key={i._id}>
                    {i.name}
                  </Option>
                ))}
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
        <Modal
          title="充值"
          visible={rechargeVisable}
          onOk={that.handleRecharge}
          onCancel={that.rechargeCancel}
          okText="确定"
          cancelText="取消"
          maskClosable={false}
        >
        <Form>
        <Form.Item
              label="充值客户"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 10 }}
              required={true}
            >
              <Select
              showSearch
              value={rechargeUser}
              onChange={that.rechargeUserChange}
              onSearch={this.getUsersName}
              notFoundContent="未找到"
              >
                {userList.map(i => (
                  <Option value={i.name} key={i._id}>
                    {i.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          <Form.Item
              label="登记人"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 10 }}
              required={true}
            >
              <Select
              value={rechargeBooker}
              onChange={that.rechargeBookerChange}
              >
                {staffList.map(i => (
                  <Option value={i.name} key={i._id}>
                    {i.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          <Form.Item
          label="充值金额"
          labelCol={{span: 4}}
          wrapperCol={{span: 16}}
          required={true}
          >
          <Input ref="rechargeIpt"/>
          </Form.Item>
          { isShowToVip ? <Form.Item
            label="成为会员"
            labelCol={{span: 4}}
            wrapperCol={{span: 16}}
          >
          <RadioGroup onChange={this.vipOperation} value={rechargeToVip}>
            <Radio value={1}>成为会员</Radio>
            <Radio value={2}>非会员</Radio>
            </RadioGroup>
          </Form.Item> : null }
        </Form>
        </Modal>
      </div>
    );
  }
}
