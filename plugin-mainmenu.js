define([
    "jwebkit",    
    "jwebdesk",
], function(jwk, jwebdesk) {
    
    function mainmenu_template() {
        return [
            { "text": "Applications", "id": "app-menu", "menu": [
                    { "text": "Accessories",    "id": "access",   "menu": [] },
                    { "text": "Games",          "id": "games",    "menu": [] },
                    { "text": "Graphics",       "id": "graphics", "menu": [] },
                    { "text": "Office",         "id": "office",   "menu": [] },
                    { "text": "Development",    "id": "dev",      "menu": [] },
                    { "text": "Sound & Video",  "id": "media",    "menu": [] },
                    { "text": "Web",            "id": "web",      "menu": [] },
                    { "text": "Other",          "id": "other",    "menu": [] },
                    { "separation" : true },
                    { "text": "Add / Remove...", "command": "add_remove"}
                ]
            },
            { "text": "Social", "id": "social-menu", "menu": [ ] },
            { "text": "System", "id": "sys-menu",  "menu": [
                    { "text": "My JwebdesK WebIdent", "command": "jwebdesk-webident", "params":{ access_token: jwk.getCookie("access_token"), namespace: "jwebdesk" }},
                    { "separation" : true },
                    { "text": "Package Manager", "command": "jwebdesk-package-manager"},
                    { "text": "Package Wizard (viejo)", "command": "jwebdesk-package-wizard"},
                    { "text": "Package Wizard", "command": "jwebdesk~jwebdesk-package-wizard@init"},
                    /*{ "text": "Configuraciuon",    "id": "prefs",   "menu": [] },
                    { "text": "Administration", "id": "admin",   "menu": [] },*/
                    { "separation" : true },
                    { "text": "About jwk jwebdesk", "command": "about_jwebdesk"},
                    { "text": "About jwk", "command": "about_jwk"}
                ]
            }
        ]
    }
    
    function get_menu_by_id(data, id) {
        function search(id, branch) {
            var menu = null;
            console.assert(Array.isArray(branch), branch);
            for (var i in branch) {
                if (branch[i].id == id) return branch[i];
                if (branch[i].menu) {
                    menu = search.call(this, id, branch[i].menu);
                    if (menu) return menu;
                }
            }
        }
        
        menu = search(id, data);
        console.assert(menu);
        return menu;
    }
    
    var data = new jwk.Node();    
    function instalar_plugin(launchbar) {    
        launchbar.add_component("mainmenu", {
            "data": data,
            "ui_type": "menu.menubar",
            "datapath": "mainmenu"
        });
        
        jwebdesk.access.mainmenu.on("change", function () {
            launchbar.reset_menu();
        })
        
        launchbar.on("change:structure", function (n, e) {
            launchbar.reset_menu();
        });
        
        launchbar.one("change:structure", function (n, e) {
            var mainmenu = e.value.search("mainmenu");
            mainmenu.on("command", function(n, e) {
                jwebdesk.open_app(e.command, e.params);
            });            
        });
        
        launchbar.register_function("reset_menu", function() {            
            var new_main_menu = mainmenu_template();
            var menuentries = jwebdesk.access.mainmenu;
            var list = menuentries.keys();            
            var structure = this.get("structure");
            // if (structure) {
                // var mainmenu = structure.search("mainmenu");                
            for (var i in list) {
                var entry = menuentries.get(list[i]).valueOf();
                var id = entry["menu-id"];
                delete entry["menu-id"];                
                var parent = get_menu_by_id(new_main_menu, id);
                console.assert(Array.isArray(parent.menu), id, entry, parent);
                parent.menu.push(entry);
            }
            // }            
            data.set("mainmenu", new_main_menu, {no_parse: true});
        });
        
        

        
    }
    
    jwebdesk.wait_app("jwebdesk~jwebdesk-launchbar@alpha-0.5").done(function (proxy) {    
        instalar_plugin(proxy.instance)
    });
    
    
    
    
});