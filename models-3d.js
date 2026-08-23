document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  // Scene Setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 8);

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  // Lighting System
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
  scene.add(ambientLight);

  const cyanLight = new THREE.PointLight(0x00f2fe, 5, 25);
  cyanLight.position.set(5, 5, 5);
  scene.add(cyanLight);

  const purpleLight = new THREE.PointLight(0x7000ff, 5, 25);
  purpleLight.position.set(-5, -5, 3);
  scene.add(purpleLight);

  const Y_OFFSET = 12;

  // Global Mouse Cursor Tracking Logic
  let mouseX = 0, mouseY = 0;
  let targetMouseX = 0, targetMouseY = 0;

  window.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ==========================================
  // 1. HERO: PREMIUM HOLOGRAPHIC HYPER-CORE
  // ==========================================
  const heroGroup = new THREE.Group();
  heroGroup.position.set(3.2, 0, 0);

  // Outer Glowing Particle Swarm
  const particleGeo = new THREE.BufferGeometry();
  const particleCount = 200;
  const posArray = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 6;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  const particleMat = new THREE.PointsMaterial({ size: 0.04, color: 0x00f2fe, transparent: true, opacity: 0.8 });
  const particles = new THREE.Points(particleGeo, particleMat);
  heroGroup.add(particles);

  // Central Icosahedron Core
  const icoGeo = new THREE.IcosahedronGeometry(1.2, 1);
  const icoMat = new THREE.MeshStandardMaterial({ 
    color: 0x030712, 
    wireframe: true, 
    emissive: 0x00f2fe, 
    emissiveIntensity: 0.6,
    metalness: 0.9,
    roughness: 0.1
  });
  const coreIco = new THREE.Mesh(icoGeo, icoMat);
  heroGroup.add(coreIco);

  // Inner Core Sphere
  const innerGeo = new THREE.SphereGeometry(0.7, 32, 32);
  const innerMat = new THREE.MeshStandardMaterial({ color: 0x7000ff, emissive: 0x7000ff, emissiveIntensity: 0.8, roughness: 0.2 });
  const innerCore = new THREE.Mesh(innerGeo, innerMat);
  heroGroup.add(innerCore);

  // Torus Rings
  const ringGeo = new THREE.TorusGeometry(2.2, 0.03, 16, 100);
  const ringMat = new THREE.MeshStandardMaterial({ color: 0x00f2fe, emissive: 0x00f2fe, emissiveIntensity: 0.5 });
  const ring1 = new THREE.Mesh(ringGeo, ringMat);
  ring1.rotation.x = Math.PI / 3;
  heroGroup.add(ring1);

  const ring2 = new THREE.Mesh(ringGeo, ringMat);
  ring2.rotation.x = -Math.PI / 3;
  heroGroup.add(ring2);

  scene.add(heroGroup);

  // ==========================================
  // 2. COURSES: CURVED CURVED MONITOR & CODE
  // ==========================================
  const coursesGroup = new THREE.Group();
  coursesGroup.position.set(3.2, -Y_OFFSET, 0);

  const monitorGeo = new THREE.BoxGeometry(3.6, 2.2, 0.15);
  const monitorMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.1 });
  const monitor = new THREE.Mesh(monitorGeo, monitorMat);
  coursesGroup.add(monitor);

  const codeCanvas = document.createElement('canvas');
  codeCanvas.width = 512;
  codeCanvas.height = 320;
  const ctx = codeCanvas.getContext('2d');
  const codeTexture = new THREE.CanvasTexture(codeCanvas);

  const screenGeo = new THREE.PlaneGeometry(3.4, 2.0);
  const screenMat = new THREE.MeshBasicMaterial({ map: codeTexture });
  const screenMesh = new THREE.Mesh(screenGeo, screenMat);
  screenMesh.position.z = 0.09;
  coursesGroup.add(screenMesh);

  const matrixCols = Array(32).fill(0);
  function updateMatrixCode() {
    ctx.fillStyle = 'rgba(3, 7, 18, 0.2)';
    ctx.fillRect(0, 0, codeCanvas.width, codeCanvas.height);
    ctx.fillStyle = '#00f2fe';
    ctx.font = 'bold 15px monospace';

    matrixCols.forEach((y, i) => {
      const char = String.fromCharCode(0x30A0 + Math.random() * 96);
      ctx.fillText(char, i * 16, y);
      if (y > 320 + Math.random() * 10000) matrixCols[i] = 0;
      else matrixCols[i] = y + 16;
    });
    codeTexture.needsUpdate = true;
  }
  scene.add(coursesGroup);

  // ==========================================
  // 3. DASHBOARD: 3D GRAPH WITH LINE NODE
  // ==========================================
  const dashboardGroup = new THREE.Group();
  dashboardGroup.position.set(3.2, -Y_OFFSET * 2, 0);

  const bars = [];
  const barCount = 6;
  const linePoints = [];

  for (let i = 0; i < barCount; i++) {
    const barGeo = new THREE.BoxGeometry(0.35, 1, 0.35);
    const barMat = new THREE.MeshStandardMaterial({ 
      color: 0x00f2fe, 
      roughness: 0.2, 
      metalness: 0.8,
      emissive: 0x00f2fe,
      emissiveIntensity: 0.2
    });
    const bar = new THREE.Mesh(barGeo, barMat);
    bar.position.x = (i - barCount / 2) * 0.6;
    dashboardGroup.add(bar);
    bars.push(bar);

    linePoints.push(new THREE.Vector3(bar.position.x, 1, 0));
  }

  const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
  const lineMat = new THREE.LineBasicMaterial({ color: 0x7000ff, linewidth: 3 });
  const lineGraph = new THREE.Line(lineGeo, lineMat);
  dashboardGroup.add(lineGraph);

  scene.add(dashboardGroup);

  // ==========================================
  // 4. STORIES: 3D CONSTELLATION NODE NETWORK
  // ==========================================
  const storiesGroup = new THREE.Group();
  storiesGroup.position.set(3.2, -Y_OFFSET * 3, 0);

  const nodeCount = 30;
  const nodeGeo = new THREE.SphereGeometry(0.08, 16, 16);
  const nodeMat = new THREE.MeshStandardMaterial({ color: 0x00f2fe, emissive: 0x00f2fe, emissiveIntensity: 0.8 });
  const nodes = [];

  for (let i = 0; i < nodeCount; i++) {
    const node = new THREE.Mesh(nodeGeo, nodeMat);
    node.position.set((Math.random() - 0.5) * 4.5, (Math.random() - 0.5) * 3.5, (Math.random() - 0.5) * 2);
    storiesGroup.add(node);
    nodes.push(node);
  }

  const networkGeo = new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(2.2, 2));
  const networkMat = new THREE.LineBasicMaterial({ color: 0x7000ff, transparent: true, opacity: 0.4 });
  const networkMesh = new THREE.LineSegments(networkGeo, networkMat);
  storiesGroup.add(networkMesh);

  scene.add(storiesGroup);

  // ==========================================
  // 5. ABOUT: CYBER EYE WITH ACTIVE CURSOR TRACKING
  // ==========================================
  const aboutGroup = new THREE.Group();
  aboutGroup.position.set(3.2, -Y_OFFSET * 4, 0);

  const eyeBaseGeo = new THREE.SphereGeometry(1.6, 32, 32);
  const eyeBaseMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.8 });
  const eyeBase = new THREE.Mesh(eyeBaseGeo, eyeBaseMat);
  aboutGroup.add(eyeBase);

  const irisGroup = new THREE.Group();
  irisGroup.position.z = 1.4;

  const outerIrisGeo = new THREE.TorusGeometry(0.6, 0.04, 16, 100);
  const outerIrisMat = new THREE.MeshStandardMaterial({ color: 0x00f2fe, emissive: 0x00f2fe, emissiveIntensity: 0.9 });
  const outerIris = new THREE.Mesh(outerIrisGeo, outerIrisMat);
  irisGroup.add(outerIris);

  const pupilGeo = new THREE.SphereGeometry(0.35, 32, 32);
  const pupilMat = new THREE.MeshStandardMaterial({ color: 0x7000ff, emissive: 0x7000ff, emissiveIntensity: 1.0 });
  const pupil = new THREE.Mesh(pupilGeo, pupilMat);
  irisGroup.add(pupil);

  aboutGroup.add(irisGroup);
  scene.add(aboutGroup);

  // ==========================================
  // 6. CONTACT: METALLIC GLASS CHAT ICON
  // ==========================================
  const contactGroup = new THREE.Group();
  contactGroup.position.set(3.2, -Y_OFFSET * 5, 0);

  const bubbleGeo = new THREE.SphereGeometry(1.3, 32, 32);
  bubbleGeo.scale(1.2, 1.0, 0.7);
  const bubbleMat = new THREE.MeshPhysicalMaterial({ 
    color: 0x00f2fe, 
    metalness: 0.1, 
    roughness: 0.1, 
    transmission: 0.6, 
    thickness: 1.2, 
    emissive: 0x00f2fe,
    emissiveIntensity: 0.3
  });
  const bubble = new THREE.Mesh(bubbleGeo, bubbleMat);
  contactGroup.add(bubble);

  const phoneGeo = new THREE.TorusGeometry(0.4, 0.12, 16, 32, Math.PI * 0.8);
  const phoneMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.9, roughness: 0.1 });
  const phone = new THREE.Mesh(phoneGeo, phoneMat);
  phone.position.z = 0.5;
  contactGroup.add(phone);

  scene.add(contactGroup);

  // ==========================================
  // ANIMATION & CURSOR TRACKING LOOP
  // ==========================================
  let scrollY = 0;
  window.addEventListener('scroll', () => {
    scrollY = window.scrollY / window.innerHeight;
  });

  const clock = new THREE.Clock();

  function animate() {
    const elapsed = clock.getElapsedTime();

    // Lerp smooth mouse movement
    mouseX += (targetMouseX - mouseX) * 0.08;
    mouseY += (targetMouseY - mouseY) * 0.08;

    // Smooth camera scroll transition
    camera.position.y = -scrollY * Y_OFFSET;

    // 1. Hero Dynamic Rotation + Cursor Response
    coreIco.rotation.y = elapsed * 0.4;
    coreIco.rotation.x = elapsed * 0.2;
    innerCore.scale.setScalar(1 + Math.sin(elapsed * 3) * 0.08);
    ring1.rotation.z = elapsed * 0.3;
    ring2.rotation.z = -elapsed * 0.3;
    heroGroup.rotation.y = mouseX * 0.5;
    heroGroup.rotation.x = -mouseY * 0.5;

    // 2. Courses Cursor Rotation & Matrix Screen Update
    updateMatrixCode();
    coursesGroup.rotation.y = mouseX * 0.4;
    coursesGroup.rotation.x = -mouseY * 0.3;

    // 3. Dashboard Real-Time Bars & Cursor Response
    const positions = lineGraph.geometry.attributes.position.array;
    bars.forEach((bar, index) => {
      const h = Math.sin(elapsed * 3 + index) * 0.9 + 1.3;
      bar.scale.y = h;
      bar.position.y = h / 2 - 0.5;
      positions[index * 3 + 1] = h;
    });
    lineGraph.geometry.attributes.position.needsUpdate = true;
    dashboardGroup.rotation.y = mouseX * 0.4;
    dashboardGroup.rotation.x = -mouseY * 0.3;

    // 4. Stories Constellation Motion
    networkMesh.rotation.y = elapsed * 0.2;
    storiesGroup.rotation.y = mouseX * 0.5;
    storiesGroup.rotation.x = -mouseY * 0.4;

    // 5. About Eye Cursor Tracking
    aboutGroup.rotation.y = mouseX * 0.7;
    aboutGroup.rotation.x = -mouseY * 0.5;

    // 6. Contact Chat Floating & Tilt
    contactGroup.position.y = -Y_OFFSET * 5 + Math.sin(elapsed * 2) * 0.15;
    contactGroup.rotation.y = mouseX * 0.6;
    contactGroup.rotation.x = -mouseY * 0.4;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
});
