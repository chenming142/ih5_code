const propertyType = {
    Integer: 0,
    Number: 1,
    String: 2,
    Text: 3,
    Boolean: 4,
    Percentage: 5,
    Color: 6,
    Select:7,
    Float:8,
    Color2:9,
    Boolean2:10,
    Function:11,
    FormulaInput:12,
    Dropdown:13,
    TbSelect : 14,
    TbColor : 15,
    TbFont : 16,
    TdLayout : 17,
    DBCons: 18,
    DBOrder: 19,
    Range: 20,
    Object:21,
    Hidden: -1,
    Boolean3:22,
    ObjectSelect:23,
};

const backwardTransOptions = {
    '同上一页':-1,
    '无':0,
    '向左滑走（平移）':1,
    '向右滑走（平移）':2,
    '向上滑走（平移）':3,
    '向下滑走（平移）':4,

    '向左滑走（平移渐变）':9,
    '向右滑走（平移渐变）':10,
    '向上滑走（平移渐变）':11,
    '向下滑走（平移渐变）':12,

    '向左滑走（覆盖视差）':13,
    '向右滑走（覆盖视差）':14,
    '向上滑走（覆盖视差）':15,
    '向下滑走（覆盖视差）':16,

    '缩小向左':17,
    '缩小向右':18,
    '缩小向上':19,
    '缩小向下':20,


    '缩小向后':21,
    '放大向前':22,
    '向左滑走+放大出现':23,
    '向右滑走+放大出现':24,
    '向上滑走+放大出现':25,
    '向下滑走+放大出现':26,
    '缩小离开+放大出现':27,

    '向右翻转':29,
    '向上翻转':30,
    '掉落':36,
    '向下翻书':41,

    '向左翻书（连续）':42,
    '向右翻书（连续）':43,

    '自左旋转出现':50,
    '自右旋转出现':51,
    '自上旋转出现':52,
    '自下旋转出现':53,
    '向左旋转离开（渐变）':54,
    '向右旋转离开（渐变）':55,
    '向上旋转离开（渐变）':56,
    '向下旋转离开（渐变）':57,
    '向左方块旋转':58,
    '向右方块旋转':59,
    '向上方块旋转':60,
    '向下方块旋转':61,
    '弧线向左':62,
    '弧线向右':63,
    '弧线向上':64,
    '弧线向下':65,
    '交替翻页':66,
    '碰撞翻页':67
};

const forwardTransOptions = {
    '同上一页':-1,
    '无':0,
    '向左滑走（平移）':1,
    '向右滑走（平移）':2,
    '向上滑走（平移）':3,
    '向下滑走（平移）':4,

    '向左滑走（平移渐变）':9,
    '向右滑走（平移渐变）':10,
    '向上滑走（平移渐变）':11,
    '向下滑走（平移渐变）':12,

    '向左滑走（覆盖视差）':13,
    '向右滑走（覆盖视差）':14,
    '向上滑走（覆盖视差）':15,
    '向下滑走（覆盖视差）':16,

    '缩小向左':17,
    '缩小向右':18,
    '缩小向上':19,
    '缩小向下':20,

    '缩小向后':21,
    '放大向前':22,
    '向左滑走+放大出现':23,
    '向右滑走+放大出现':24,
    '向上滑走+放大出现':25,
    '向下滑走+放大出现':26,
    '缩小离开+放大出现':27,

    '向右翻转':29,
    '向上翻转':30,
    '掉落':36,
    '向下翻书':41,

    '向左翻书（连续）':42,
    '向右翻书（连续）':43,

    '自左旋转出现':50,
    '自右旋转出现':51,
    '自上旋转出现':52,
    '自下旋转出现':53,
    '向左旋转离开（渐变）':54,
    '向右旋转离开（渐变）':55,
    '向上旋转离开（渐变）':56,
    '向下旋转离开（渐变）':57,
    '向左方块旋转':58,
    '向右方块旋转':59,
    '向上方块旋转':60,
    '向下方块旋转':61,
    '弧线向左':62,
    '弧线向右':63,
    '弧线向上':64,
    '弧线向下':65,
    '交替翻页':66,
    '碰撞翻页':67
};

