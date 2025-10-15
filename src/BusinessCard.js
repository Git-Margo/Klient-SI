function BusinessCard() {

    let acc             = null;
    let icon            = null;
    let id              = null;
    let lvl             = null;
    let operationLevel  = null;
    let nick            = null;
    let prof            = null;
    let sex             = null;

    const init = () => {

    };

    const updateData = (data) => {
        if (isset(data.acc))    acc             = data.acc;
        if (isset(data.icon))   icon            = data.icon;
        if (isset(data.id))     id              = data.id;
        if (isset(data.lvl))    lvl             = data.lvl;
        if (isset(data.oplvl))  operationLevel  = data.oplvl;
        if (isset(data.nick))   nick            = data.nick;
        if (isset(data.prof))   prof            = data.prof;
        if (isset(data.sex))    sex             = data.sex;
    };

    this.getAcc             = () => {return acc};
    this.getIcon            = () => {return icon};
    this.getId              = () => {return id};
    this.getLvl             = () => {return lvl};
    this.getOperationLevel  = () => {return operationLevel};
    this.getNick            = () => {return nick};
    this.getProf            = () => {return prof};
    this.getSex             = () => {return sex};


    this.init               = init;
    this.updateData         = updateData;

};