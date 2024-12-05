// https://xiangyuecn.github.io/AreaCity-JsSpider-StatsGov/

function UserFormat(list,mapping){
    /***********************
        修改此方法实现自定义格式（剪切本代码到你的编辑器中修改），可参考JsonArrayFormat的实现
        参数list：为所有城市平铺列表，[{id,pid,deep,name,pinyin_prefix,pinyin,ext_id,ext_name,child:[]},...]
        参数mapping：为id城市映射，0索引的是省级0:{child:[]}，其他为id：{id,pid,deep,name,pinyin_prefix,pinyin,ext_id,ext_name,child:[]}
    *************************/
    
    /**导出的json key配置**/
    var Settings={
        ID:"id"
        ,IDMinLen:2 //id最少要这么长，取值2，4，6，尽量不要超过2，因为部分城市没有下级，数据中添加了00结尾的ID作为下级，因此恢复6位时就会冲突。如过调整，生成的数据需要自行处理冲突ID
        
        //如果设为空，会将所有城市展开到数组内，不进行上下级嵌套
        ,Childs:"childs"
        
        //以下字段如果设为空，对应字段就不添加到结果中
        ,pid:""
        ,deep:""
        ,name:"n"
        ,pinyin:""
        ,pinyin_prefix:"fpy"
        ,ext_id:""
        ,ext_name:""
    };
    
    var exec=function(obj,dist){//写个函数，递归处理数据
        if(!obj.childs.length){
            return;
        };
        for(var i=0;i<obj.childs.length;i++){
            if (obj.childs[i].name === '国外') { continue }
            var itm=obj.childs[i];
            var o={};
            dist.push(o);
            
            var id=(itm.id+"");
            o[Settings.ID]=id.length<Settings.IDMinLen?(id+"000000000000").substr(0,Settings.IDMinLen):id;
            o[Settings.ID]=+o[Settings.ID]
            
            var add=function(key){
                var setKey=Settings[key];
                if(setKey){
                    o[setKey]=itm[key].replaceAll(' ', '');
                    if(key === 'pinyin_prefix') { o[setKey] = itm['pinyin'].substring(0, 1).toUpperCase() }
                };
            };
            add("pid");
            add("deep");
            add("name");
            add("pinyin");
            add("pinyin_prefix");
            add("ext_id");
            add("ext_name");
            
            if(Settings.Childs){
                var c=exec(itm,[]);
                if(c){
                    o[Settings.Childs]=c;
                };
            }else{
                exec(itm,dist);
            };
        };
        return dist;
    };
        var data=exec(mapping[0],[]);
    
        var code=JSON.stringify(data,null,"\t");
        var codeLen=new Blob([code],{"type":"text/plain"}).size+3;
    
        return Result("",code,"area_format_user.json",codeLen+"字节");
    }