import React, { Component } from "react";
import { Button, Popconfirm, Pagination, Form, Row, Col, Radio, Modal, Input, DatePicker, Upload, Icon  } from 'antd';
import './index.scss';

const uploadButton = (
    <div>
        <Icon style={{fontSize:'30px',fontWeight: 'bold', color: '#1890ff'}} type="plus"/>
        <div className="ant-upload-text">上传照片</div>
    </div>
)
const RadioGroup = Radio.Group;
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
                birthday: ''
            },
            fileList: [],
            previewVisible: false
        }
    }
    componentWillMount() {
        this.fetchData();
    }
    fetchData() {

    }
    deleteStaff() {
        console.log('删除员工');
        this.fetchData();
    }
    pageChange(page, pageSize) {
        console.log(this);
        console.log(page, pageSize);
    }
    isOffChange(e) {
        let { queryParams } = this.state;
        queryParams.status = e.target.value;
        this.setState({
            queryParams
        });
        this.fetchData();
    }
    addStaff() {
        this.setState({
            detailVisble: true
        })
    }
    handleEdit() {
        this.setState({
            detailVisble: false
        })
    }
    editCancel() {
        this.setState({
            detailVisble: false
        })
    }
    detailIptChange(e) {
        let type = e.target.dataset.symbol;
        let { detail } = this.state;
        detail[type] = e.target.value;
        this.setState({
            detail
        })
    }
    isEditOffChange(e) {
        let { detail } = this.state;
        detail.status = e.target.value;
        this.setState({
            detail
        });
    }
    datePickerChange(date, dateStr) {
        let { detail } = this.state;
        detail.birthday = dateStr;
        this.setState({
            detail
        });
    }
    handlePreview() {

    }
    upLoadChange() {

    }
    handleCancel() {

    }
    render() {
        let { dataList, total, pageSize, queryParams, detailVisble, detail, fileList, previewVisible } = this.state;
        return <div className="staffInfo-page">
            <div className="form-area">
                <Form>
                    <Row>
                        <Col span={12}>
                            <Form.Item label="在职" labelCol={{ span: 2 }} wrapperCol={{ span: 18 }}>
                                <RadioGroup value={queryParams.status} onChange={this.isOffChange.bind(this)}>
                                    <Radio value={0}>全部</Radio>
                                    <Radio value={1}>是</Radio>
                                    <Radio value={2}>否</Radio>
                                </RadioGroup>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Button type="primary" onClick={this.addStaff.bind(this)} style={{'float': 'right'}}>新增</Button>
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
                                    <Popconfirm placement="top" title="确定删除此位员工？" cancelText="取消" okText="确定" onConfirm={this.deleteStaff.bind(this)}>
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
                <Pagination style={{ margin: "0 auto" }} total={total} onChange={this.pageChange.bind(this)} pageSize={pageSize}></Pagination>
            </div>
            <Modal
                title="员工信息"
                visible={detailVisble}
                onOk={this.handleEdit.bind(this)}
                onCancel={this.editCancel.bind(this)}
                okText="确定"
                cancelText="取消"
                maskClosable={false}
            >
            <Form>
                <Form.Item label="姓名" labelCol={{ span: 4 }} wrapperCol={{ span: 10 }}>
                    <Input value={detail.name} placeholder="请输入姓名" onChange={this.detailIptChange.bind(this)} data-symbol="name"/>
                </Form.Item>
                <Form.Item value={detail.concat} label="联系方式" labelCol={{ span: 4 }} wrapperCol={{ span: 10 }}>
                    <Input placeholder="请输入手机号" data-symbol="concat" onChange={this.detailIptChange.bind(this)}/>
                </Form.Item>
                <Form.Item value={detail.address} label="地址" labelCol={{ span: 4 }} wrapperCol={{ span: 10 }}>
                    <Input placeholder="请输入地址" data-symbol="address" onChange={this.detailIptChange.bind(this)}/>
                </Form.Item>
                <Form.Item value={detail.address} label="地址" labelCol={{ span: 4 }} wrapperCol={{ span: 10 }}>
                    <DatePicker value={detail.birthday} onChange={this.datePickerChange.bind(this)} placeholder="请选择出生日期"/>
                </Form.Item>
                <Form.Item label="是否在职" labelCol={{ span: 4 }} wrapperCol={{ span: 10 }}>
                    <RadioGroup value={detail.status} onChange={this.isEditOffChange.bind(this)}>
                        <Radio value={1}>是</Radio>
                        <Radio value={2}>否</Radio>
                    </RadioGroup>
                </Form.Item>
                <Form.Item>
                    <Upload
                        action="//jsonplaceholder.typicode.com/posts/"
                        listType="picture-card"
                        fileList={fileList}
                        onPreview={this.handlePreview.bind(this)}
                        onChange={this.upLoadChange.bind(this)}
                    >
                    {fileList.length > 0 ? null : uploadButton}
                    </Upload>
                </Form.Item>
            </Form>
            </Modal>
            <Modal
                visible={previewVisible}
                footer={null}
                onCancel={this.handleCancel.bind(this)}
            >
                <img alt="图片预览" style={{width:"100%"}}/>
            </Modal>
        </div>
    }
}