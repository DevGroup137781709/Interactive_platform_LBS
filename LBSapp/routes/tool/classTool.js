/**
 * Created by qianzise on 2015/7/21.
 */

//�﷨��¶��


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