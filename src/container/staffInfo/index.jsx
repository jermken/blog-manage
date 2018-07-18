import React, { Component } from "react";
import { Button, Popconfirm, Pagination, Form, Row, Col, Radio, Modal, Input, DatePicker, Upload, Icon  } from 'antd';
import moment from 'moment';
import './index.scss';

const uploadButton = (
    <div>
        <Icon style={{fontSize:'30px',fontWeight: 'bold', color: '#1890ff'}} type="plus"/>
        <div className="ant-upload-text">请选择照片</div>
    </div>
)
const RadioGroup = Radio.Group;
const dateFormat = 'YYYY-MM-DD';
export default class StaffInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataList:[1,2,3,4,5,6],
            queryParams: {
                name: '',
                status: 1,
                page: 1,
                pageSize: 6
            },
            total: 7,
            pageSize: 6,
            detailVisble: false,
            detail:{
                status: 1,
                name: '',
                address: '',
                concat: '',
                birthday: '2000-01-01',
                fileList: []
            },
            fileList: [],
            previewVisible: false,
            previewImage: '',
            validate:{
                name: {},
                address: {},
                concat: {},
                birthday: {}
            }
        }
    }
    componentWillMount() {
        this.fetchData();
    }
    fetchData() {
    
    }
    deleteStaff = () => {
        console.log('删除员工');
        this.fetchData();
    }
    pageChange = (page, pageSize) => {
        let { queryParams } = this.state;
        queryParams.page = page;
        queryParams.pageSize = pageSize;
        this.setState({
            queryParams
        });
        this.fetchData();
    }
    isOffChange = (e) => {
        let { queryParams } = this.state;
        queryParams.status = e.target.value;
        this.setState({
            queryParams
        });
        this.fetchData();
    }
    addStaff = () => {
        let detail = {
            status: 1,
            name: '',
            address: '',
            concat: '',
            birthday: '2000-01-01',
            fileList: []
        }
        this.setState({
            detailVisble: true,
            detail
        })
    }
    checkEditInfo = () => {
        let { detail, validate } = this.state;
        let isvalidate = true;
        if (detail.name === '') {
            validate.name.error = true;
            validate.name.help = '请填写姓名';
            isvalidate = false;
        } else {
            validate.name.error = false;
            validate.name.help = '';
        }
        if (!/(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/.test(detail.concat)) {
            validate.concat.error = true;
            validate.concat.help = '请填写联系方式';
            isvalidate = false;
        } else {
            validate.concat.error = false;
            validate.concat.help = '';
        }
        if (detail.address === '') {
            validate.address.error = true;
            validate.address.help = '请填写地址';
            isvalidate = false;
        } else {
            validate.address.error = false;
            validate.address.help = '';
        }
        if (detail.birthday === '') {
            validate.birthday.error = true;
            validate.birthday.help = '请选择生日';
            isvalidate = false;
        } else {
            validate.birthday.error = false;
            validate.birthday.help = '';
        }
        this.setState({
            validate
        });
        return isvalidate;
    }
    handleEdit = () => {
        if(this.checkEditInfo()) {
            this.setState({
                detailVisble: false
            });
        }
    }
    editCancel = () => {
        this.setState({
            detailVisble: false
        });
    }
    detailIptChange = (e) => {
        let type = e.target.dataset.symbol;
        let { detail } = this.state;
        detail[type] = e.target.value;
        this.setState({
            detail
        })
    }
    isEditOffChange = (e) => {
        let { detail } = this.state;
        detail.status = e.target.value;
        this.setState({
            detail
        });
    }
    datePickerChange = (date, dateStr) => {
        let { detail } = this.state;
        detail.birthday = dateStr;
        this.setState({
            detail
        });
    }
    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true
        })
    }
    removePhotos = (file) => {
        let { detail } = this.state;
        detail.fileList = [];
        this.setState({
            fileList: [],
            detail
        })
    }
    upLoadChange = ({fileList}) => {
        this.setState({
            fileList
        });
        if(fileList[0].status === 'done') {
            let { detail } = this.state;
            detail.fileList[0] = {
                uid: fileList[0].uid,
                status: 'done',
                name: fileList[0].name,
                url: fileList[0].response.data
            };
            this.setState({
                detail
            });
        }
    }
    handleCancel = () => {
        this.setState({
            previewImage: '',
            previewVisible: false
        })
    }
    render() {
        let { dataList, total, pageSize, queryParams, detailVisble, detail, fileList, previewVisible, previewImage, validate } = this.state;
        return <div className="staffInfo-page">
            <div className="form-area">
                <Form>
                    <Row>
                        <Col span={12}>
                            <Form.Item label="在职" labelCol={{ span: 2 }} wrapperCol={{ span: 18 }}>
                                <RadioGroup value={queryParams.status} onChange={this.isOffChange}>
                                    <Radio value={0}>全部</Radio>
                                    <Radio value={1}>是</Radio>
                                    <Radio value={2}>否</Radio>
                                </RadioGroup>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Button type="primary" onClick={this.addStaff} style={{'float': 'right'}}>新增</Button>
                        </Col>
                    </Row>
                </Form>
            </div>
            <div className="staff-wrap">
                <ul className="staff-list">
                    {
                        dataList.map((i,idx) => {
                            return <li className={`staff-item ${(idx+1)%2? '' : 'mrg-right-none'}`} key={idx}>
                                <img className="staff-avatar" src="http://downhdlogo.yy.com/hdlogo/6060/60/60/50/1346502044/u13465020444G8ndtm.jpg"/>
                                <span className="staff-info">
                                    <span className="staff-name"><span className="staff-title">姓名:</span>小宝</span>
                                    <span className="staff-concat"><span className="staff-title">联系方式:</span>13231242344</span>
                                </span>
                                <span className="staff-btn-wrap">
                                    <Popconfirm placement="top" title="确定删除此位员工？" cancelText="取消" okText="确定" onConfirm={this.deleteStaff}>
                                        <Button type="danger" ghost style={{'marginRight': '10px'}}>删除</Button>
                                    </Popconfirm>
                                    <Button type="primary" ghost>管理</Button>
                                </span>
                            </li>
                        })
                    }
                </ul>
            </div>
            <div className="pagination-wrap">
                <Pagination style={{ margin: "0 auto" }} total={total} onChange={this.pageChange} pageSize={pageSize}></Pagination>
            </div>
            <Modal
                title="员工信息"
                visible={detailVisble}
                onOk={this.handleEdit}
                onCancel={this.editCancel}
                okText="确定"
                cancelText="取消"
                maskClosable={false}
            >
            <Form>
                <Form.Item label="姓名" required labelCol={{ span: 4 }} wrapperCol={{ span: 10 }} help={validate.name.help} validateStatus={validate.name.error? 'error' : ''}>
                    <Input value={detail.name} placeholder="请输入姓名" onChange={this.detailIptChange} data-symbol="name"/>
                </Form.Item>
                <Form.Item required label="联系方式" labelCol={{ span: 4 }} wrapperCol={{ span: 10 }} help={validate.concat.help} validateStatus={validate.concat.error? 'error' : ''}>
                    <Input value={detail.concat} placeholder="请输入手机号" data-symbol="concat" onChange={this.detailIptChange}/>
                </Form.Item>
                <Form.Item required label="地址" labelCol={{ span: 4 }} wrapperCol={{ span: 10 }} help={validate.address.help} validateStatus={validate.address.error? 'error' : ''}>
                    <Input value={detail.address} placeholder="请输入地址" data-symbol="address" onChange={this.detailIptChange}/>
                </Form.Item>
                <Form.Item required label="生日" labelCol={{ span: 4 }} wrapperCol={{ span: 10 }} help={validate.birthday.help} validateStatus={validate.birthday.error? 'error' : ''}>
                    <DatePicker defaultValue={moment(detail.birthday, dateFormat)} onChange={this.datePickerChange} placeholder="请选择出生日期"/>
                </Form.Item>
                <Form.Item label="是否在职" labelCol={{ span: 4 }} wrapperCol={{ span: 10 }}>
                    <RadioGroup value={detail.status} onChange={this.isEditOffChange}>
                        <Radio value={1}>是</Radio>
                        <Radio value={2}>否</Radio>
                    </RadioGroup>
                </Form.Item>
                <Form.Item label="上传照片" labelCol={{ span: 4 }} wrapperCol={{ span: 10 }}>
                    <Upload
                        action='/api/ybs_upload.json'
                        listType="picture-card"
                        fileList={fileList}
                        onPreview={this.handlePreview}
                        onChange={this.upLoadChange}
                        onRemove={this.removePhotos}
                        name="staffPhotos"
                    >
                    {fileList.length > 0 ? null : uploadButton}
                    </Upload>
                </Form.Item>
            </Form>
            </Modal>
            <Modal
                visible={previewVisible}
                footer={null}
                onCancel={this.handleCancel}
            >
                <img alt="图片预览" style={{width:"100%"}} src={previewImage}/>
            </Modal>
        </div>
    }
}