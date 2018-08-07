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
        consumeUser: {},
        paymentWay: {},
        serverName: {},
        amount: {},
        amountBalance: {}
      },
      detailVisble: false,
      dataList: [],
      tableLoading: false,
      queryParams: {
        startT: "",
        endT: "",
        name: "",
        sexual: "1",
        serverName: ""
      },
      total: 1,
      current: 1,
      pageSize: 10,
      detailData: {
        name: "",
        projectList: '',
        serverName: '',
        amount: "",
        amountBalance: '',
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
      consumeUserInfo: {
        activeList:[{
          title: '活动1',
          list: [{title: '美甲1', times: 2},{title: '洗脸1', times:1}]
        },{
          title: '活动2',
          list: [{title: '美甲', times: 2},{title: '洗脸', times:0}]
        }]
      },
      activeList: [{
        title: '活动1',
        list: [{title: '美甲1', times: 2},{title: '洗脸1', times:1}]
      },{
        title: '活动2',
        list: [{title: '美甲', times: 2},{title: '洗脸', times:1}]
      }]
    };
  }
  componentWillMount() {
    this.initColumns();
    // this.fetchStaffList();
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
        dataIndex: "name",
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
    let projectList = row.projectList.join(' ');
    detailData = {
      ...row,
      projectList
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
  datePickerChange = (e) => { }

  selectChange = (e) => { }

  queryTableList = (e) => { }

  pageChange = (e) => { }

  addConsume = () => {
    let detailData = this.state.detailData;
    detailData = {
      name: '',
      projectList: [],
      serverName: '',
      amount: '',
      amountBalance: '',
      paymentWay: [],
      desc: '',
      cardProject: [],
      userType: 1
    };
    this.setState({ detailVisble: true, detailData: detailData });
  }
  checkoutDetailData(data) {
    let isValidate = true;
    let { consumeUser, validateStatus } = this.state;
    if (data.userType != 1 && !consumeUser) {
      validateStatus.consumeUser.error = true;
      validateStatus.consumeUser.help = '请选择已登记客户';
      isValidate = false;
    } else {
      validateStatus.consumeUser.error = false;
      validateStatus.consumeUser.help = '';
    }
    if (!data.paymentWay.length) { 
      validateStatus.paymentWay.error = true;
      validateStatus.paymentWay.help = '请选择付款方式';
      isValidate = false;
    } else {
      validateStatus.paymentWay.error = false;
      validateStatus.paymentWay.help = '';
    }
    if (!data.serverName) {
      validateStatus.serverName.error = true;
      validateStatus.serverName.help = '请选择登记人';
      isValidate = false;
    } else {
      validateStatus.serverName.error = false;
      validateStatus.serverName.help = '';
    }
    if (data.amountBalance && (!/^[1-9]\d*(.\d{1,2})?$/.test(data.amountBalance) || data.amountBalance < 0)) { 
      validateStatus.amountBalance.error = true;
      validateStatus.amountBalance.help = '请填写金额';
      isValidate = false;
    } else {
      validateStatus.amountBalance.error = false;
      validateStatus.amountBalance.help = '';
      data.amountBalance = +data.amountBalance;
    }
    if (data.userType == 1 && (!/^[1-9]\d*(.\d{1,2})?$/.test(data.amount) || data.amount < 0)) { 
      validateStatus.amount.error = true;
      validateStatus.amount.help = '请填写金额';
      isValidate = false;
    } else {
      validateStatus.amount.error = false;
      validateStatus.amount.help = '';
      data.amount = +data.amount;
    }
    this.setState({
      validateStatus
    });
    return isValidate;
  }
  handleEdit = () => {
    let { detailData, consumeUser } = this.state;
    let projectList = this.refs.projectList.input.value;
    if (detailData.userType == 1) {
      detailData.name = this.refs.trave_user.input.value || '游客';
    } else {
      detailData.amountBalance = this.refs.amountBalance.input.value || 0;
      detailData.name = consumeUser;
    }
    detailData.amount = this.refs.amount.input.value;
    detailData.projectList = projectList ? projectList.split(' ') : [];
    if (!this.checkoutDetailData(detailData)) {
      return;
    }
    if (detailData._id) {
      detailData.update_time = +new Date();
    } else {
      detailData.create_time = detailData.update_time = +new Date();
    }
    console.log(detailData);
    this.setState({ detailVisble: false });
  }
  editCancel = () => {
    this.setState({ detailVisble: false });
  }
  detailIptChange = (e) => {
    let val = e.target.value,
      type = e.target.dataset.type,
      detailData = this.state.detailData;
    detailData[type] = val;
    this.setState({ detailData: detailData });
  }
  cardProjectChange = (e) => {
    let { detailData } = this.state;
    detailData.cardProject = e;
    this.setState({ detailData: detailData });
  }
  detailPaymentWayChange = (e) => {
    let detailData = this.state.detailData;
    detailData.paymentWay = e;
    this.setState({ detailData: detailData });
  }
  detailServerNameChange = (e) => {
    let detailData = this.state.detailData;
    detailData.serverName = e;
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
    let { detailData } = this.state;
    detailData.userType = e.target.value;
    this.setState({
      detailData
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
  fetchUsersName = (e) => {
    request.reqGET("epsUserList", { 
      startT: "",
      endT: "",
      name: e,
      vipCode: "",
      booker: "",
      sexual: "1",
      isVip: 0,
      page: 1,
      pageSize: 5
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
  fetchActiveList(e) {
    request.reqGET('epsActive',{
      title: e,
      validate: '0',
      begin_time: '',
      end_time: '',
      page: 1,
      pageSize: 5
    }, res => {
      if (!res.code) {
        this.setState({
          activeList: res.data[0]
        });
      } else {
        message.error(res.msg);
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
    let { userList, consumeUserInfo, detailData } = this.state;
    userList.forEach((i) => {
      if (i.name == e) {
        consumeUserInfo = i;
      }
    });
    detailData.cardProject = [];
    this.setState({
      consumeUserInfo,
      detailData
    });
  }
  newCardChange = (e) => {
    let { detailData, activeList } = this.state;
    activeList.forEach((i) => {
      if (i.title == e) {
        detailData.newCard = i.title;
      }
    });
    this.setState({
      detailData
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
      rechargeUser,
      consumeUser,
      rechargeVisable,
      consumeUserInfo,
      activeList
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
                <RangePicker onChange={that.datePickerChange} />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                label="客户姓名"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
              >
                <Input placeholder="请输入客户姓名" ref="name" />
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
                  onChange={that.selectChange}
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
                  onChange={that.selectChange}
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
                  onClick={that.queryTableList}
                >
                  查询
                </Button>
                <Button
                  type="primary"
                  className="dayConsume-btn"
                  onClick={that.addConsume}
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
            onChange={that.pageChange}
            current={current}
            pageSize={pageSize}
            defaultCurrent={1}
          />
        </div>
        <Modal
          title="消费详情"
          visible={detailVisble}
          onOk={that.handleEdit}
          onCancel={that.editCancel}
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
          <RadioGroup onChange={this.userTypeChange} value={detailData.userType}>
            <Radio value={1}>游客</Radio>
            <Radio value={2}>已登记客户</Radio>
            </RadioGroup>
          </Form.Item>
            {detailData.userType == 2 ? <Form.Item
              label="客户姓名"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 10 }}
              required={true}
              validateStatus={validateStatus.consumeUser.error ? "error" : ""}
              help={validateStatus.consumeUser.help || ''}
            >
              <Select
              showSearch
              value={consumeUser}
              onChange={that.consumeUserChange}
              onSearch={this.fetchUsersName}
              notFoundContent="未找到"
              >
                {userList.map(i => (
                  <Option value={i.name} key={i._id}>
                    {i.name}
                  </Option>
                ))}
              </Select>
            </Form.Item> : <Form.Item
              label="游客姓名"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 10 }}
              required={true}
            >
              <Input placeholder="请输入游客姓名" ref="trave_user"/>
            </Form.Item>}
            {detailData.userType == 2 ? <Form.Item
              label="套卡项目"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 16 }}
            >
              <Select
              mode="multiple"
              onChange={this.cardProjectChange}
              value={detailData.cardProject}
              >
                {consumeUserInfo.activeList ? consumeUserInfo.activeList.map((i) => (
                  <OptGroup label={i.title} key={i.title}>
                  {i.list.map((j) => (
                    <Option disabled={j.times=='0' || false} value={i.title+ '#'+ j.title} key={j.title}>{j.title}</Option>
                  ))}
                </OptGroup>
                )) : null}
              </Select>
            </Form.Item> : null}
            <Form.Item
            label="新增套卡"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 10 }}
            >
              <Select
              showSearch
              value={detailData.newCard}
              onChange={that.newCardChange}
              onSearch={this.fetchActiveList}
              notFoundContent="未找到"
              >
                {activeList.map((i) => (<Option value={i.title} key={i.title}>{i.title}</Option>))}
              </Select>
            </Form.Item>
            <Form.Item
              label="项目"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 16 }}
            >
              <Input placeholder="多个项目需以空格隔开" ref="projectList"/>
            </Form.Item>
            <Form.Item
              label="付款方式"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 16 }}
              required={true}
              validateStatus={validateStatus.paymentWay.error ? "error" : ""}
              help={validateStatus.paymentWay.help || ''}
            >
              <Select
                onChange={that.detailPaymentWayChange}
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
              validateStatus={validateStatus.serverName.error ? "error" : ""}
              help={validateStatus.serverName.help || ''}
            >
              <Select
                onChange={that.detailServerNameChange}
                value={detailData.serverName}
              >
                {staffList.map(i => (
                  <Option value={i.name} key={i._id}>
                    {i.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            {detailData.userType == 2 ? <Form.Item
              label="扣卡金额"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 14 }}
              required={true}
              validateStatus={validateStatus.amountBalance.error ? "error" : ""}
              help={validateStatus.amountBalance.help || ''}
            >
              <Input min={0} precision={1} ref="amountBalance"/>
            </Form.Item> : null}
            <Form.Item
              label="金额"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 14 }}
              required={true}
              validateStatus={validateStatus.amount.error ? "error" : ""}
              help={validateStatus.amount.help || ''}
            >
              <Input min={0} precision={1} ref="amount"/>
            </Form.Item>
            <Form.Item
              label="备注"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 16 }}
            >
              <TextArea
                onChange={that.detailIptChange}
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
              onSearch={this.fetchUsersName}
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
