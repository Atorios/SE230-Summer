import React from 'react';
import {Layout, Icon} from 'antd';
import Sidebar from '../components/Parts/Sidebar';
import WrappedAddCourse from "../components/AddCourse/AddCourse";
import Avatar from "../components/Parts/Avatar";
const {Header, Content, Sider}=Layout;

class AddCoursePage extends React.Component {
    handleClick = (e) => {
        console.log('click ', e);
    };

    render() {
        return(
            <Layout>
                <Header className={"header"} style={{background:'#aaa'}}>
                    <Avatar/>
                </Header>
                <Layout>
                    <Sider width={256} style={{background: '#fff'}}>
                        <Sidebar />
                    </Sider>
                    <Layout>
                        <Content>
                            <WrappedAddCourse />
                            <div className="fill"/>
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        )
    }
}

export default AddCoursePage;