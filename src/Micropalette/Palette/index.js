export default class Palette {

    constructor(props) {
        this.props = props;

        this.setHeight = this.setHeight.bind(this);
        this.setX = this.setX.bind(this);
        this.appendTo = this.appendTo.bind(this);
        // this.handleHover = this.handleHover.bind(this);
        // this.handleClick = this.handleClick.bind(this);
        this.moveSwatches = this.moveSwatches.bind(this);
        this.makeProportional = this.makeProportional.bind(this);
        this.makeEqual = this.makeEqual.bind(this);
        this.toggleProportional = this.toggleProportional.bind(this);

        this.sortBy = this.sortBy.bind(this);
        this.sortByHue = this.sortByHue.bind(this);
        this.sortByLightness = this.sortByLightness.bind(this);
        this.sortBySaturation = this.sortBySaturation.bind(this);

        this.isEqual = this.isEqual.bind(this);
        
    }

    isEqual(){
        return !this.proportional;
    }

    setHeight(h) {
        this.props.height = h;
        return this;
    }

    setX(x) {
        this.props.x = x;
        return this;
    }

    sortBy(channel){
        this.props.swatches = this.props.swatches.sort((a, b)=>{
            if (a.getHSL()[channel] < b.getHSL()[channel]) return -1;
            return 1;
        })
    }

    sortByHue(){ return this.sortBy(0); }
    sortBySaturation(){ return this.sortBy(1)}
    sortByLightness(){ return this.sortBy(2);}


    /**
     * Update to 
     */
    makeProportional() {
        // let yOffset = 0;
        // this.props.swatches.forEach((swatch, i)=>{
        //     const height = swatch.getPercent() * this.props.height;
        //     swatch.setHeight(height);
        //     swatch.setY(yOffset);

        //     yOffset += height;

        // })
        this.moveSwatches(swatch => swatch.getPercent() * this.props.height);
        this.proportional = true;
        return this;
    }

    toggleProportional(){
        console.log(this.isEqual())
        if (this.isEqual()){ this.makeProportional() }
        else { this.makeProportional() }
    }

    makeEqual() {
        const height = this.props.height / this.props.swatches.length ;
        // let yOffset = 0;
        // this.props.swatches.forEach((swatch, i)=>{
        //     swatch.setHeight(height);
        //     swatch.setY(yOffset);
        //     yOffset += height;

        // })
        this.moveSwatches(()=>height);
        this.proportional = false;
        return this;

    }

    moveSwatches(hfunc){
        let yOffset = 0;
        this.props.swatches.forEach((swatch, i)=>{
            const height = hfunc(swatch);
            swatch.setHeight(height);
            swatch.setY(yOffset);
            yOffset += height;

        })

    }


    appendTo(stage) {
        const height = this.props.height / this.props.swatches.length ;

        this.props.swatches.map((s, i, arr) => {
            s.setX(this.props.x)
                .setY(this.props.height * (i / arr.length))
                .setHeight(1)
                .setWidth(10)
                .setMouseoverHandler(this.props.mouseOverHandler)
                .setMouseoutHandler(this.props.mouseOutHandler)
                //.setClickHandler(this.makeEqual)
                .appendTo(stage)
        });

        // this.sortByHue();
        // this.sortBySaturation();
        // this.sortByLightness();

        //this.makeEqual();
        this.makeProportional();

        return this;

    }
}