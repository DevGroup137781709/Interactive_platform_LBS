


var express = require('express');
var router = express.Router();

var object =    //����Сд��object�����࣬����ʵ��������ķ�����
{
    isA: function(aType)   //һ���ж�������֮���Լ���������֮���ϵ�Ļ�������
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

function Class(aBaseClass, aClassDefine)    //������ĺ��������������༰�̳й�ϵ
{
    function class_()   //���������ʱ������
    {
        this.Type = aBaseClass;    //���Ǹ�ÿһ����Լ��һ��Type���ԣ�������̳е���
        for(var member in aClassDefine)
            this[member] = aClassDefine[member];    //�������ȫ�����嵽��ǰ��������
    };
    class_.prototype = aBaseClass;
    return new class_();
};

function New(aClass, aParams)   //��������ĺ���������������Ķ��󴴽�
{
    function new_()     //�����������ʱ������
    {
        this.Type = aClass;    //����Ҳ��ÿһ������Լ��һ��Type���ԣ��ݴ˿��Է��ʵ�������������
        if (aClass.Create)
            aClass.Create.apply(this, aParams);   //����Լ��������Ĺ��캯������Create�����DELPHI�Ƚ�����
    };
    new_.prototype = aClass;
    return new new_();
};

/* GET home page. */
router.get('/', function(req, res, next) {




    var party=New(require('/party/party.class.js'),[]);

    party.getNewPartys(3,function(result){




        var obj=[{ID:1,name:'2',type:'3',location:'4',poster:'5',time:'6'},{ID:1,name:'2',type:'3',location:'4',poster:'5',time:'6'},{ID:1,name:'2',type:'3',location:'4',poster:'5',time:'6'}];


        res.render('index', {party:obj});

    })





});



module.exports = router;
