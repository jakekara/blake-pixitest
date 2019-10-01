export default class PaletteGroup{

    constructor(props){
        this.props = props;

        this.props.paletteWidth = props.paletteWidth || 10;
        this.props.paletteHeight = props.paletteHeight || 100;
        this.props.palettePadding = props.palettePadding || 3;

        this.appendTo = this.appendTo.bind(this);
    }

    appendTo(el){
        el.appendChild(this.props.app.view);

        this.props.palettes.forEach((p, i)=>{

            //
            // if (this.props.sortByHue === true){ p.sortByHue()}

            p.setX((this.props.paletteWidth + this.props.palettePadding) * i)
            .setHeight(this.props.paletteHeight)
            .appendTo(this.props.app.stage);
                // .rectangles()
                // .forEach(rectangle =>{
                //     this.props.app.stage.addChild(rectangle);
                // });

        });
        this.props.app.renderer.resize(this.props.app.stage.width, this.props.app.stage.height);
        this.props.app.start();
        setTimeout(()=>{
            console.log("Stopping")
            this.props.app.stop()
        }, 1000 * 5)
    
    }

}