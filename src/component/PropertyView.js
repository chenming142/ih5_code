/**
 * 属性面板
 */

import React from 'react';
import ReactDOM from 'react-dom';

import { Form, Input, InputNumber, Slider, Switch, Collapse,Select } from 'antd';
const Panel = Collapse.Panel;
import cls from 'classnames';

import WidgetStore from '../stores/WidgetStore';
import WidgetActions from '../actions/WidgetActions';

import {propertyType, propertyMap} from './PropertyMap';

require("jscolor/jscolor");


class PropertyView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {fields: null};
        this.selectNode = null;
        this.currentPage = null;
        this.defaultWidth=null;
        this.defaultData={
            width:null,
            height:null
        };
    }


//获取封装的form组件
     getInputBox(type, defaultProp) {
        switch (type) {
            case propertyType.Integer:
                return <InputNumber {...defaultProp} />;

            case propertyType.Float:
                return <InputNumber {...defaultProp} />;

            case propertyType.Number:
                return <InputNumber step={0.1} {...defaultProp} />;

            case propertyType.Percentage:
                return  <div>
                    <InputNumber step={0.01} max={1} min={0}  {...defaultProp}  className='slider-input' />
                    <Slider max={1} min={0} step={0.01} {...defaultProp}    className='slider-per' />
                </div>;

            case propertyType.Text:
                return <Input type="textarea" {...defaultProp} />;

            case propertyType.Color:

                return <div>
                    <Input ref={(input) => {
                if (input) {
                    var dom = ReactDOM.findDOMNode(input).firstChild;
                    if (!dom.jscolor) {
                        dom.jscolor = new window.jscolor(dom, {hash:true, required:false});
                        dom.jscolor.onFineChange = defaultProp.onChange;
                    }
                }
            }} {...defaultProp}   className='color-input' />
                    <Switch    defaultChecked={true}     className='visible-switch ant-switch-small' />
                </div>;

            case propertyType.Boolean:

                return <Switch   {...defaultProp} />;

            case propertyType.Select:
                return  <Select   {...defaultProp}   >
                    {defaultProp.options}
                </Select>;

            default:
                return <Input {...defaultProp} />;
        }
    }



    onChangeProp(prop, value) {
        let v;
        var bTag=true; //开关,控制执行

        if (value === undefined) {
            v = null;
        } else {
            switch (prop.type) {
                case propertyType.Percentage:
                    v = parseFloat(value);
                    if (v === prop.default)
                        v = null;
                    break;
                case propertyType.Number:
                    v = parseFloat(value);
                    break;

                case propertyType.Integer:
                    v = parseInt(value);
                    break;
                case propertyType.Float:


                    if('scaleX'== prop.name) {
                        v =parseFloat(value) /this.defaultData.width;
                    }else if('scaleY'== prop.name){
                        v = parseFloat(value)/this.defaultData.height;
                    }
                    console.log(this.defaultData.width);

                    break;
                case propertyType.Select:

                  if(prop.name == 'originPos'){
                      //数组
                      let arr=value.split(',');


                      const obj = {};
                      prop.name='originX';
                      obj[prop.name] = parseFloat(arr[0]);
                      this.onStatusChange({updateProperties: obj});
                      WidgetActions['updateProperties'](obj, false, true);//reflux模式,調用actions

                      prop.name='originY';
                      obj[prop.name] = parseFloat(arr[1]);
                      this.onStatusChange({updateProperties: obj});
                      WidgetActions['updateProperties'](obj, false, true);//reflux模式,調用actions

                      prop.name='originPos';
                       bTag=false;

                  }else{
                      v = parseInt(value);
                  }

                    break;
                case propertyType.Boolean:
                    v = (value === prop.default) ? null : value;
                    break;

                default:
                    v = value;
            }
        }

       if(bTag){
           const obj = {};
           obj[prop.name] = v;
           this.onStatusChange({updateProperties: obj});
           WidgetActions['updateProperties'](obj, false, true);//reflux模式,調用actions
       }
    }


    //为什么不写到onChangeProp中去?
    onChangePropDom(item, value) {
        this.onChangeProp(item, (value && value.target.value !== '') ? value.target.value : undefined);
    }


    getFields() {
        let node = this.selectNode;//当前舞台选中的对象

        if (!node)
            return null;

        let className = node.className;
        if (className.charAt(0) == '_')
            className = 'class';

        if (!propertyMap[className])
            return null;

        //暂未被使用
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };

        const groups = {};


        const getInput = (item, index) => {

            //设置默认值
            let defaultValue;

            if (item.readOnly ) {
                defaultValue = node.node[item.name];
            }else if(item.type==propertyType.Float) {
                let str = item.name == 'scaleX' ? 'width' : 'height'
                defaultValue = node.node[str];
                if (!this.defaultData[str]) { this.defaultData[str] = defaultValue;}//只执行一次
            } else {
                if (node.props[item.name] === undefined)
                    defaultValue = (item.type === propertyType.Boolean || item.type === propertyType.Percentage) ? item.default : '';
                else
                    defaultValue = node.props[item.name];
            }





            //设置通用默认参数和事件
            const defaultProp = {
                size: 'small',
                placeholder: item.default,
                disabled: item.readOnly !== undefined,
                onChange: (item.type === propertyType.String || item.type === propertyType.Text || item.type === propertyType.Color ) ? this.onChangePropDom.bind(this, item) : this.onChangeProp.bind(this, item)
            };

            //单独设置默认参数
            if (item.type === propertyType.Boolean) {
                defaultProp.checked = defaultValue;
            }else if(item.type ==propertyType.Select ){
                defaultProp.defaultValue= item.default;
                //拼接children元素
                defaultProp.options=[];
                for(var i in  item.options){
                    defaultProp.options.push(<Option key={item.options[i]}>{i}</Option>);
                }
            } else {
                defaultProp.value = defaultValue;
            }


            let groupName = item.group || 'basic';
            if (groups[groupName] === undefined)
                groups[groupName] = [];

            //设置布局结构和图标
            let hasTwin = ['x','y','w','h','rotationImgTag','originPosImgTag','shapeW','shapeH'].indexOf(item.showName) >= 0;//左右结构显示
            let hasPx=['x','y','w','h'].indexOf(item.showName)>=0; //判断input中是否添加px单位
            let hasDegree =['rotationImgTag'].indexOf(item.showName)>=0; //判断input中是否添加°单位
            let hasLock=item.showLock==true; //判断是否在元素前添加锁图标



           if(!item.showName){item.showName=item.name;}//当showName不存在时,用name作为showName


            //拼接图标样式
            let htmlStr;
            if(item.imgClassName){
                htmlStr=<label><div className={item.imgClassName}></div></label>
            }else{
                if(hasLock){
                    htmlStr=<label><div className='ant-lock'></div>{item.showName}</label>
                }else {
                    htmlStr =<label>{item.showName}</label>
                }
            }


            groups[groupName].push(
                <div key={item.name}
                    className={cls('f--hlc','ant-row','ant-form-item',{'ant-form-half': hasTwin}, {'ant-form-full': !hasTwin})}>

                    <div className='ant-col-l ant-form-item-label'>{htmlStr}</div>

                    <div className='ant-col-r'>
                        <div className= {cls('ant-form-item-control', {'ant-input-degree':hasDegree}, {'ant-input-px': hasPx})}>
                        {this.getInputBox(item.type, defaultProp, item.readOnly !== undefined)}

                        </div>
                    </div>
                </div>
            );
        };
        

        const result = [];

        propertyMap[className].forEach((item, index) => {
            if (item.isProperty)
                getInput(item, index);
        });

        return Object.keys(groups).map((name,index)=> 
                <Form horizontal key={index}>
                    {groups[name].map((input, i) => input)}
                </Form>);
    }

    onStatusChange(widget) {
        if (widget.selectWidget !== undefined){
            //加载后被调用,数据的更改激活change
            this.selectNode = widget.selectWidget;
            this.setState({fields: this.getFields()});
            let node = this.selectNode; //当前加载的对象

            while (node != null) {
                if (node.className == 'page') {
                    if (node != this.currentPage) {
                        this.currentPage = node;
                        node.parent.node['gotoPage'](node.node);
                    }
                    break;
                }
                node = node.parent; //node指向当前对象的父级对象
            }
        } else if (widget.updateProperties !== undefined && widget.skipProperty === undefined) {

            let needRender = (widget.skipRender === undefined);
            let selectNode = this.selectNode;
            let obj = widget.updateProperties;
            let className = selectNode.className;
            if (className.charAt(0) == '_')
                className = 'class';
             propertyMap[className].map(item => {
                if (item.isProperty && obj[item.name] !== undefined) {
                    if (obj[item.name] === null) {
                        delete(selectNode.props[item.name]);
                        if (needRender)
                            selectNode.node[item.name] = item.default;
                    } else {
                        selectNode.props[item.name] = obj[item.name];
                        if (needRender)
                            selectNode.node[item.name] = obj[item.name];

                    }
                }
            });
            if (needRender)
                WidgetActions['render']();
            this.setState({fields: this.getFields()});
        }
    }

    componentDidMount() {
        this.unsubscribe = WidgetStore.listen(this.onStatusChange.bind(this));
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        return (
            <div id='PropertyView'>
                <h1 id='PropertyViewHeader'>属性</h1>
                <div id='PropertyViewBody'>
                    {this.state.fields}
                </div>
            </div>
        );
    }
}

module.exports = PropertyView;
