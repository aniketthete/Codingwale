const canvas = document.getElementById('webgl-canvas');

if (canvas) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const isHome = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');

  if (!isHome) {
    // Inner pages geometry
    camera.position.set(0, 0, 7);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x00f2fe, 3, 20);
    cyanLight.position.set(4, 4, 4);
    scene.add(cyanLight);

    const group = new THREE.Group();
    const geometry = new THREE.BoxGeometry(0.6, 0.6, 0.6);
    const material = new THREE.MeshStandardMaterial({ color: 0x00f2fe, wireframe: true });

    for (let i = 0; i < 20; i++) {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set((Math.random() - 0.5) * 12, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 6 - 2);
      group.add(mesh);
    }
    scene.add(group);

    function animateInner() {
      group.rotation.y += 0.003;
      renderer.render(scene, camera);
      requestAnimationFrame(animateInner);
    }
    animateInner();

  } else {
    // Homepage Terminal & Matrix
    camera.position.set(0, 0, 5);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const cyanLight = new THREE.DirectionalLight(0x00f2fe, 2.0);
    cyanLight.position.set(5, 5, 5);
    scene.add(cyanLight);

    const outerMatrixGeo = new THREE.IcosahedronGeometry(1.6, 2);
    const outerMatrixMat = new THREE.MeshBasicMaterial({ color: 0x00f2fe, wireframe: true, transparent: true, opacity: 0.15 });
    const backgroundMatrix = new THREE.Mesh(outerMatrixGeo, outerMatrixMat);
    backgroundMatrix.position.set(-2.2, 0.2, -1.5);
    scene.add(backgroundMatrix);

    let terminalModel;
    if (typeof THREE.GLTFLoader !== 'undefined') {
      const loader = new THREE.GLTFLoader();
      loader.load('laptop.glb', (gltf) => {
        terminalModel = gltf.scene;
        terminalModel.scale.set(0.85, 0.85, 0.85);
        terminalModel.position.set(2, -0.2, 0);
        scene.add(terminalModel);
      });
    }

    function animateHome() {
      backgroundMatrix.rotation.y += 0.005;
      if (terminalModel) terminalModel.rotation.y += 0.002;
      renderer.render(scene, camera);
      requestAnimationFrame(animateHome);
    }
    animateHome();
  }

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
