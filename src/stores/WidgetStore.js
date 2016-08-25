import Reflux from 'reflux';
import WidgetActions from '../actions/WidgetActions';

var bridge = require('bridge');
bridge.create();

var rootDiv;
var rootElm;

var stageTree;
var classList;
let _keyCount = 1;

var copyObj = {};

function onSelect() {
  WidgetActions['selectWidget'](this);
}

const selectableClass = ['image', 'imagelist', 'text', 'video', 'rect', 'ellipse', 'path', 'slidetimer', 'bitmaptext'];

function loadTree(parent, node) {
  let current = {};

  current.parent = parent;
  current.key = _keyCount++;
  current.className = node['cls'];
  current.props = node['props'] || {};
  current.events = node['events'] || {};

  current.varList = [];
  if (node['vars']) {
    for (let n in node['vars']) {
      if (n.length >= 3 && n.substr(0, 2) == '__')
        current.varList.push({key:n.substr(2), value: node['vars'][n]});
    }
  }
  current.funcList = [];
  if (node['funcs']) {
    for (let n in node['funcs']) {
      if (n.length >= 3 && n.substr(0, 2) == '__')
        current.funcList.push({key:n.substr(2), value:node['funcs'][n]});
    }
  }

  if (node['id'])
    current.props['id'] = node['id'];

  var renderer = bridge.getRenderer((parent) ? parent.node : null, node);
  current.node = bridge.addWidget(renderer, (parent) ? parent.node : null, node['cls'], null, node['props'], (parent && parent.timerWidget) ? parent.timerWidget.node : null);
  current.timerWidget = (current.node.isTimer) ? current : ((parent && parent.timerWidget) ? parent.timerWidget : null);

  if (parent) {
    parent.children.push(current);
    current.rootWidget = parent.rootWidget;
    if (renderer != current.rootWidget.rendererList[0])
      current.rootWidget.rendererList.push(renderer);
  } else {
    current.rootWidget = current;
    current.imageList = node['links'] || [];
    current.rendererList = [renderer];
    bridge.setLinks(current.node, current.imageList);
    bridge.createSelector(current.node);
  }

  if (selectableClass.indexOf(current.className) >= 0) {
    bridge.addMouseDownHandler(current.node, onSelect.bind(current));
  }

  current.children = [];
  let children = node['children'];
  if (children) {
    for (let i = 0; i < children.length; i++) {
      loadTree(current, children[i]);
    }
  }

  return current;
}

function saveTree(data, node) {
  data['cls'] = node.className;
  let props = {};
  for (let name in node.props) {
    if (name === 'id')
      data['id'] = node.props['id'];
    else
      props[name] = node.props[name];
  }
  if (props)
    data['props'] = props;
  if (node.events)
    data['events'] = node.events;
  if (node.varList.length > 0) {
    let o = {};
    for (let i = 0; i < node.varList.length; i++) {
      o['__' + node.varList[i].key] = node.varList[i].value;
    }
    data['vars'] = o;
  }
  if (node.funcList.length > 0) {
    let o = {};
    for (let i = 0; i < node.funcList.length; i++) {
      o['__' + node.funcList[i].key] = node.funcList[i].value;
    }
    data['funcs'] = o;
  }
  if (node.children.length > 0) {
    data['children'] = [];
    node.children.map(item => {
      if (item.className == 'track' && item.props['prop'] && item.props['data'].length > 0) {
        data['props'] = data['props'] || {};
        for (var i = 0; i < item.props['prop'].length; i++) {
          data['props'][item.props['prop'][i]] = item.props['data'][0][i + 1];
        }
      }
      let child = {};
      data['children'].push(child);
      saveTree(child, item);
    });
  }
}

bridge.setGenerateText(function(widget, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'app/generateText');
  var form = new FormData();
  form.append('font', widget['font']);
  form.append('text', widget['text']);
  form.append('size', widget['size']);
  form.append('color', widget['color']);
  form.append('lineHeight', widget['lineHeight']);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function(e) {
    if (this.status == 200) {
      var uInt8Array = new Uint8Array(this.response);
      var i = uInt8Array.length;
      var binaryString = new Array(i);
      while (i--)
      {
        binaryString[i] = String.fromCharCode(uInt8Array[i]);
      }
      var data = binaryString.join('');
      WidgetActions['setImageText']('data:image/png;base64,' + btoa(data));
    }
  };
  xhr.send(form);
});

