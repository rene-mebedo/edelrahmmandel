import React, { Component } from 'react'
import { Meteor } from 'meteor/meteor';
import { Breadcrumb, Typography } from 'antd';

const { Link } = Typography;

export class OpinionBreadcrumb extends Component {
    constructor(props) {
        super(props);
        
        const {refOpinion, refDetail} = props;

        //this.getBreadcrumbItems(refOpinion, refDetail);
    }

    state = {
        loading: true,
        items: []
    }

    getBreadcrumbItems(refOpinion, refDetail){
        Meteor.call('opinionDetail.getBreadcrumbItems', {refOpinion, refDetail}, (err, result) => {
            if (err) {
                console.log(err)
            } else {
                this.setState({
                    items: result,
                    loading: false
                });
            }
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { refOpinion, refDetail } = this.props;

        if (prevProps.refOpinion !== refOpinion || prevProps.refDetail !== refDetail) {
            this.getBreadcrumbItems(refOpinion, refDetail);
        }
    }

    render() {
        const { items } = this.state;

        return (
            <Breadcrumb>
                {items.map( ({ title, uri }, index) => {
                    return (
                        <Breadcrumb.Item key={index}>
                            <Link href={uri}>{title}</Link>
                        </Breadcrumb.Item>
                    );
                })}
            </Breadcrumb>
        );
    }
}