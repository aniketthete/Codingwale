// CodingWale Universal 3D Engine
const canvas = document.getElementById('webgl-canvas');

if (canvas) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;

  const path = window.location.pathname;

  if (path.includes('courses.html') || path.includes('dashboard.html') || path.includes('stories.html') || path.includes('about.html') || path.includes('contact.html')) {
    // ==========================================
    // INNER PAGES: Floating Interactive Geometry
    // ==========================================
    camera.position.set(0, 0, 7);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x00f2fe, 3, 20);
    cyanLight.position.set(4, 4, 4);
    scene.add(cyanLight);

    const purpleLight = new THREE.PointLight(0x7000ff, 3, 20);
    purpleLight.position.set(-4, -4, 2);
    scene.add(purpleLight);

    const group = new THREE.Group();
    const geometry = path.includes('contact.html') ? new THREE.TorusGeometry(0.4, 0.15, 16, 50) : new THREE.BoxGeometry(0.6, 0.6, 0.6);

    const materials = [
      new THREE.MeshStandardMaterial({ color: 0x00f2fe, wireframe: true }),
      new THREE.MeshStandardMaterial({ color: 0x7000ff, wireframe: true }),
      new THREE.MeshStandardMaterial({ color: 0x00ff88, wireframe: true })
    ];

    for (let i = 0; i < 22; i++) {
      const mesh = new THREE.Mesh(geometry, materials[i % materials.length]);
      mesh.position.x = (Math.random() - 0.5) * 12;
      mesh.position.y = (Math.random() - 0.5) * 8;
      mesh.position.z = (Math.random() - 0.5) * 6 - 2;
      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;
      group.add(mesh);
    }
    scene.add(group);

    let targetX = 0, targetY = 0;
    window.addEventListener('mousemove', (e) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 1.5;
      targetY = (e.clientY / window.innerHeight - 0.5) * 1.5;
    });

    const clock = new THREE.Clock();
    function animateInner() {
      const elapsed = clock.getElapsedTime();
      group.children.forEach((mesh, idx) => {
        mesh.rotation.x += 0.005 * (idx % 2 === 0 ? 1 : -1);
        mesh.rotation.y += 0.008 * (idx % 3 === 0 ? 1 : -1);
        mesh.position.y += Math.sin(elapsed + idx) * 0.002;
      });
      group.rotation.y = targetX * 0.5;
      group.rotation.x = targetY * 0.3;
      renderer.render(scene, camera);
      requestAnimationFrame(animateInner);
    }
    animateInner();

  } else {
    // ==========================================
    // HOME PAGE: 3D Terminal + Matrix
    // ==========================================
    camera.position.set(0, 0, 5);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const cyanLight = new THREE.DirectionalLight(0x00f2fe, 2.0);
    cyanLight.position.set(5, 5, 5);
    scene.add(cyanLight);

    const purpleLight = new THREE.DirectionalLight(0x7000ff, 1.5);
    purpleLight.position.set(-5, -5, -2);
    scene.add(purpleLight);

    const outerMatrixGeo = new THREE.IcosahedronGeometry(1.6, 2);
    const outerMatrixMat = new THREE.MeshBasicMaterial({ color: 0x00f2fe, wireframe: true, transparent: true, opacity: 0.15 });
    const backgroundMatrix = new THREE.Mesh(outerMatrixGeo, outerMatrixMat);

    const innerMatrixGeo = new THREE.IcosahedronGeometry(0.9, 1);
    const innerMatrixMat = new THREE.MeshBasicMaterial({ color: 0x7000ff, wireframe: true, transparent: true, opacity: 0.2 });
    backgroundMatrix.add(new THREE.Mesh(innerMatrixGeo, innerMatrixMat));

    if (window.innerWidth > 900) backgroundMatrix.position.set(-2.2, 0.2, -1.5);
    else backgroundMatrix.position.set(0, 1, -1.5);
    scene.add(backgroundMatrix);

    let terminalModel;
    const loader = new THREE.GLTFLoader();
    loader.load('laptop.glb', (gltf) => {
      terminalModel = gltf.scene;
      terminalModel.traverse((child) => {
        if (child.isMesh) {
          child.material.depthWrite = true;
          child.material.transparent = false;
        }
      });
      terminalModel.scale.set(0.85, 0.85, 0.85);
      terminalModel.rotation.x = 0.2;
      if (window.innerWidth > 900) terminalModel.position.set(2, -0.2, 0);
      else terminalModel.position.set(0, -0.5, 0);
      scene.add(terminalModel);
    });

    let targetX = 0, targetY = 0, scrollY = 0;
    window.addEventListener('mousemove', (e) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    });
    window.addEventListener('scroll', () => { scrollY = window.scrollY; });

    const clock = new THREE.Clock();
    function animateHome() {
      const elapsed = clock.getElapsedTime();
      backgroundMatrix.rotation.y = elapsed * 0.1;
      backgroundMatrix.rotation.x = elapsed * 0.05;
      if (terminalModel) {
        terminalModel.rotation.y = targetX * 0.8;
        terminalModel.rotation.x = 0.2 + (targetY * 0.4);
        terminalModel.position.y = Math.sin(elapsed * 1.5) * 0.05 - (scrollY * 0.001);
      }
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
