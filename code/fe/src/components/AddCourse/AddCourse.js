import React from 'react'
import { Divider, Form,  Input, Button,Select,Icon} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

let uuid = 0;

/* Author: He Rongjun
 * Time: 2018/7/7
 * parameters: null
 * Intro: This component handle event when user want to add courses. validate values of input,
 * user can add several class time, but at least one class time.
 */
class AddCourse extends React.Component{
    constructor(props){
        super(props);
        this.state={
            studentNumberOk:null,
            frequencyOk:null,
            courseTitleOk:null,
        }
    }

    // set error when title is empty.
    checkCourseTitle=(e)=>{
        if (e.target.value === ''){
            this.setState({
                courseTitleOk:'error',
            })
        }
        else{
            this.setState({
                courseTitleOk:'success'
            })
        }
    };

    // set error when frequency is less than 0 or equal to 0 or bigger than 60 
    checkFrequency=(e)=>{
        if(e.target.value <= 0 || e.target.value > 60 || e.target.value === null){
            this.setState({
                frequencyOk:'error',
            })
        }
        else{
            this.setState({
                frequencyOk:'success',
            })
        }
    };

    // set error when student number is less than or equal to 0 
    checkStudentNumber=(e)=>{
        if (e.target.value <= 0 || e.target.value === null){
            this.setState({
                studentNumberOk:'error',
            })
        }
        else{
            this.setState({
                studentNumberOk:'success',
            })
        }
    };

    // remove class time
    remove = (k) => {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        if (keys.length === 1) {
          return;
        }
        form.setFieldsValue({
          keys: keys.filter(key => key !== k),
        });
    };

    // add class time
    add = () => {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(uuid);
        console.log(keys);
        uuid++;
        form.setFieldsValue({
          keys: nextKeys,
        });
    };

    // handle submit
    handleSubmit=(e)=>{
    };

    render(){
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 5 },
            },
        };
        const formItemLayoutWithOutLabel = {
            wrapperCol: {
                xs: { span: 24, offset: 0 },
                sm: { span: 5, offset: 4 },
            },
        };
        const { getFieldDecorator, getFieldValue } = this.props.form;
        getFieldDecorator('keys', { initialValue: [] });
        const keys = getFieldValue('keys');
        const formItems = keys.map((k, index) => {
            return (
                <div>
                <FormItem
                    {...formItemLayoutWithOutLabel}
                    required={false}
                    key={k}
                >   
                    {getFieldDecorator(`names[${k}]`, {
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [ { required: true, message: 'can not be empty', type: 'array' },],
                    })(
                        <Select mode="multiple" placeholder="Please select days">
                        <Option value="Monday">Monday</Option>
                        <Option value="Tuesday">Tuesday</Option>
                        <Option value="Wednesday">Wednesday</Option>
                        <Option value="Thursday">Thursday</Option>
                        <Option value="Friday">Friday</Option>
                        <Option value="Saturday">Saturday</Option>
                        <Option value="Sunday">Sunday</Option>
                        </Select>
                    )}

                    {getFieldDecorator(`names[${k}.${k}]`, {
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [{ required: true, message: 'can not be empty', type: 'array' },],
                    })(
                        <Select mode="multiple" placeholder="Please select hours">
                        <Option value="8:00-10:00">8:00-10:00</Option>
                        <Option value="10:00-12:00">10:00-12:00</Option>
                        <Option value="2:00-4:00">2:00-4:00</Option>
                        <Option value="4:00-6:00">4:00-6:00</Option>
                        </Select>
                    )}

                    {keys.length > 1 ? (
                    <Icon
                        className="dynamic-delete-button"
                        type="minus-circle-o"
                        disabled={keys.length === 1}
                        onClick={() => this.remove(k)}
                    />
                    ) : null}
                </FormItem>
                </div>
            );
        });
        return(
            <div>
                <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                    <Divider orientation="left">填写课程信息</Divider>
                    <FormItem {...formItemLayout}  hasFeedback validateStatus={this.state.courseTitleOk} help="请输入课程名称" label="课程名称">
                        <Input  type="text" onChange={this.checkCourseTitle}/>
                    </FormItem>
                    <FormItem {...formItemLayout}  hasFeedback validateStatus={this.state.studentNumberOk} help="请输入课程人数" label="课程人数">
                        <Input  type="text" onChange={this.checkStudentNumber}/>
                    </FormItem>
                    <FormItem {...formItemLayout}  hasFeedback validateStatus={this.state.frequencyOk} help="请输入拍照间隔(1~60)s" label="拍照间隔">
                        <Input  type="text" onChange={this.checkFrequency}/>
                    </FormItem>
                    {formItems}
                    <FormItem {...formItemLayout} label="每周上课时间"> 
                        <Button type="dashed" onClick={this.add} style={{ width: '100%' }}><Icon type="plus" />添加上课时间</Button>
                    </FormItem>
                    <Button type="primary" htmlType="submit">提交课程</Button>
                </Form>
            </div>
        );
    }
}
const WrappedAddCourse = Form.create()(AddCourse);

export default WrappedAddCourse;