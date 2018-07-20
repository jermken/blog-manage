import React, { Component } from "react";
import { Button, Popconfirm, Pagination, Form, Row, Col, Radio, Modal, Input, DatePicker, Upload, Icon, message  } from 'antd';
import request from "../../server/server";
import './index.scss';
import defaultAvatar from '../../asset/image/default_avatar.png';

const uploadButton = (
    <div>
        <Icon style={{fontSize:'30px',fontWeight: 'bold', color: '#1890ff'}} type="plus"/>
        <div className="ant-upload-text">请选择照片</div>
    </div>
)
const RadioGroup = Radio.Group;
const { TextArea } = Input;
export default class StockManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataList:[],
            queryParams: {
                title: '',
                code: '',
                page: 1,
                pageSize: 10
            },
            total: 0,
            pageSize: 10,
            detailVisble: false,
            detail:{},
            fileList: [],
            previewVisible: false,
            previewImage: '',
            validate:{
                title: {},
                code: {},
                warnNum: {},
                joinStock: {},
                price: {}
            }
        }
    }
    componentWillMount() {
        this.fetchData(this.state.queryParams);
    }
    fetchData(queryParams) {
        queryParams = queryParams || this.state.queryParams;
        request.reqGET('epsGoodsList', {...queryParams}, (res) => {
            if(!res.code) {
                let items = res.data[0];
                for(let i = 0, len = items.length; i < len; i++) {
                    items[i].fileList = JSON.parse(items[i].fileList);
                }
                this.setState({
                    dataList: items,
                    total: res.data[2],
                    queryParams
                });
            } else {
                message.error('服务器异常，请稍后重试');
            }
        });
    }
    deleteGoods = (id) => {
        request.reqPOST('epsDeleteGoods', {_id: id}, (res) => {
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
    isOffChange = (e) => {
        let { queryParams } = this.state;
        queryParams.status = e.target.value;
        this.fetchData(queryParams);
    }
    manageGoods = (i) => {
        let detail;
        if (i) {
            detail = i;
        } else {
            detail = {
                title: '',
                code: '',
                stock: 0,
                price: '',
                joinStock: '',
                warnNum: '',
                fileList: [],
                desc: ''
            } 
        }
        this.setState({
            detailVisble: true,
            detail,
            fileList: i ? i.fileList : []
        })
    }
    checkEditInfo = () => {
        let { detail, validate } = this.state;
        let isvalidate = true;
        if (detail.title === '') {
            validate.title.error = true;
            validate.title.help = '请填写产品名称';
            isvalidate = false;
        } else {
            validate.title.error = false;
            validate.title.help = '';
        }
        if (!/[0-9]\d*/.test(detail.code)) {
            validate.code.error = true;
            validate.code.help = '请填写产品编码';
            isvalidate = false;
        } else {
            validate.code.error = false;
            validate.code.help = '';
        }
        if (!/^[1-9]\d*(.\d{1,2})?$/.test(detail.price) && detail.price < 0) {
            validate.price.error = true;
            validate.price.help = '请填写产品价格';
            isvalidate = false;
        } else {
            validate.price.error = false;
            validate.price.help = '';
        }
        if (!/[1-9]\d*/.test(detail.warnNum) && detail.warnNum < 0) {
            validate.warnNum.error = true;
            validate.warnNum.help = '请填写库存警线';
            isvalidate = false;
        } else {
            validate.warnNum.error = false;
            validate.warnNum.help = '';
        }
        if (detail.joinStock && !/[1-9]\d*/.test(detail.joinStock) && detail.joinStock < 0) {
            validate.joinStock.error = true;
            validate.joinStock.help = '请填写入库数量';
            isvalidate = false;
        } else {
            validate.joinStock.error = false;
            validate.joinStock.help = '';
        }
        this.setState({
            validate
        });
        return isvalidate;
    }
    handleEdit = () => {
        if(this.checkEditInfo()) {
            let { detail } = this.state;
            detail.fileList = JSON.stringify(detail.fileList);
            if (detail._id) {
                detail.update_time = +new Date();
                detail.stock = detail.stock + Number(detail.joinStock);
                request.reqPOST('epsUpdateGoods', {...detail}, (res) => {
                    if (!res.code) {
                        this.setState({
                            detailVisble: false
                        });
                        this.fetchData();
                        message.success('修改成功');
                        if (Number(detail.joinStock)) {
                            request.reqPOST('epsAddStockLog', {title: detail.title,joinStock:{num:detail.joinStock,date: +new Date()}});
                        }
                    } else {
                        message.error('修改失败，请稍后重试');
                    }
                })
            } else {
                detail.create_time = detail.update_time = +new Date();
                detail.stock = detail.stock + Number(detail.joinStock);
                request.reqPOST('epsAddGoods', {...detail}, (res) => {
                    if (!res.code) {
                        this.setState({
                            detailVisble: false
                        });
                        this.fetchData();
                        if (Number(detail.joinStock)) {
                            request.reqPOST('epsAddStockLog', {title: detail.title,joinStock:{num:detail.joinStock,date: +new Date()}});
                        }
                        message.success('新增成功');
                    } else {
                        message.error('新增失败，请稍后重试');
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
        return <div className="stockInfo-page">
            <div className="form-area">
                <Form>
                    <Row>
                        <Col span={6}>
                            <Form.Item label="产品名称" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
                                <Input value={queryParams.title} placeholder="请输入名称" onChange={this.iptChange.bind(this)} data-symbol="title"/>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="产品编码" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
                                <Input value={queryParams.code} placeholder="请输入编码" onChange={this.iptChange.bind(this)} data-symbol="code"/>
                            </Form.Item>
                        </Col>
                        <Col span={2}>
                            <Form.Item>
                                <Button type="primary" ghost onClick={() => {this.fetchData()}}>查询</Button>
                            </Form.Item>
                        </Col>
                        <Col span={10}>
                            <Button type="primary" onClick={() => {this.manageGoods()}} style={{'float': 'right'}}>新增</Button>
                        </Col>
                    </Row>
                </Form>
            </div>
            <div className="goods-wrap">
                <ul className="goods-list  clear-float">
                    {
                        dataList.map((i,idx) => {
                            return <li className={`goods-item ${i.status == 2 ? 'offline' : ''}`} key={idx}>
                                <img className="goods-img" src={i.fileList.length? i.fileList[0].url : defaultAvatar}/>
                                <div className="goods-info">
                                    <div className="goods-desc">
                                        <div className="goods-name"><span className="goods-title">产品：</span>{i.title}</div>
                                        <div className="goods-stock"><span className="goods-title">库存：</span>{i.stock}</div>
                                        <div className="goods-code"><span className="goods-title">编码：</span>{i.code}</div>
                                    </div>
                                    <div className="goods-operation">
                                        <Popconfirm placement="top" title="确定删除这款产品？" cancelText="取消" okText="确定" onConfirm={() => {this.deleteGoods(i._id)}}>
                                            <Button className="goods-btn" type="danger" ghost>删除</Button>
                                        </Popconfirm>
                                        <Button className="goods-btn" type="primary" ghost onClick={() => {this.manageGoods(i)}}>历史</Button>
                                        <Button className="goods-btn" type="primary" ghost onClick={() => {this.manageGoods(i)}}>管理</Button>
                                    </div>
                                </div>
                            </li>
                        })
                    }
                </ul>
            </div>
            <div className="pagination-wrap" style={{marginTop: '-10px'}}>
            {total? <Pagination style={{ margin: "0 auto" }} total={total} onChange={this.pageChange} pageSize={pageSize}></Pagination> : null}
            </div>
            <Modal
                title="产品信息"
                visible={detailVisble}
                onOk={this.handleEdit}
                onCancel={this.editCancel}
                okText="确定"
                cancelText="取消"
                maskClosable={false}
            >
            <Form>
                <Form.Item label="产品" required labelCol={{ span: 4 }} wrapperCol={{ span: 10 }} help={validate.title.help} validateStatus={validate.title.error? 'error' : ''}>
                    <Input value={detail.title} placeholder="请输入产品名称" onChange={this.detailIptChange.bind(this)} data-symbol="title"/>
                </Form.Item>
                <Form.Item required label="产品编码" labelCol={{ span: 4 }} wrapperCol={{ span: 10 }} help={validate.code.help} validateStatus={validate.code.error? 'error' : ''}>
                    <Input value={detail.code} placeholder="请输入产品编码" data-symbol="code" onChange={this.detailIptChange}/>
                </Form.Item>
                <Form.Item required label="单价" labelCol={{ span: 4 }} wrapperCol={{ span: 10 }} help={validate.price.help} validateStatus={validate.price.error? 'error' : ''}>
                    <Input value={detail.price} placeholder="请输入价格" data-symbol="price" onChange={this.detailIptChange}/>
                </Form.Item>
                <Form.Item required label="库存警线" labelCol={{ span: 4 }} wrapperCol={{ span: 10 }} help={validate.warnNum.help} validateStatus={validate.warnNum.error? 'error' : ''}>
                    <Input value={detail.warnNum} placeholder="请输入库存警线" data-symbol="warnNum" onChange={this.detailIptChange}/>
                </Form.Item>
                <Form.Item required label="库存" labelCol={{ span: 4 }} wrapperCol={{ span: 10 }}>
                    <Input value={detail.stock} disabled/>
                </Form.Item>
                <Form.Item label="入库数量" labelCol={{ span: 4 }} wrapperCol={{ span: 10 }} help={validate.joinStock.help} validateStatus={validate.joinStock.error? 'error' : ''}>
                    <Input value={detail.joinStock || ''} placeholder="请输入入库数量" data-symbol="joinStock" onChange={this.detailIptChange}/>
                </Form.Item>
                <Form.Item label="上传照片" labelCol={{ span: 4 }} wrapperCol={{ span: 10 }}>
                    <Upload
                        action='/api/ybs_upload.json'
                        listType="picture-card"
                        fileList={fileList}
                        onPreview={this.handlePreview}
                        onChange={this.upLoadChange}
                        onRemove={this.removePhotos}
                        name="uploadPhotos"
                    >
                    {fileList.length > 0 ? null : uploadButton}
                    </Upload>
                </Form.Item>
                <Form.Item label="产品备注" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                    <TextArea rows={3} value={detail.desc} placeholder="请输入产品备注" data-symbol="desc" onChange={this.detailIptChange}/>
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