const easingMoveOptions = {
    '线性':'linear',
    '曲线':'swing',
    '二次进':'easeInQuad',
    '二次出':'easeOutQuad',
    '二次进出':'easeInOutQuad',
    '五次进':'easeInQuint',
    '五次出':'easeOutQuint',
    '五次进出':'easeInOutQuint',
    '圆周进':'easeInCirc',
    '圆周出':'easeOutCirc',
    '圆周进出':'easeInOutCirc',
    '弹性进':'easeInElastic',
    '弹性出':'easeOutElastic',
    '弹性进出':'easeInOutElastic',
    '后退进':'easeInBack',
    '后退出':'easeOutBack',
    '后退进出':'easeInOutBack',
    '反弹进':'easeInBounce',
    '反弹出':'easeOutBounce',
    '反弹进出':'easeInOutBounce'
};

const effectOptionsToJudge = {
    '弹性进入':'bounceIn',
    '弹性进入（从上）':'bounceInDown',
    '弹性进入（从左）':'bounceInLeft',
    '弹性进入（从右）':'bounceInRight',
    '弹性进入（从下）':'bounceInUp',
    '淡入':'fadeIn',
    '自上淡入':'fadeInDown',
    ' 自上淡入（长距离）':'fadeInDownBig',
    '自左淡入':'fadeInLeft',
    '自左淡入（长距离）':'fadeInLeftBig',
    '自右淡入':'fadeInRight',
    '自右淡入（长距离）':'fadeInRightBig',
    '自下淡入':'fadeInUp',
    '自下淡入（长距离）':'fadeInUpBig',
    '翻转进入（上下）':'flipInX',
    '翻转进入（左右）':'flipInY',
    '光速进入':'lightSpeedIn',
    '滚动进入':'rollIn',
    '旋转进入':'rotateIn',
    '旋转进入（自左上）':'rotateInDownLeft',
    '旋转进入（自右上）':'rotateInDownRight',
    '旋转进入（自左下）':'rotateInUpLeft',
    '旋转进入（自右下）':'rotateInUpRight',
    '放大出现':'zoomIn',
    ' 放大出现（自上）':'zoomInDown',
    '放大出现（自左）':'zoomInLeft',
    '放大出现（自右）':'zoomInRight',
    '放大出现（自下）':'zoomInUp',
    '飞入（自上）':'slideInDown',
    '飞入（自左）':'slideInLeft',
    '飞入（自右）':'slideInRight',
    '飞入（自下）':'slideInUp'
};

