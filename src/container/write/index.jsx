import React, { Component } from 'react';
import { Input, Button, Form, Row, Col, Modal } from 'antd';
import './index.scss';
import marked from 'marked';

const { TextArea } = Input;

export default class Write extends Component {

    constructor(props) {
        super(props)
        this.state = {
            textVal: '',
            title: '',
            label: '',
            author: '',
            id: ''
        }
    }

    onSubmit() {
        const title = this.refs.title.input.value,
            label = this.refs.label.input.value,
            author = this.refs.author.input.value;
        const textVal = this.state.textVal;
        if (!title || !label || !author || !textVal) {
            return Modal.error({
                title: '请将信息填写完整！',
                okText: '确定'
            });
        } else {
            Modal.success({
                title: '提交成功！',
                okText: '确定',
                onOk: () => {

                }
            })
        }
    }

    clearQuery() {
        this.refs.title.input.value = '';
        this.refs.label.input.value = '';
        this.refs.author.input.value = '';
    }

    inputChange(e) {
        this.setState({
            textVal: e.target.value
        });
    }

    render() {
        const that = this;
        let textVal = marked(that.state.textVal).replace(/<\/script/g, '<\\/script').replace(/<!--/g, '<\\!--');
        return <div className="write-page">
            <Form className="page-from">
                <Row>
                    <Col span={4}>
                        <Form.Item label="标题" labelCol={{ span: 4 }} wrapperCol={{ span: 16 }}>
                            <Input ref="title" />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item label="标签" labelCol={{ span: 4 }} wrapperCol={{ span: 16 }}>
                            <Input ref="label" />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item label="作者" labelCol={{ span: 4 }} wrapperCol={{ span: 16 }}>
                            <Input ref="author" />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item>
                            <Button onClick={that.clearQuery.bind(this)} className="clear-btn">清除</Button>
                            <Button onClick={that.onSubmit.bind(this)} type="primary">提交</Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            <div className="write-content">
                <TextArea onChange={that.inputChange.bind(this)} placeholder="请输入markdown格式文本" autosize={{ minRows: 24, maxRows: 24 }}></TextArea>
            </div>
            <div className="article-show" dangerouslySetInnerHTML={{ __html: textVal }}>

            </div>
        </div>
    }
}