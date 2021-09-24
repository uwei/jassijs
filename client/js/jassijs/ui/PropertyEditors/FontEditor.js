var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/PropertyEditor", "jassijs/ui/PropertyEditors/Editor", "jassijs/ui/Textbox", "jassijs/remote/Jassi", "jassijs/ui/Select", "jassijs/ui/CSSProperties"], function (require, exports, PropertyEditor_1, Editor_1, Textbox_1, Jassi_1, Select_1, CSSProperties_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.test2 = exports.FontEditor = void 0;
    let systemFonts = ["Arial", "Helvetica Neue", "Courier New", "Times New Roman", "Comic Sans MS", "Impact"];
    let googleFonts = ["Aclonica", "Allan", "Annie Use Your Telescope", "Anonymous Pro", "Allerta Stencil", "Allerta", "Amaranth", "Anton", "Architects Daughter", "Arimo", "Artifika", "Arvo", "Asset", "Astloch", "Bangers", "Bentham", "Bevan", "Bigshot One", "Bowlby One", "Bowlby One SC", "Brawler", "Buda:300", "Cabin", "Calligraffitti", "Candal", "Cantarell", "Cardo", "Carter One", "Caudex", "Cedarville Cursive", "Cherry Cream Soda", "Chewy", "Coda", "Coming Soon", "Copse", "Corben", "Cousine", "Covered By Your Grace", "Crafty Girls", "Crimson Text", "Crushed", "Cuprum", "Damion", "Dancing Script", "Dawning of a New Day", "Didact Gothic", "Droid Sans", "Droid Serif", "EB Garamond", "Expletus Sans", "Fontdiner Swanky", "Forum", "Francois One", "Geo", "Give You Glory", "Goblin One", "Goudy Bookletter 1911", "Gravitas One", "Gruppo", "Hammersmith One", "Holtwood One SC", "Homemade Apple", "Inconsolata", "Indie Flower", "Irish Grover", "Istok Web", "Josefin Sans", "Josefin Slab", "Judson", "Jura", "Just Another Hand", "Just Me Again Down Here", "Kameron", "Kenia", "Kranky", "Kreon", "Kristi", "La Belle Aurore", "Lato", "League Script", "Lekton", "Limelight", "Lobster", "Lobster Two", "Lora", "Love Ya Like A Sister", "Loved by the King", "Luckiest Guy", "Maiden Orange", "Mako", "Maven Pro", "Maven Pro:900", "Meddon", "MedievalSharp", "Megrim", "Merriweather", "Metrophobic", "Michroma", "Miltonian Tattoo", "Miltonian", "Modern Antiqua", "Monofett", "Molengo", "Mountains of Christmas", "Muli:300", "Muli", "Neucha", "Neuton", "News Cycle", "Nixie One", "Nobile", "Nova Cut", "Nova Flat", "Nova Mono", "Nova Oval", "Nova Round", "Nova Script", "Nova Slim", "Nova Square", "Nunito", "Old Standard TT", "Open Sans:300", "Open Sans", "Open Sans:600", "Open Sans:800", "Open Sans Condensed:300", "Orbitron", "Orbitron:500", "Orbitron:700", "Orbitron:900", "Oswald", "Over the Rainbow", "Reenie Beanie", "Pacifico", "Patrick Hand", "Paytone One", "Permanent Marker", "Philosopher", "Play", "Playfair Display", "Podkova", "Press Start 2P", "Puritan", "Quattrocento", "Quattrocento Sans", "Radley", "Raleway:100", "Redressed", "Roboto", "Rock Salt", "Rokkitt", "Ruslan Display", "Schoolbell", "Shadows Into Light", "Shanti", "Sigmar One", "Six Caps", "Slackey", "Smythe", "Sniglet", "Sniglet:800", "Special Elite", "Stardos Stencil", "Sue Elen Francisco", "Sunshiney", "Swanky and Moo Moo", "Syncopate", "Tangerine", "Tenor Sans", "Terminal Dosis Light", "The Girl Next Door", "Tinos", "Ubuntu", "Ultra", "Unkempt", "UnifrakturCook:bold", "UnifrakturMaguntia", "Varela", "Varela Round", "Vibur", "Vollkorn", "VT323", "Waiting for the Sunrise", "Wallpoet", "Walter Turncoat", "Wire One", "Yanone Kaffeesatz", "Yeseva One", "Zeyada"];
    let FontEditor = 
    /**
    * Editor for font
    * used by PropertyEditor
    **/
    class FontEditor extends Editor_1.Editor {
        constructor(property, propertyEditor) {
            super(property, propertyEditor);
            /** @member - the renedering component **/
            this.component = new Select_1.Select({
                "multiple": false,
                "placeholder": "select a font",
                "allowDeselect": false
            });
            this.component.width = "100%";
            this.component.display = function (item) {
                return '<span style=font-family:"' + item + '>' + item + '</span>';
            };
            var all = [];
            for (let i = 0; i < systemFonts.length; i++) {
                all.push(systemFonts[i]);
            }
            for (let i = 0; i < googleFonts.length; i++) {
                all.push(googleFonts[i]);
                (0, CSSProperties_1.loadFontIfNedded)(googleFonts[i]);
            }
            this.component.items = all;
            //   this.component.dom=font[0];
            var _this = this;
            this.component.onchange(function (param) {
                _this._onchange(param);
            });
        }
        /**
         * @member {object} ob - the object which is edited
         */
        set ob(ob) {
            super.ob = ob;
            var value = this.propertyEditor.getPropertyValue(this.property);
            if (value !== undefined && value.length > 1)
                value = value.substring(1, value.length - 1);
            this.component.value = value;
        }
        get ob() {
            return this._ob;
        }
        /**
       * get the renderer for the PropertyEditor
       * @returns - the UI-component for the editor
       */
        getComponent() {
            return this.component;
        }
        /**
         * intern the value changes
         * @param {type} param
         */
        _onchange(param) {
            var val = this.component.value;
            val = "\"" + val + "\"";
            this.propertyEditor.setPropertyInCode(this.property.name, val);
            var oval = this.component.value;
            this.propertyEditor.setPropertyInDesign(this.property.name, oval);
            super.callEvent("edit", param);
        }
    };
    FontEditor = __decorate([
        (0, Editor_1.$PropertyEditor)(["font"]),
        (0, Jassi_1.$Class)("jassijs.ui.PropertyEditors.FontEditor")
        /**
        * Editor for font
        * used by PropertyEditor
        **/
        ,
        __metadata("design:paramtypes", [Object, Object])
    ], FontEditor);
    exports.FontEditor = FontEditor;
    function test2() {
        var prop = new PropertyEditor_1.PropertyEditor();
        prop.value = new Textbox_1.Textbox();
        return prop;
    }
    exports.test2 = test2;
    function test() {
        var prop = new FontEditor(undefined, undefined);
        return prop.component;
    }
    exports.test = test;
});
//# sourceMappingURL=FontEditor.js.map