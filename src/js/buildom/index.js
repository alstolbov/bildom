var Buildom = {
    _mount: function (rootNode) {
        this.rootNode = rootNode;
        this.Node = this.render();
        this.rootNode.innerHTML = '';
        Buildom._com.mountElement(this.rootNode, this.Node);
    },

    setState: function (newState) {
        for( var item in newState) {
            this.state[item] = newState[item];
        }
        
        this.mount(this.rootNode);
    },

    init: function (opt) {
        this.render = opt.render;
        this.setState = Buildom.setState;
        this.mount = Buildom._mount;
        if (opt.initialState) {
            this.state = opt.initialState();
        }
        if (opt.pub) {
            for( var item in opt.pub) {
                this[item] = opt.pub[item];
            }
        }
        return this;
    },

    createModule: function (opt) {
        var module = new this.init(opt);
        return module;
    },

    mount: function (rootNode, module) {
        module.mount(rootNode);
    },

    _com: {}
};