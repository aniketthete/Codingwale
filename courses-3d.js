// CodingWale Courses Page - Floating Skill Matrix Background Engine
const canvas = document.getElementById('webgl-canvas');

if (canvas) {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 7);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Ambient & Accent Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const cyanLight = new THREE.PointLight(0x00f2fe, 3, 20);
  cyanLight.position.set(4, 4, 4);
  scene.add(cyanLight);

  const purpleLight = new THREE.PointLight(0x7000ff, 3, 20);
  purpleLight.position.set(-4, -4, 2);
  scene.add(purpleLight);

  // Floating Skill Cubes Cluster
  const cubesGroup = new THREE.Group();
  const cubeGeometry = new THREE.BoxGeometry(0.6, 0.6, 0.6);

  const materials = [
    new THREE.MeshStandardMaterial({ color: 0x00f2fe, wireframe: true }),
    new THREE.MeshStandardMaterial({ color: 0x7000ff, wireframe: true }),
    new THREE.MeshStandardMaterial({ color: 0x00ff88, wireframe: true })
  ];

  for (let i = 0; i < 25; i++) {
    const material = materials[i % materials.length];
    const cube = new THREE.Mesh(cubeGeometry, material);

    cube.position.x = (Math.random() - 0.5) * 12;
    cube.position.y = (Math.random() - 0.5) * 8;
    cube.position.z = (Math.random() - 0.5) * 6 - 2;

    cube.rotation.x = Math.random() * Math.PI;
    cube.rotation.y = Math.random() * Math.PI;

    cubesGroup.add(cube);
  }
  scene.add(cubesGroup);

  // Mouse Interaction Variables
  let targetX = 0;
  let targetY = 0;

  window.addEventListener('mousemove', (e) => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 1.5;
    targetY = (e.clientY / window.innerHeight - 0.5) * 1.5;
  });

  // Render Loop
  const clock = new THREE.Clock();

  function animate() {
    const elapsedTime = clock.getElapsedTime();

    // Rotate individual cubes
    cubesGroup.children.forEach((cube, idx) => {
      cube.rotation.x += 0.005 * (idx % 2 === 0 ? 1 : -1);
      cube.rotation.y += 0.008 * (idx % 3 === 0 ? 1 : -1);
      cube.position.y += Math.sin(elapsedTime + idx) * 0.002;
    });

    // Rotate whole group based on cursor positioning
    cubesGroup.rotation.y = targetX * 0.5;
    cubesGroup.rotation.x = targetY * 0.3;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();

  // Resize Handling
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
}
