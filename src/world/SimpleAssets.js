import AssetManifest from 'assets/pigeon/AssetManifest.js';

const manifest = new AssetManifest();

manifest.addAsset("vert", "shader.vert");
manifest.addAsset("frag", "shader.frag");
manifest.addAsset("shader", "shader.shader", {vertexShader: "shader.vert", fragmentShader: "shader.frag"});
manifest.addAsset("vert", "phong.vert");
manifest.addAsset("frag", "phong.frag");
manifest.addAsset("shader", "phong.shader", {vertexShader: "phong.vert", fragmentShader: "phong.frag"});

manifest.addAsset("image", "capsule.jpg");
manifest.addAsset("texture", "capsule.tex", {image: "capsule.jpg"});
manifest.addAsset("image", "color.png");
manifest.addAsset("texture", "color.tex", {image: "color.png"});
manifest.addAsset("image", "rock.jpg");
manifest.addAsset("texture", "rock.tex", {image: "rock.jpg"});
manifest.addAsset("image", "font.png");
manifest.addAsset("texture", "font.tex", {image: "font.png"});
manifest.addAsset("image", "wooden_crate.jpg");
manifest.addAsset("texture", "wooden_crate.tex", {image: "wooden_crate.jpg"});

manifest.addAsset("obj", "cube.obj");
manifest.addAsset("mesh", "cube.mesh", {geometry: "cube.obj"});
manifest.addAsset("obj", "capsule.obj");
manifest.addAsset("mesh", "capsule.mesh", {geometry: "capsule.obj"});
manifest.addAsset("obj", "quad.obj");
manifest.addAsset("mesh", "quad.mesh", {geometry: "quad.obj"});
manifest.addAsset("obj", "ball.obj");
manifest.addAsset("mesh", "ball.mesh", {geometry: "ball.obj"});

export default manifest;
