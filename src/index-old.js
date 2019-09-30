import * as PIXI from 'pixi.js';

//Create a Pixi Application
let app = new PIXI.Application({ 
    width: window.innerWidth,         // default: 800
    height: window.innerHeight,        // default: 600
    autoResize: true,
    antialias: true,    // default: false
    transparent: true, // default: false    
    resolution: window.devicePixelRatio       // default: 1

  });

app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);
//Add the canvas that Pixi automatically created for you to the HTML document
document.getElementById("container").appendChild(app.view);

let rectangle = new PIXI.Graphics();
//rectangle.lineStyle(4, 0xFF3300, 1);
rectangle.beginFill(0x000000);
rectangle.drawRect(0, 0, 10, 10);
rectangle.endFill();
rectangle.x = 170;
rectangle.y = 170;
app.stage.addChild(rectangle);

app.loader.add("sprite1", "./img/songsie.a.p1-3.300.jpg").load((loader, resources)=>{
    console.log("Loaded");
    console.log("sprite1.texture", resources.sprite1.texture);
    const sprite = new PIXI.Sprite(resources.sprite1.texture);
    sprite.x = 0;
    sprite.y = 0;

    const ratio = 100 / sprite.width;
    console.log("Ratio", ratio)
    sprite.scale.x = ratio;
    sprite.scale.y = ratio;
    app.stage.addChild(sprite)

    console.log("ok3")


    const text = new PIXI.Text("text");
    text.x = 300;
    text.y = 0;
    app.stage.addChild(text);

    console.log("OK4")

})
