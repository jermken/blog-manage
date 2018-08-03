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
  Avatar,
  Radio,
  message
} from "antd";
import "./index.scss";
import request from "../../server/server";
import vipIcon from "../../asset/image/vip_client.png";
import noVipIcon from "../../asset/image/no_vip_client.png";
const Option = Select.Option;
const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
export default class ClientInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [],
      validateStatus: {
        name: {
          error: false,
          help: ''
        },
        booker: {
          error: false,
          help: ''
        },
        contact: {
          error: false,
          help: ''
        }
      },
      detailVisble: false,
      dataList: [],
      tableLoading: false,
      queryParams: {
        startT: "",
        endT: "",
        name: "",
        vipCode: "",
        booker: "",
        sexual: "1",
        isVip: 0,
        page: 1,
        pageSize: 8
      },
      total: 1,
      current: 1,
      pageSize: 10,
      detailData: {},
      staffList: []
    };
  }
  componentWillMount() {
    this.initColumns();
    this.fetchData();
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
  fetchData(queryParams) {
    queryParams = queryParams || this.state.queryParams;
    request.reqGET("epsUserList", { ...queryParams }, res => {
      if (!res.code) {
        this.setState({ 
        dataList: res.data[0],
        total: res.data[2],
        queryParams
        });
      } else {
        Modal.error({
          title: "",
          content: res.msg
        });
      }
    });
  }
  formatTime(time) {
    time = new Date(time);
    let timeStr = "";
    let year = time.getFullYear();
    let month = time.getMonth() + 1;
    month = month > 9 ? month : "0" + month;
    let date = time.getDate();
    timeStr = year + "-" + month + "-" + date;
    return timeStr;
  }
  initColumns() {
    let that = this;
    let columns = [
      {
        title: "客户姓名",
        dataIndex: "name",
        width: 150,
        render: (text, row, index) => {
          return (
            <span>
              <Avatar
                size="large"
                src={
                  row.avatar
                    ? row.avatar
                    : "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                }
              />
              <span>{text}</span>
            </span>
          );
        }
      },
      {
        title: "登记日期",
        dataIndex: "create_time",
        width: 200,
        render: (text, row, index) => {
          return <span>{that.formatTime(text)}</span>;
        }
      },
      {
        title: "联系方式",
        dataIndex: "contact",
        width: 200,
        render: (text, row, index) => {
          return <span>{text}</span>;
        }
      },
      {
        title: "性别",
        dataIndex: "sexual",
        width: 150,
        render: (text, row, index) => {
          return (
            <span>
              <Tag color={text == 1 ? "#fcb200" : "#2db7f5"}>
                {text == 1 ? "女" : "男"}
              </Tag>
            </span>
          );
        }
      },
      {
        title: "是否会员",
        dataIndex: "isVip",
        width: 150,
        render: (text, row, index) => {
          return (
            <span>{text === 1 ? <Avatar size="large" src={vipIcon} /> : ""}</span>
          );
        }
      },
      {
        title: "余额",
        dataIndex: "balance",
        width: 150,
        render: (text, row, index) => {
          return <span>{"￥" + text}</span>;
        }
      },
      {
        title: "活动",
        dataIndex: "activeList",
        width: 150,
        render: (text, row, index) => {
          return <span>{text.length ? text : "-"}</span>;
        }
      },
      {
        title: "备注",
        dataIndex: "desc",
        width: 250,
        render: (text, row, index) => {
          return (
            <Tooltip title={text}>
              <span className="table-desc">{text || "-"}</span>
            </Tooltip>
          );
        }
      },
      {
        title: "操作",
        width: 200,
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
              <span className="gap-line"></span>
              <a
                className="action-aLink"
                href="javascript:;"
                onClick={() => that.deleteList(row.id)}
              >
                删除
              </a>
              {row.isVip === 1 ? <span className="gap-line"></span> : ''}
            </span>
          );
        }
      }
    ];
    that.setState({ columns: columns });
  }
  showDetail(row) {
    let detailData = this.state.detailData;
    detailData = {};
    this.setState({ detailVisble: true, detailData: detailData });
  }
  datePickerChange() {}

  selectChange = (e,type) => {
    let { queryParams } = this.state;
    queryParams[type] = e.target.value;
    this.fetchData(queryParams);
  }

  queryClientList = () => {
    let { queryParams } = this.state;
    console.log(this);
    queryParams.name = this.refs.userName.input.value;
    queryParams.vipCode = this.refs.vipCode.input.value;
    this.fetchData(queryParams);
  }

  pageChange() {}
  addUser = () => {
    let detailData = {
      name: "",
      create_time: 0,
      update_time: 0,
      isVip: 2,
      vipCode: "",
      sexual: '1',
      booker: "",
      contact: "",
      balance: 0,
      activeList: []
    };
    this.setState({ detailVisble: true, detailData: detailData });
  }
  checkEditInfo(detailData) {
    let isValidate = true;
    let { validateStatus } = this.state;
    if (!detailData.name) {
      validateStatus.name.error = 'error';
      validateStatus.name.help = '请输入客户姓名';
      isValidate = false;
    } else {
      validateStatus.name.error = '';
      validateStatus.name.help = '';
    }
    if (!detailData.booker) {
      validateStatus.booker.error = 'error';
      validateStatus.booker.help = '请选择登记人';
      isValidate = false;
    } else {
      validateStatus.booker.error = '';
      validateStatus.booker.help = '';
    }
    if (detailData.contact && !/^[1][3,4,5,7,8][0-9]{9}$/.test(detailData.contact)) {
      validateStatus.contact.error = 'error';
      validateStatus.contact.help = '手机号码格式有误';
      isValidate = false;
    } else {
      validateStatus.contact.error = '';
      validateStatus.contact.help = '';
    }
    this.setState({validateStatus: validateStatus});
    return isValidate;
  }
  handleEdit = () => {
    let that = this;
    let { detailData } = that.state;
    let create_time = +new Date();
    let update_time = create_time;
    if (this.checkEditInfo(detailData)) {
      detailData._id ? request.reqPOST("epsEditUser", { ...detailData, update_time, _id: detailData._id }, res => {
        if (!res.code) {
          message.success('编辑成功！');
          this.setState({
            detailVisble: false
          });
          this.fetchData();
        } else {
          message.error(res.msg);
        }
      }) : request.reqPOST("epsAddUser", { ...detailData, create_time, update_time }, res => {
        if (!res.code) {
          message.success("新增成功！");
          that.setState({detailVisble: false});
          this.fetchData();
        } else {
          message.error(res.msg);
        }
      })
    }
  }
  editCancel = () => {
    this.setState({ detailVisble: false });
  }
  detailIptChange = (e) => {
    let val = e.target.value,
      type = e.target.dataset.type,
      detailData = this.state.detailData;
    detailData[type] = val.replace(/(^\s+)|(\s+$)/g,"");
    this.setState({ detailData: detailData });
  }
  detailSexualChange = (e) => {
    let detailData = this.state.detailData;
    detailData.sexual = e;
    this.setState({ detailData: detailData });
  }
  detailBookerChange = (e) => {
    let detailData = this.state.detailData;
    detailData.booker = e;
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
      detailData,
      staffList
    } = that.state;
    const { TextArea } = Input;
    return (
      <div className="clientInfo-page">
        <div className="form-area">
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
              <Col span={3}>
                <Form.Item
                  label="客户姓名"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                >
                  <Input defaultValue="" placeholder="请输入姓名" ref="userName" />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item
                  label="会员vip"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                >
                  <Input defaultValue="" placeholder="请输入会员号" ref="vipCode" />
                </Form.Item>
              </Col>
              <Col span={3}>
                <Form.Item
                  label="登记人"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                >
                  <Select
                    value={queryParams.serverName}
                    onChange={ (e) => {that.selectChange(e, 'booker')}}
                  >
                    {staffList.map(i => (
                      <Option value={i.name} key={i._id}>
                        {i.name}
                      </Option>
                    ))}
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
                    onChange={(e) => {that.selectChange(e, 'sexual')}}
                  >
                    <Option value={"1"}>女士</Option>
                    <Option value={"2"}>男士</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label="会员"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 16 }}
                >
                  <RadioGroup>
                    <Radio>全部</Radio>
                    <Radio>会员</Radio>
                    <Radio>非会员</Radio>
                  </RadioGroup>
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <div className="btn-area">
            <Button
              type="primary"
              className="btn-area_item"
              onClick={that.queryClientList}
            >
              查询
            </Button>
            <Button className="btn-area_item" onClick={that.addUser}>
              新增
            </Button>
          </div>
        </div>
        <Table
          size="small"
          columns={columns}
          dataSource={dataList}
          loading={tableLoading}
          pagination={false}
          rowKey={record => record._id}
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
          title="客户信息"
          visible={detailVisble}
          onOk={that.handleEdit}
          onCancel={that.editCancel}
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
              validateStatus={validateStatus.name.error? 'error' : ''}
              help={validateStatus.name.help}
            >
              <Input
                value={detailData.name}
                placeholder="请输入客户姓名"
                data-type="name"
                onChange={that.detailIptChange}
              />
            </Form.Item>
            <Form.Item
                  label="性别"
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 10 }}
                >
                  <Select
                    value={detailData.sexual}
                    onChange={that.detailSexualChange}
                  >
                    <Option value="1">女士</Option>
                    <Option value="2">男士</Option>
                  </Select>
                </Form.Item>
            <Form.Item
              label="出生日期"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 10 }}
            >
              <Input
                value={detailData.birthday}
                placeholder="请输入出生日期"
                data-type="birthday"
                onChange={that.detailIptChange}
              />
            </Form.Item>
            <Form.Item
              label="联系方式"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 10 }}
              validateStatus={validateStatus.contact.error? 'error' : ''}
              help={validateStatus.contact.help}
            >
              <Input
                value={detailData.contact}
                placeholder="请输入联系方式"
                data-type="contact"
                onChange={that.detailIptChange}
              />
            </Form.Item>
            <Form.Item
              label="登记人"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 10 }}
              required={true}
              validateStatus={validateStatus.booker.error? 'error' : ''}
              help={validateStatus.booker.help}
            >
              <Select
              value={detailData.booker}
              onChange={that.detailBookerChange}
              >
                {staffList.map(i => (
                  <Option value={i.name} key={i._id}>
                    {i.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="余额"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 10 }}
            >
              <Input value={detailData.balance} disabled/>
            </Form.Item>
            <Form.Item
              label="备注"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 18 }}
              value={detailData.desc}
              onChange={that.detailIptChange}
              data-type="desc"
            >
            <TextArea
            rows={4}
            ></TextArea>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}
