// from memory - douglas crockford object.create (not sure if object.create works exactly the same)
if (typeof Object.create != 'function') {
    Object.create = function (object) {
        function f () {};
        f.prototype = object;
        return new f();
    };
}

// menu building class
var Menu = Object.create({
    init: function () {
        this.getMenu();
    },

    buildMenu: function (menu_data) {
        var menu_length = menu_data.length,
            menu = document.createElement('ul');

        for (var i = 0; i < menu_length; i++) {
            var menu_item = this.buildMenuItem(menu_data[i]);

            menu.appendChild(menu_item);
        }

        return menu;
    },

    buildMenuItem: function (item) {
        var menu_item = document.createElement('li'),
            a = document.createElement('a'),
            sub_menu;

        // build link
        a.href = item.href;
        a.id = ['menu_item', item.id].join('_');
        a.innerHTML = item.name;

        if (item.children instanceof Array) {
            // build submenu - using sibling combinator so submenu must come before link in DOM
            sub_menu = this.buildMenu(item.children);

            sub_menu.className = 'submenu';

            // append submenu
            menu_item.appendChild(sub_menu);
        }

        // append link
        menu_item.appendChild(a);

        return menu_item;
    },

    getMenu: function () {
        var xhr = new XMLHttpRequest();

        // allow the onReadyStateChange to call the menu class with the response it received from the ajax request
        // menu building logic can stay within the Menu class without having the xhr context to worry about
        function onReadyStateChange(fn, that) {
            return function () {
                // hijack complete
                if (this.readyState == 4) {
                    var data = this.responseText;

                    fn.apply(that, [data, this]);
                }
            };
        };

        // make ajax request
        xhr.onreadystatechange = onReadyStateChange(this.onGetMenuComplete, this);
        xhr.open('GET', 'data/menu.json');
        xhr.send();
    },

    onGetMenuComplete: function (data, xhr) {
        var menu_data = JSON.parse(data || null);

        var menu = this.buildMenu(menu_data),
            nav = document.getElementById('nav');

        // build menu
        menu.className = 'menu';

        // append menu
        nav.appendChild(menu);
    }
});

Menu.init();