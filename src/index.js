import { Swatch, PaletteGroup, Palette } from "./Micropalette";
import * as PIXI from "pixi.js";
// import * as PIXI from "pixi.js-legacy";

// import { CanvasRenderer } from '@pixi/canvas-renderer';
import * as MMCQ20PaletteJSON from "./palette-data/all-ColorThiefMMCQExtractor-LAB-20-palette.json";
import * as CV2KMeans20PaletteJSON from "./palette-data/all-CV2KMeansExtractor-LAB-20-palette.json";
import * as PIL20PaletteJSON from "./palette-data/all-PILExtractor-LAB-20-palette.json";

// import * as fullPaletteJSON from "./palette-data/all--Extractor-LAB-20-palette.json";

let apps = [];
let swatches = [];
let palettes = [];
let paletGroups = [];

const dataSets = [
    {
        data: MMCQ20PaletteJSON,
        label: "MMCQ"
    }, {
        data: CV2KMeans20PaletteJSON,
        label: "K-Means"
    }, {
        data: PIL20PaletteJSON,
        label: "Octree"
    }];

const sortModes = [
    {
        label: "hue",
        func: x => x.sortByHue()
    }, {
        label: "lightness",
        func: x => x.sortByLightness()
    }, {
        label: "saturation",
        func: x => x.sortBySaturation()
    }, {
        label: "percent",
        func: x => x.sortByPercent()
    }]



function cleanup() {

    // swatches.forEach(swatch => {
    //     swatch.rectangle.clear();
    //     try {
    //         swatch.rectangle.destroy();
    //     } catch (e) { }
    // })
    apps.forEach(app => {
        try { app.destroy(); } catch (e) { }
    })
    apps = [];
}

function addSamplePalette(paletteData, label = "sample data", height = 200, sortMode = x=>x) {

    //const height = 200;

    let app = new PIXI.Application({
        // width: window.innerWidth,         // default: 800
        // height: window.innerHeight,        // default: 600
        autoResize: true,
        // antialias: true,    // default: false
        transparent: true, // default: false    
        resolution: window.devicePixelRatio,       // default: 1
        autoStart: false,
        // forceCanvas: true,
    });

    apps.push(app);


    const container = document.createElement("div");

    const barLabel = document.createElement("div");
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

    container.classList.add("container");
    contentContainer.classList.add("content-row");

    let root = document.getElementById("root");
    // root = document.createElement("div");
    document.body.appendChild(root);

    // add skeleton
    root.appendChild(container);

    let proportional = false;
    // annotate
    barLabel.innerText = `${label} @${height}px`
    function updateToggleLabel() {
        toggleProportionalStatus.innerText = proportional ? "proportional" : "equal-sized";
    }

    updateToggleLabel()

    function imgSrc(filename) {
        const folder = filename.split(".").slice(0, 2).join("."),
            ret = `./images/${folder}/${filename}.jpg`;
        return ret;

        // const fname100 = filename.split(".").slice(0,-1).concat(["100"]).join(".")

        // return `https://www.blakearchive.org/images/${fname100}.jpg`;

    }
    // create each Palette
    const palettes = Object.keys(paletteData).sort().map(k => {
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


        let ret = new Palette({
            key: k,
            swatches,
            mouseOverHandler: (swatch) => {
                //preview.style.backgroundColor=`rgba(${swatch.getRGB().join(",")})`
                preview.setAttribute("src", imgSrc(k))
            },
            // mouseOutHandler: (plt) => { preview.setAttribute("src", "") }
        })

        sortMode(ret);

        return ret;

    })

    function toggleProproportional() {
        proportional = !proportional;
        updateToggleLabel();
        palettes.forEach(p => {
            if (proportional) { p.makeEqual(); }
            else { p.makeProportional(); }

            app.start();
            setTimeout(()=>{
                console.log("Stopped")
                app.stop()
            }, 1000 * 5)

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
        // sortByHue: true,
        paletteHeight: height
    }).appendTo(barContainer);

}

function draw(data, sortMode) {

    cleanup();

    let root = document.getElementById("root");

    function killChildren(node) {
        if (!node) { return }

        node.childNodes.forEach(c => killChildren(c));
        node.remove()
    }

    killChildren(root);

    root = document.createElement("div")
    root.id = "root";
    document.body.appendChild(root);


    Object.keys(data).slice(0, 2).forEach(k => {
        if (!k.startsWith("songs")) { return }
        addSamplePalette(data[k], `${k}`, 50, sortMode);
    })

    Object.keys(data).slice(2, 4).forEach(k => {
        if (!k.startsWith("songs")) { return }
        addSamplePalette(data[k], `${k}`, 100, sortMode);
    })


    Object.keys(data).slice(4, 6).forEach(k => {
        if (!k.startsWith("songs")) { return }
        addSamplePalette(data[k], `${k}`, 200, sortMode);
    })

    Object.keys(data).slice(6, 100).forEach(k => {
        if (!k.startsWith("songs")) { return }
        addSamplePalette(data[k], `${k}`, 300, sortMode);
    })

}

let dataSetIdx = 0,
    sortModeIdx = 0;

sortModes.forEach((m, i) => {
    const button = document.createElement("button")
    button.innerText = m.label
    const controls = document.getElementById("sort-controls")
    controls.appendChild(button)
    button.onclick = () => {
        sortModeIdx = i;
        drawWithCurrentState()
    }

})

// document.getElementById("kmeans").onclick = () => {
//     draw(MMCQ20PaletteJSON);
// }

// document.getElementById("mmcq").onclick = () => {
//     draw(CV2KMeans20PaletteJSON);
// }

// document.getElementById("octree").onclick = () => {
//     draw(PIL20PaletteJSON);
// }

function drawWithCurrentState() {
    const dset = dataSets[dataSetIdx],
        sorter = sortModes[sortModeIdx];
    draw(dataSets[dataSetIdx].data, sorter.func)
    const details = document.getElementById("overview");
    details.innerText = `Current mode: ${dset.label} extraction sorted by ${sorter.label}`;
}

dataSets.forEach((dset, i) => {
    const button = document.createElement("button")
    button.innerText = dset.label;
    const controls = document.getElementById("algorithm-controls")
    controls.appendChild(button)
    button.onclick = () => {
        dataSetIdx = i;
        drawWithCurrentState()
    }
})

drawWithCurrentState()
// draw(MMCQ20PaletteJSON);