function dragenter(e) {
  e.stopPropagation();
  e.preventDefault();
}

function dragover(e) {
  e.stopPropagation();
  e.preventDefault();
}

function drop(e) {
  e.stopPropagation();
  e.preventDefault();

  var dt = e.dataTransfer;
  var files = dt.files;
  var i;
  var file;

  /*
  for (i = 0; i < files.length; i++) {
    file = files[i];
    if (file.type.match(/text\/html/)) {
      let reader = new FileReader();
      reader.onload = e => {
        let s =window.atob(e.target.result.substr(22));
        let re = /VXCORE\.load\((.*)\)\;\<\/script\>/;
        let result = re.exec(s);
        if (result[1]) {
          let o = JSON.parse(result[1]);
          if (o && o['stage']) {
            this.currentWidget = null;
            stageData = o['stage'];
            WidgetActions['initTree'](true);
          }
        }
      };
      reader.readAsDataURL(file);
      return;
    }
  }*/

  if (this.currentWidget && this.currentWidget.node['create']) {
    for (i = 0; i < files.length; i++) {
      file = files[i];
      if (file.type.match(/image.*/)) {
        let reader = new FileReader();
        reader.onload = e => {
          this.addWidget('image', null, e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  }
}

function chooseFileCallback(w) {
  if (w.files.length > 0) {
    var allowExt = null;
    if (w.userType == 'font') {
      allowExt = ['ttf', 'otf'];
    } else if (w.userType == 'image') {
      allowExt = ['png', 'jpg', 'jpeg', 'gif'];
    } else if (w.userType == 'imagelist') {
      allowExt = ['zip'];
    } else if (w.userType == 'zip') {
      allowExt = ['zip'];
    } else {
      return;
    }
    var name = w.files[0]['name'];
    var dot = name.lastIndexOf('.');
    if (dot <= 0)
      return;
    var ext = name.substr(dot + 1);
    if (!allowExt || allowExt.indexOf(ext) >= 0) {
      if (w.userUpload) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'app/uploadFile');
        var form = new FormData();
        form.append('type', w.userType);
        form.append('file', w.files[0]);
        xhr.send(form);
        xhr.onreadystatechange = function() {
          if (xhr.readyState == 4) {
              w.userCallback(w, xhr.responseText);
          }
        };
      } else {
        w.userCallback(w, ext);
      }
    }
  }
}

/*
function downloadFile(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
}
*/

export default Reflux.createStore({
    init: function () {
        this.listenTo(WidgetActions['selectWidget'], this.selectWidget);
        this.listenTo(WidgetActions['addWidget'], this.addWidget);
        this.listenTo(WidgetActions['reorderWidget'], this.reorderWidget);
        this.listenTo(WidgetActions['addClass'], this.addClass);
        this.listenTo(WidgetActions['removeWidget'], this.removeWidget);
        this.listenTo(WidgetActions['copyWidget'], this.copyWidget);
        this.listenTo(WidgetActions['pasteWidget'], this.pasteWidget);
        this.listenTo(WidgetActions['initTree'], this.initTree);
        this.listenTo(WidgetActions['render'], this.render);
        this.listenTo(WidgetActions['updateProperties'], this.updateProperties);
        this.listenTo(WidgetActions['resetTrack'], this.resetTrack);
        this.listenTo(WidgetActions['syncTrack'], this.syncTrack);
        this.listenTo(WidgetActions['deletePoint'], this.deletePoint);
        this.listenTo(WidgetActions['saveNode'], this.saveNode);
        this.listenTo(WidgetActions['chooseFile'], this.chooseFile);
        this.listenTo(WidgetActions['setFont'], this.setFont);
        this.listenTo(WidgetActions['setImageText'], this.setImageText);
    },
    selectWidget: function(widget) {
        var render = false;
        if (widget) {
          if (!this.currentWidget || this.currentWidget.rootWidget != widget.rootWidget) {
            render = true;
            var el = bridge.getDomElement(widget.rootWidget.node);
            if (el != rootElm) {
              if (rootElm)
                rootDiv.removeChild(rootElm);
              rootElm = el;
              rootDiv.appendChild(rootElm);
            }
          }
        }
        this.currentWidget = widget;
        this.trigger({selectWidget: widget});
        if (widget && selectableClass.indexOf(widget.className) >= 0) {
            bridge.selectWidget(widget.node, this.updateProperties.bind(this));
        } else {
            bridge.selectWidget(widget.node);
        }
        if (render)
          this.render();
    },
    addWidget: function(className, props, link) {
      if (!this.currentWidget)
          return;
      if (className === 'track') {
        if (!this.currentWidget.timerWidget ||
            (this.currentWidget.className !== 'image'
              && this.currentWidget.className !== 'rect'
              && this.currentWidget.className !== 'text'
              && this.currentWidget.className !== 'container'))
          return;
        let propList = ['positionX', 'positionY', 'scaleX', 'scaleY', 'rotation', 'alpha'];
        let dataList = [[0], [1]];
        for (let i = 0; i < propList.length; i++) {
          let d = this.currentWidget.node[propList[i]];
          dataList[0].push(d);
          dataList[1].push(d);
        }
        let track = loadTree(this.currentWidget, {'cls':className, 'props': {'prop': propList, 'data': dataList}});
        this.trigger({redrawTree: true, updateTrack: track});
      } else if (className === 'body' || className === 'easing' || className === 'effect' || this.currentWidget.node['create']) {
        let p;
        if (props || link) {
          p = {};
          if (props) {
            for (let n in props) {
              p[n] = props[n];
            }
          }
          if (link)
            p['link'] = this.currentWidget.rootWidget.imageList.push(link) - 1;
        }
        loadTree(this.currentWidget, {'cls':className, 'props': p});
        var cmd = {redrawTree: true};
        if (className == 'body')
          cmd.updateProperties = {'originX':0.5, 'originY':0.5};
        this.trigger(cmd);
        this.render();
      }
    },
    removeWidget: function() {
      if (this.currentWidget && this.currentWidget.parent) {
          bridge.removeWidget(this.currentWidget.node);
          let index = this.currentWidget.parent.children.indexOf(this.currentWidget);
          this.currentWidget.parent.children.splice(index, 1);
          this.currentWidget = null;
          this.trigger({selectWidget: null, redrawTree: true});
          this.render();
      }
    },
    copyWidget: function() {
      if (this.currentWidget && this.currentWidget.parent) {
        copyObj = {};
        saveTree(copyObj, this.currentWidget);
      }
    },
    pasteWidget: function() {
      if (this.currentWidget) {
        loadTree(this.currentWidget, copyObj);
        this.trigger({selectWidget: null, redrawTree: true});
        this.render();
      }
    },
    reorderWidget: function(delta) {
      if (this.currentWidget && this.currentWidget.parent) {
          let index = this.currentWidget.parent.children.indexOf(this.currentWidget);
          if (delta > 0 && index < this.currentWidget.parent.children.length - 1 || delta < 0 && index > 0) {
            this.currentWidget.parent.children.splice(index, 1);
            this.currentWidget.parent.children.splice(index + delta, 0, this.currentWidget);
            this.trigger({redrawTree: true});
          }
      }
    },
    updateProperties: function(obj, skipRender, skipProperty) {
      let p = {updateProperties: obj};
      if (skipRender) {
        p.skipRender = true;
        bridge.updateSelector(this.currentWidget.node);
      }
      if (skipProperty)
        p.skipProperty = true;
      this.trigger(p);
    },
    resetTrack: function() {
      this.trigger({resetTrack: true});
    },
    syncTrack: function() {
      this.trigger({syncTrack: true});
    },
    deletePoint: function() {
      this.trigger({deletePoint: true});
    },
    initTree: function(data) {
      classList = [];
      bridge.resetClass();
      stageTree = [];

      if (data['defs']) {
        for (let n in data['defs']) {
          bridge.addClass(n);
          classList.push(n);
          stageTree.push({name: n, tree: loadTree(null, data['defs'][n])});
        }
      }

      stageTree.unshift({name: 'stage', tree: loadTree(null, data['stage'])});
      bridge.createSelector(null);

      if (!rootDiv) {
        rootDiv = document.getElementById('canvas-dom');
        rootDiv.addEventListener('dragenter', dragenter, false);
        rootDiv.addEventListener('dragover', dragover, false);
        rootDiv.addEventListener('drop', drop.bind(this), false);
      }

      this.trigger({initTree: stageTree, classList: classList});
      this.selectWidget(stageTree[0].tree);
    },
    addClass: function(name) {
      stageTree.push({name: name, tree: loadTree(null, {'cls': 'root', 'type': bridge.getRendererType(this.currentWidget.node), 'props': {'width': 640, 'height': 480}})});
      classList.push(name);
      bridge.addClass(name);
      this.trigger({initTree: stageTree, classList: classList});
    },
    render: function() {
      if (this.currentWidget) {
        process.nextTick(() => bridge.render(this.currentWidget.rootWidget.node));
      }
    },
    saveNode: function(token, wid, wname, callback) {
      // let appendArray = function(a1, a2) {
      //     for (let i = 0; i < a2.length; i++) {
      //       a1.push(a2[i]);
      //     }
      // };
      let getImageList = function(array, list) {
        var result = [];
        var count = 0;
        for (let i = 0; i < list.length; i++) {
          var item = list[i];
          if (typeof item == 'string') {
            count++;
            array.push(item);
          } else {
            var n = item.length;
            if (count) {
              result.push(count);
              count = 0;
            }
            result.push(-n);
            for (var j = 0; j < n; j++) {
              array.push(item[j]);
            }
          }
        }
        if (result.length) {
          if (count)
            result.push(count);
          return result.join(',');
        } else {
          return count;
        }
      };
      let data = {};
      let images = [];
      data['stage'] = {};
      saveTree(data['stage'], stageTree[0].tree);
      data['stage']['type'] = bridge.getRendererType(stageTree[0].tree.node);
      // data['stage']['links'] = stageTree[0].tree.imageList.length;
      // appendArray(images, stageTree[0].tree.imageList);
      data['stage']['links'] = getImageList(images, stageTree[0].tree.imageList);

      if (stageTree.length > 1) {
        data['defs'] = {};
        for (let i = 1; i < stageTree.length; i++) {
          let name = stageTree[i].name;
          data['defs'][name] = {};
          saveTree(data['defs'][name], stageTree[i].tree);
          data['defs'][name]['type'] = bridge.getRendererType(stageTree[i].tree.node);
          // data['defs'][name]['links'] = stageTree[i].tree.imageList.length;
          // appendArray(images, stageTree[i].tree.imageList);
          data['defs'][name]['links'] = getImageList(images, stageTree[i].tree.imageList);
        }
      }

      data = bridge.encryptData(data, images);
      if (!data)
        return;

      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = () => {
          if (xhr.readyState == 4) {
            let result = JSON.parse(xhr.responseText);
            callback(result['id'], wname);
          }
      };
      if (wid) {
        xhr.open('PUT', 'app/work/' + wid);
      } else {
        xhr.open('POST', 'app/work?name=' + encodeURIComponent(wname));
      }
      if (token)
        xhr.setRequestHeader('Authorization', 'Bearer {' + token + '}');
      xhr.setRequestHeader('Content-Type', 'text/plain');
      xhr.send(data);
    },
    chooseFile: function(type, upload, callback) {
      var w = document.getElementById('upload-box');
      w.value = '';
      w.userType = type;
      w.userUpload = upload;
      w.userCallback = callback;
      w.sysCallback = chooseFileCallback;
      w.click();
    },
    setFont: function(font) {
      if (this.currentWidget && this.currentWidget.className == 'bitmaptext') {
        this.updateProperties({'font':font});
      }
    },
    setImageText:function(data) {
      if (this.currentWidget && this.currentWidget.className == 'bitmaptext') {
        var link = this.currentWidget.props['link'];
        if (link === undefined) {
          link = this.currentWidget.rootWidget.imageList.push(data) - 1;
        } else {
          this.currentWidget.rootWidget.imageList[link] = data;
        }
        this.currentWidget.props['link'] = this.currentWidget.node['link'] = link;
        process.nextTick(() => {
          bridge.updateSelector(this.currentWidget.node);
          this.render();
        });
      }
    }
});