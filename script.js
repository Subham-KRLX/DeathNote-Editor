const themeToggle = document.getElementById('theme-toggle');
const codeInput = document.getElementById('code-input');
const codeOutput = document.querySelector('#code-output code');
const terminalOutput = document.getElementById('terminal-output');
const commandInput = document.getElementById('command-input');
const runButton = document.getElementById('run-button');
const files = document.querySelectorAll('.file');
const container3d = document.getElementById('3d-cube-container');
const logo3d = document.getElementById('3d-logo');

function init3DScene() {
    if (typeof THREE === 'undefined') {
        console.error('Three.js not loaded');
        container3d.innerHTML = '<div class="error-message">3D visualization requires Three.js</div>';
        return;
    }

    const scene = new THREE.Scene();
    const loader = new THREE.TextureLoader();

    const backgroundTextures = [
        'https://wallpaperaccess.com/full/317501.jpg',
        'https://wallpaperaccess.com/full/1234567.jpg',
        'https://wallpaperaccess.com/full/2345678.jpg',
        'https://wallpaperaccess.com/full/3456789.jpg'
    ];

    const cubeTextures = [
        'https://i.imgur.com/3ZQ3ZQZ.jpg',
        'https://i.imgur.com/abcdefg.jpg',
        'https://i.imgur.com/hijklmn.jpg',
        'https://i.imgur.com/opqrstu.jpg'
    ];

    let currentIndex = 0;

    let animeTexture = loader.load(backgroundTextures[currentIndex]);
    scene.background = animeTexture;

    const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    let texture = loader.load(cubeTextures[currentIndex]);
    let material = new THREE.MeshPhongMaterial({
        map: texture,
        shininess: 50,
        transparent: true,
        opacity: 0.95,
    });

    let cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const camera = new THREE.PerspectiveCamera(60, container3d.offsetWidth / container3d.offsetHeight, 0.1, 1000);
    camera.position.z = 3.5;
    camera.position.y = 1;

    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container3d.offsetWidth, container3d.offsetHeight);
    renderer.shadowMap.enabled = true;
    container3d.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0x550000, 2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xff2200, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    function updateTextures() {
        currentIndex = (currentIndex + 1) % backgroundTextures.length;
        animeTexture = loader.load(backgroundTextures[currentIndex]);
        scene.background = animeTexture;

        texture = loader.load(cubeTextures[currentIndex]);
        cube.material.map = texture;
        cube.material.needsUpdate = true;
    }

    function animate() {
        requestAnimationFrame(animate);

        cube.rotation.x += 0.006;
        cube.rotation.y += 0.008;
        cube.rotation.z += 0.004;

        const scale = 1 + Math.sin(Date.now() * 0.0012) * 0.06;
        cube.scale.set(scale, scale, scale);

        renderer.render(scene, camera);
    }

    animate();

    setInterval(updateTextures, 15000);

    window.addEventListener('resize', () => {
        camera.aspect = container3d.offsetWidth / container3d.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container3d.offsetWidth, container3d.offsetHeight);
    });
}

function initLogo3D() {
    if (typeof THREE === 'undefined') {
        logo3d.innerHTML = '</>';
        return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        alpha: true,
        antialias: true
    });
    
    renderer.setSize(logo3d.offsetWidth, logo3d.offsetHeight);
    logo3d.appendChild(renderer.domElement);
    
    const loader = new THREE.TextureLoader();
    const texture = loader.load('https://i.imgur.com/7Q9Q9Q9.png');
    
    const geometry = new THREE.BoxGeometry(0.4, 0.8, 0.2);
    const material = new THREE.MeshBasicMaterial({ 
        map: texture,
        transparent: true,
        opacity: 0.95
    });
    
    const logoMesh = new THREE.Mesh(geometry, material);
    scene.add(logoMesh);
    
    camera.position.z = 2;
    
    function animate() {
        requestAnimationFrame(animate);
        
        logoMesh.rotation.y += 0.02;
        logoMesh.rotation.x += 0.01;
        
        renderer.render(scene, camera);
    }
    
    animate();
}

function setupThemeToggle() {
    const updateTheme = (isDark) => {
        document.body.classList.toggle('dark-mode', isDark);
        localStorage.setItem('darkMode', isDark);
        themeToggle.querySelector('.theme-icon').textContent = isDark ? '☯️' : '☯️';
        themeToggle.querySelector('.theme-text').textContent = isDark ? 'Light' : 'Dark';
    };

    themeToggle.addEventListener('click', () => {
        const isDark = !document.body.classList.contains('dark-mode');
        updateTheme(isDark);
    });

    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme !== null) {
        updateTheme(savedTheme === 'true');
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        updateTheme(true);
    }
}

