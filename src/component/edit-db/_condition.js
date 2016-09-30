//限制条件
import React from 'react';
import $class from 'classnames';
import $ from 'jquery';

import WidgetActions from '../../actions/WidgetActions';
import WidgetStore from '../../stores/WidgetStore';

class Condition extends React.Component {
    constructor (props) {
        super(props);
        this.state = {

        };
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {
        return (
            <div className='Condition'>
                {
                    this.props.isBig
                    ? <div className={$class('Condition-layer',{"action": this.props.isBig })}>
                        <div className="Condition-header f--hlc">限制条件</div>

                        <ul>
                            <li>
                                <label>开始时间：</label>
                                <input placeholder="例如：2016/06/06 00:00:00" />
                            </li>

                            <li>
                                <label>结束时间：</label>
                                <input placeholder="例如：2016/06/06 00:00:00" />
                            </li>

                            <li>
                                <label>每人提交间隔：</label>

                                <div className="input-content f--h">
                                    <div className="input-layer f--h">
                                        <input placeholder="无限制" className="flex-1" />

                                        <div className="btn-group">
                                            <span className="btn top-btn" />
                                            <span className="btn bottom-btn" />
                                        </div>
                                    </div>

                                    <span className="unit">小时</span>
                                </div>
                            </li>

                            <li>
                                <label>每人提交次数：</label>

                                <div className="input-content f--h">
                                    <div className="input-layer f--h">
                                        <input placeholder="无限制" className="flex-1" />

                                        <div className="btn-group">
                                            <span className="btn top-btn" />
                                            <span className="btn bottom-btn" />
                                        </div>
                                    </div>

                                    <span className="unit">次</span>
                                </div>
                            </li>

                            <li>
                                <label>每人每日提交数：</label>

                                <div className="input-content f--h">
                                    <div className="input-layer f--h">
                                        <input placeholder="无限制" className="flex-1" />

                                        <div className="btn-group">
                                            <span className="btn top-btn" />
                                            <span className="btn bottom-btn" />
                                        </div>
                                    </div>

                                    <span className="unit">次</span>
                                </div>
                            </li>

                            <li>
                                <label>提交总人数：</label>

                                <div className="input-content f--h">
                                    <div className="input-layer f--h">
                                        <input placeholder="无限制" className="flex-1" />

                                        <div className="btn-group">
                                            <span className="btn top-btn" />
                                            <span className="btn bottom-btn" />
                                        </div>
                                    </div>

                                    <span className="unit">人</span>
                                </div>
                            </li>

                            <li>
                                <label>每日提交总人数：</label>

                                <div className="input-content f--h">
                                    <div className="input-layer f--h">
                                        <input placeholder="无限制" className="flex-1" />

                                        <div className="btn-group">
                                            <span className="btn top-btn" />
                                            <span className="btn bottom-btn" />
                                        </div>
                                    </div>

                                    <span className="unit">人</span>
                                </div>
                            </li>
                        </ul>

                        <div className="putAway-btn f--hcc" onClick={ this.props.smallBtn }>
                            <span className="icon" />
                            收起页面
                        </div>
                    </div>
                    :   <div className={$class("expand-layer",{"action": !this.props.isBig })} onClick={ this.props.bigBtn }>
                            <div className="expand-btn">
                                <span className="icon" />
                                展开
                            </div>
                        </div>
                }
            </div>
        );
    }
}

module.exports = Condition;


