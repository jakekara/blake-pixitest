import { Swatch, PaletteGroup, Palette } from "./Micropalette";
import * as PIXI from "pixi.js";
import * as MMCQ20PaletteJSON from "./palette-data/all-ColorThiefMMCQExtractor-LAB-20-palette.json";
// import * as fullPaletteJSON from "./palette-data/all--Extractor-LAB-20-palette.json";


function newSwatches(n = 10) {

    let ret = [];

    let rgbval = () => 64 + Math.floor(Math.random() * 128);
    let pctSum = 0;

    for (var i = 0; i < n; i++) {
        const tmpPct = Math.random();
        pctSum += tmpPct
        ret.push({
            key: i,
            //color: [i, i, i],
            //percent: Math.random() * 0.1,
            percent: tmpPct,
            color: [rgbval(), rgbval(), rgbval()],
            // x: 10,
            // y: 10 * i,
        });
    }
    // make sure the pcts always add up to 1
    ret = ret.map(x => {
        return new Swatch({ ...x, percent: x.percent / pctSum })
    })



    return ret;
}

function newPalettes(n, m = 10) {


    let ret = [];
    for (var i = 0; i < n; i++) {
        ret.push(new Palette({
            key: i,
            swatches: newSwatches(m)
        }))
    }
    return ret;
}
// for (var i = 0; i < 255; i += 25) {
//     swatches.push(new Swatch({
//         key:i,
//         color: [i, i, i],
//         x: 10,
//         y: 10 * i,
//     }));
// }


// const p = new Palette({
//     swatches
// });

// const palettes = [p];



function addExample(paletteCount = 100, swatchCount = 10, paletteHeight = 100) {

    let app = new PIXI.Application({
        // width: window.innerWidth,         // default: 800
        // height: window.innerHeight,        // default: 600
        autoResize: true,
        antialias: true,    // default: false
        transparent: true, // default: false    
        resolution: window.devicePixelRatio       // default: 1
    });


    const container = document.createElement("div");
    const barLabel = document.createElement("h5");
    const barContainer = document.createElement("div");

    container.appendChild(barLabel);
    container.appendChild(barContainer)
    container.appendChild(preview);
    document.body.appendChild(container);


    // annotate
    barLabel.innerText = `${paletteCount} palettes, ${paletteHeight}px tall, with ${swatchCount} swatches each`

    new PaletteGroup({
        paletteHeight,
        palettes: newPalettes(paletteCount, swatchCount, paletteHeight),
        app,
        //    sortByHue:true
    }).appendTo(barContainer);

}
// addExample();

// addExample(100,10,50);


// addExample(5, 500, 300);


function addSamplePalette(paletteData, label = "sample data", height=200) {
    
    //const height = 200;

    let app = new PIXI.Application({
        // width: window.innerWidth,         // default: 800
        // height: window.innerHeight,        // default: 600
        autoResize: true,
        // antialias: true,    // default: false
        transparent: true, // default: false    
        resolution: window.devicePixelRatio,       // default: 1
        forceCanvas: true

    });


    const container = document.createElement("div");
    const barLabel = document.createElement("h5");
    const toggleProportionalStatus = document.createElement("button")
    const contentContainer = document.createElement("div");
    const barContainer = document.createElement("div");
    const preview = document.createElement("img");

    preview.style.height = `${height}px`;

    container.appendChild(barLabel);
    container.appendChild(toggleProportionalStatus);
    container.appendChild(contentContainer);
    contentContainer.appendChild(barContainer);
    contentContainer.appendChild(preview);
    document.body.appendChild(container);

    container.classList.add("container");
    contentContainer.classList.add("content-row");


    let proportional = false;
    // annotate
    barLabel.innerText = `${label}`
    function updateToggleLabel() {
        toggleProportionalStatus.innerText = proportional ? "proportional" : "equal-sized";
    }

    updateToggleLabel()

    function imgSrc(filename) {
        // const folder = filename.split(".").slice(0, 2).join("."),
        //     ret = `./images/${folder}/${filename}.jpg`;
        //return ret;

        const fname100 = filename.split(".").slice(0,-1).concat(["100"]).join(".")

        return `http://www.blakearchive.org/images/${fname100}.jpg`;
        
    }
    // create each Palette
    const palettes = Object.keys(paletteData).map(k => {
        const d = paletteData[k];
        const swatches = d.map((pct_color, i) => {
            const ret = new Swatch({
                key: `${k}-${i}`,
                percent: pct_color[0],
                color: pct_color[1]
            })
            // console.log(k, pct_color[1], ret.getColor());
            return ret

        });


        return new Palette({
            key: k,
            swatches,
            mouseOverHandler: () => { preview.setAttribute("src", imgSrc(k)) },
            mouseOutHandler: () => { preview.setAttribute("src", "")}
        })
    })

    function toggleProproportional() {
        proportional = !proportional;
        updateToggleLabel();
        palettes.forEach(p => {
            if (proportional) { p.makeEqual(); }
            else { p.makeProportional(); }
        });
    }

    toggleProportionalStatus.onclick = toggleProproportional;


    // create the PaletteGroup
    // new PaletteGroup({
    //     palettes,
    //     app,
    //     sortByHue: true,
    //     paletteHeight: 200
    // }).appendTo(barContainer);
    
    // new PaletteGroup({
    //     palettes,
    //     app,
    //     sortByHue: true,
    //     paletteHeight: 100
    // }).appendTo(barContainer);

    new PaletteGroup({
        palettes,
        app,
        sortByHue: true,
        paletteHeight: height
    }).appendTo(barContainer);


}


Object.keys(MMCQ20PaletteJSON).slice(0,2).forEach(k => {
    if (!k.startsWith("songs")) { return }
    addSamplePalette(MMCQ20PaletteJSON[k], `${k}`, 50);
})

Object.keys(MMCQ20PaletteJSON).slice(2,4).forEach(k => {
    if (!k.startsWith("songs")) { return }
    addSamplePalette(MMCQ20PaletteJSON[k], `${k}`, 100);
})


Object.keys(MMCQ20PaletteJSON).slice(4,6).forEach(k => {
    if (!k.startsWith("songs")) { return }
    addSamplePalette(MMCQ20PaletteJSON[k], `${k}`,200);
})

Object.keys(MMCQ20PaletteJSON).slice(6,100).forEach(k => {
    if (!k.startsWith("songs")) { return }
    addSamplePalette(MMCQ20PaletteJSON[k], `${k}`,300);
})


