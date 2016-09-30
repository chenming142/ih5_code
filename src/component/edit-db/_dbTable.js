//数据库表格
import React from 'react';
import $class from 'classnames';
import $ from 'jquery';

import WidgetActions from '../../actions/WidgetActions';
import WidgetStore from '../../stores/WidgetStore';
import DbHeaderStores from '../../stores/DbHeader'

var PREFIX = 'app/';

class DbTable extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            dbList : [],
            dbHeader: [],
            inputNow : null,
            inputText : null,
            inputStyle : null,
            node: null,
            allDbHeader : [],
            isAddCul : false,
            addType : 0
        };
        this.scrollBtn = this.scrollBtn.bind(this);
        this.addColumn = this.addColumn.bind(this);
        this.inputClick = this.inputClick.bind(this);
        this.inputChange = this.inputChange.bind(this);
        this.inputBlur = this.inputBlur.bind(this);
        this.updateHeader = this.updateHeader.bind(this);
        this.getNewData = this.getNewData.bind(this);
        this.saveBtn = this.saveBtn.bind(this);
        this.createContent =  this.createContent.bind(this);
        this.getDbList = this.getDbList.bind(this);
        this.popShow = this.popShow.bind(this);
        this.popHide = this.popHide.bind(this);
        this.whichAddType = this.whichAddType.bind(this);
    }

    componentDidMount() {
        this.unsubscribe = WidgetStore.listen(this.onStatusChange.bind(this));
        this.onStatusChange(WidgetStore.getStore());
        DbHeaderStores.listen(this.DbHeaderData.bind(this));
        //57ee37ce7f8472077f7384f7
        //57ee37e67f84726aa75f0036
        //WidgetActions['ajaxSend'](null, 'POST', "http://play.vt.vxplo.cn/editor3/dbFind/57ee37ce7f8472077f7384f7", null, null, function(text) {
        //    let result = JSON.parse(text);
        //    console.log(result.d);
        //    if(result.d.length > 0){
        //        let dbHeader = [];
        //        for(let i in result.d[0]){
        //            if (i != "_id"){
        //                dbHeader.push(i);
        //            }
        //        }
        //        let newList = [];
        //        dbHeader.map((v,i)=>{
        //            newList[v] = ""
        //        });
        //        result.d.push(newList);
        //        //console.log(result.d);
        //        this.setState({
        //            dbHeader : dbHeader,
        //            dbList : result.d
        //        });
        //    }
        //}.bind(this));
        this.scrollBtn();
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    DbHeaderData(data){
        console.log(data);
        this.setState({
            allDbHeader : data
        })
    }

    onStatusChange(widget) {
        if(widget.selectWidget){
           if(widget.selectWidget.className == "db"){
               this.setState({
                   node : widget.selectWidget.node,
                   dbList : [],
                   dbHeader: [],
                   inputNow : null,
                   inputText : null,
                   inputStyle : null
               });
           }
        }
    }

    getNewData() {
        let self = this;
        let allDbHeader = this.state.allDbHeader;
        allDbHeader.map((v,i)=>{
            if(allDbHeader[i].id === this.state.node.dbid){
                let headerData = allDbHeader[i].header.split(",");
                //console.log(454,headerData,headerData.length);
                let index = headerData.indexOf("null");
                if(headerData.length !== 0 && index < 0){
                    let dbHeader = headerData;
                    this.state.node.find({}, function (err, data) {
                        //console.log(2,data);
                        if(data == undefined) return;

                        let list = [];
                        list = data;
                        //console.log(dbHeader,list);
                        self.setState({
                            dbHeader : dbHeader,
                            dbList : list
                        });

                        if(list.length === 0){
                            self.createContent();
                        }
                    });
                    this.scrollBtn();
                }
            }
        });
    }

    createContent(){
        let dbHeader = this.state.dbHeader;
        let newList = {};
        let list = [];
        newList['id'] = this.state.node.dbid;
        dbHeader.map((v,i)=>{
            newList[v] = "";
        });
        list.push(newList);
        this.state.node.insert(list[0]);
        this.getDbList();
    }

    getDbList(){
        this.state.node.find({}, function (err, data) {
            if(data == undefined) return;

            let list = [];
            list = data;
            self.setState({
                dbList : list
            });
        });
    }

    updateHeader(){
        let array = this.state.dbHeader;
        let header = array.join(',');
        let name = this.state.node.name;
        let id = this.state.node.dbid;
        let data = "id=" + id + "&name=" + encodeURIComponent(name) + "&header=" + encodeURIComponent(header);
        WidgetActions['ajaxSend'](null, 'POST', PREFIX + 'dbParm?' + data, null, null, function(text) {
            var result = JSON.parse(text);
            if (result['id']) {
                this.state.node['name'] = name;
                this.state.node['header'] = header;
            }
        }.bind(this));
    }

    saveBtn(){
        //this.updateHeader();
        //this.state.node.updata(this.state.dbList);
    }

    scrollBtn(){
        //let move = false;
        //let _x;
        //let self = this;
        //let left = 0;
        //let width = parseFloat($(".DT-content table").css('width'));
        //let widthShow = this.props.isBig ?
        //console.log(width);
        //
        //$(".DbTable .scroll span").mousedown(function(e){
        //    move=true;
        //    _x=e.pageX;
        //});
        //$(document).mousemove(function(e){
        //    if(move){
        //        let x =  e.pageX - _x;
        //    }
        //}).mouseup(function(){
        //    move=false;
        //});
    }


    addColumn(){
        let header = this.state.dbHeader;
        let value = null;
        let list = this.state.dbList;
        if(this.state.addType == 0){
            value = "T" + this.refs.inputType.value;
        }
        else {
            value = "I" + this.refs.inputType.value;
        }
        header.push(value);
        list.map((v,i)=>{
            list[i][value] = "";
        });
    }

    inputClick(key,value){
        if(key === this.state.inputNow) return;

        let width = parseFloat($(".t" + key).css('width'));
        let height = parseFloat($(".t" + key).css('height'));
        let style = {"width":width,"height":height};
        this.setState({
            inputStyle : style,
            inputText : value,
            inputNow : key
        },()=>{
            $(".i" + key).focus();
        })
    }

    inputChange(event){
        this.setState({
            inputText : event.target.value
        })
    }

    inputBlur(type,which,which2){
        let header = this.state.dbHeader;
        let list = this.state.dbList;
        if(type == 0) {
            let value = header[which];
            let text = this.state.inputText;
            let index = header.indexOf(text);
            if(index >=0 ){
                if(index !== which){
                    this.setState({
                        inputText : "重命名！！！"
                    })
                }
            }
            else {
                list.map((v,i)=>{
                    list[i][text] = list[i][value];
                    delete list[i][value];
                });
                //console.log(list);
                header[which] = this.state.inputText;
                //if(which == header.length-1){
                //    this.addColumn();
                //}
                this.setState({
                    dbHeader : header,
                    inputNow : null
                })
            }
        }
        else {
            let value = header[which2];
            let type = value.charAt(0);
            let text = "";
            text = this.state.inputText;
            if(type == "T" ){
                list[which][value] = text;
            }
            else if( type == "I" ){
                list[which][value] = parseFloat(text);
            }
            else {
                list[which][value] = text;
            }
            if(which == list.length-1 && text.length){
                let newList = [];
                header.map((v,i)=>{
                    newList[v] = ""
                });
                list.push(newList);
            }
            this.setState({
                dbHeader : header,
                dbList : list,
                inputNow : null
            })
        }
    }

    popHide(){
        this.setState({
            isAddCul: false
        })
    }

    popShow(){
        this.setState({
            isAddCul: true
        })
    }

    whichAddType(i){
        this.setState({
            addType:i
        })
    }

    render() {
        let width = this.props.isBig ? 769 : 928;

        return (
            <div className='DbTable'>
                <div className="DT-header f--h">
                    <p className="flex-1">列表</p>
                    <div className="btn-group">
                        <button className="btn btn-clear">导入</button>
                        <button className="btn btn-clear">导出</button>
                    </div>
                </div>

                <div className="DT-main">
                    <div className="DT-scroll">
                        <div className="DT-content" style={{ width : width }}>
                            <table>
                                <thead>
                                    <tr>
                                        <td className={ $class({"hidden": this.state.dbHeader.length == 0})}> </td>

                                        {
                                            this.state.dbHeader.length > 0
                                            ? this.state.dbHeader.map((v,i)=>{
                                                let id = "header" + i;
                                                return  <td key={i}
                                                            className={ 't'+id}
                                                            onClick={ this.inputClick.bind(this, id, v)}>
                                                            {v}

                                                            {
                                                                id === this.state.inputNow
                                                                ? <input value={ this.state.inputText }
                                                                         style={ this.state.inputStyle }
                                                                         className={ 'i'+id}
                                                                         onBlur={ this.inputBlur.bind(this,0,i) }
                                                                         onChange={ this.inputChange.bind(this) } />
                                                                : null
                                                            }
                                                        </td>;
                                              })
                                            : null
                                        }
                                    </tr>
                                </thead>

                                <tbody>
                                    {
                                        this.state.dbList.length > 0
                                            ? this.state.dbList.map((v,i)=>{
                                                    let index = String(i);
                                                    let data = [];
                                                    for(let i=0;i< index.length;i++){
                                                        data.push(index.charAt(i))
                                                    }
                                                    let id = "content" + i;
                                                    return  <tr key={i}>
                                                                <td>
                                                                    {
                                                                        data.length > 1
                                                                        ? data.map((v3,i3)=>{
                                                                            return <span className="shift" key={i3}>{ v3 }</span>
                                                                          })
                                                                        : data
                                                                    }
                                                                </td>
                                                                {
                                                                    this.state.dbHeader.map((v2,i2)=>{
                                                                        return  <td key={ i2 }
                                                                                    className={ 't'+id+"-"+i2}
                                                                                    onClick={ this.inputClick.bind(this, id+"-"+i2, v[v2])}>
                                                                                    { v[v2] }

                                                                                    {
                                                                                        id+"-"+i2 === this.state.inputNow
                                                                                            ? <input value={ this.state.inputText }
                                                                                                     style={ this.state.inputStyle }
                                                                                                     className={ 'i'+id+"-"+i2}
                                                                                                     onBlur={ this.inputBlur.bind(this,1,i,i2) }
                                                                                                     onChange={ this.inputChange.bind(this) } />
                                                                                            : null
                                                                                    }
                                                                                </td>
                                                                    })
                                                                }
                                                            </tr>
                                                })
                                            : null
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <p className={$class("no-tips f--hcc",{"hidden":  this.state.dbHeader.length === 0})}>请点击右上角添加按钮创建字段</p>

                    <div className="add-btn f--s" onClick={ this.popShow }>
                        <button className="btn btn-clear">
                            <span className="icon" />
                            添加
                        </button>

                        <div className="flex-1"></div>
                    </div>

                    <div className="scroll-div f--h">
                        <span className="icon"/>
                        <span className="scroll flex-1 f--hlc">
                            <span style={{ }} />
                        </span>
                    </div>
                </div>

                <div className="DT-footer f--h">
                    <div className="left flex-1 f--hlc ">
                        <div className="account">总数： 100</div>
                        <div className="page">共 10 页</div>
                        <button className="btn btn-clear last-btn">上一页</button>
                        <div className="now-page">当前页： 1</div>
                        <button className="btn btn-clear next-bnt">下一页</button>
                    </div>

                    <div className="right f--hlc">
                        <button className="btn btn-clear cancel-btn" onClick={ this.props.editDbHide }>取消</button>
                        <button className="btn btn-clear save-btn" onClick={ this.saveBtn }>保存</button>
                    </div>
                </div>

                <div className={ $class("Dt-pop f--hcc",{"hidden" : !this.state.isAddCul})}>
                    <div className="pop-layer"></div>

                    <div className="pop-main">
                        <div className="pop-header f--hlc">添加字段</div>
                        <div className="pop-content">
                            <div className="title">字段类型：</div>
                            <div className="btn-group f--h">
                                <div className={$class("btn f--hcc flex-1",{"active": 0 === this.state.addType})}
                                     onClick={ this.whichAddType.bind(this, 0)}>文本</div>
                                <div className={$class("btn f--hcc flex-1",{"active": 1 === this.state.addType})}
                                     onClick={ this.whichAddType.bind(this, 1)}>数值</div>
                            </div>
                            <div className="title">字段名称：</div>
                            <input placeholder="请输入名称" ref="inputType" />

                            <div className="pop-footer f--hcc">
                                <button className="btn btn-clear cancel-btn" onClick={ this.popHide }>取消</button>
                                <button className="btn btn-clear save-btn">确定</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = DbTable;



