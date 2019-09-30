import * as PIXI from "pixi.js";
import rgb2hsl from "./rgb2hsl";

export default class Swatch {

    constructor(props) {
        this.props = props;

        this.appendTo = this.appendTo.bind(this);
        this.setApp = this.setApp.bind(this);
        this.setX = this.setX.bind(this);
        this.setY = this.setY.bind(this);
        this.setHeight = this.setHeight.bind(this);
        this.setWidth = this.setWidth.bind(this);
        this.setMouseoverHandler = this.setMouseoverHandler.bind(this);
        this.setMouseoutHandler = this.setMouseoutHandler.bind(this);
        this.setClickHandler = this.setClickHandler.bind(this);

        this.getHSL = this.getHSL.bind(this);
    }

    getHSL(){
        if (!this.__hsl){
            this.__hsl = rgb2hsl(this.props.color);
    
        }
        return this.__hsl;
    }

    setClickHandler(handler) {
        this.props.clickHandler = handler;
        return this;
    }

    setMouseoverHandler(handler) {
        this.props.mouseoverHandler = handler;
        return this;
    }

    setMouseoutHandler(handler) {
        this.props.mouseoutHandler = handler;
        return this;
    }


    setHeight(h){
        this.props.height = h;

        if (this.props.rectangle){
            this.props.rectangle.height = h;
        }
        return this;
    }

    setWidth(w){
        this.props.width = w;
        return this;
    }

    setX(x) {
        this.props.x = x;
        return this;
    }

    setY(y) {
        this.props.y = y;
        if (this.props.rectangle){
            this.props.rectangle.y = y;
        }
        return this;
    }

    setApp(app) {
        this.props.app = app;
        return this;
    }

    getPercent() {
        return this.props.percent;
    }

    getColor() {
        return parseInt("0x" + this.props.color.slice(0, 3).map(x => x.toString(16).padStart(2,'0')).join(""));

    }

    appendTo(stage) {
        const rectangle = this.props.rectangle || new PIXI.Graphics();
        rectangle.beginFill(this.getColor());
        rectangle.drawRect(0, 0, this.props.width, this.props.height);
        rectangle.x = this.props.x;
        rectangle.y = this.props.y;
        rectangle.endFill();

        if (this.props.clickHandler) {
            rectangle.interactive = true;
            rectangle.on("click", ()=>{console.log(this.props.key, this.props.color); this.props.clickHandler()});

        }
        if (this.props.mouseoverHandler) {
            rectangle.interactive = true;
            rectangle.on("mouseover", this.props.mouseoverHandler);
        }
        if(this.props.mouseoutHandler){
            rectangle.interactive = true;
            rectangle.on("mouseout", this.props.mouseoutHandler);

        }

        stage.addChild(rectangle);
        this.props.rectangle = rectangle;

        return this;

    }
}