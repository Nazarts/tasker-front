class DataFrame{
    construct(columns=null, data){
        if(typeof(data) == 'object'){
            this.data = data;
            this.columns = data.keys();
        }
        else if(typeof(data) == 'array' && typeof(columns) == 'array'){
            data.forEach((element, index) => {
                this.data[columns[index]] = element;
            });
        }
    }

    groupBy(columnName, inPlace=false){
        if(this.columns.includes(columnName)){
            let newData = {};

            for (let index = 0; index < data.length; index++) {
                const element = data[index];
        
                if (!newData.hasOwnProperty(columnName)){
                    newData[columnName] = [];
                }
                
                newData[columnName].push(element);
            }
        
            if(inPlace)(
                this.data = newData
            )
            else {
                return new DataFrame()
            }
        }
    }
}