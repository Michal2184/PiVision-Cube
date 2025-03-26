(function (PV) {
  function MySymbol() {
    this.cube = null;
    this.material = null;
  }

  MySymbol.prototype.init = function (scope, elem) {
    const container = document.createElement("div");
    container.style.width = "100%";
    container.style.height = "100%";
    elem.appendChild(container);

    // Scene, camera, renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    window.addEventListener("resize", () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    });

    // Cube with stored material
    const geometry = new THREE.BoxGeometry();
    this.material = new THREE.MeshStandardMaterial({ color: 0x29ab87, roughness: 1, metalness: 0.5 });
    this.cube = new THREE.Mesh(geometry, this.material);
    scene.add(this.cube);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    const pointLight = new THREE.PointLight(0xffffff, 0.9);
    pointLight.position.set(5, 5, 5);
    scene.add(ambientLight, pointLight);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    const animate = () => {
      requestAnimationFrame(animate);
      //if (this.cube) this.cube.rotation.y += 0.01;
      controls.update();
      renderer.render(scene, camera);
    };

    animate();
  };

  MySymbol.prototype.dataUpdate = function (scope, data) {
    if (this.cube && this.material) {
      const val = data.Value ?? data[0]?.Value ?? 0;

      // Rotation
      this.cube.rotation.y = (val / 100) * Math.PI * 2;

      // Color thresholds
      if (val > 80) {
        this.material.color.set(0xff0000); // red
      } else if (val < 20) {
        this.material.color.set(0xffff00); // yellow
      } else {
        this.material.color.set(0x29ab87); // default greenish
      }
    }
  };

  PV.symbolCatalog.register({
    typeName: "mySymbol",
    displayName: "My Custom Symbol",
    init: MySymbol,
  });
})(window.PIVisualization);