const effectOption = {
    '弹性进入':'bounceIn',
    '弹性进入（从上）':'bounceInDown',
    '弹性进入（从左）':'bounceInLeft',
    '弹性进入（从右）':'bounceInRight',
    '弹性进入（从下）':'bounceInUp',
    '淡入':'fadeIn',
    '自上淡入':'fadeInDown',
    ' 自上淡入（长距离）':'fadeInDownBig',
    '自左淡入':'fadeInLeft',
    '自左淡入（长距离）':'fadeInLeftBig',
    '自右淡入':'fadeInRight',
    '自右淡入（长距离）':'fadeInRightBig',
    '自下淡入':'fadeInUp',
    '自下淡入（长距离）':'fadeInUpBig',
    '翻转进入（上下）':'flipInX',
    '翻转进入（左右）':'flipInY',
    '光速进入':'lightSpeedIn',
    '滚动进入':'rollIn',
    '旋转进入':'rotateIn',
    '旋转进入（自左上）':'rotateInDownLeft',
    '旋转进入（自右上）':'rotateInDownRight',
    '旋转进入（自左下）':'rotateInUpLeft',
    '旋转进入（自右下）':'rotateInUpRight',
    '放大出现':'zoomIn',
    ' 放大出现（自上）':'zoomInDown',
    '放大出现（自左）':'zoomInLeft',
    '放大出现（自右）':'zoomInRight',
    '放大出现（自下）':'zoomInUp',
    '飞入（自上）':'slideInDown',
    '飞入（自左）':'slideInLeft',
    '飞入（自右）':'slideInRight',
    '飞入（自下）':'slideInUp',

    '弹跳':'bounce',
    '闪烁':'flash',
    '心跳':'pulse',
    '弹弹球':'rubberBand',
    '左右晃动（大幅）':'shake',
    '左右晃动（小幅）':'headShake',
    '摇动':'swing',
    '旋转晃动':'tada',
    '抖动':'wobble',
    '扭动':'jello',

    '弹性离开':'bounceOut',
    '弹性离开（向下）':'bounceOutDown',
    '弹性离开（向左）':'bounceOutLeft',
    '弹性离开（向右）':'bounceOutRight',
    '弹性离开（向上）':'bounceOutUp',
    '淡出':'fadeOut',
    '向下淡入':'fadeOutDown',
    ' 向下淡入（长距离）':'fadeOutDownBig',
    '向左淡入':'fadeOutLeft',
    '向左淡入（长距离）':'fadeOutLeftBig',
    '向右淡入':'fadeOutRight',
    ' 向右淡入（长距离）':'fadeOutRightBig',
    '向上淡入':'fadeOutUp',
    '向上淡入（长距离）':'fadeOutUpBig',
    '翻转消失（上下）':'flipOutX',
    '翻转消失（左右）':'flipOutY',
    '光速离开':'lightSpeedOut',
    '旋转离开':'rotateOut',
    '旋转离开（向左下）':'rotateOutDownLeft',
    '旋转离开（向右下）':'rotateOutDownRight',
    '旋转离开（向左上）':'rotateOutUpLeft',
    '旋转离开（向右上）':'rotateOutUpRight',
    '掉落':'hinge',
    '滚动离开':'rollOut',
    '缩小消失':'zoomOut',
    '缩小消失（向下）':'zoomOutDown',
    '缩小消失（向左）':'zoomOutLeft',
    '缩小消失（向右）':'zoomOutRight',
    '缩小消失（向上）':'zoomOutUp',
    '飞出（向下）':'slideOutDown',
    '飞出（向左）':'slideOutLeft',
    '飞出（向右）':'slideOutRight',
    '飞出（向上）':'slideOutUp'
};

const widgetFlags = { Root: 1,
    Display: 2,
    Container: 4,
    Renderer: 8,
    Leaf: 16,
    Timer: 32,
    World: 64,
    Unique: 128,
    DomOnly: 256,
    CanvasOnly: 512 };

widgetFlags.FLAG_MASK = widgetFlags.Root | widgetFlags.Display | widgetFlags.Container;

