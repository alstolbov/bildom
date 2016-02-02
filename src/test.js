var list = [
    {
        name: 'one',
        status: true
    }, {
        name: 'two',
        status: true
    }, {
        name: 'last',
        status: false
    }
];


var Component = Buildom.createModule({

    initialState: function () {
        return {
            list: list
        }
    },

    pub: {
        handleClick: function (name) {
            console.log('name:', name);
            var tmpList = this.state.list;
            tmpList.forEach(
                function (item) {
                    if (item.name == name) {
                        item.status = !item.status;
                    }
                }
            );
            this.setState({
                list: tmpList
            });
        },
        handleRestore: function () {
            var tmpList = this.state.list;
            tmpList.forEach(
                function (item) {
                    item.status = true;
                }
            );
            this.setState({
                list: tmpList
            });
        }
    },

    render: function () {
        var _this = this;
        var listHTML = [];
        var linkTpl = function(){/*
        <a href="#">
            <b>[[iter]].</b>
            <span>&nbsp;[[name]]</span>
        </a>
        */};

        var btnHTML = Buildom._com.createElement(
            'div',
            Buildom._com.createElement(
                'button',
                {
                    onclick: function (e) {
                        e.preventDefault();
                        _this.handleRestore();
                    }
                },
                'Restore'
            )
        );

        this.state.list.forEach(
            function (item, i) {
                if (item.status) {
                    listHTML.push(
                        Buildom._com.createElement(
                            'li',
                            {
                                onclick: function (e) {
                                    e.preventDefault();
                                    _this.handleClick(item.name);
                                }
                            },
                            Buildom._com.template({name: item.name, iter: (i + 1)}, linkTpl)
                        )
                    );
                }
            }
        );
        return Buildom._com.createElement(
            'div',
            [
                btnHTML,
                Buildom._com.createElement('ul', listHTML)
            ]
        );
    }

});

Buildom.mount(document.getElementById('test'), Component);