function setupFileExplorer() {
    files.forEach(file => {
        file.addEventListener('click', () => {
            files.forEach(f => f.classList.remove('active'));
            file.classList.add('active');
            
            const fileName = file.getAttribute('data-file');
            document.querySelector('.file-name').textContent = fileName;
            
            codeInput.style.opacity = '0';
            setTimeout(() => {
                switch(fileName) {
                    case 'script.js':
                        codeInput.value = `function helloWorld() {
    console.log("Hello, world!");
}

helloWorld();

`;
                        break;
                    case 'style.css':
                        codeInput.value = `:root {
    --primary: #4f46e5;
    --secondary: #10b981;
    --accent: #f59e0b;
}

body {
    margin: 0;
    font-family: 'Inter', sans-serif;
    background-color: #f0f4f8;
}

/* Add your custom styles here */
`;
                        break;
                    case 'index.html':
                        codeInput.value = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>3D Code Editor Pro</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <script src="script.js"></script>
</body>
</html>
`;
                        break;
                }
                codeInput.style.opacity = '1';
                updateSyntaxHighlighting();
            }, 200);
        });
    });
}

function setupCodeExecution() {
    function runCode() {
        const code = codeInput.value;
        terminalOutput.innerHTML += `<span class="command">$ Running code...</span><br>`;
        
        try {
            const originalConsole = {
                log: console.log,
                error: console.error,
                warn: console.warn
            };
            
            let output = '';
            
            console.log = function(...args) {
                output += args.map(arg => 
                    typeof arg === 'object' ? JSON.stringify(arg) : arg
                ).join(' ') + '\n';
                originalConsole.log.apply(console, args);
            };
            
            console.error = function(...args) {
                output += `<span class="error">${args.join(' ')}</span>\n`;
                originalConsole.error.apply(console, args);
            };
            
            console.warn = function(...args) {
                output += `<span class="warning">${args.join(' ')}</span>\n`;
                originalConsole.warn.apply(console, args);
            };
            
            try {
                eval(code);
            } catch (e) {
                output += `<span class="error">Error: ${e.message}</span>\n`;
            }
            
            console.log = originalConsole.log;
            console.error = originalConsole.error;
            console.warn = originalConsole.warn;
            
            if (output.trim()) {
                terminalOutput.innerHTML += output.replace(/\n/g, '<br>');
            } else {
                terminalOutput.innerHTML += `<span class="success">Code executed successfully (no output)</span><br>`;
            }
        } catch (error) {
            terminalOutput.innerHTML += `<span class="error">Fatal Error: ${error.message}</span><br>`;
        }
        
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    runButton.addEventListener('click', runCode);

    commandInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const command = commandInput.value.trim();
            terminalOutput.innerHTML += `<span class="command">$ ${command}</span><br>`;
            
            if (command === 'clear') {
                terminalOutput.innerHTML = '';
            } else if (command === 'run') {
                runCode();
            } else if (command === 'help') {
                terminalOutput.innerHTML += `Available commands:<br>
                - clear: Clear terminal<br>
                - run: Execute current code<br>
                - help: Show this help<br><br>`;
            } else {
                terminalOutput.innerHTML += `<span class="error">Command not found: ${command}</span><br>`;
            }
            
            commandInput.value = '';
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
        }
    });
}

function setupSyntaxHighlighting() {
    function updateSyntaxHighlighting() {
        if (typeof Prism === 'undefined') {
            console.error('Prism.js not loaded');
            return;
        }
        
        const fileName = document.querySelector('.file.active')?.getAttribute('data-file');
        let language = 'javascript';
        
        if (fileName === 'style.css') {
            language = 'css';
        } else if (fileName === 'index.html') {
            language = 'html';
        }
        
        codeOutput.className = `language-${language}`;
        codeOutput.innerHTML = Prism.highlight(
            codeInput.value,
            Prism.languages[language],
            language
        );
    }

    codeInput.addEventListener('input', updateSyntaxHighlighting);
}

document.addEventListener('DOMContentLoaded', () => {
    initLogo3D();
    init3DScene();
    setupThemeToggle();
    setupFileExplorer();
    setupCodeExecution();
    setupSyntaxHighlighting();
    
    if (files.length > 0) {
        files[0].click();
    }
    
    codeInput.focus();
    
    setTimeout(() => {
        terminalOutput.innerHTML = `<span class="success">Welcome to 3D Code Editor Pro!</span><br>
        <span>Type 'help' for available commands</span><br><br>`;
    }, 500);
});

window.addEventListener('error', (e) => {
    if (e.message.includes('THREE') || e.message.includes('Three')) {
        container3d.innerHTML = '<div class="error-message">3D visualization disabled - Three.js error</div>';
        container3d.style.display = 'flex';
        container3d.style.justifyContent = 'center';
        container3d.style.alignItems = 'center';
        container3d.style.color = 'var(--error)';
    }
    
    if (e.message.includes('Prism')) {
        const editorHeader = document.querySelector('.editor-header');
        if (editorHeader) {
            editorHeader.insertAdjacentHTML('afterend', 
                '<div class="error-message">Syntax highlighting disabled - Prism.js error</div>');
        }
    }
});
