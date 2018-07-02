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
  Radio
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
      validateStatus: {},
      detailVisble: false,
      dataList: [],
      tableLoading: false,
      queryParams: {
        startT: "",
        endT: "",
        name: "",
        vipCode: "",
        booker: "",
        sexual: "",
        isVip: 0,
        page: 1,
        pageSize: 8
      },
      total: 1,
      current: 1,
      pageSize: 10,
      detailData: {},
      serverName: []
    };
  }
  componentWillMount() {
    this.initColumns();
    //this.fetchData(this.state.queryParams);
    let data = [
      {
        name: "张一",
        create_time: 1530093403514,
        update_time: 1530093403514,
        isVip: true,
        vipCode: "13212121212",
        sexual: 2,
        booker: "小杰",
        _id: "fdsfsd345d",
        contact: "13212387654",
        balance: 123,
        activeList: []
      },
      {
        name: "张二",
        create_time: 1530093403514,
        update_time: 1530093403514,
        isVip: false,
        vipCode: "",
        sexual: 1,
        booker: "小婷",
        _id: "fdsfsd34de5d",
        contact: "13212387654",
        balance: 343,
        activeList: []
      }
    ];
    this.setState({ dataList: data });
  }
  fetchData(queryParams) {
    let that = this;
    request.reqGET("epsUserList", { ...queryParams }, res => {
      if (!res.code) {
        that.setState({ dataList: res.data });
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
            <span>{text ? <Avatar size="large" src={vipIcon} /> : ""}</span>
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
              {row.isVip ? <span className="gap-line"></span> : ''}
              {row.isVip? <a
                className="action-aLink"
                href="javascript:;"
                onClick={() => that.deleteList(row.id)}
              >
                充值
              </a> : ''}
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

  selectChange() {}

  queryTableList() {
    this.fetchData(this.state.queryParams);
  }

  pageChange() {}
  addUser() {
    let detailData = {
      name: "",
      create_time: 0,
      update_time: 0,
      isVip: false,
      vipCode: "",
      sexual: '1',
      booker: "",
      contact: "",
      balance: 0
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
    if (detailData.contact && /^[1][3,4,5,7,8][0-9]{9}$/.test(detailData.contact)) {
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
  handleEdit() {
    let that = this;
    let { detailData } = that.state;
    let create_time = +new Date();
    let update_time = create_time;
    if (this.checkEditInfo(detailData)) {
      let { _id } = detailData._id;
      _id ? request.reqPOST("epsEditUser", { ...detailData, update_time, _id }, res => {
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
      }) : request.reqPOST("epsAddUser", { ...detailData, create_time, update_time }, res => {
        if (!res.code) {
          Modal.success({
            title: "新增成功！",
            okText: "确定",
            onOk: () => {}
          });
          that.setState({detailVisble: false});
        } else {
          Modal.error({
            title: "",
            content: res.msg
          });
        }
      })
    }
  }
  editCancel() {
    this.setState({ detailVisble: false });
  }
  detailIptChange(e) {
    let val = e.target.value,
      type = e.target.dataset.type,
      detailData = this.state.detailData;
    detailData[type] = val.replace(/(^\s+)|(\s+$)/g,"");
    this.setState({ detailData: detailData });
  }
  detailSexualChange(e) {
    let detailData = this.state.detailData;
    detailData.sexual = e;
    this.setState({ detailData: detailData });
  }
  detailBookerChange(e) {
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
      serverName
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
                  <Input placeholder="请输入姓名" ref="userName" />
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
                  label="登记人"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                >
                  <Select
                    value={queryParams.serverName}
                    onChange={that.selectChange.bind(that)}
                  >
                    {serverName.map(i => (
                      <Option value={i._id} key={i._id}>
                        {i.text}
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
                    onChange={that.selectChange.bind(that)}
                  >
                    <Option value="1">女士</Option>
                    <Option value="2">男士</Option>
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
              onClick={that.queryTableList.bind(that)}
            >
              查询
            </Button>
            <Button className="btn-area_item" onClick={that.addUser.bind(that)}>
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
            >
              <Input
                value={detailData.name}
                placeholder="请输入客户姓名"
                data-type="userName"
                onChange={that.detailIptChange.bind(that)}
              />
            </Form.Item>
            <Form.Item
                  label="性别"
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 10 }}
                >
                  <Select
                    value={detailData.sexual}
                    onChange={that.detailSexualChange.bind(that)}
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
                onChange={that.detailIptChange.bind(that)}
              />
            </Form.Item>
            <Form.Item
              label="联系方式"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 10 }}
            >
              <Input
                value={detailData.contact}
                placeholder="请输入联系方式"
                data-type="contact"
                onChange={that.detailIptChange.bind(that)}
              />
            </Form.Item>
            <Form.Item
              label="登记人"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 10 }}
              required={true}
            >
              <Select
              value={detailData.booker}
              onChange={that.detailBookerChange.bind(that)}
              >
                {serverName.map(i => (
                  <Option value={i._id} key={i._id}>
                    {i.text}
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
              onChange={that.detailIptChange.bind(that)}
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
