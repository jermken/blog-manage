import React, { Component } from 'react';
import { Table, Form, Input, Pagination, Row, Col, Button, Select, DatePicker } from 'antd';
import moment from 'moment';
import request from '../../server/server';
import './index.scss';

const Option = Select.Option;
let that;
export default class MyArticle extends Component {

    constructor(props) {
        super(props)
        this.state = {
            columns: [],
            paginationConfig: {},
            queryParams: {

            }
        };
        that = this;
    }

    componentWillMount() {
        const columns = this.initColumns();
        const paginationConfig = this.initPagination();
        //this.fetchData(1,10);
        this.setState({
            columns: columns,
            paginationConfig: paginationConfig
        });
    }

    initPagination() {
        const paginationConfig = {
            current: 1,
            total: 15,
            pageSize: 6,
            onChange: (page, pageSize) => {
                that.fetchData(page, pageSize)
            },
            onShowSizeChange: (current, size) => {
                that.fetchData()
            }
        }
        return paginationConfig
    }

    fetchData(page, pageSize) {
        const queryParams = that.state.queryParams;
        const paginationConfig = that.state.paginationConfig;
        paginationConfig.current = queryParams.page = page;
        paginationConfig.pageSize = queryParams.pageSize = pageSize;
        request.reqGET('articlelist', {}, (res) => {
            console.log(res)
        });
        that.setState({
            queryParams: queryParams,
            paginationConfig: paginationConfig
        });
    }

    initColumns() {
        return [{
            title: '日期',
            dataIndex: 'date',
            render: (text, row, index) => {
                return <span>{text}</span>
            }
        }, {
            title: '标题',
            dataIndex: 'title',
            render: (text, row, index) => {
                return <span>{text}</span>
            }
        }, {
            title: '标签',
            dataIndex: 'label',
            render: (text, row, index) => {
                return <span>{text}</span>
            }
        }, {
            title: '作者',
            dataIndex: 'author',
            render: (text, row, index) => {
                return <span>{text}</span>
            }
        }, {
            title: '操作',
            render: (text, row, index) => {
                return <span><a href="javascript:;" onClick={()=>that.goToPageDetail(row.id)}>编辑</a><span className="gap-line"></span><a href="javascript:;" onClick={()=>that.deleteArticle(row)}>删除</a></span>
            }
        }]
    }

    goToPageDetail(id) {
        window.location.href = `/home/write?articleId=${id}`;
    }

    deleteArticle(item) {
        console.log(item)
    }

    render() {
        const data = [{
            date: '2011-01-01',
            title: 'js进阶1',
            label: 'javascript',
            author: 'jermken',
            id: 1
        }, {
            date: '2011-01-01',
            title: 'js进阶2',
            label: 'javascript',
            author: 'jermken',
            id: 2
        }, {
            date: '2011-01-01',
            title: 'js进阶3',
            label: 'javascript',
            author: 'jermken',
            id: 3
        }, {
            date: '2011-01-01',
            title: 'js进阶4',
            label: 'javascript',
            author: 'jermken',
            id: 4
        }, {
            date: '2011-01-01',
            title: 'js进阶5',
            label: 'javascript',
            author: 'jermken',
            id: 5
        }, {
            date: '2011-01-01',
            title: 'js进阶1',
            label: 'javascript',
            author: 'jermken',
            id: 6
        }, {
            date: '2011-01-01',
            title: 'js进阶4',
            label: 'javascript',
            author: 'jermken',
            id: 7
        }, {
            date: '2011-01-01',
            title: 'js进阶5',
            label: 'javascript',
            author: 'jermken',
            id: 8
        }];
        return <div className="myArticle-page">
            <Form className="page-from">
                <Row>
                    <Col span={6}>
                        <Form.Item label="日期" labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
                            <DatePicker></DatePicker>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item label="标签" labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
                            <Select>
                                <Option value="html">HTML</Option>
                                <Option value="node">NODE</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item label="标题" labelCol={{ span: 5 }} wrapperCol={{ span: 16 }}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item>
                            <Button type="primary" className="search-btn">查询</Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            <Table size="small" columns={that.state.columns} dataSource={data} loading={false} pagination={false}></Table>
            <div className="pagination-wrap"><Pagination style={{ margin: '0 auto' }} {...that.state.paginationConfig} /></div>
        </div>
    }
}