


var express = require('express');
var router = express.Router();

var object =    //定义小写的object基本类，用于实现最基础的方法等
{
    isA: function(aType)   //一个判断类与类之间以及对象与类之间关系的基础方法
    {
        var self = this;
        while(self)
        {
            if (self == aType)
                return true;
            self = self.Type;
        };
        return false;
    }
};

function Class(aBaseClass, aClassDefine)    //创建类的函数，用于声明类及继承关系
{
    function class_()   //创建类的临时函数壳
    {
        this.Type = aBaseClass;    //我们给每一个类约定一个Type属性，引用其继承的类
        for(var member in aClassDefine)
            this[member] = aClassDefine[member];    //复制类的全部定义到当前创建的类
    };
    class_.prototype = aBaseClass;
    return new class_();
};

function New(aClass, aParams)   //创建对象的函数，用于任意类的对象创建
{
    function new_()     //创建对象的临时函数壳
    {
        this.Type = aClass;    //我们也给每一个对象约定一个Type属性，据此可以访问到对象所属的类
        if (aClass.Create)
            aClass.Create.apply(this, aParams);   //我们约定所有类的构造函数都叫Create，这和DELPHI比较相似
    };
    new_.prototype = aClass;
    return new new_();
};

/* GET home page. */
router.get('/', function(req, res, next) {



    console.log(req.session);
    var party=New(require('./party/party.class.js'),[]);


    party.getNewPartys(3,function(result){


        res.render('index', {party:result});

    })





});



module.exports = router;
