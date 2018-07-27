import React, { Component } from "react";
import { Button, Popconfirm, Pagination, Form, Row, Col, Radio, Modal, Input, DatePicker, Upload, Icon, message, Select  } from 'antd';
import request from "../../server/server";
import './index.scss';
import defaultAvatar from '../../asset/image/default_avatar.png';
import moment from 'moment';

const RadioGroup = Radio.Group;
const dateFormat = 'YYYY-MM-DD';
const { TextArea } = Input;
const { RangePicker } = DatePicker;
export default class ActiveList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataList:[],
            queryParams: {
                title: '',
                validate: '0',
                begin_time: '',
                end_time: '',
                page: 1,
                pageSize: 9
            },
            total: 0,
            detailVisble: false,
            detail:{
              title: '',
              begin_time: '',
              end_time: '',
              list: [{
                title: '',
                times: ''
              }]
            },
            validate:{
                title: {},
                validate: {},
                date: {},
                list: {}
            }
        }
    }
    componentWillMount() {
        this.fetchData(this.state.queryParams);
    }
    fetchData(queryParams) {
        queryParams = queryParams || this.state.queryParams;
        request.reqGET('epsActive', {...queryParams}, (res) => {
            if(!res.code) {
                this.setState({
                    dataList: res.data[0],
                    total: res.data[2],
                    queryParams
                });
            } else {
                message.error('服务器异常，请稍后重试');
            }
        });
    }
    deleteActive = (id) => {
        request.reqPOST('epsDeleteActive', {_id: id}, (res) => {
            if(!res.code) {
                message.success('删除成功');
                this.fetchData(this.state.queryParams);
            } else {
                message.error('删除失败，请稍后重试');
            }
        })
    }
    pageChange = (page, pageSize) => {
        let { queryParams } = this.state;
        queryParams.page = page;
        queryParams.pageSize = pageSize;
        this.fetchData(queryParams);
    }
    isValidateChange = (e) => {
        let { queryParams } = this.state;
        queryParams.validate = e.target.value;
        this.fetchData(queryParams);
    }
    editActive = (i) => {
        let detail;
        if (i) {
            detail = i;
        } else {
            detail = {
                title: '',
                validate: '',
                begin_time: '2018-07-01',
                end_time: '2018-07-21',
                list: [{
                  title: '',
                  times: ''
                }]
            } 
        }
        this.setState({
            detailVisble: true,
            detail
        })
    }
    checkEditInfo = () => {
        let { detail, validate } = this.state;
        let isvalidate = true;
        if (detail.title === '') {
            validate.title.error = true;
            validate.title.help = '请填写活动名称';
            isvalidate = false;
        } else {
            validate.title.error = false;
            validate.title.help = '';
        }
        if (!detail.begin_time) {
            validate.date.error = true;
            validate.date.help = '请选择活动时间';
            isvalidate = false;
        } else {
            validate.date.error = false;
            validate.date.help = '';
        }
        let titleArr = [];
        for (let i = 0; i < detail.list.length; i++) {
          if (!detail.list[i].title || !detail.list[i].times) {
            validate.list.error = true;
            validate.list.help = '请将信息填写完整';
            isvalidate = false;
            this.setState({
              validate
            });
            return isvalidate;
          } else {
            titleArr.push(detail.list[i].title);
            if (detail.list[i].times.replace(/\d/g,'')) {
              validate.list.error = true;
              validate.list.help = '使用次数只能填整数';
              isvalidate = false;
              this.setState({
                validate
              });
              return isvalidate;
            }
          }
        }
        if (titleArr.length != 1 && titleArr.length != (new Set(titleArr)).size) {
          validate.list.error = true;
          validate.list.help = '项目名称存在重复';
          isvalidate = false;
          this.setState({
            validate
          });
          return isvalidate;
        }
        validate.list.error = false;
        validate.list.help = '';
        this.setState({
            validate
        });
        return isvalidate;
    }
    handleEdit = () => {
        if(this.checkEditInfo()) {
            let { detail } = this.state;
            delete(detail.validate);
            detail.creator = localStorage.getItem('author');
            if (detail._id) {
                detail.update_time = +new Date();
                request.reqPOST('epsUpdateActive', {...detail}, (res) => {
                    if (!res.code) {
                        this.setState({
                            detailVisble: false
                        });
                        this.fetchData();
                        message.success('修改成功');
                    } else {
                        message.error(res.msg);
                    }
                })
            } else {
                detail.create_time = detail.update_time = +new Date();
                request.reqPOST('epsAddActive', {...detail}, (res) => {
                    if (!res.code) {
                        this.setState({
                            detailVisble: false
                        });
                        this.fetchData();
                        message.success('新增成功');
                    } else {
                        message.error(res.msg);
                    }
                })
            }
        }
    }
    editCancel = () => {
        this.setState({
            detailVisble: false
        });
    }
    deleteActive = (id) => {

    }
    iptChange = (e) => {
        let type = e.target.dataset.symbol;
        let { queryParams } = this.state;
        queryParams[type] = e.target.value;
        this.setState({
            queryParams
        });
    }
    detailIptChange = (e) => {
        let type = e.target.dataset.symbol;
        let { detail } = this.state;
        detail[type] = e.target.value;
        this.setState({
            detail
        });
    }
    detailDatePickerChange = (date, dataStr) => {
      let { detail } = this.state;
      detail.begin_time = dataStr[0];
      detail.end_time = dataStr[1];
      this.setState({
        detail
      })
    }
    isEditValidateChange = (e) => {
        let { detail } = this.state;
        detail.status = e.target.value;
        this.setState({
            detail
        });
    }
    datePickerChange = (date, dataStr) => {
      let { queryParams } = this.state;
      queryParams.begin_time = +new Date(dataStr[0]);
      queryParams.end_time = +new Date(dataStr[1]);
      this.fetchData(queryParams);
    }
    projectInfoChange = (e,idx,type) => {
      let { detail } = this.state;
      detail.list[idx][type] = e.target.value;
      this.setState({
        detail
      })
    }
    addProject = (isAdd, idx) => {
      let { detail } = this.state;
      if (isAdd) {
        detail.list.splice(idx+1,0,{title: '', times: ''});
      } else {
        detail.list.splice(idx,1);
      }
      this.setState({
        detail
      })
    }
    render() {
        let { dataList, total, queryParams, detailVisble, detail, validate } = this.state;
        return <div className="active-page">
            <div className="form-area">
                <Form>
                    <Row>
                        <Col span={6}>
                          <Form.Item label="活动时间" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
                            <RangePicker onChange={this.datePickerChange} />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item label="活动名称" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
                            <Input value={queryParams.title} placeholder="请输入名称" onChange={this.iptChange.bind(this)} data-symbol="title"/>
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item label="活动状态" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
                            <RadioGroup value={queryParams.validate} onChange={this.isValidateChange}>
                              <Radio value={'0'}>全部</Radio>
                              <Radio value={'1'}>进行中</Radio>
                              <Radio value={'2'}>已过期</Radio>
                            </RadioGroup>
                          </Form.Item>
                        </Col>
                        <Col span={3}>
                            <Form.Item>
                                <Button type="primary" ghost onClick={() => {this.fetchData()}}>查询</Button>
                            </Form.Item>
                        </Col>
                        <Col span={3}>
                            <Button type="primary" onClick={() => {this.editActive()}} style={{'float': 'right'}}>新增</Button>
                        </Col>
                    </Row>
                </Form>
            </div>
            <div className="active-wrap">
                <ul className="active-list clear-float">
                {dataList.map((i,idx) => {
                  return <li className="active-item" key={idx}> 
                    <span className="active-title">{i.title}</span>
                    <div className="active-info">
                      <p className="active-date">有效期：{i.begin_time} 至 {i.end_time}</p>
                    </div>
                    <div className="active-operation">
                    <Popconfirm placement="top" title="确定删除该活动？" cancelText="取消" okText="确定" onConfirm={() => {this.deleteActive(i._id)}}>
                      <Button type="danger" ghost style={{marginRight: '16px'}}>删除</Button>
                    </Popconfirm>
                      <Button type="primary" ghost onClick={() => {this.editActive(i)}}>管理</Button>
                    </div>
                  </li>
                })}
                </ul>
            </div>
            <div className="pagination-wrap">
            {total? <Pagination style={{ margin: "0 auto" }} total={total} onChange={this.pageChange} pageSize={queryParams.pageSize}></Pagination> : null}
            </div>
            <Modal
                title="活动详情"
                visible={detailVisble}
                onOk={this.handleEdit}
                onCancel={this.editCancel}
                okText="确定"
                cancelText="取消"
                maskClosable={false}
                width={600}
            >
            <Form>
                <Form.Item label="活动名称" required labelCol={{ span: 4 }} wrapperCol={{ span: 10 }} help={validate.title.help} validateStatus={validate.title.error? 'error' : ''}>
                    <Input value={detail.title} placeholder="请输入活动名称" onChange={this.detailIptChange} data-symbol="title"/>
                </Form.Item>
                <Form.Item label="活动时间" required labelCol={{ span: 4 }} wrapperCol={{ span: 10 }} help={validate.date.help} validateStatus={validate.date.error? 'error' : ''}>
                    {detail.begin_time ? <RangePicker value={[moment(detail.begin_time, dateFormat), moment(detail.end_time, dateFormat)]} onChange={this.detailDatePickerChange} /> : <RangePicker onChange={this.detailDatePickerChange} />}
                </Form.Item>
                <Form.Item label="包含项目" required labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} help={validate.list.help} validateStatus={validate.list.error? 'error' : ''}>
                  {detail.list.map((i, idx) => {
                    return <span key={i.idx}>
                      名称：<Input value={i.title} style={{width:'40%', marginLeft:'10px'}} onChange={(e) =>{this.projectInfoChange(e,idx, 'title')}}/>
                      <span style={{margin: '10px'}}>使用次数：</span>
                      <Input value={i.times} style={{width:'15%'}} onChange={(e) =>{this.projectInfoChange(e,idx, 'times')}}/>
                      <Icon onClick={() => {this.addProject(true, idx)}} type="plus-circle" style={{marginLeft: '10px', fontSize: '20px', color: '#fd0', cursor: 'pointer'}}/>
                      {idx == 0 && detail.list.length == 1 ? null : <Icon onClick={() => {this.addProject(false, idx)}} type="minus-circle" style={{marginLeft: '10px', fontSize: '20px', color: '#fd0', cursor: 'pointer'}}/>}
                      <br/></span>
                  })}
                </Form.Item>
                <Form.Item label="活动备注" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                    <TextArea value={detail.desc} rows={3} data-symbol="desc" onChange={this.detailIptChange}/>
                </Form.Item>
            </Form>
            </Modal>
        </div>
    }
}