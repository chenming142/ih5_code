//事件的属性
import React from 'react';
import $class from 'classnames'
import WidgetStore from '../../stores/WidgetStore'
import WidgetActions from '../../actions/WidgetActions'

class Property extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            expanded: true,
            activeKey: this.props.activeKey,//当前激活的widgetkey
            event: this.props.event,        //对应的事件
            wid: this.props.activeKey,      //specfic所在的widgetkey
            specific: this.props.specific,  //specfic
            objectList: null    //目标对象的列表
        };
        this.expandBtn = this.expandBtn.bind(this);
        this.onStatusChange = this.onStatusChange.bind(this);
        this.onDeleteSpecific = this.onDeleteSpecific.bind(this);
        this.onAddSpecific = this.onAddSpecific.bind(this);
        this.onChangeSpecific = this.onChangeSpecific.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            activeKey: nextProps.activeKey,
            event: nextProps.event,
            wid: nextProps.activeKey,
            specific: nextProps.specific
        });
    }

    componentDidMount() {
        this.unsubscribe = WidgetStore.listen(this.onStatusChange);
        this.onStatusChange(WidgetStore.getStore());
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    onStatusChange(widget) {

    }

    onAddSpecific() {
        if(this.state.activeKey == this.state.wid) {
            WidgetActions['addSpecific'](this.state.event);
        }
    }

    onDeleteSpecific() {
        if(this.state.activeKey == this.state.wid) {
            WidgetActions['deleteSpecific'](this.state.specific.sid ,this.state.event);
        }
    }

    onChangeSpecific() {

    }

    expandBtn(expanded, event) {
        event.stopPropagation();
        this.setState({
            expanded: expanded
        });
    }

    render() {
        let content = (v1,i1)=>{
            return  <div className="pp--list f--hlc" key={i1}>
                        <div className="pp--name">{ v1.name }</div>
                        { type(v1.types, v1.value) }
                    </div>
        };

        let type = (num, data)=>{
            if(num == 0){
                return  <input className="flex-1" type="text" placeholder={data}/>
            }
            else if(num == 1){
                let btnp = null;
                let bg =  "none";
                if(data == -1){
                    btnp = 2;
                    bg = "#152322"
                }
                else if (data ==  0){
                    btnp = 33;
                    bg =  "none";
                }
                else {
                    btnp = 67;
                    bg = "#396764";
                }
                return  <div className="on-off-btn f--h">
                            <span className="btn-name left flex-1">ON</span>
                            <div className="btn-icon flex-1"><span style={{ background: bg}} /></div>
                            <span className="btn-name right flex-1">OFF</span>
                            <span className="btn" style={{ marginLeft : btnp + "px" }}/>
                        </div>
            }
            else {
                return  <div className="p--dropDown middle flex-1">
                            <div className="title f--hlc">
                                { data }
                                <span className="icon" />
                            </div>
                            <div className="dropDown"></div>
                        </div>
            }
        };

        return (
            <div className="Property f--h" id={'spec-item-'+ this.state.specific.sid}>
                <div className="P--left-line"></div>
                <div className="P--content flex-1 f--h">
                    <span className="p--close-line" onClick={this.onDeleteSpecific}/>
                    <div className="p--main flex-1 f--h">
                        <div className="p--left">
                            <div className="p--left-div f--hlc">
                                <button className="p--icon"></button>
                                <div className="p--dropDown short">
                                    <div className="title f--hlc">
                                        { this.state.specific.object===null
                                            ?'目标对象'
                                            :'TODO:这里需要修改'
                                        }
                                        <span className="icon" />
                                    </div>
                                    <div className="dropDown"></div>
                                </div>
                            </div>

                            <div className="add-btn" onClick={this.onAddSpecific}>
                                <div className="btn-layer">
                                    <span className="heng"/>
                                    <span className="shu"/>
                                </div>
                            </div>
                        </div>

                        <div className="p--right flex-1">
                            {
                                !this.state.specific.params || this.state.specific.params.length === 0
                                ? null
                                : this.state.specific.params.map((v,i)=>{
                                    return  <div className="p--property" key={i}>
                                        <div className="p--dropDown long">
                                            <div className="title f--hlc">
                                                <span className="pp--icon" />
                                                { v.action===null
                                                    ? '目标动作'
                                                    : 'TODO:这里需要修改'
                                                }
                                                <span className="icon" />
                                            </div>
                                            <div className="dropDown"></div>
                                        </div>
                                        {/*是否展开属性内容*/}
                                        <div className={$class("pp-content f--h", {'hidden': !this.state.expanded} )}>
                                            {
                                                !v.property || v.property.length === 0
                                                    ? null
                                                    : <div className="pp--list-layer flex-1">
                                                    {
                                                        v.property.map(content)
                                                    }
                                                </div>
                                            }
                                        </div>

                                        <button className={$class("up-btn", {'expanded-props': this.state.expanded})}
                                                onClick={this.expandBtn.bind(this, false)}
                                                disabled={v.property.length==0}>
                                            <div className="btn-layer">
                                            </div>
                                        </button>
                                        <button className={$class("down-btn", {'expanded-props': (this.state.expanded)})}
                                                onClick={this.expandBtn.bind(this, true)}
                                                disabled={v.property.length==0}>
                                            <div className="btn-layer">
                                            </div>
                                        </button>
                                    </div>
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = Property;