const propertyMap = {
    'object':
    { dom:
    { funcs: [ { name: 'delete', info: '' } ],
        props: [],
        provides: 0 },
        canvas:
        { funcs: [ { name: 'delete', info: '' } ],
            props: [],
            provides: 0 },
        flex:
        { funcs: [ { name: 'delete', info: '' } ],
            props: [],
            provides: 0 } },
    'display':
    { dom:
    { funcs: [ { name: 'delete', info: '' } ],
        props: [],
        provides: 2 },
        canvas:
        { funcs: [ { name: 'delete', info: '' } ],
            props:
                [ { name: 'positionX', type: 0, default: 0 },
                    { name: 'positionY', type: 0, default: 0 },
                    { name: 'scaleX', type: 1, default: 1 },
                    { name: 'scaleY', type: 1, default: 1 } ],
            provides: 2 },
        flex:
        { funcs: [ { name: 'delete', info: '' } ],
            props: [],
            provides: 2 } },
    'container':
    { dom:
    { funcs: [ { name: 'delete', info: '' } ],
        props: [],
        provides: 6 },
        canvas:
        { funcs: [ { name: 'delete', info: '' } ],
            props:
                [ { name: 'positionX', type: 0, default: 0 },
                    { name: 'positionY', type: 0, default: 0 },
                    { name: 'scaleX', type: 1, default: 1 },
                    { name: 'scaleY', type: 1, default: 1 } ],
            provides: 6 },
        flex:
        { funcs: [ { name: 'delete', info: '' } ],
            props:
                [ { name: 'direction', type: 2, default: '' },
                    { name: 'alignItems', type: 2, default: '' } ],
            provides: 6 } },
    'canvas':
    { dom:
    { funcs: [ { name: 'delete', info: '' } ],
        props: [],
        provides: 10 },
        canvas:
        { funcs: [ { name: 'delete', info: '' } ],
            props:
                [ { name: 'positionX', type: 0, default: 0 },
                    { name: 'positionY', type: 0, default: 0 },
                    { name: 'scaleX', type: 1, default: 1 },
                    { name: 'scaleY', type: 1, default: 1 } ],
            provides: 10 },
        flex:
        { funcs: [ { name: 'delete', info: '' } ],
            props:
                [ { name: 'width', type: 0, default: 0 },
                    { name: 'height', type: 0, default: 0 } ],
            provides: 10 } },
    'root':
    { dom:
    { funcs: [ { name: 'delete', info: '' } ],
        props: [],
        provides: 7 },
        canvas:
        { funcs: [ { name: 'delete', info: '' } ],
            props:
                [ { name: 'positionX', type: 0, default: 0 },
                    { name: 'positionY', type: 0, default: 0 },
                    { name: 'scaleX', type: 1, default: 1 },
                    { name: 'scaleY', type: 1, default: 1 } ],
            provides: 7 },
        flex:
        { funcs: [ { name: 'delete', info: '' } ],
            props:
                [ { name: 'direction', type: 2, default: '' },
                    { name: 'alignItems', type: 2, default: '' },
                    { name: 'width', type: 0, default: 0 },
                    { name: 'height', type: 0, default: 0 },
                    { name: 'color', type: 6, default: '' } ],
            provides: 7 } },
    'image':
    { dom:
    { funcs: [ { name: 'delete', info: '' } ],
        props: [],
        provides: 2 },
        canvas:
        { funcs: [ { name: 'delete', info: '' } ],
            props:
                [ { name: 'positionX', type: 0, default: 0 },
                    { name: 'positionY', type: 0, default: 0 },
                    { name: 'scaleX', type: 1, default: 1 },
                    { name: 'scaleY', type: 1, default: 1 },
                    { name: 'link', type: 0, default: 0 } ],
            provides: 2 },
        flex:
        { funcs: [ { name: 'delete', info: '' } ],
            props: [ { name: 'link', type: 0, default: 0 } ],
            provides: 2 } },
    'text':
    { dom:
    { funcs: [ { name: 'delete', info: '' } ],
        props: [],
        provides: 2 },
        canvas:
        { funcs: [ { name: 'delete', info: '' } ],
            props:
                [ { name: 'positionX', type: 0, default: 0 },
                    { name: 'positionY', type: 0, default: 0 },
                    { name: 'scaleX', type: 1, default: 1 },
                    { name: 'scaleY', type: 1, default: 1 },
                    { name: 'value', type: 3, default: '' } ],
            provides: 2 },
        flex:
        { funcs: [ { name: 'delete', info: '' } ],
            props: [ { name: 'value', type: 3, default: '' } ],
            provides: 2 } },
};

export {propertyMap, propertyType, backwardTransOptions, forwardTransOptions, effectOption, effectOptionsToJudge, easingMoveOptions, widgetFlags};
