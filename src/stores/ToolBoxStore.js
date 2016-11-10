/**
 * 用于左侧工具栏的 store
 */

import Reflux from 'reflux';
import Actions from '../actions/ToolBoxAction';
import defaultTool from '../component/ToolBox/DEFAUL_TOOLBOX';
import {checkChildClass, checkNotInDomMode, checkNotInCanvasMode} from '../component/tempMap';

// 响应 点击二级（默认隐藏）工具菜单的事件
var selectSecondary = function(config, gid, cid) {
    // 是否有更新
    let hasUpdate = false;

    let data = config.data;
    let group = null;
    let groupIndex;
    for(let i =0; i < data.length; i++) {
       if(data[i].gid===gid) {
           group = data[i];
           groupIndex = i;
           break;
       }
    }

    if(group===null || !group.secondary instanceof Array) return;
    for(let j=0; j<group.secondary.length; j++) {
        if(group.secondary[j].cid===cid) {
            group.primary = j;
            hasUpdate = true;
            break;
        }
    }
    return hasUpdate;
};

// 是否有多于2个按钮
var hasSecondary = function(config, gid) {
    let data = config.data;
    let group = null;
    for(let i =0; i < data.length; i++) {
        if(data[i].gid===gid) {
            group = data[i];
            break;
        }
    }
    if(group===null) return false;
    if(group.secondary===null) return false;
    return (group.secondary.length>1);
};

var toolBoxItem = defaultTool;

var toolBoxConfig = {
    activeButtonId: null,
    openSecondaryId: null,
    data: toolBoxItem
};


export default Reflux.createStore({
    init: function() {
        this.listenTo(Actions['selectPrimary'], this.selectPrimary);
        this.listenTo(Actions['selectSecondary'], this.selectSecondary);
        this.listenTo(Actions['openSecondary'], this.openSecondary);
        this.listenTo(Actions['deselect'], this.deselect);
        this.listenTo(Actions['changeToolBoxItems'], this.changeToolBoxItems);
        this.listenTo(Actions['expandToolBox'], this.expandToolBox);
        this.expandedToolbox = false;
    },

    changeToolBoxItems: function(widget) {
        //change items here 用secondary的去比对；
        for (let i = 0; i < toolBoxItem.data.length; i++) {
            let allAreHidden = 0;
            for (let j = 0; j < toolBoxItem.data[i]['secondary'].length; j++) {
                if (checkChildClass(widget, toolBoxItem.data[i]['secondary'][j].className)) {
                    toolBoxItem.data[i]['secondary'][j]['disabled'] = false;
                } else {
                    toolBoxItem.data[i]['secondary'][j]['disabled'] = true;
                }
                if(checkNotInDomMode(widget, toolBoxItem.data[i]['secondary'][j].className)
                    ||checkNotInCanvasMode(widget, toolBoxItem.data[i]['secondary'][j].className)) {
                    allAreHidden++;
                    toolBoxItem.data[i]['secondary'][j]['hidden'] = true;
                } else {
                    toolBoxItem.data[i]['secondary'][j]['hidden'] = false;
                }

                if( toolBoxItem.data[i]['secondary'][j].className == 'module'){
                    toolBoxItem.data[i]['secondary'][j]['disabled'] = false;
                    toolBoxItem.data[i]['secondary'][j]['hidden'] = false;
                }
            }
            if (toolBoxItem.data[i]['secondary'].length>0 && allAreHidden === toolBoxItem.data[i]['secondary'].length) {
                toolBoxItem.data[i].hidden = true;
            } else {
                toolBoxItem.data[i].hidden = false;
            }
        }
        toolBoxConfig.data = toolBoxItem;
        this.trigger(toolBoxConfig, true);
    },

    expandToolBox: function (expanded) {
        this.expandedToolbox = expanded;
        this.trigger({expanded:{value:this.expandedToolbox}});
    },

    selectPrimary: function(buttonId, groupId, boxId) {
        //console.log('selectPrimary');
        this.clickPrimary(buttonId);
        this.openSecondary(groupId);
        this.trigger(toolBoxConfig);
    },

    selectSecondary: function(buttonId, groupId, boxId) {
        //console.log('selectSecondary');
        this.clickPrimary(buttonId);
        this.openSecondary(null);
        let hasUpdate = selectSecondary(toolBoxConfig.data, groupId, buttonId);
        this.trigger(toolBoxConfig, hasUpdate);

        // retrigger event, a patch to fix React state checking issues
        setTimeout(()=> {
            this.trigger(toolBoxConfig, hasUpdate);
        }, 100);
    },

    openSecondary: function(groupId, update) {
        if(groupId===toolBoxConfig.openSecondaryId) {
            return;
        }
        //没有第二层菜单时
        if(!hasSecondary(toolBoxConfig.data, groupId) && !update) {
            //右键点击只有一层的菜单时
            if (groupId !== null) {
                toolBoxConfig.activeButtonId = null;
            }
            toolBoxConfig.openSecondaryId = null;
        } else {
            //点击了当前组件有二层菜单后记录groupId
            toolBoxConfig.openSecondaryId = groupId;
        }
        if(arguments.length>=2 && update) {
            //console.log('trigger: openSecondary');
            //没有点击相关按钮
            this.deselect();
            this.trigger(toolBoxConfig);
        }

    },

    clickPrimary: function(buttonId) {
        //console.log('clickPrimary');
        toolBoxConfig.activeButtonId = buttonId;
    },

    deselect: function(){
        toolBoxConfig.activeButtonId = null;
        toolBoxConfig.openSecondaryId = null;
        toolBoxConfig.data = toolBoxItem;
        this.trigger(toolBoxConfig);
    }

});


var isActiveButton = function(cid) {
    return cid === toolBoxConfig.activeButtonId
};

export {isActiveButton};