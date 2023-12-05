AFRAME.registerComponent("bullets", {
  init: function () {
    this.shootBullet();
  },
  shootBullet: function () {
    window.addEventListener("keydown", (e) => {
      if (e.key === "z") {
        var bullet = document.createElement("a-entity");

        bullet.setAttribute("geometry", {
          primitive: "sphere",
          radius: 0.15,
        });

        ballColorList = ["yellow","red","green","pink","blue","purple","orange"];
        ballColor = ballColorList[Math.floor(Math.random()*7)];

        bullet.setAttribute("material", "color", ballColor);

        var cam = document.querySelector("#camera");

        pos = cam.getAttribute("position");

        bullet.setAttribute("position", {
          x: pos.x+0.8,
          y: pos.y-0.8,
          z: pos.z-1.65,
        });

        var camera = document.querySelector("#camera").object3D;

        //get the camera direction as Three.js Vector
        var direction = new THREE.Vector3();
        camera.getWorldDirection(direction);

        //set the velocity and it's direction
        bullet.setAttribute("velocity", direction.multiplyScalar(-10));

        var scene = document.querySelector("#scene");

        //set the bullet as the dynamic entity
        bullet.setAttribute("dynamic-body", {
          shape: "sphere",
          mass: "0",
        });

        //add the collide event listener to the bullet
        bullet.addEventListener("collide", this.removeBullet);

        scene.appendChild(bullet);

        //shooting sound
        this.shootSound();
      }
    });
  },
  removeBullet: function (e) {
    //bullet element
    var element = e.detail.target.el;

    //element which is hit
    var elementHit = e.detail.body.el;

    if (elementHit.id.includes("shootwall")) {
      element.setAttribute("material",{
        src:f`./images/${element.getAttribute("material","color")}-splash.png`,
        repeat:"1 1 1",
        opacity: 1
      });
    }

    //impulse and point vector
    var impulse = new CANNON.Vec3(-2, 2, 1);
    var worldPoint = new CANNON.Vec3().copy(
      elementHit.getAttribute("position")
    );

    elementHit.body.applyImpulse(impulse, worldPoint);

      //remove event listener
    element.removeEventListener("collide", this.removeBullet);

      //remove the bullets from the scene
    var scene = document.querySelector("#scene");
    scene.removeChild(element);

    
  },
  shootSound: function () {
    var entity = document.querySelector("#sound1");
    entity.components.sound.playSound();
  },
});

