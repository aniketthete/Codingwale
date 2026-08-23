document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  // Scene, Camera, Renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 7.5);

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  // Lighting System
  const ambientLight = new THREE.AmbientLight(0x0f172a, 2.5);
  scene.add(ambientLight);

  const cyanPoint = new THREE.PointLight(0x00f2fe, 8, 30);
  cyanPoint.position.set(6, 6, 6);
  scene.add(cyanPoint);

  const purplePoint = new THREE.PointLight(0x9d4edd, 8, 30);
  purplePoint.position.set(-6, -6, 4);
  scene.add(purplePoint);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
  dirLight.position.set(0, 10, 10);
  scene.add(dirLight);

  const Y_OFFSET = 12;

  // Global Smooth Mouse Interactions
  let mouseX = 0, mouseY = 0;
  let targetMouseX = 0, targetMouseY = 0;

  window.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Texture Generator for Core CW Logo
  function createCWTexture() {
    const c = document.createElement('canvas');
    c.width = 512; c.height = 512;
    const ctx = c.getContext('2d');
    
    const grad = ctx.createRadialGradient(256, 256, 10, 256, 256, 256);
    grad.addColorStop(0, 'rgba(157, 78, 221, 0.9)');
    grad.addColorStop(0.5, 'rgba(0, 242, 254, 0.6)');
    grad.addColorStop(1, 'rgba(3, 7, 18, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    ctx.strokeStyle = '#00f2fe';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(256, 256, 200, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 160px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = '#00f2fe';
    ctx.shadowBlur = 25;
    ctx.fillText('CW', 256, 256);

    return new THREE.CanvasTexture(c);
  }

  // ==========================================
  // 1. HERO: QUANTUM CORE & GLASS SHARD SWARM
  // ==========================================
  const heroGroup = new THREE.Group();
  heroGroup.position.set(3.2, 0, 0);

  const particleGeo = new THREE.BufferGeometry();
  const count = 350;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 7;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({ size: 0.035, color: 0x00f2fe, transparent: true, opacity: 0.85 });
  const heroParticles = new THREE.Points(particleGeo, particleMat);
  heroGroup.add(heroParticles);

  const shardGroup = new THREE.Group();
  const shardMat = new THREE.MeshPhysicalMaterial({
    color: 0x00f2fe, metalness: 0.1, roughness: 0.1, transmission: 0.9, thickness: 0.5, transparent: true, opacity: 0.7
  });
  const shards = [];
  for (let i = 0; i < 8; i++) {
    const shardGeo = new THREE.ConeGeometry(0.2, 0.8, 3);
    const shard = new THREE.Mesh(shardGeo, shardMat);
    const angle = (i / 8) * Math.PI * 2;
    shard.position.set(Math.cos(angle) * 2.2, (Math.random() - 0.5) * 1.5, Math.sin(angle) * 2.2);
    shard.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    shardGroup.add(shard);
    shards.push({ mesh: shard, angle: angle, speed: 0.008 + Math.random() * 0.005 });
  }
  heroGroup.add(shardGroup);

  const cwMat = new THREE.MeshBasicMaterial({ map: createCWTexture(), transparent: true });
  const cwCore = new THREE.Mesh(new THREE.SphereGeometry(0.85, 32, 32), cwMat);
  heroGroup.add(cwCore);

  const cageGeo = new THREE.IcosahedronGeometry(1.4, 1);
  const cageMat = new THREE.MeshStandardMaterial({ color: 0x00f2fe, wireframe: true, emissive: 0x00f2fe, emissiveIntensity: 0.8 });
  const cage = new THREE.Mesh(cageGeo, cageMat);
  heroGroup.add(cage);

  const ringMat = new THREE.MeshPhysicalMaterial({ color: 0x9d4edd, metalness: 0.8, roughness: 0.2, clearcoat: 1.0 });
  const gyroRing1 = new THREE.Mesh(new THREE.TorusGeometry(2.0, 0.03, 16, 100), ringMat);
  gyroRing1.rotation.x = Math.PI / 3;
  heroGroup.add(gyroRing1);

  const gyroRing2 = new THREE.Mesh(new THREE.TorusGeometry(2.3, 0.02, 16, 100), ringMat);
  gyroRing2.rotation.y = Math.PI / 4;
  heroGroup.add(gyroRing2);

  scene.add(heroGroup);

  // ==========================================
  // 2. COURSES: CYBER TERMINAL & STREAMING CODE
  // ==========================================
  const coursesGroup = new THREE.Group();
  coursesGroup.position.set(3.2, -Y_OFFSET, 0);

  const monitorFrame = new THREE.Mesh(
    new THREE.BoxGeometry(3.8, 2.3, 0.2),
    new THREE.MeshStandardMaterial({ color: 0x090d16, metalness: 0.95, roughness: 0.15 })
  );
  coursesGroup.add(monitorFrame);

  const edgeGlow = new THREE.Mesh(
    new THREE.BoxGeometry(3.86, 2.36, 0.05),
    new THREE.MeshBasicMaterial({ color: 0x00f2fe, wireframe: true })
  );
  edgeGlow.position.z = -0.05;
  coursesGroup.add(edgeGlow);

  const codeCanvas = document.createElement('canvas');
  codeCanvas.width = 1024; codeCanvas.height = 640;
  const codeCtx = codeCanvas.getContext('2d');
  const codeTex = new THREE.CanvasTexture(codeCanvas);

  const screenMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(3.6, 2.1),
    new THREE.MeshBasicMaterial({ map: codeTex })
  );
  screenMesh.position.z = 0.11;
  coursesGroup.add(screenMesh);

  const matrixCols = Array(64).fill(0);
  function drawCodeStream() {
    codeCtx.fillStyle = 'rgba(3, 7, 18, 0.25)';
    codeCtx.fillRect(0, 0, codeCanvas.width, codeCanvas.height);
    codeCtx.fillStyle = '#00f2fe';
    codeCtx.font = '600 20px "JetBrains Mono", monospace';

    matrixCols.forEach((y, i) => {
      const char = String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96));
      codeCtx.fillText(char, i * 16, y);
      if (y > 640 + Math.random() * 10000) matrixCols[i] = 0;
      else matrixCols[i] = y + 20;
    });
    codeTex.needsUpdate = true;
  }

  scene.add(coursesGroup);

  // ==========================================
  // 3. DASHBOARD: 3D GLASS DATA VISUALIZER
  // ==========================================
  const dashboardGroup = new THREE.Group();
  dashboardGroup.position.set(3.2, -Y_OFFSET * 2, 0);

  const glassBars = [];
  const barCount = 7;
  const barMat = new THREE.MeshPhysicalMaterial({
    color: 0x00f2fe, metalness: 0.2, roughness: 0.1, transmission: 0.8, thickness: 0.8, emissive: 0x00f2fe, emissiveIntensity: 0.3
  });

  const chartPoints = [];
  for (let i = 0; i < barCount; i++) {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.32, 1, 0.32), barMat);
    bar.position.x = (i - barCount / 2) * 0.55;
    dashboardGroup.add(bar);
    glassBars.push(bar);
    chartPoints.push(new THREE.Vector3(bar.position.x, 1, 0));
  }

  const chartLineGeo = new THREE.BufferGeometry().setFromPoints(chartPoints);
  const chartLineMat = new THREE.LineBasicMaterial({ color: 0x9d4edd, linewidth: 4 });
  const chartLine = new THREE.Line(chartLineGeo, chartLineMat);
  dashboardGroup.add(chartLine);

  scene.add(dashboardGroup);

  // ==========================================
  // 4. STORIES: NEURAL CONSTELLATION MESH
  // ==========================================
  const storiesGroup = new THREE.Group();
  storiesGroup.position.set(3.2, -Y_OFFSET * 3, 0);

  const netCount = 40;
  const netGeo = new THREE.BufferGeometry();
  const netPositions = new Float32Array(netCount * 3);

  for (let i = 0; i < netCount; i++) {
    netPositions[i * 3] = (Math.random() - 0.5) * 5;
    netPositions[i * 3 + 1] = (Math.random() - 0.5) * 4;
    netPositions[i * 3 + 2] = (Math.random() - 0.5) * 2;
  }
  netGeo.setAttribute('position', new THREE.BufferAttribute(netPositions, 3));

  const netPoints = new THREE.Points(
    netGeo,
    new THREE.PointsMaterial({ size: 0.08, color: 0x00f2fe, transparent: true, opacity: 0.9 })
  );
  storiesGroup.add(netPoints);

  const netWireMesh = new THREE.LineSegments(
    new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(2.3, 2)),
    new THREE.LineBasicMaterial({ color: 0x9d4edd, transparent: true, opacity: 0.35 })
  );
  storiesGroup.add(netWireMesh);

  scene.add(storiesGroup);

  // ==========================================
  // 5. ABOUT: BIOMETRIC CYBER EYE ASSEMBLY
  // ==========================================
  const aboutGroup = new THREE.Group();
  aboutGroup.position.set(3.2, -Y_OFFSET * 4, 0);

  const eyeCasing = new THREE.Mesh(
    new THREE.SphereGeometry(1.6, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0x090d16, metalness: 0.9, roughness: 0.2 })
  );
  aboutGroup.add(eyeCasing);

  const irisGroup = new THREE.Group();
  irisGroup.position.z = 1.35;

  const apertureRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.65, 0.05, 16, 100),
    new THREE.MeshStandardMaterial({ color: 0x00f2fe, emissive: 0x00f2fe, emissiveIntensity: 1.0 })
  );
  irisGroup.add(apertureRing);

  const glowingPupil = new THREE.Mesh(
    new THREE.SphereGeometry(0.38, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0x9d4edd })
  );
  irisGroup.add(glowingPupil);

  aboutGroup.add(irisGroup);
  scene.add(aboutGroup);

  // ==========================================
  // 6. CONTACT: GLASS HOLOGRAPHIC COMMUNICATOR
  // ==========================================
  const contactGroup = new THREE.Group();
  contactGroup.position.set(3.2, -Y_OFFSET * 5, 0);

  const commOrb = new THREE.Mesh(
    new THREE.SphereGeometry(1.2, 32, 32),
    new THREE.MeshPhysicalMaterial({
      color: 0x00f2fe, metalness: 0.1, roughness: 0.05, transmission: 0.9, thickness: 1.5, emissive: 0x00f2fe, emissiveIntensity: 0.2
    })
  );
  contactGroup.add(commOrb);

  const signalRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.8, 0.02, 16, 100),
    new THREE.MeshBasicMaterial({ color: 0x00f2fe, transparent: true, opacity: 0.7 })
  );
  signalRing.rotation.x = Math.PI / 2.5;
  contactGroup.add(signalRing);

  const innerSymbol = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.5, 0),
    new THREE.MeshStandardMaterial({ color: 0x9d4edd, emissive: 0x9d4edd, emissiveIntensity: 1.0, wireframe: true })
  );
  contactGroup.add(innerSymbol);

  scene.add(contactGroup);

  // ==========================================
  // ANIMATION LOOP
  // ==========================================
  let scrollY = 0;
  window.addEventListener('scroll', () => {
    scrollY = window.scrollY / window.innerHeight;
  });

  const clock = new THREE.Clock();

  function renderLoop() {
    const elapsed = clock.getElapsedTime();

    mouseX += (targetMouseX - mouseX) * 0.06;
    mouseY += (targetMouseY - mouseY) * 0.06;

    camera.position.y = -scrollY * Y_OFFSET;

    // Hero
    cwCore.rotation.y = elapsed * 0.4;
    cage.rotation.y = -elapsed * 0.2;
    cage.rotation.x = elapsed * 0.1;
    gyroRing1.rotation.z = elapsed * 0.3;
    gyroRing2.rotation.z = -elapsed * 0.2;
    shards.forEach((s) => {
      s.angle += s.speed;
      s.mesh.position.x = Math.cos(s.angle) * 2.2;
      s.mesh.position.z = Math.sin(s.angle) * 2.2;
      s.mesh.rotation.x += 0.01;
    });
    heroGroup.rotation.y = mouseX * 0.4;
    heroGroup.rotation.x = -mouseY * 0.3;

    // Courses
    drawCodeStream();
    coursesGroup.rotation.y = mouseX * 0.35;
    coursesGroup.rotation.x = -mouseY * 0.25;

    // Dashboard
    const chartLinePos = chartLine.geometry.attributes.position.array;
    glassBars.forEach((bar, index) => {
      const h = Math.sin(elapsed * 2.5 + index) * 0.85 + 1.25;
      bar.scale.y = h;
      bar.position.y = h / 2 - 0.5;
      chartLinePos[index * 3 + 1] = h;
    });
    chartLine.geometry.attributes.position.needsUpdate = true;
    dashboardGroup.rotation.y = mouseX * 0.35;
    dashboardGroup.rotation.x = -mouseY * 0.25;

    // Stories
    netWireMesh.rotation.y = elapsed * 0.15;
    storiesGroup.rotation.y = mouseX * 0.4;
    storiesGroup.rotation.x = -mouseY * 0.3;

    // About Eye Tracking
    aboutGroup.rotation.y = mouseX * 0.65;
    aboutGroup.rotation.x = -mouseY * 0.45;
    apertureRing.scale.setScalar(1 + Math.sin(elapsed * 2) * 0.05);

    // Contact
    commOrb.position.y = Math.sin(elapsed * 1.8) * 0.12;
    innerSymbol.rotation.y = elapsed * 0.8;
    signalRing.rotation.z = elapsed * 0.4;
    contactGroup.rotation.y = mouseX * 0.4;
    contactGroup.rotation.x = -mouseY * 0.3;

    renderer.render(scene, camera);
    requestAnimationFrame(renderLoop);
  }

  renderLoop();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
});
