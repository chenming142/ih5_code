import React from 'react';

import { Slider, Row, Col, Card, Button } from 'antd';
import WidgetStore from '../stores/WidgetStore';
import WidgetActions from '../actions/WidgetActions';

import VxSlider from './VxSlider';

class TimelineView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {timerNode: null, currentTime:0, currentTrack: null};
    }

    componentDidMount() {
        this.unsubscribe = WidgetStore.listen(this.onStatusChange.bind(this));
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    onStatusChange(widget) {
        if (widget.selectWidget !== undefined) {
            const changed = {currentTrack:null};
            let node = widget.selectWidget;
            if (node) {
                node.children.map(item => {
                    if (item.className === 'track') {
                        changed.currentTrack = item;
                    }
                });
            }
            if (node)
                node = node.timerWidget;
            if (node !== this.state.timerNode) {
                if (node) {
                    this.renderer = node.node.renderer;
                    node.node.addCallback(this);
                } else {
                    this.renderer = null;
                    if (this.state.timerNode)
                        this.state.timerNode.node.removeCallback(this);
                }
                changed.timerNode = node;
            }
            this.setState(changed);
        }
        if (widget.updateTrack !== undefined) {
            if (widget.updateTrack !== null && widget.updateTrack.timerWidget === this.state.timerNode) {
                this.setState({currentTrack: widget.updateTrack});
            } else {
                this.setState({currentTrack: null});
            }
        }
    }

    onTimer(p) {
        this.setState({currentTime:p});
        WidgetActions['syncTrack']();
    }

    onPlay() {
        WidgetActions['resetTrack']();
        this.state.timerNode.node['play']();
    }

    onPause() {
        this.state.timerNode.node['pause']();
    }

    onTimerChange(value) {
        WidgetActions['resetTrack']();
        this.state.timerNode.node['seek'](value * this.state.timerNode.node['totalTime']);
        WidgetActions['syncTrack']();
        this.setState({currentTime:value});
    }

    onAdd() {
        if (this.state.currentTrack) {
            let p = this.state.currentTime;
            let data = this.state.currentTrack.props['data'];
            let index = 0;
            while (index < data.length && p >= data[index][0]) {
                index++;
            }
            let d = [p];
            let prop = this.state.currentTrack.props['prop'];
            let parent = this.state.currentTrack.parent;
            for (let i = 0; i < prop.length; i++) {
                d.push(parent.node[prop[i]]);
            }
            data.splice(index, 0, d);
            this.state.currentTrack.node['data'] = data;
            this.forceUpdate();
        }
    }

    onDelete() {
        WidgetActions['deletePoint']();
    }

    render() {
        let tracks = [];
        let index = 0;

        const getTracks = (node) => {
            if (node.className === 'track') {
                tracks.push(<VxSlider key={index++} max={1} step={0.001} refTrack={node} refTimer={this.state.timerNode} points={node.props.data} isCurrent={node === this.state.currentTrack} />);
            }
            node.children.map(item => getTracks(item));
        };

        if (this.state.timerNode)
            getTracks(this.state.timerNode);

        return (this.state.timerNode) ?
                (<Card title="时间轴">
                        <Row>
                            <Col>
                                <Button onClick={this.onPlay.bind(this)}>播放</Button>
                                <Button onClick={this.onPause.bind(this)}>暂停</Button>
                                <Button onClick={this.onAdd.bind(this)}>添加</Button>
                                <Button onClick={this.onDelete.bind(this)}>删除</Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Slider max={1} step={0.001} value={this.state.currentTime} onChange={this.onTimerChange.bind(this)} />
                                {tracks}
                            </Col>
                        </Row>
                </Card>) : null;
    }
}


module.exports = TimelineView;