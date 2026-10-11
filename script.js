const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0x00ffff, 2.5, 50);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

// 3D Rotating Cube
const geometry = new THREE.BoxGeometry(2.5, 2.5, 2.5);
const material = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.3,
    metalness: 0.8,
    wireframe: false
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Lightning Bolt Setup
const lightningMaterial = new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 3 });
let lightningLine = null;

function createLightning() {
    if (lightningLine) scene.remove(lightningLine);

    const points = [];
    let currentX = (Math.random() - 0.5) * 2;
    let currentY = 10; // Start from top sky
    let currentZ = (Math.random() - 0.5) * 2;

    points.push(new THREE.Vector3(currentX, currentY, currentZ));

    // Generate zigzag path down to the cube
    while (currentY > 1.25) {
        currentY -= 1.5 + Math.random() * 1.5;
        currentX += (Math.random() - 0.5) * 1.5;
        currentZ += (Math.random() - 0.5) * 1.5;
        points.push(new THREE.Vector3(currentX, currentY, currentZ));
    }
    // Strike the cube directly
    points.push(new THREE.Vector3(cube.position.x, cube.position.y + 1.25, cube.position.z));

    const lightningGeometry = new THREE.BufferGeometry().setFromPoints(points);
    lightningLine = new THREE.Line(lightningGeometry, lightningMaterial);
    scene.add(lightningLine);

    // Bright flash effect on light
    pointLight.color.setHex(0xffffff);
    pointLight.intensity = 6;

    setTimeout(() => {
        if (lightningLine) {
            scene.remove(lightningLine);
            lightningLine = null;
        }
        pointLight.color.setHex(0x00ffff);
        pointLight.intensity = 2.5;
    }, 100);
}

// Trigger lightning every 3 seconds
setInterval(() => {
    createLightning();
}, 3000);

camera.position.z = 6;

// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate cube smoothly
    cube.rotation.x += 0.005;
    cube.rotation.y += 0.008;

    renderer.render(scene, camera);
}
animate();

// Responsive Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
