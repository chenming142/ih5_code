//事件的属性
import React from 'react';
import $class from 'classnames'
import WidgetStore, {varType, funcType} from '../../stores/WidgetStore'
import WidgetActions from '../../actions/WidgetActions'
import { Menu, Dropdown } from 'antd';
import { Input, InputNumber, Select} from 'antd';
import { SwitchMore } from  '../PropertyView/PropertyViewComponet';
import { propertyMap, propertyType } from '../PropertyMap'

const MenuItem = Menu.Item;
const Option = Select.Option;

class Property extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            expanded: true,
            activeKey: this.props.activeKey,//当前激活的widgetkey
            wKey: this.props.wKey,      //specfic所在的widgetkey
            event: this.props.event,        //对应的事件
            specific: this.props.specific,  //specific
            objectList: null,    //目标对象的列表
            actionList: null,    //对象动作列表
            objectDropdownVisible: false, //是否显示对象的下拉框
            actionDropdownVisible: false, //是否显示动作的下拉框
            currentObject: this.props.specific.object,
            currentAction: this.props.specific.action,  //name&property
        };
        this.expandBtn = this.expandBtn.bind(this);
        this.onStatusChange = this.onStatusChange.bind(this);
        this.onSpecificDelete = this.onSpecificDelete.bind(this);
        this.onSpecificAdd = this.onSpecificAdd.bind(this);

        this.onObjectVisibleChange = this.onObjectVisibleChange.bind(this);
        this.onObjectSelect = this.onObjectSelect.bind(this);
        this.onActionVisibleChange = this.onActionVisibleChange.bind(this);
        this.onActionSelect = this.onActionSelect.bind(this);
        this.onGetActionList = this.onGetActionList.bind(this);
        this.onChangePropDom = this.onChangePropDom.bind(this);
        this.onPropertyContentSelect = this.onPropertyContentSelect.bind(this);

        this.arrList = []; //数组类型变量列表
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.activeKey){
            this.setState({
                activeKey: nextProps.activeKey,
                event: nextProps.event,
                wKey: nextProps.wKey,
                specific: nextProps.specific,

                currentObject: nextProps.specific.object,
                currentAction: nextProps.specific.action
            }, ()=>{
                //获取动作
                if(this.state.currentObject){
                    this.onGetActionList(this.state.currentObject);
                }
            });
        }
    }

    componentDidMount() {
        this.unsubscribe = WidgetStore.listen(this.onStatusChange);
        this.onStatusChange(WidgetStore.getAllWidgets());
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    onStatusChange(widget) {
        if(!widget) {
            return;
        }
        if(widget.allWidgets){
            this.setState({
                objectList: widget.allWidgets
            }, ()=>{
                this.arrList = [];
                this.state.objectList.forEach(v=>{
                    if(v.className === 'data') {
                        this.arrList.push(v);
                    }
                });
            });
        } else if (widget.updateFunction){
            if(widget.updateFunction.widget&&this.state.currentObject){
                if(widget.updateFunction.widget.key == this.state.currentObject.key){
                    this.onGetActionList(this.state.currentObject);
                }
            }
        } else if (widget.updateDBItem) {
            if(widget.updateDBItem.widget&&this.state.currentObject&&this.state.currentAction){
                if(this.state.currentObject.className === 'db' && this.state.currentAction.name){
                    this.forceUpdate();
                }
            }
        }
    }

    onGetActionList(obj){
        let actionList = [];
        let className = obj.className;

        //添加自定义func
        if(className !== 'var') {
            for(let i=0; i<obj.funcList.length; i++){
                let func = obj.funcList[i];
                let act = { func:func, type: funcType.customize};
                //params
                if(func.params){
                    let property = [];
                    func.params.forEach(p =>{
                        if(p.name&&p.type){
                            property.push({'name':p.name, 'showName':p.name, 'value':null, 'type':p.type.type});
                        }
                    });
                    if(property.length>0){
                        act['property']= property;
                    }
                }
                actionList.push(act);
            }
        }

        if(className === 'var'){
            switch (obj.type) {
                case varType.number:
                    className = 'intVar';
                    break;
                case varType.string:
                    className = 'strVar';
                    break;
                default:
                    break;
            }
        }
        propertyMap[className].map((item, index) => { 
            if (item.isFunc) {
                let temp = JSON.parse(JSON.stringify(item));
                if (temp.info) {
                    delete temp.info;
                }
                delete temp.isFunc;
                temp.type = funcType.default;
                actionList.push(temp);
            }
         });
        this.setState({
            actionList: actionList
        })
    }

    onSpecificAdd() {
        if(this.state.activeKey !== this.state.wKey) {
            return;
        }
        WidgetActions['addSpecific'](this.state.event);
    }

    onSpecificDelete() {
        if(this.state.activeKey !== this.state.wKey) {
            return;
        }
        WidgetActions['deleteSpecific'](this.state.specific.sid ,this.state.event);

    }

    expandBtn(expanded) {
        if(this.state.activeKey !== this.state.wKey) {
            return;
        }
        this.setState({
            expanded: expanded
        });
    }

    onObjectSelect(e){
        e.domEvent.stopPropagation();
        let object = e.item.props.object;
        if(this.state.currentObject && this.state.currentObject.key === object.key) {
            this.setState({
                objectDropdownVisible: false
            });
            return;
        }
        this.setState({
            currentObject: object,
            objectDropdownVisible: false
        }, ()=> {
           WidgetActions['changeSpecific'](this.state.specific, {'object':this.state.currentObject});
        });
    }

    onObjectVisibleChange(flag) {
        if(this.state.activeKey !== this.state.wKey) {
            return;
        }
        this.setState({
            objectDropdownVisible: flag
        });
    }

    onActionSelect(e){
        e.domEvent.stopPropagation();
        let action = e.item.props.action;
        if(this.state.currentAction&&action.type===this.state.currentAction.type) {
            switch (action.type){
                case funcType.customize:
                    if(action.func.key == this.state.currentAction.func.key){
                        this.setState({
                            actionDropdownVisible: false
                        });
                        return;
                    }
                    break;
                default:
                    if(action.name == this.state.currentAction.name){
                        this.setState({
                            actionDropdownVisible: false
                        });
                        return;
                    }
                    break;
            }
        }
        this.setState({
            currentAction: action,
            actionDropdownVisible: false
        }, ()=> {
            WidgetActions['changeSpecific'](this.state.specific, {action:this.state.currentAction});
        });
    }

    onActionVisibleChange(flag) {
        if(this.state.activeKey !== this.state.wKey) {
            return;
        }
        this.setState({
            actionDropdownVisible: flag
        });
    }

    onChangePropDom(prop, index, e){
        var value = null;
        switch (prop.type) {
            case propertyType.String:
                value = e.target.value;
                break;
            case propertyType.Integer:
            case propertyType.Float:
            case propertyType.Boolean2:
            case propertyType.Number:
                value = e;
                break;
            case propertyType.Function:
                break;
            default:
                break;
        }
        prop.value = value;
        let property = this.state.currentAction.property;
        property[index] = prop;
        let action = this.state.currentAction;
        action.property = property;
        this.setState({
            currentAction: action,
        }, ()=>{
            WidgetActions['changeSpecific'](this.state.specific, {property:this.state.currentAction.property});
        });
    }

    onPropertyContentSelect(prop, index, e) {
        e.domEvent.stopPropagation();
        let data = e.item.props.data;
        prop.value = data;
        let property = this.state.currentAction.property;
        property[index] = prop;
        let action = this.state.currentAction;
        action.property = property;
        this.setState({
            currentAction: action,
        }, ()=>{
            WidgetActions['changeSpecific'](this.state.specific, {property:this.state.currentAction.property});
        });
    }


    getProps(item, index) {
        var defaultProp = {
            size: 'small',
            onChange:  this.onChangePropDom.bind(this, item, index)
        };
        switch (item.type) {
            case propertyType.String:
            case propertyType.Integer:
            case propertyType.Float:
            case propertyType.Number:
                defaultProp.value = item.value;
                break;
            case propertyType.Boolean2:
                if(item.value==false){
                    defaultProp.checked = 2;
                }else if(item.value==true){
                    defaultProp.checked = 0;
                }else{
                    defaultProp.checked = 1;
                }
                break;
            case propertyType.Function:
            case propertyType.Select:
            default:
                break;
        }
        return defaultProp;
    }

    render() {
        let propertyId = 'spec-item-'+ this.state.specific.sid;
        let propertyContent = (v1,i1)=>{
            //设置通用默认参数和事件
            return  <div className="pp--list f--hlc" key={i1}>
                        <div className="pp--name">{ v1.showName }</div>
                        { type(v1.type, this.getProps(v1, i1), v1, i1)}
                    </div>
        };

        // let funcList = (v2, i2)=>{
        //     return <MenuItem data={v2} key={i2}>{v2.props.name}</MenuItem>;
        // };

        let dbList = (v3, i3)=>{
            return <MenuItem data={v3} key={i3}>{v3.props.name}</MenuItem>;
        };

        let type = (type, defaultProp, item, index)=>{
            switch (type) {
                case propertyType.String:
                    return <Input {...defaultProp}/>;
                    {/*return <input {...defaultProp} className="flex-1" type="text" placeholder={value}/>;*/}
                case propertyType.Integer:
                    return <InputNumber {...defaultProp}/>;
                    // return <input className="flex-1" type="text" placeholder={value}/>;
                case propertyType.Float:
                case propertyType.Number:
                    return <InputNumber step={0.1} {...defaultProp}/>;
                case propertyType.Boolean2:
                    return <SwitchMore   {...defaultProp}/>;
                case propertyType.Select:
                    if(this.state.currentObject.className === 'db'){
                        let menu = (<Menu></Menu>);
                        let titleTemp = '类别';
                        if(item.name ==='data') {
                            titleTemp = '来源';
                            menu = (<Menu onClick={this.onPropertyContentSelect.bind(this, item, index)}>
                                {
                                    !this.state.currentObject.dbItemList||this.state.currentObject.dbItemList.length==0
                                        ? null
                                        : this.state.currentObject.dbItemList.map(dbList)
                                }
                            </Menu>);
                        } else if (item.name ==='option'){
                            titleTemp = '选项';
                            menu = (<Menu onClick={this.onPropertyContentSelect.bind(this, item, index)}>
                                {
                                    !this.arrList||this.arrList.length==0
                                        ? null
                                        : this.arrList.map(dbList)
                                }
                            </Menu>);
                        }
                        return <Dropdown overlay={menu} trigger={['click']}
                                         getPopupContainer={() => document.getElementById(propertyId)}>
                            <div className={$class("p--dropDown short")}>
                                <div className="title f--hlc">
                                    { !item.value || !item.value.props.name
                                        ?titleTemp
                                        :item.value.props.name
                                    }
                                    <span className="icon" />
                                </div>
                            </div>
                        </Dropdown>;
                    } else {
                        return <div>未定义类型</div>;
                    }
                case propertyType.Function:
                    return <div>未定义类型</div>;
                default:
                    return <div>未定义类型</div>;
            }
        };


        let objectMenuItem = (v1,i)=>{
            return  <MenuItem key={i} object={v1}>{v1.props.name}</MenuItem>
        };

        let objectMenu = (
            <Menu onClick={this.onObjectSelect}>
                {
                    !this.state.objectList||this.state.objectList.length==0
                        ? null
                        : this.state.objectList.map(objectMenuItem)
                }
            </Menu>
        );

        let actionMenuItem = (v2, i)=>{
            switch (v2.type) {
                case funcType.customize:
                    return <MenuItem key={i} action={v2}>{v2.func.props.name}</MenuItem>;
                case funcType.default:
                    return <MenuItem key={i} action={v2}>{v2.showName}</MenuItem>;
            }
        };

        let actionMenu = (
            <Menu onClick={this.onActionSelect}>
                {
                    !this.state.actionList||this.state.actionList.length==0
                        ? null
                        : this.state.actionList.map(actionMenuItem)
                }
            </Menu>
        );

        return (
            <div className="Property f--h" id={propertyId}>
                <div className="P--left-line"></div>
                <div className="P--content flex-1 f--h">
                    <span className="p--close-line" onClick={this.onSpecificDelete}/>
                    <div className="p--main flex-1 f--h">
                        <div className="p--left">
                            <div className="p--left-div f--hlc">
                                <button className="p--icon"></button>
                                <Dropdown overlay={objectMenu} trigger={['click']}
                                          getPopupContainer={() => document.getElementById(propertyId)}
                                          onVisibleChange={this.onObjectVisibleChange}
                                          visible={this.state.objectDropdownVisible}>
                                    <div className={$class("p--dropDown short", {'active':this.state.objectDropdownVisible})}>
                                        <div className="title f--hlc">
                                            { !this.state.currentObject ||
                                              !this.state.currentObject.props.name
                                                ?'目标对象'
                                                :this.state.currentObject.props.name
                                            }
                                            <span className="icon" />
                                        </div>
                                    </div>
                                </Dropdown>
                            </div>

                            <div className="add-btn" onClick={this.onSpecificAdd}>
                                <div className="btn-layer">
                                    <span className="heng"/>
                                    <span className="shu"/>
                                </div>
                            </div>
                        </div>

                        <div className="p--right flex-1">
                            <div className="p--property">
                                <Dropdown overlay={actionMenu} trigger={['click']}
                                          getPopupContainer={() => document.getElementById(propertyId)}
                                          onVisibleChange={this.onActionVisibleChange}
                                          visible={this.state.actionDropdownVisible}>
                                    <div className={$class("p--dropDown long", {'active':this.state.actionDropdownVisible})}>
                                        <div className="title f--hlc">
                                            <span className="pp--icon" />
                                            {
                                                !this.state.currentAction
                                                    ? '目标动作'
                                                    : this.state.currentAction.type === funcType.customize
                                                        ? this.state.currentAction.func.props.name
                                                        : this.state.currentAction.showName
                                            }
                                            <span className="icon" />
                                        </div>
                                    </div>
                                </Dropdown>
                                {/*是否展开属性内容*/}
                                <div className={$class("pp-content f--h", {'hidden': !this.state.expanded} )}>
                                    {
                                        !this.state.currentAction ||
                                        !this.state.currentAction.property ||
                                         this.state.currentAction.property.length === 0
                                            ? null
                                            : <div className="pp--list-layer flex-1">
                                            {
                                                this.state.currentAction.property.map(propertyContent)
                                            }
                                        </div>
                                    }
                                </div>

                                <button className={$class("up-btn", {'expanded-props': this.state.expanded})}
                                        onClick={this.expandBtn.bind(this, false)}
                                        disabled={!this.state.currentAction||
                                        !this.state.currentAction.property ||
                                         this.state.currentAction.property.length==0}>
                                    <div className="btn-layer">
                                    </div>
                                </button>
                                <button className={$class("down-btn", {'expanded-props': (this.state.expanded)})}
                                        onClick={this.expandBtn.bind(this, true)}
                                        disabled={!this.state.currentAction||
                                        !this.state.currentAction.property ||
                                        this.state.currentAction.property.length==0}>
                                    <div className="btn-layer">
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = Property;


