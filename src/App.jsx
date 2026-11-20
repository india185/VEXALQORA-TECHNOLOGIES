import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Users,
  Briefcase,
  ShoppingBag,
  MessageSquare,
  CreditCard,
  Settings,
  BarChart3,
  Globe,
  LogOut,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Eye,
  EyeOff,
  Menu,
  X,
  ArrowRight,
  Cpu,
  Layers,
  Code2,
  LayoutDashboard,
  User,
  FileText,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  Palette,
  Activity,
  Zap,
  Cloud
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';

// ============================================================================
// 1. REAL FIREBASE INITIALIZATION (ENV + FALLBACK)
// ============================================================================
const envFirebaseConfig = {
  apiKey: import.meta.env?.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env?.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env?.VITE_FIREBASE_APP_ID
};

const hasRealEnvConfig = Boolean(
  envFirebaseConfig.apiKey &&
    envFirebaseConfig.projectId &&
    !String(envFirebaseConfig.apiKey).includes('DemoKey')
);

const firebaseConfig =
  typeof window.__firebase_config !== 'undefined'
    ? JSON.parse(window.__firebase_config)
    : hasRealEnvConfig
    ? envFirebaseConfig
    : {
        apiKey: 'AIzaSyDemoKeyForVexalqoraTech3DApp',
        authDomain: 'vexalqora-tech.firebaseapp.com',
        projectId: 'vexalqora-tech',
        storageBucket: 'vexalqora-tech.appspot.com',
        messagingSenderId: '100000000000',
        appId: '1:100000000000:web:vexalqora3dapp'
      };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId =
  typeof window.__app_id !== 'undefined'
    ? window.__app_id
    : import.meta.env?.VITE_APP_ID ||
      firebaseConfig.appId ||
      'vexalqora-technologies-3d-v4';

// Secret Admin Entry Config (Sirf aapko pata hoga)
const ADMIN_SECRET_HASH = '#vx-karna-1857';

// ============================================================================
// 2. CONFIGURATION & DATA CONSTANTS
// ============================================================================
const DEFAULT_SITE_CONTENT = {
  heroBadge: 'VEXALQORA TECHNOLOGIES • 3D DIGITAL & INDUSTRIAL SYSTEMS',
  heroTitle: 'Real-Time Three.js Visualization, Live IoT Sensor Overlays & High-Growth Web Systems',
  heroSubtitle:
    'Real-time Three.js industrial visualization, live IoT sensor overlays, and immersive customer portals — alongside high-converting business websites, custom web applications, and Meta Ads growth campaigns delivered in 1–2 days.',
  aboutMission:
    'At VEXALQORA TECHNOLOGIES, we unite interactive 3D engineering, live IoT telemetry, custom web applications, and performance-driven Meta Ads marketing to accelerate modern businesses.'
};

const INITIAL_SERVICES = [
  {
    title: 'Website Development',
    category: 'Web Engineering',
    description:
      'Modern, responsive and premium business websites equipped with real-time Three.js industrial visualization and live IoT sensor overlays.',
    deliveryTime: '1–2 Days Rapid Delivery',
    featured: true
  },
  {
    title: 'Web Application Development',
    category: 'SaaS & Dashboards',
    description:
      'Custom dashboards, enterprise SaaS platforms, and business management systems with secure role-based customer portals.',
    deliveryTime: '1–2 Days Rapid Delivery',
    featured: true
  },
  {
    title: 'Digital Marketing & Promotion',
    category: 'Growth & Meta Ads',
    description:
      'Strategic Meta Ads management, high-converting campaign funnels, target audience scaling, and comprehensive lead generation systems.',
    deliveryTime: '1–2 Days Rapid Delivery',
    featured: true
  }
];

const THEME_OPTIONS = [
  { id: 'cybernetic', label: 'Cybernetic Core', desc: '3D Icosahedron & Gyro Rings', swatch: 'from-cyan-400 to-blue-600' },
  { id: 'quantum', label: 'Quantum Helix', desc: '3D DNA Torus Knot & Orbitals', swatch: 'from-violet-400 to-fuchsia-600' },
  { id: 'neonGrid', label: 'Neon Matrix', desc: 'Infinite 3D Wave Terrain & Cubes', swatch: 'from-emerald-400 to-teal-600' },
  { id: 'holographic', label: 'Holographic Globe', desc: '3D IoT Sensor Network Sphere', swatch: 'from-sky-400 to-indigo-600' },
  { id: 'nebula', label: 'Solar Vortex', desc: '3D Spiral Galaxy Particle Storm', swatch: 'from-amber-400 to-rose-600' },
  { id: 'minimalist', label: 'Architectural Monolith', desc: 'Floating 3D Obsidian Pillars', swatch: 'from-slate-300 to-cyan-500' }
];

// ============================================================================
// 4. INTERACTIVE 3D WEBGL SCENE COMPONENT WITH 6 THEME MODES
// ============================================================================
const ThreeBackgroundScene = ({ role, bgTheme }) => {
  const containerRef = useRef(null);
  const roleRef = useRef(role);
  const themeRef = useRef(bgTheme);

  useEffect(() => {
    roleRef.current = role;
  }, [role]);

  useEffect(() => {
    themeRef.current = bgTheme;
  }, [bgTheme]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId;
    let renderer;
    let scene;
    let camera;
    let mainGroup;
    let particles;
    let gridHelper;
    let mouseX = 0;
    let mouseY = 0;
    let currentBuiltTheme = null;

    const initThree = () => {
      const THREE = window.THREE;
      if (!THREE || !container) return;

      scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x020617, 0.032);

      camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.set(0, 1.5, 16);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.innerHTML = '';
      container.appendChild(renderer.domElement);

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
      scene.add(ambientLight);

      const pointLight1 = new THREE.PointLight(0x06b6d4, 2.5, 60);
      pointLight1.position.set(10, 10, 12);
      scene.add(pointLight1);

      const pointLight2 = new THREE.PointLight(0x8b5cf6, 2.2, 60);
      pointLight2.position.set(-10, -8, 10);
      scene.add(pointLight2);

      const getPalette = (r, t) => {
        if (r === 'admin') {
          return { primary: 0xf43f5e, secondary: 0xf59e0b, accent: 0xfb7185 };
        }
        if (r === 'customer') {
          return { primary: 0x10b981, secondary: 0x06b6d4, accent: 0x34d399 };
        }
        switch (t) {
          case 'quantum':
            return { primary: 0xa855f7, secondary: 0xec4899, accent: 0x38bdf8 };
          case 'neonGrid':
            return { primary: 0x10b981, secondary: 0x22d3ee, accent: 0xa3e635 };
          case 'holographic':
            return { primary: 0x38bdf8, secondary: 0x6366f1, accent: 0x2dd4bf };
          case 'nebula':
            return { primary: 0xf59e0b, secondary: 0xf43f5e, accent: 0xc084fc };
          case 'minimalist':
            return { primary: 0x94a3b8, secondary: 0x38bdf8, accent: 0xf8fafc };
          case 'cybernetic':
          default:
            return { primary: 0x06b6d4, secondary: 0x6366f1, accent: 0x22d3ee };
        }
      };

      const buildThemeScene = (t) => {
        if (mainGroup) scene.remove(mainGroup);
        if (particles) scene.remove(particles);
        if (gridHelper) scene.remove(gridHelper);

        const pal = getPalette(roleRef.current, t);
        mainGroup = new THREE.Group();
        mainGroup.position.set(4.2, 0.4, -2);
        scene.add(mainGroup);

        if (t === 'cybernetic') {
          const coreGeo = new THREE.IcosahedronGeometry(3.2, 1);
          const coreMat = new THREE.MeshStandardMaterial({
            color: pal.primary,
            wireframe: true,
            emissive: pal.primary,
            emissiveIntensity: 0.45
          });
          mainGroup.add(new THREE.Mesh(coreGeo, coreMat));

          const innerGeo = new THREE.OctahedronGeometry(1.7, 0);
          const innerMat = new THREE.MeshStandardMaterial({
            color: pal.secondary,
            metalness: 0.85,
            roughness: 0.2,
            emissive: pal.secondary,
            emissiveIntensity: 0.35
          });
          mainGroup.add(new THREE.Mesh(innerGeo, innerMat));

          const ring1 = new THREE.Mesh(
            new THREE.TorusGeometry(4.8, 0.04, 16, 100),
            new THREE.MeshBasicMaterial({ color: pal.primary, transparent: true, opacity: 0.65 })
          );
          ring1.rotation.x = Math.PI / 3;
          mainGroup.add(ring1);

          const ring2 = new THREE.Mesh(
            new THREE.TorusGeometry(5.8, 0.03, 16, 100),
            new THREE.MeshBasicMaterial({ color: pal.secondary, transparent: true, opacity: 0.45 })
          );
          ring2.rotation.y = Math.PI / 4;
          mainGroup.add(ring2);
        } else if (t === 'quantum') {
          const knotGeo = new THREE.TorusKnotGeometry(2.5, 0.55, 120, 16);
          const knotMat = new THREE.MeshStandardMaterial({
            color: pal.primary,
            wireframe: true,
            emissive: pal.primary,
            emissiveIntensity: 0.5
          });
          mainGroup.add(new THREE.Mesh(knotGeo, knotMat));

          for (let i = 0; i < 16; i++) {
            const angle = (i / 16) * Math.PI * 2;
            const sphere = new THREE.Mesh(
              new THREE.SphereGeometry(0.24, 12, 12),
              new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? pal.secondary : pal.accent })
            );
            sphere.position.set(Math.cos(angle) * 5.2, Math.sin(angle * 2) * 2.5, Math.sin(angle) * 5.2);
            mainGroup.add(sphere);
          }
        } else if (t === 'neonGrid') {
          for (let i = 0; i < 14; i++) {
            const size = 0.8 + (i % 4) * 0.45;
            const box = new THREE.Mesh(
              new THREE.BoxGeometry(size, size, size),
              new THREE.MeshStandardMaterial({
                color: pal.primary,
                wireframe: i % 2 === 0,
                emissive: pal.secondary,
                emissiveIntensity: 0.4
              })
            );
            const a = (i / 14) * Math.PI * 2;
            box.position.set(Math.cos(a) * 4.5, ((i % 5) - 2) * 1.4, Math.sin(a) * 4.5);
            mainGroup.add(box);
          }
        } else if (t === 'holographic') {
          const globe = new THREE.Mesh(
            new THREE.SphereGeometry(3.6, 24, 24),
            new THREE.MeshBasicMaterial({ color: pal.primary, wireframe: true, transparent: true, opacity: 0.45 })
          );
          mainGroup.add(globe);

          const coreSphere = new THREE.Mesh(
            new THREE.SphereGeometry(2.2, 20, 20),
            new THREE.MeshStandardMaterial({
              color: pal.secondary,
              emissive: pal.secondary,
              emissiveIntensity: 0.3,
              transparent: true,
              opacity: 0.55
            })
          );
          mainGroup.add(coreSphere);

          for (let i = 0; i < 20; i++) {
            const phi = Math.acos(-1 + (2 * i) / 20);
            const theta = Math.sqrt(20 * Math.PI) * phi;
            const pin = new THREE.Mesh(
              new THREE.OctahedronGeometry(0.22, 0),
              new THREE.MeshBasicMaterial({ color: pal.accent })
            );
            pin.position.set(
              4.0 * Math.cos(theta) * Math.sin(phi),
              4.0 * Math.sin(theta) * Math.sin(phi),
              4.0 * Math.cos(phi)
            );
            mainGroup.add(pin);
          }
        } else if (t === 'nebula') {
          const vortexCore = new THREE.Mesh(
            new THREE.DodecahedronGeometry(2.4, 1),
            new THREE.MeshStandardMaterial({
              color: pal.primary,
              wireframe: true,
              emissive: pal.primary,
              emissiveIntensity: 0.6
            })
          );
          mainGroup.add(vortexCore);

          for (let r = 1; r <= 4; r++) {
            const disc = new THREE.Mesh(
              new THREE.TorusGeometry(1.6 + r * 1.1, 0.03, 12, 80),
              new THREE.MeshBasicMaterial({
                color: r % 2 === 0 ? pal.secondary : pal.accent,
                transparent: true,
                opacity: 0.55
              })
            );
            disc.rotation.x = Math.PI / 2.3;
            disc.rotation.y = r * 0.25;
            mainGroup.add(disc);
          }
        } else {
          for (let i = 0; i < 9; i++) {
            const pillar = new THREE.Mesh(
              new THREE.BoxGeometry(0.7, 3.5 + (i % 3) * 1.5, 0.7),
              new THREE.MeshStandardMaterial({
                color: 0x0f172a,
                metalness: 0.9,
                roughness: 0.15,
                emissive: pal.secondary,
                emissiveIntensity: 0.25
              })
            );
            const angle = (i / 9) * Math.PI * 2;
            pillar.position.set(Math.cos(angle) * 3.8, ((i % 3) - 1) * 0.9, Math.sin(angle) * 3.8);
            mainGroup.add(pillar);
          }
        }

        const particleCount = t === 'nebula' ? 900 : 480;
        const positions = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount * 3; i += 3) {
          positions[i] = (Math.random() - 0.5) * 48;
          positions[i + 1] = (Math.random() - 0.5) * 32;
          positions[i + 2] = (Math.random() - 0.5) * 36;
        }
        const particleGeo = new THREE.BufferGeometry();
        particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const particleMat = new THREE.PointsMaterial({
          color: pal.accent,
          size: t === 'nebula' ? 0.16 : 0.12,
          transparent: true,
          opacity: 0.75
        });
        particles = new THREE.Points(particleGeo, particleMat);
        scene.add(particles);

        gridHelper = new THREE.GridHelper(65, 42, pal.primary, 0x0f172a);
        gridHelper.position.y = -6.5;
        scene.add(gridHelper);

        currentBuiltTheme = t;
      };

      buildThemeScene(themeRef.current);

      const onPointerMove = (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
      };
      window.addEventListener('mousemove', onPointerMove);

      const onResize = () => {
        if (!camera || !renderer) return;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', onResize);

      let clock = 0;
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        clock += 0.008;

        if (currentBuiltTheme !== themeRef.current) {
          buildThemeScene(themeRef.current);
        }

        if (mainGroup) {
          mainGroup.rotation.y += 0.0045;
          mainGroup.rotation.x = Math.sin(clock * 0.7) * 0.18;
        }
        if (particles) {
          particles.rotation.y = clock * 0.06;
        }
        if (gridHelper) {
          gridHelper.position.z = (clock * 3) % 1.5;
        }

        camera.position.x += (mouseX * 2.4 - camera.position.x) * 0.04;
        camera.position.y += (1.5 + mouseY * 1.4 - camera.position.y) * 0.04;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
      };

      animate();

      return () => {
        window.removeEventListener('mousemove', onPointerMove);
        window.removeEventListener('resize', onResize);
      };
    };

    let cleanupListeners;

    if (window.THREE) {
      cleanupListeners = initThree();
    } else {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
      script.async = true;
      script.onload = () => {
        cleanupListeners = initThree();
      };
      document.head.appendChild(script);
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (cleanupListeners) cleanupListeners();
      if (renderer) renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10 pointer-events-none bg-gradient-to-b from-slate-950 via-[#040b1c] to-slate-950"
    />
  );
};

// ============================================================================
// 5. INTERACTIVE 3D TILT GLASSMORPHIC CARD COMPONENT
// ============================================================================
const TiltCard3D = ({
  children,
  className = '',
  glowColor = 'cyan',
  onClick
}) => {
  const cardRef = useRef(null);
  const [transformStyle, setTransformStyle] = useState(
    'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
  );

  const handleMouseMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;
    setTransformStyle(
      `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(
        2
      )}deg) scale3d(1.01, 1.01, 1.01)`
    );
  };

  const handleMouseLeave = () => {
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  };

  const borderGlowMap = {
    cyan: 'hover:border-cyan-400/50 hover:shadow-[0_15px_45px_-10px_rgba(6,182,212,0.28)]',
    emerald: 'hover:border-emerald-400/50 hover:shadow-[0_15px_45px_-10px_rgba(16,185,129,0.28)]',
    rose: 'hover:border-rose-400/50 hover:shadow-[0_15px_45px_-10px_rgba(244,63,94,0.28)]',
    violet: 'hover:border-violet-400/50 hover:shadow-[0_15px_45px_-10px_rgba(139,92,246,0.28)]'
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ transform: transformStyle, transition: 'transform 180ms ease-out' }}
      className={`rounded-2xl bg-slate-900/75 backdrop-blur-xl border border-slate-800/90 shadow-xl transition-colors duration-300 ${borderGlowMap[glowColor]} ${className}`}
    >
      {children}
    </div>
  );
};

// ============================================================================
// 6. FLOATING 3D BACKGROUND THEME SELECTOR WIDGET
// ============================================================================
const BackgroundThemePicker = ({ currentTheme, onSelectTheme }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 left-5 z-40">
      {open && (
        <div className="mb-3 w-72 sm:w-80 rounded-2xl bg-slate-950/95 backdrop-blur-2xl border border-cyan-500/40 shadow-[0_20px_50px_rgba(0,0,0,0.85)] p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-300">
              <Palette className="w-4 h-4" />
              <span>3D Environment Modes</span>
            </div>
            <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-2 max-h-72 overflow-y-auto pr-1">
            {THEME_OPTIONS.map((item) => {
              const active = currentTheme === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTheme(item.id);
                    setOpen(false);
                  }}
                  className={`flex items-center gap-3 p-2.5 rounded-xl border text-left transition ${
                    active
                      ? 'bg-cyan-500/20 border-cyan-400 text-white'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className={`w-7 h-7 rounded-lg bg-gradient-to-br ${item.swatch} shrink-0 shadow-md`} />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold truncate">{item.label}</div>
                    <div className="text-[11px] text-slate-400 truncate">{item.desc}</div>
                  </div>
                  {active && <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-950/90 backdrop-blur-xl border border-cyan-500/40 text-cyan-300 hover:text-white hover:border-cyan-400 shadow-[0_10px_30px_rgba(6,182,212,0.25)] transition text-xs font-bold"
      >
        <Palette className="w-4 h-4 text-cyan-400" />
        <span>3D Theme: {THEME_OPTIONS.find((t) => t.id === currentTheme)?.label}</span>
      </button>
    </div>
  );
};

// ============================================================================
// 7. MAIN APPLICATION COMPONENT
// ============================================================================
export default function App() {
  const [fbUser, setFbUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [dbError, setDbError] = useState(null);

  // 3D Theme State
  const [bgTheme, setBgTheme] = useState(() => {
    const saved = localStorage.getItem('vexalqora_3d_theme');
    return saved || 'cybernetic';
  });

  const handleSelectTheme = (t) => {
    setBgTheme(t);
    localStorage.setItem('vexalqora_3d_theme', t);
  };

  // Routes & Navigation State
  const [currentRoute, setCurrentRoute] = useState('/');
  const [publicSection, setPublicSection] = useState('home');
  const [customerTab, setCustomerTab] = useState('dashboard');
  const [adminTab, setAdminTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // RBAC State
  const [role, setRole] = useState('guest');
  const [activeCustomer, setActiveCustomer] = useState(null);
  const [adminSessionId, setAdminSessionId] = useState(null);

  // Live Firestore Collections
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [projects, setProjects] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [siteContent, setSiteContent] = useState(DEFAULT_SITE_CONTENT);

  // Agreement Modal State
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [agreementPlanSelected, setAgreementPlanSelected] = useState(null);

  // Feedback Banner
  const [toast, setToast] = useState(null);

  const notify = (type, message) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 5000);
  };

  // Firebase Auth Bootstrap
  useEffect(() => {
    const initAuth = async () => {
      try {
        setAuthError(null);
        if (typeof window.__initial_auth_token !== 'undefined' && window.__initial_auth_token) {
          await signInWithCustomToken(auth, window.__initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error('Firebase Auth Init Error:', err);
        setAuthError(err?.message || 'Firebase authentication failed.');
      } finally {
        setAuthReady(true);
      }
    };
    initAuth();

    const unsub = onAuthStateChanged(
      auth,
      (user) => {
        setFbUser(user);
        setAuthReady(true);
      },
      (err) => {
        console.error('Auth state listener error:', err);
        setAuthError(err?.message || 'Auth listener error.');
        setAuthReady(true);
      }
    );
    return () => unsub();
  }, []);

  // Cloud Firestore Listeners with Error Callbacks
  useEffect(() => {
    if (!fbUser) return;

    const handleSnapError = (colName) => (err) => {
      console.error(`Firestore [${colName}] error:`, err);
      setDbError(err?.message || `Unable to sync ${colName} from Firestore.`);
    };

    const unsubCustomers = onSnapshot(
      collection(db, 'artifacts', appId, 'public', 'data', 'customers'),
      (snap) => {
        setDbError(null);
        setCustomers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      },
      handleSnapError('customers')
    );

    const unsubServices = onSnapshot(
      collection(db, 'artifacts', appId, 'public', 'data', 'services'),
      async (snap) => {
        setDbError(null);
        if (snap.empty) {
          setServices(INITIAL_SERVICES);
          for (const srv of INITIAL_SERVICES) {
            try {
              await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'services'), srv);
            } catch (e) {
              console.error('Seed service error:', e);
            }
          }
        } else {
          setServices(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        }
      },
      handleSnapError('services')
    );

    const unsubProjects = onSnapshot(
      collection(db, 'artifacts', appId, 'public', 'data', 'projects'),
      (snap) => {
        setDbError(null);
        setProjects(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      },
      handleSnapError('projects')
    );

    const unsubOrders = onSnapshot(
      collection(db, 'artifacts', appId, 'public', 'data', 'orders'),
      (snap) => {
        setDbError(null);
        setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      },
      handleSnapError('orders')
    );

    const unsubTickets = onSnapshot(
      collection(db, 'artifacts', appId, 'public', 'data', 'tickets'),
      (snap) => {
        setDbError(null);
        setTickets(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      },
      handleSnapError('tickets')
    );

    const unsubInvoices = onSnapshot(
      collection(db, 'artifacts', appId, 'public', 'data', 'invoices'),
      (snap) => {
        setDbError(null);
        setInvoices(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      },
      handleSnapError('invoices')
    );

    const unsubInquiries = onSnapshot(
      collection(db, 'artifacts', appId, 'public', 'data', 'inquiries'),
      (snap) => {
        setDbError(null);
        setInquiries(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      },
      handleSnapError('inquiries')
    );

    const unsubReviews = onSnapshot(
      collection(db, 'artifacts', appId, 'public', 'data', 'reviews'),
      (snap) => {
        setDbError(null);
        setReviews(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      },
      handleSnapError('reviews')
    );

    const unsubContent = onSnapshot(
      doc(db, 'artifacts', appId, 'public', 'data', 'siteConfig', 'main'),
      async (docSnap) => {
        setDbError(null);
        if (docSnap.exists()) {
          setSiteContent(docSnap.data());
        } else {
          setSiteContent(DEFAULT_SITE_CONTENT);
          try {
            await setDoc(
              doc(db, 'artifacts', appId, 'public', 'data', 'siteConfig', 'main'),
              DEFAULT_SITE_CONTENT
            );
          } catch (e) {
            console.error('Seed siteConfig error:', e);
          }
        }
      },
      handleSnapError('siteConfig')
    );

    return () => {
      unsubCustomers();
      unsubServices();
      unsubProjects();
      unsubOrders();
      unsubTickets();
      unsubInvoices();
      unsubInquiries();
      unsubReviews();
      unsubContent();
    };
  }, [fbUser]);

  // Keep activeCustomer synced with live Firestore updates
  useEffect(() => {
    if (role === 'customer' && activeCustomer) {
      const updated = customers.find((c) => c.id === activeCustomer.id);
      if (updated) {
        if (updated.status === 'Suspended') {
          handleLogout();
          notify('error', 'Your account has been suspended by an administrator.');
        } else {
          setActiveCustomer(updated);
        }
      }
    }
  }, [customers]);

  // Secret Admin Hash & Client Isolation Guard
  useEffect(() => {
    const syncSecretHash = () => {
      if (window.location.hash === ADMIN_SECRET_HASH) {
        if (role === 'customer') {
          setCurrentRoute('/dashboard');
          return;
        }
        setCurrentRoute('/admin/login');
      } else if (
        currentRoute.startsWith('/admin') &&
        window.location.hash !== ADMIN_SECRET_HASH &&
        !(role === 'admin' && adminSessionId)
      ) {
        setCurrentRoute(role === 'customer' ? '/dashboard' : '/');
      }
    };

    syncSecretHash();
    window.addEventListener('hashchange', syncSecretHash);
    return () => window.removeEventListener('hashchange', syncSecretHash);
  }, [currentRoute, role, adminSessionId]);

  // Secret Keyboard Shortcut (Ctrl + Shift + K) for Admin Entry (Not for customer panel)
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'K' || e.key === 'k')) {
        e.preventDefault();
        if (role === 'customer') {
          setCurrentRoute('/dashboard');
          return;
        }
        window.location.hash = ADMIN_SECRET_HASH.slice(1);
        setCurrentRoute('/admin/login');
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [role]);

  // Route Guard & Navigation
  const navigateTo = (targetPath) => {
    setMobileMenuOpen(false);

    if (role === 'customer' && targetPath.startsWith('/admin')) {
      setCurrentRoute('/dashboard');
      return;
    }

    if (targetPath === '/admin/dashboard') {
      if (role !== 'admin' || !adminSessionId) {
        if (window.location.hash === ADMIN_SECRET_HASH) {
          setCurrentRoute('/admin/login');
        } else {
          setCurrentRoute('/');
        }
        return;
      }
    }

    if (targetPath === '/admin/login' && window.location.hash !== ADMIN_SECRET_HASH && role !== 'admin') {
      setCurrentRoute('/');
      return;
    }

    if (targetPath === '/dashboard') {
      if (role !== 'customer' || !activeCustomer) {
        notify('warning', 'Please sign in to access your Customer Portal.');
        setCurrentRoute('/login');
        return;
      }
    }

    setCurrentRoute(targetPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ==========================================================================
  // 8. AUTHENTICATION HANDLERS (CLOUD USERNAME & PASSWORD)
  // ==========================================================================
  const handleCustomerLogin = async (mode, payload) => {
    const cleanPassword = (payload.password || '').trim();
    if (!cleanPassword || cleanPassword.length < 4) {
      notify('error', 'Please enter a valid password (minimum 4 characters).');
      return;
    }

    try {
      if (mode === 'login') {
        const cleanIdentifier = (payload.identifier || '').trim().toLowerCase();
        if (!cleanIdentifier) {
          notify('error', 'Please enter your Username or Email address.');
          return;
        }

        const existing = customers.find(
          (c) =>
            (c.username && c.username.toLowerCase() === cleanIdentifier) ||
            c.email.toLowerCase() === cleanIdentifier
        );

        if (!existing) {
          notify('error', 'No account found with that Username or Email. Please register first.');
          return;
        }
        if (existing.password && existing.password !== cleanPassword) {
          notify('error', 'Incorrect password. Please check your credentials and try again.');
          return;
        }
        if (existing.status === 'Suspended') {
          notify('error', 'This account is suspended. Contact VEXALQORA support.');
          return;
        }

        setActiveCustomer(existing);
        setRole('customer');
        setAdminSessionId(null);
        setCurrentRoute('/dashboard');
        notify('success', `Welcome back, ${existing.name} (@${existing.username || existing.email})! Cloud data synced.`);
      } else {
        const cleanUsername = (payload.username || '').trim().toLowerCase().replace(/[^a-z0-9._-]/g, '');
        const cleanEmail = (payload.email || '').trim().toLowerCase();
        const fullName = (payload.name || '').trim();

        if (!cleanUsername || cleanUsername.length < 3) {
          notify('error', 'Please choose a Username (at least 3 letters/numbers).');
          return;
        }
        if (!fullName) {
          notify('error', 'Please enter your full name.');
          return;
        }
        if (!cleanEmail || !cleanEmail.includes('@')) {
          notify('error', 'Please enter a valid email address.');
          return;
        }

        const usernameTaken = customers.some(
          (c) => c.username && c.username.toLowerCase() === cleanUsername
        );
        if (usernameTaken) {
          notify('error', `Username "@${cleanUsername}" is already taken. Choose another username.`);
          return;
        }

        const emailTaken = customers.some((c) => c.email.toLowerCase() === cleanEmail);
        if (emailTaken) {
          notify('error', 'An account with this email already exists. Please Sign In.');
          return;
        }

        const newCustomerData = {
          username: cleanUsername,
          password: cleanPassword,
          name: fullName,
          email: cleanEmail,
          company: (payload.company || 'Enterprise Client').trim(),
          phone: (payload.phone || '+91 9839000000').trim(),
          role: 'customer',
          status: 'Active',
          createdAt: new Date().toISOString()
        };

        const docRef = await addDoc(
          collection(db, 'artifacts', appId, 'public', 'data', 'customers'),
          newCustomerData
        );
        const createdCustomer = { id: docRef.id, ...newCustomerData };

        await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'projects'), {
          customerId: docRef.id,
          customerName: fullName,
          title: 'VEXALQORA Rapid Deployment Setup',
          serviceType: 'Website Development',
          status: 'Discovery',
          progress: 25,
          deadline: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0]
        });

        setActiveCustomer(createdCustomer);
        setRole('customer');
        setAdminSessionId(null);
        setCurrentRoute('/dashboard');
        notify('success', `Cloud account created for @${cleanUsername}! All data is saved.`);
      }
    } catch (err) {
      console.error(err);
      notify('error', 'Cloud authentication error. Please try again.');
    }
  };

  // Admin Password Login
  const handleAdminPasswordLogin = async (passwordInput) => {
    if (passwordInput !== 'ANGRAJKARNA1857') {
      notify('error', 'INVALID ADMIN PASSWORD. Access denied.');
      return;
    }

    try {
      const sessionRef = await addDoc(
        collection(db, 'artifacts', appId, 'public', 'data', 'adminSessions'),
        {
          role: 'admin',
          authenticatedAt: new Date().toISOString(),
          active: true
        }
      );

      setActiveCustomer(null);
      setRole('admin');
      setAdminSessionId(sessionRef.id);
      setCurrentRoute('/admin/dashboard');
      notify('success', 'ADMIN CLEARANCE GRANTED. Welcome to VEXALQORA Command Center.');
    } catch (err) {
      console.error(err);
      notify('error', 'Admin session initialization failed.');
    }
  };

  // Secure Logout
  const handleLogout = async () => {
    if (role === 'admin' && adminSessionId) {
      try {
        await updateDoc(
          doc(db, 'artifacts', appId, 'public', 'data', 'adminSessions', adminSessionId),
          { active: false, endedAt: new Date().toISOString() }
        );
      } catch (e) {
        console.error(e);
      }
    }
    if (window.location.hash === ADMIN_SECRET_HASH) {
      window.location.hash = '';
    }
    setRole('guest');
    setActiveCustomer(null);
    setAdminSessionId(null);
    setCurrentRoute('/');
    notify('success', 'You have been securely logged out.');
  };

  if (!authReady) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-cyan-400">
        <div className="w-14 h-14 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-mono text-xs tracking-widest uppercase">
          Initializing VEXALQORA 3D Engine...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 relative overflow-x-hidden">
      {/* Real-Time Interactive 3D WebGL Environment */}
      <ThreeBackgroundScene role={role} bgTheme={bgTheme} />

      {/* Floating 3D Environment Customizer */}
      <BackgroundThemePicker currentTheme={bgTheme} onSelectTheme={handleSelectTheme} />

      {/* Firebase / Cloud Status Alert if needed */}
      {(authError || dbError || !hasRealEnvConfig) && (
        <div className="fixed top-20 right-5 z-40 max-w-sm rounded-2xl bg-amber-950/90 border border-amber-500/40 px-4 py-2.5 text-[11px] font-mono text-amber-200 backdrop-blur-xl shadow-xl">
          {authError || dbError
            ? `Cloud Notice: ${authError || dbError}`
            : 'Firebase env not set — using fallback config'}
        </div>
      )}

      {/* Global Notification Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 max-w-md animate-fade-in">
          <div
            className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border backdrop-blur-xl ${
              toast.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500/60 text-emerald-100'
                : toast.type === 'warning'
                ? 'bg-amber-950/90 border-amber-500/60 text-amber-100'
                : 'bg-rose-950/90 border-rose-500/60 text-rose-100'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <span className="text-sm font-medium">{toast.message}</span>
            <button onClick={() => setToast(null)} className="ml-2 text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ====================================================================
          AREA 1: PUBLIC WEBSITE (/)
      ==================================================================== */}
      {currentRoute === '/' && (
        <PublicWebsiteLayout
          publicSection={publicSection}
          setPublicSection={setPublicSection}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          role={role}
          navigateTo={navigateTo}
          handleLogout={handleLogout}
          siteContent={siteContent}
          services={services}
          reviews={reviews}
          notify={notify}
          onOpenAgreement={() => setShowAgreementModal(true)}
        />
      )}

      {/* 2-YEAR SUPPORT AGREEMENT 3D MODAL */}
      {showAgreementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-2xl rounded-3xl bg-gradient-to-br from-slate-900 via-[#0a1530] to-slate-950 border border-cyan-500/50 shadow-[0_25px_60px_rgba(6,182,212,0.35)] p-6 sm:p-8 space-y-6 text-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center justify-between border-b border-cyan-500/30 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg">
                  <ShieldCheck className="w-6 h-6 text-slate-950" />
                </div>
                <div>
                  <div className="text-sm font-black tracking-wider text-white">VEXALQORA TECHNOLOGIES</div>
                  <div className="text-[10px] font-mono text-cyan-400 uppercase">Official 2-Year Support Agreement</div>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowAgreementModal(false);
                  setAgreementPlanSelected(null);
                }}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm text-slate-300 leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
              <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 font-medium text-cyan-200">
                "Welcome, Sir! Our team will be with you for the next 2 years. As long as your subscription remains active with us, you will continue to receive our support and assistance."
              </div>

              {/* AGREEMENT PRICING SELECTION */}
              <div className="space-y-2 pt-2">
                <div className="text-xs font-mono font-bold text-cyan-300 uppercase">
                  Select Agreement Package (Required to Enable Submit)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAgreementPlanSelected('website')}
                    className={`p-4 rounded-xl border text-left transition ${
                      agreementPlanSelected === 'website'
                        ? 'bg-cyan-500/25 border-cyan-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                        : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold text-cyan-200">Only Website</div>
                    <div className="text-xl font-black text-cyan-400 mt-1">₹850</div>
                    <div className="text-[11px] text-slate-400 mt-1">2-Year Support & 1–2 Days Delivery</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAgreementPlanSelected('combo')}
                    className={`p-4 rounded-xl border text-left transition ${
                      agreementPlanSelected === 'combo'
                        ? 'bg-emerald-500/25 border-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                        : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold text-emerald-200">Website + Meta Ads / Promotion</div>
                    <div className="text-xl font-black text-emerald-400 mt-1">₹700 + ₹400</div>
                    <div className="text-[11px] text-slate-400 mt-1">Complete Growth Campaign & Support</div>
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300 pt-2">
                <p><strong>Operational Commitment:</strong> VEXALQORA TECHNOLOGIES guarantees secure cloud synchronization, 99.9% uptime, responsive updates, and continuous assistance for 2 years.</p>
              </div>
            </div>

            <div className="pt-4 border-t border-cyan-500/30 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowAgreementModal(false);
                  setAgreementPlanSelected(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                disabled={!agreementPlanSelected}
                onClick={() => {
                  notify('success', `Agreement accepted with ${agreementPlanSelected === 'website' ? 'Only Website (₹850)' : 'Website + Meta Ads (₹700 + ₹400)'} package!`);
                  setShowAgreementModal(false);
                  setAgreementPlanSelected(null);
                  navigateTo('/login');
                }}
                className={`px-6 py-3 rounded-xl font-extrabold text-xs shadow-lg transition ${
                  agreementPlanSelected
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 hover:opacity-95 cursor-pointer'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                }`}
              >
                Accept & Proceed to Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          AREA 2A: CUSTOMER LOGIN & REGISTRATION (/login)
      ==================================================================== */}
      {currentRoute === '/login' && (
        <CustomerAuthView
          onAuthSubmit={handleCustomerLogin}
          onBackPublic={() => navigateTo('/')}
        />
      )}

      {/* ====================================================================
          AREA 2B: ISOLATED CUSTOMER PANEL (/dashboard)
      ==================================================================== */}
      {currentRoute === '/dashboard' && role === 'customer' && activeCustomer && (
        <CustomerPortalLayout
          customer={activeCustomer}
          customerTab={customerTab}
          setCustomerTab={setCustomerTab}
          onBackPublic={() => navigateTo('/')}
          onLogout={handleLogout}
          projects={projects.filter((p) => p.customerId === activeCustomer.id)}
          orders={orders.filter((o) => o.customerId === activeCustomer.id)}
          tickets={tickets.filter((t) => t.customerId === activeCustomer.id)}
          invoices={invoices.filter((i) => i.customerId === activeCustomer.id)}
          services={services}
          notify={notify}
        />
      )}

      {/* ====================================================================
          AREA 3A: SECRET ADMIN LOGIN (ONLY VIA SECRET HASH / SHORTCUT)
      ==================================================================== */}
      {currentRoute === '/admin/login' && role !== 'customer' && window.location.hash === ADMIN_SECRET_HASH && (
        <AdminLoginView
          onAdminSubmit={handleAdminPasswordLogin}
          onBackPublic={() => {
            if (window.location.hash === ADMIN_SECRET_HASH) {
              window.location.hash = '';
            }
            navigateTo('/');
          }}
        />
      )}

      {/* ====================================================================
          AREA 3B: PRIVATE ADMIN PANEL (/admin/dashboard)
      ==================================================================== */}
      {currentRoute === '/admin/dashboard' && role === 'admin' && adminSessionId && (
        <AdminPortalLayout
          adminTab={adminTab}
          setAdminTab={setAdminTab}
          onLogout={handleLogout}
          customers={customers}
          projects={projects}
          services={services}
          orders={orders}
          tickets={tickets}
          invoices={invoices}
          inquiries={inquiries}
          reviews={reviews}
          siteContent={siteContent}
          notify={notify}
        />
      )}
    </div>
  );
}

// ============================================================================
// 9. PUBLIC WEBSITE COMPONENT (NO ADMIN LINKS OR HINTS)
// ============================================================================
const PublicWebsiteLayout = ({
  publicSection,
  setPublicSection,
  mobileMenuOpen,
  setMobileMenuOpen,
  role,
  navigateTo,
  handleLogout,
  siteContent,
  services,
  reviews,
  notify,
  onOpenAgreement
}) => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: ''
  });
  const [submittingContact, setSubmittingContact] = useState(false);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      notify('error', 'Please fill in your name, email, and inquiry.');
      return;
    }
    setSubmittingContact(true);
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'inquiries'), {
        ...contactForm,
        status: 'New',
        createdAt: new Date().toISOString()
      });
      setContactForm({ name: '', email: '', phone: '', company: '', subject: '', message: '' });
      notify('success', 'Inquiry stored in Cloud & routed to vexalqoratechnologies@gmail.com.');
    } catch (err) {
      console.error(err);
      notify('error', 'Unable to send message.');
    } finally {
      setSubmittingContact(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top 3D Glass Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/75 backdrop-blur-2xl border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <button
            onClick={() => setPublicSection('home')}
            className="flex items-center gap-3 text-left group"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.45)] group-hover:scale-105 transition">
              <Cpu className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="font-black tracking-wider text-lg text-white leading-none">
                VEXALQORA
              </div>
              <div className="text-[10px] font-mono tracking-[0.26em] text-cyan-400 uppercase mt-1">
                TECHNOLOGIES
              </div>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-900/70 p-1.5 rounded-2xl border border-slate-800/80">
            {[
              { id: 'home', label: 'Home' },
              { id: 'about', label: 'About Us' },
              { id: 'services', label: 'Services' },
              { id: 'contact', label: 'Contact' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setPublicSection(item.id)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                  publicSection === item.id
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-lg'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={onOpenAgreement}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-cyan-300 hover:bg-cyan-500/20 transition"
            >
              2-Year Agreement
            </button>
          </nav>

          {/* Portal Actions */}
          <div className="hidden md:flex items-center gap-3">
            {role === 'customer' ? (
              <>
                <button
                  onClick={() => navigateTo('/dashboard')}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold hover:bg-emerald-500/30 transition"
                >
                  Customer Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-800/90 text-slate-300 hover:text-white text-xs font-semibold"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => navigateTo('/login')}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 text-xs font-extrabold shadow-[0_0_25px_rgba(6,182,212,0.35)] hover:opacity-95 transition"
              >
                Customer Login
              </button>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-950/95 backdrop-blur-2xl border-b border-slate-800 px-4 py-5 space-y-3">
            {['home', 'about', 'services', 'contact'].map((sec) => (
              <button
                key={sec}
                onClick={() => {
                  setPublicSection(sec);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-3 rounded-xl font-semibold capitalize ${
                  publicSection === sec
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-300'
                }`}
              >
                {sec}
              </button>
            ))}
            <button
              onClick={() => {
                onOpenAgreement();
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-3 rounded-xl font-semibold text-cyan-300 bg-cyan-950/30"
            >
              2-Year Support Agreement
            </button>
            <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
              <button
                onClick={() => {
                  navigateTo(role === 'customer' ? '/dashboard' : '/login');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 font-bold text-sm"
              >
                {role === 'customer' ? 'Customer Dashboard' : 'Customer Login / Register'}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* HOME SECTION */}
        {publicSection === 'home' && (
          <div className="space-y-20">
            <section className="pt-6 lg:pt-12">
              <div className="max-w-3xl space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{siteContent.heroBadge}</span>
                </div>

                <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.08] drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)]">
                  {siteContent.heroTitle}
                </h1>

                <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl bg-slate-950/55 backdrop-blur-md p-4 rounded-2xl border border-slate-800/80">
                  {siteContent.heroSubtitle}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl">
                  <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-cyan-500/30 backdrop-blur-md">
                    <Cpu className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="text-xs font-semibold text-cyan-100">Three.js 3D Visualization</span>
                  </div>
                  <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-emerald-500/30 backdrop-blur-md">
                    <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-xs font-semibold text-emerald-100">Live IoT Sensor Overlays</span>
                  </div>
                  <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-violet-500/30 backdrop-blur-md">
                    <Layers className="w-4 h-4 text-violet-400 shrink-0" />
                    <span className="text-xs font-semibold text-violet-100">1–2 Days Rapid Delivery</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-2">
                  <button
                    onClick={() => setPublicSection('services')}
                    className="px-7 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 font-extrabold text-sm sm:text-base shadow-[0_0_35px_rgba(6,182,212,0.45)] hover:scale-[1.02] transition flex items-center gap-2.5"
                  >
                    <span>Explore Our 3 Core Services</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <button
                    onClick={onOpenAgreement}
                    className="px-7 py-4 rounded-2xl bg-slate-900/85 backdrop-blur-xl border border-cyan-500/40 text-cyan-200 font-bold text-sm sm:text-base hover:bg-slate-800 transition flex items-center gap-2.5"
                  >
                    <ShieldCheck className="w-5 h-5 text-cyan-400" />
                    <span>2-Year Support Agreement</span>
                  </button>
                </div>

                <div className="pt-5 flex flex-wrap items-center gap-3 text-xs font-mono">
                  <a
                    href="mailto:vexalqoratechnologies@gmail.com?subject=Project%20Inquiry%20-%20VEXALQORA%20TECHNOLOGIES"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/90 border border-cyan-500/35 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 transition"
                  >
                    <Mail className="w-4 h-4 text-cyan-400" />
                    <span>vexalqoratechnologies@gmail.com</span>
                  </a>
                  <a
                    href="tel:+919140799915"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/90 border border-emerald-500/35 text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-400 transition"
                  >
                    <Phone className="w-4 h-4 text-emerald-400" />
                    <span>Call +91 91407 99915</span>
                  </a>
                  <a
                    href="tel:+919235380356"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/90 border border-emerald-500/35 text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-400 transition"
                  >
                    <Phone className="w-4 h-4 text-emerald-400" />
                    <span>Call +91 92353 80356</span>
                  </a>
                </div>
              </div>
            </section>

            {/* LIVE CUSTOMER REVIEWS & RATINGS SECTION */}
            {reviews.length > 0 && (
              <section className="space-y-6">
                <div className="text-center max-w-xl mx-auto space-y-1">
                  <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">
                    Verified Client Testimonials
                  </span>
                  <h2 className="text-3xl font-extrabold text-white">What Our Customers Say</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {reviews.map((rev) => (
                    <TiltCard3D key={rev.id} glowColor="emerald" className="p-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm">{rev.customerName}</span>
                        <div className="flex text-amber-400 text-xs">
                          {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                            <span key={i}>★</span>
                          ))}
                        </div>
                      </div>
                      <div className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        {rev.reviewText}
                      </div>
                      {rev.comment && <p className="text-xs text-slate-300">{rev.comment}</p>}
                    </TiltCard3D>
                  ))}
                </div>
              </section>
            )}

            {/* THREE CORE PROFESSIONAL SERVICES (WITHOUT PRICES) */}
            <section className="space-y-8">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
                  Core Professional Solutions • 1–2 Days Rapid Delivery
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                  Engineered for Digital Dominance
                </h2>
                <p className="text-slate-400 text-sm">
                  Three dedicated pillars designed to elevate your brand, automate workflows, and scale acquisition within 1–2 days.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <TiltCard3D className="p-8 flex flex-col justify-between h-full space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                        <Globe className="w-6 h-6 text-cyan-400" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white">1. Website Development</h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      Modern, responsive and premium business websites equipped with real-time Three.js industrial visualization and live IoT sensor overlays.
                    </p>
                  </div>
                  <button
                    onClick={() => navigateTo(role === 'customer' ? '/dashboard' : '/login')}
                    className="w-full py-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 font-bold text-xs transition"
                  >
                    Order Service
                  </button>
                </TiltCard3D>

                <TiltCard3D glowColor="violet" className="p-8 flex flex-col justify-between h-full space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-violet-500/20 border border-violet-500/40 flex items-center justify-center">
                        <Code2 className="w-6 h-6 text-violet-400" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white">2. Web Application Development</h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      Custom dashboards, enterprise SaaS platforms, and business management systems with secure role-based customer portals.
                    </p>
                  </div>
                  <button
                    onClick={() => navigateTo(role === 'customer' ? '/dashboard' : '/login')}
                    className="w-full py-3 rounded-xl bg-violet-500/20 hover:bg-violet-500 text-violet-300 hover:text-slate-950 font-bold text-xs transition"
                  >
                    Order Service
                  </button>
                </TiltCard3D>

                <TiltCard3D glowColor="emerald" className="p-8 flex flex-col justify-between h-full space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                        <BarChart3 className="w-6 h-6 text-emerald-400" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white">3. Digital Marketing & Promotion</h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      Strategic Meta Ads management, high-converting campaign funnels, target audience scaling, and comprehensive lead generation systems.
                    </p>
                  </div>
                  <button
                    onClick={() => navigateTo(role === 'customer' ? '/dashboard' : '/login')}
                    className="w-full py-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 font-bold text-xs transition"
                  >
                    Order Service
                  </button>
                </TiltCard3D>
              </div>
            </section>
          </div>
        )}

        {/* ABOUT US SECTION */}
        {publicSection === 'about' && (
          <div className="space-y-10 max-w-4xl mx-auto">
            <TiltCard3D className="p-8 sm:p-12 space-y-6">
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
                About VEXALQORA TECHNOLOGIES
              </span>
              <h1 className="text-3xl sm:text-5xl font-black text-white">
                Pioneering 3D Web Systems & Performance Digital Growth
              </h1>
              <p className="text-slate-200 leading-relaxed text-base sm:text-lg">
                {siteContent.aboutMission}
              </p>
            </TiltCard3D>
          </div>
        )}

        {/* SERVICES SECTION */}
        {publicSection === 'services' && (
          <div className="space-y-8">
            <div className="max-w-2xl">
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
                Specialized Capabilities • 1–2 Days Rapid Delivery
              </span>
              <h1 className="text-4xl font-black text-white mt-2">
                VEXALQORA Core Services
              </h1>
              <p className="text-slate-300 text-sm mt-2">
                Explore our core capabilities and initiate your order via the agreement.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services.map((srv, idx) => (
                <TiltCard3D
                  key={srv.id || srv.title}
                  glowColor={idx === 0 ? 'cyan' : idx === 1 ? 'violet' : 'emerald'}
                  className="p-8 flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 text-xs font-mono">
                        {srv.category}
                      </span>
                      <span className="text-xs font-mono text-slate-400">{srv.deliveryTime}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white">{srv.title}</h2>
                    <p className="text-sm text-slate-300 leading-relaxed">{srv.description}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80">
                    <button
                      onClick={onOpenAgreement}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 font-extrabold text-xs shadow-lg hover:opacity-95 transition"
                    >
                      View Support Agreement & Order
                    </button>
                  </div>
                </TiltCard3D>
              ))}
            </div>
          </div>
        )}

        {/* CONTACT SECTION */}
        {publicSection === 'contact' && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-5xl mx-auto">
            <div className="lg:col-span-2 space-y-6">
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
                Direct Line • 1–2 Days Rapid Delivery
              </span>
              <h1 className="text-4xl font-black text-white">Contact VEXALQORA</h1>
              <p className="text-slate-300 text-sm leading-relaxed">
                Click below to directly call our team or open your email app to message us immediately.
              </p>

              <TiltCard3D className="p-6 space-y-4 text-sm text-slate-300">
                <a
                  href="mailto:vexalqoratechnologies@gmail.com?subject=Business%20Inquiry%20-%20VEXALQORA%20TECHNOLOGIES"
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/90 border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-500/10 transition group"
                >
                  <Mail className="w-5 h-5 text-cyan-400 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[11px] font-mono text-cyan-400 uppercase">Click to Email Directly</div>
                    <div className="font-semibold text-white truncate group-hover:text-cyan-200">
                      vexalqoratechnologies@gmail.com
                    </div>
                  </div>
                </a>

                <a
                  href="tel:+919140799915"
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/90 border border-emerald-500/30 hover:border-emerald-400 hover:bg-emerald-500/10 transition group"
                >
                  <Phone className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-[11px] font-mono text-emerald-400 uppercase">Primary Line • Click to Call</div>
                    <div className="font-semibold text-white group-hover:text-emerald-200">+91 91407 99915</div>
                  </div>
                </a>

                <a
                  href="tel:+919235380356"
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/90 border border-emerald-500/30 hover:border-emerald-400 hover:bg-emerald-500/10 transition group"
                >
                  <Phone className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-[11px] font-mono text-emerald-400 uppercase">Secondary Line • Click to Call</div>
                    <div className="font-semibold text-white group-hover:text-emerald-200">+91 92353 80356</div>
                  </div>
                </a>
              </TiltCard3D>
            </div>

            <TiltCard3D className="lg:col-span-3 p-8">
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Name *</label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="Aarav Sharma"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="aarav@company.com"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Company</label>
                    <input
                      type="text"
                      value={contactForm.company}
                      onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
                      placeholder="Enterprise Ltd"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Subject</label>
                  <input
                    type="text"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    placeholder="Website & Meta Ads Inquiry"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Message *</label>
                  <textarea
                    rows={4}
                    required
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Describe your project requirements..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingContact}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 font-bold text-sm"
                >
                  {submittingContact ? 'Saving to Cloud...' : 'Submit Inquiry'}
                </button>
              </form>
            </TiltCard3D>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-xl py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-3">
            <span>Email:</span>
            <a href="mailto:vexalqoratechnologies@gmail.com" className="font-bold text-cyan-300 hover:underline">
              vexalqoratechnologies@gmail.com
            </a>
            <span>| Call:</span>
            <a href="tel:+919140799915" className="font-bold text-emerald-300 hover:underline">+919140799915</a>
            <span>,</span>
            <a href="tel:+919235380356" className="font-bold text-emerald-300 hover:underline">+919235380356</a>
          </div>
          <button onClick={onOpenAgreement} className="text-cyan-300 hover:underline font-bold">
            2-Year Support Agreement Terms
          </button>
        </div>
      </footer>
    </div>
  );
};

// ============================================================================
// 10. CUSTOMER AUTHENTICATION VIEW (/login)
// ============================================================================
const CustomerAuthView = ({ onAuthSubmit, onBackPublic }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (isRegister) {
      await onAuthSubmit('register', { username, password, email, name, company, phone });
    } else {
      await onAuthSubmit('login', { identifier, password });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <TiltCard3D glowColor="emerald" className="w-full max-w-md p-8 border-emerald-500/30">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBackPublic} className="text-xs text-slate-400 hover:text-white">
            ← Public Website
          </button>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            {isRegister ? 'REGISTER' : 'SIGN IN'}
          </span>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
            <User className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">
              {isRegister ? 'Client Registration' : 'Client Sign In'}
            </h1>
            <p className="text-xs text-slate-400">Access your cloud portal</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister ? (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Aarav Sharma"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Username *</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="aaravsharma"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="aarav@company.com"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Company</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Enterprise Ltd"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9839000000"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                  />
                </div>
              </div>
            </>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Username or Email *</label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter username or email"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Password *</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full px-4 py-3 pr-12 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-600 text-slate-950 font-extrabold text-sm shadow-lg"
          >
            {loading ? 'Processing...' : isRegister ? 'Register & Access Portal' : 'Sign In'}
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-slate-400">
          {isRegister ? (
            <span>
              Already have an account?{' '}
              <button onClick={() => setIsRegister(false)} className="text-emerald-400 font-bold hover:underline">
                Sign In
              </button>
            </span>
          ) : (
            <span>
              New client?{' '}
              <button onClick={() => setIsRegister(true)} className="text-emerald-400 font-bold hover:underline">
                Create Account
              </button>
            </span>
          )}
        </div>
      </TiltCard3D>
    </div>
  );
};

// ============================================================================
// 11. ISOLATED CUSTOMER PANEL (/dashboard) WITH ORDER FORM, REVIEWS & WHATSAPP
// ============================================================================
const CustomerPortalLayout = ({
  customer,
  customerTab,
  setCustomerTab,
  onBackPublic,
  onLogout,
  projects,
  orders,
  tickets,
  invoices,
  services,
  notify
}) => {
  const [profileForm, setProfileForm] = useState({
    name: customer.name,
    company: customer.company,
    phone: customer.phone
  });

  // Detailed Order Form State with Automatic Pricing Box
  const [orderModalService, setOrderModalService] = useState(null);
  const [planType, setPlanType] = useState('website');
  const [reqDetails, setReqDetails] = useState('');
  const [businessName, setBusinessName] = useState('');

  // Support Ticket Form State
  const [newTicketSubject, setNewTicketSubject] = useState('');
  const [newTicketMessage, setNewTicketMessage] = useState('');
  const [newTicketPriority, setNewTicketPriority] = useState('Medium');

  // Review & Rating State
  const [reviewModalOrder, setReviewModalOrder] = useState(null);
  const [ratingVal, setRatingVal] = useState(5);
  const [reviewTextOpt, setReviewTextOpt] = useState('Excellent');
  const [reviewComment, setReviewComment] = useState('');
  const [showWhatsAppButton, setShowWhatsAppButton] = useState(false);

  useEffect(() => {
    setProfileForm({ name: customer.name, company: customer.company, phone: customer.phone });
  }, [customer]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(
        doc(db, 'artifacts', appId, 'public', 'data', 'customers', customer.id),
        profileForm
      );
      notify('success', 'Customer profile saved to cloud.');
    } catch (err) {
      console.error(err);
      notify('error', 'Failed to update profile.');
    }
  };

  const handleConfirmOrder = async (e) => {
    e.preventDefault();
    if (!orderModalService) return;
    const price = planType === 'website' ? 850 : 1100;

    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'orders'), {
        customerId: customer.id,
        customerName: customer.name,
        customerUsername: customer.username || customer.email,
        customerEmail: customer.email,
        serviceId: orderModalService.id,
        serviceTitle: orderModalService.title,
        planType,
        price,
        requirements: `Business: ${businessName} | Details: ${reqDetails}`,
        status: 'Pending',
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      });

      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'invoices'), {
        invoiceNumber: `INV-${Math.floor(100000 + Math.random() * 900000)}`,
        customerId: customer.id,
        customerName: customer.name,
        orderTitle: `${orderModalService.title} (${planType === 'website' ? 'Only Website ₹850' : 'Website + Meta Ads ₹700 + ₹400'})`,
        amount: price,
        status: 'Unpaid',
        dueDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0]
      });

      notify('success', `Order placed successfully! Price: ₹${price}. 1–2 Days Delivery.`);
      setOrderModalService(null);
      setReqDetails('');
      setBusinessName('');
      setCustomerTab('orders');
    } catch (err) {
      console.error(err);
      notify('error', 'Unable to place order.');
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!newTicketSubject || !newTicketMessage) {
      notify('error', 'Please enter a ticket subject and message.');
      return;
    }
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'tickets'), {
        customerId: customer.id,
        customerName: customer.name,
        subject: newTicketSubject,
        message: newTicketMessage,
        priority: newTicketPriority,
        status: 'Open',
        createdAt: new Date().toISOString()
      });
      setNewTicketSubject('');
      setNewTicketMessage('');
      notify('success', 'Support ticket submitted successfully!');
    } catch (err) {
      console.error(err);
      notify('error', 'Unable to submit support ticket.');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewModalOrder) return;

    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'reviews'), {
        customerId: customer.id,
        customerName: customer.name,
        rating: ratingVal,
        reviewText: reviewTextOpt,
        comment: reviewComment,
        createdAt: new Date().toISOString()
      });

      notify('success', 'Review submitted successfully! Published live on public website.');
      setShowWhatsAppButton(true);
      setReviewModalOrder(null);
      setReviewComment('');
    } catch (err) {
      console.error(err);
      notify('error', 'Unable to submit review.');
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'projects', label: 'My Projects', icon: Briefcase },
    { id: 'orders', label: 'My Orders', icon: ShoppingBag },
    { id: 'tickets', label: 'Support Tickets', icon: MessageSquare },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative">
      {/* ORDER MODAL WITH DETAILED FORM & AUTOMATIC PRICING BOX */}
      {orderModalService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <TiltCard3D glowColor="emerald" className="w-full max-w-lg p-6 sm:p-8 space-y-5 bg-slate-900/95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-xl font-bold text-white">Order: {orderModalService.title}</h3>
                <p className="text-xs text-emerald-400">1–2 Days Rapid Delivery</p>
              </div>
              <button
                onClick={() => setOrderModalService(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Business Name *</label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Apex Enterprise"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                />
              </div>

              {/* AUTOMATIC PRICING & PAYMENT BOX */}
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-3">
                <div className="text-xs font-mono font-bold text-emerald-300 uppercase">
                  Automatic Pricing & Package Selection
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPlanType('website')}
                    className={`p-3 rounded-xl border text-left transition ${
                      planType === 'website'
                        ? 'bg-emerald-500/20 border-emerald-400 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="text-xs font-bold">Only Website</div>
                    <div className="text-lg font-black text-emerald-300 mt-1">₹850</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPlanType('combo')}
                    className={`p-3 rounded-xl border text-left transition ${
                      planType === 'combo'
                        ? 'bg-emerald-500/20 border-emerald-400 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="text-xs font-bold">Website + Meta Ads</div>
                    <div className="text-lg font-black text-emerald-300 mt-1">₹700 + ₹400</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  Detailed Requirements / Specifications *
                </label>
                <textarea
                  rows={4}
                  required
                  value={reqDetails}
                  onChange={(e) => setReqDetails(e.target.value)}
                  placeholder="Describe your design preferences, target audience, color schemes..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOrderModalService(null)}
                  className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-lg"
                >
                  Confirm Order
                </button>
              </div>
            </form>
          </TiltCard3D>
        </div>
      )}

      {/* REVIEW & RATING MODAL */}
      {reviewModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <TiltCard3D glowColor="emerald" className="w-full max-w-md p-6 sm:p-8 space-y-5 bg-slate-900/95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white">Rate Completed Project</h3>
                <p className="text-xs text-slate-400">{reviewModalOrder.serviceTitle}</p>
              </div>
              <button onClick={() => setReviewModalOrder(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Star Rating (1 to 5)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRatingVal(s)}
                      className={`text-2xl ${s <= ratingVal ? 'text-amber-400' : 'text-slate-600'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Review Feedback *</label>
                <select
                  value={reviewTextOpt}
                  onChange={(e) => setReviewTextOpt(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm font-bold"
                >
                  <option value="Bad">Bad</option>
                  <option value="Good">Good</option>
                  <option value="Very Good">Very Good</option>
                  <option value="Excellent">Excellent</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Detailed Comment</label>
                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your experience..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
              >
                Submit Review & Publish Live
              </button>
            </form>
          </TiltCard3D>
        </div>
      )}

      {/* Customer Sidebar */}
      <aside className="lg:w-72 bg-slate-950/85 backdrop-blur-2xl border-b lg:border-b-0 lg:border-r border-emerald-500/20 p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between lg:justify-start gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="font-black text-white text-sm tracking-wider">CLIENT PORTAL</div>
              <div className="text-[10px] font-mono text-emerald-400">VEXALQORA CLOUD</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 mb-6 space-y-1">
            <div className="text-xs text-emerald-300 font-bold truncate">{customer.name}</div>
            {customer.username && <div className="text-[11px] font-mono text-cyan-300 truncate">@{customer.username}</div>}
            <div className="text-[11px] text-slate-400 truncate">{customer.email}</div>
          </div>

          <nav className="flex lg:flex-col gap-1.5 overflow-x-auto pb-2 lg:pb-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = customerTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCustomerTab(item.id)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                    active ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg' : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* CONDITIONAL WHATSAPP BUTTON UPON REVIEW SUBMISSION */}
        {showWhatsAppButton && (
          <div className="my-3 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 space-y-2 animate-bounce">
            <div className="text-[10px] font-mono text-emerald-300 uppercase">Review Submitted!</div>
            <a
              href={`https://wa.me/919839000000?text=${encodeURIComponent(
                `Hello VEXALQORA Team, my name is ${customer.name}. I have submitted my review and want to discuss my project orders.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-2.5 px-3 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs text-center shadow-lg"
            >
              💬 Open WhatsApp Chat
            </a>
          </div>
        )}

        <div className="pt-6 border-t border-slate-800/80 mt-6 flex lg:flex-col gap-2">
          <button
            onClick={onBackPublic}
            className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 text-slate-300 hover:text-white text-xs font-semibold"
          >
            Public Website
          </button>
          <button
            onClick={onLogout}
            className="flex-1 py-2.5 px-3 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center justify-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Customer Workspace */}
      <main className="flex-1 p-5 sm:p-8 max-w-6xl w-full mx-auto space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono text-emerald-400">/dashboard/{customerTab}</span>
            <h1 className="text-2xl sm:text-3xl font-black text-white capitalize">{customerTab}</h1>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Live Cloud Sync</span>
          </div>
        </div>

        {customerTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <TiltCard3D glowColor="emerald" className="p-5">
                <div className="text-xs text-slate-400">Projects</div>
                <div className="text-3xl font-black text-white mt-1">{projects.length}</div>
              </TiltCard3D>
              <TiltCard3D glowColor="emerald" className="p-5">
                <div className="text-xs text-slate-400">Orders</div>
                <div className="text-3xl font-black text-cyan-400 mt-1">{orders.length}</div>
              </TiltCard3D>
              <TiltCard3D glowColor="emerald" className="p-5">
                <div className="text-xs text-slate-400">Tickets</div>
                <div className="text-3xl font-black text-amber-400 mt-1">{tickets.length}</div>
              </TiltCard3D>
              <TiltCard3D glowColor="emerald" className="p-5">
                <div className="text-xs text-slate-400">Invoices</div>
                <div className="text-3xl font-black text-emerald-400 mt-1">{invoices.length}</div>
              </TiltCard3D>
            </div>

            {/* LAUNCHED WEBSITES FROM ADMIN PANEL */}
            {projects.some((p) => p.launchedUrl || p.launchedFileCode) && (
              <TiltCard3D glowColor="emerald" className="p-6 space-y-4 border-emerald-500/50">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-emerald-400" />
                  Your Launched Websites & Files
                </h2>
                <div className="grid grid-cols-1 gap-3">
                  {projects
                    .filter((p) => p.launchedUrl || p.launchedFileCode)
                    .map((p) => (
                      <div key={p.id} className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-white text-sm">{p.title}</span>
                          <span className="text-xs font-mono text-emerald-400">Ready</span>
                        </div>
                        {p.launchedUrl && (
                          <a
                            href={p.launchedUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
                          >
                            🚀 Open Live Website ({p.launchedUrl})
                          </a>
                        )}
                        {p.launchedFileCode && (
                          <details className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300">
                            <summary className="cursor-pointer font-bold">Inspect Deployed Code</summary>
                            <pre className="mt-2 whitespace-pre-wrap text-[11px] text-slate-200">{p.launchedFileCode}</pre>
                          </details>
                        )}
                        {p.status === 'Completed' && (
                          <button
                            onClick={() => {
                              const matchingOrder = orders.find((o) => o.serviceTitle === p.serviceType) || orders[0];
                              if (matchingOrder) setReviewModalOrder(matchingOrder);
                            }}
                            className="mt-2 px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold"
                          >
                            ★ Write Review & Rate 5 Stars
                          </button>
                        )}
                      </div>
                    ))}
                </div>
              </TiltCard3D>
            )}

            <TiltCard3D glowColor="emerald" className="p-6">
              <h2 className="text-lg font-bold text-white mb-4">Commission VEXALQORA Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-950/85 border border-emerald-500/40 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="text-xs font-mono text-emerald-400 uppercase">Option 1</div>
                    <div className="text-xl font-black text-white mt-1">Only Website</div>
                    <div className="text-2xl font-black text-emerald-300 mt-2">₹850</div>
                    <p className="text-xs text-slate-300 mt-2">Modern business website with 1–2 days rapid delivery.</p>
                  </div>
                  <button
                    onClick={() => {
                      setPlanType('website');
                      setOrderModalService({
                        id: 'srv-only-web',
                        title: 'Only Website',
                        category: 'Website Development',
                        description: 'Modern business website',
                        deliveryTime: '1–2 Days',
                        featured: true
                      });
                    }}
                    className="w-full py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-lg hover:opacity-95 transition"
                  >
                    Confirm Order (₹850)
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950/85 border border-cyan-500/40 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="text-xs font-mono text-cyan-400 uppercase">Option 2</div>
                    <div className="text-xl font-black text-white mt-1">Website + Meta Ads / Promotion</div>
                    <div className="text-2xl font-black text-cyan-300 mt-2">₹700 + ₹400</div>
                    <p className="text-xs text-slate-300 mt-2">Complete business website combined with Meta Ads campaign management & promotion.</p>
                  </div>
                  <button
                    onClick={() => {
                      setPlanType('combo');
                      setOrderModalService({
                        id: 'srv-combo',
                        title: 'Website + Meta Ads / Promotion',
                        category: 'Growth & Meta Ads',
                        description: 'Website and promotion combo',
                        deliveryTime: '1–2 Days',
                        featured: true
                      });
                    }}
                    className="w-full py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs shadow-lg hover:opacity-95 transition"
                  >
                    Confirm Order (₹700 + ₹400)
                  </button>
                </div>
              </div>
            </TiltCard3D>
          </div>
        )}

        {customerTab === 'profile' && (
          <TiltCard3D glowColor="emerald" className="p-6 max-w-xl">
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 uppercase mb-1">Company</label>
                <input
                  type="text"
                  value={profileForm.company}
                  onChange={(e) => setProfileForm({ ...profileForm, company: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 uppercase mb-1">Phone</label>
                <input
                  type="text"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                />
              </div>
              <button type="submit" className="px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm">
                Save Changes
              </button>
            </form>
          </TiltCard3D>
        )}

        {customerTab === 'projects' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {projects.map((p) => (
              <TiltCard3D key={p.id} glowColor="emerald" className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-white">{p.title}</h3>
                    <p className="text-xs text-slate-400">{p.serviceType}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs bg-emerald-500/20 text-emerald-300">
                    {p.status}
                  </span>
                </div>
                {p.launchedUrl && (
                  <a
                    href={p.launchedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-xs font-bold text-cyan-300 underline"
                  >
                    🔗 {p.launchedUrl}
                  </a>
                )}
              </TiltCard3D>
            ))}
          </div>
        )}

        {customerTab === 'orders' && (
          <div className="space-y-4">
            {orders.map((o) => (
              <TiltCard3D key={o.id} glowColor="emerald" className="p-5 space-y-3">
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <div>
                    <div className="font-bold text-white text-base">{o.serviceTitle}</div>
                    <div className="text-xs text-slate-400">
                      Plan: {o.planType === 'website' ? 'Only Website (₹850)' : 'Website + Meta Ads (₹700 + ₹400)'} • {o.requirements}
                    </div>
                  </div>
                  <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    Status: {o.status}
                  </span>
                </div>
                {o.status === 'Completed' && (
                  <button
                    onClick={() => setReviewModalOrder(o)}
                    className="px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold"
                  >
                    ★ Rate & Review Project
                  </button>
                )}
              </TiltCard3D>
            ))}
          </div>
        )}

        {customerTab === 'tickets' && (
          <div className="space-y-6">
            <TiltCard3D glowColor="emerald" className="p-6">
              <form onSubmit={handleCreateTicket} className="space-y-4">
                <h3 className="font-bold text-white text-sm">Submit New Support Ticket / Complaint</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    value={newTicketSubject}
                    onChange={(e) => setNewTicketSubject(e.target.value)}
                    placeholder="Subject / Issue Title"
                    className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                  />
                  <select
                    value={newTicketPriority}
                    onChange={(e) => setNewTicketPriority(e.target.value)}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                  >
                    <option value="Low">Priority: Low</option>
                    <option value="Medium">Priority: Medium</option>
                    <option value="High">Priority: High</option>
                    <option value="Critical">Priority: Critical</option>
                  </select>
                </div>
                <div>
                  <textarea
                    rows={3}
                    required
                    value={newTicketMessage}
                    onChange={(e) => setNewTicketMessage(e.target.value)}
                    placeholder="Describe your question or complaint..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                  />
                </div>
                <button type="submit" className="px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs">
                  Submit Support Ticket
                </button>
              </form>
            </TiltCard3D>

            <div className="space-y-4">
              {tickets.map((t) => (
                <TiltCard3D key={t.id} glowColor="emerald" className="p-5 space-y-2">
                  <div className="flex justify-between">
                    <span className="font-bold text-white">{t.subject}</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300">{t.status}</span>
                  </div>
                  <p className="text-sm text-slate-300">{t.message}</p>
                  {t.adminReply && (
                    <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-xs text-emerald-200">
                      <strong>Admin Response:</strong> {t.adminReply}
                    </div>
                  )}
                </TiltCard3D>
              ))}
            </div>
          </div>
        )}

        {customerTab === 'invoices' && (
          <div className="space-y-3">
            {invoices.map((inv) => (
              <TiltCard3D key={inv.id} glowColor="emerald" className="p-5 flex justify-between items-center">
                <div>
                  <div className="font-mono font-bold text-white">{inv.invoiceNumber}</div>
                  <div className="text-xs text-slate-400">{inv.orderTitle} • ₹{inv.amount}</div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  inv.status === 'Paid'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}>
                  {inv.status}
                </span>
              </TiltCard3D>
            ))}
          </div>
        )}

        {customerTab === 'settings' && (
          <TiltCard3D glowColor="emerald" className="p-6 max-w-xl space-y-4">
            <h3 className="font-bold text-white">Customer Account Security</h3>
            <button onClick={onLogout} className="px-5 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-sm">
              Sign Out Session
            </button>
          </TiltCard3D>
        )}
      </main>
    </div>
  );
};

// ============================================================================
// 12. SECRET ADMIN LOGIN VIEW
// ============================================================================
const AdminLoginView = ({ onAdminSubmit, onBackPublic }) => {
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await onAdminSubmit(password);
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <TiltCard3D glowColor="rose" className="w-full max-w-md p-8 border-rose-500/30">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBackPublic} className="text-xs text-slate-400 hover:text-white">
            ← Public Website
          </button>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-rose-500/15 text-rose-300 border border-rose-500/30">
            RESTRICTED ADMIN
          </span>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6 text-rose-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Admin Gateway</h1>
            <p className="text-xs text-slate-400">VEXALQORA Command Center</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-mono uppercase text-rose-300 mb-1.5">
              Master Admin Password
            </label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin security key..."
                className="w-full px-4 py-3.5 pr-12 rounded-xl bg-slate-950 border border-rose-500/30 text-white font-mono text-sm focus:border-rose-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 text-white font-bold text-sm shadow-[0_0_25px_rgba(244,63,94,0.35)]"
          >
            {submitting ? 'Verifying...' : 'Unlock Admin Command Center'}
          </button>
        </form>
      </TiltCard3D>
    </div>
  );
};

// ============================================================================
// 13. PRIVATE ADMIN COMMAND CENTER (/admin/dashboard)
// ============================================================================
const AdminPortalLayout = ({
  adminTab,
  setAdminTab,
  onLogout,
  customers,
  projects,
  services,
  orders,
  tickets,
  invoices,
  inquiries,
  reviews,
  siteContent,
  notify
}) => {
  const [newProject, setNewProject] = useState({
    customerId: '',
    title: '',
    serviceType: 'Website Development',
    status: 'In Development',
    progress: 50,
    deadline: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
    launchedUrl: '',
    launchedFileCode: ''
  });

  const [contentForm, setContentForm] = useState(siteContent);
  useEffect(() => {
    setContentForm(siteContent);
  }, [siteContent]);

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'inquiries', label: `Inquiries (${inquiries.length})`, icon: Mail },
    { id: 'customers', label: `Customers (${customers.length})`, icon: Users },
    { id: 'projects', label: 'Projects & Launch', icon: Briefcase },
    { id: 'services', label: 'Services', icon: Cpu },
    { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
    { id: 'payments', label: `Invoices (${invoices.length})`, icon: CreditCard },
    { id: 'reviews', label: `Manage Reviews (${reviews.length})`, icon: Sparkles },
    { id: 'tickets', label: `Tickets (${tickets.length})`, icon: MessageSquare },
    { id: 'content', label: 'Website Content', icon: Globe }
  ];

  const handleAssignProject = async (e) => {
    e.preventDefault();
    const cust = customers.find((c) => c.id === newProject.customerId);
    if (!cust || !newProject.title) return;
    await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'projects'), {
      ...newProject,
      customerName: cust.name
    });
    setNewProject({
      customerId: '',
      title: '',
      serviceType: 'Website Development',
      status: 'In Development',
      progress: 50,
      deadline: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
      launchedUrl: '',
      launchedFileCode: ''
    });
    notify('success', 'Project created & synchronized to customer panel.');
  };

  const handleSaveContent = async (e) => {
    e.preventDefault();
    await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'siteConfig', 'main'), contentForm);
    notify('success', 'Website content updated live.');
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <aside className="lg:w-72 bg-slate-950/90 backdrop-blur-2xl border-b lg:border-b-0 lg:border-r border-rose-500/25 p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <div className="font-black text-white text-sm tracking-wider">ADMIN COMMAND</div>
              <div className="text-[10px] font-mono text-rose-400">VEXALQORA ROOT</div>
            </div>
          </div>

          <nav className="flex lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = adminTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setAdminTab(item.id)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                    active ? 'bg-rose-600 text-white font-bold shadow-lg' : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-slate-800 mt-4">
          <button
            onClick={onLogout}
            className="w-full py-2.5 px-3 rounded-xl bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Lock Admin Session</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 p-5 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono text-rose-400">ADMIN / {adminTab}</span>
            <h1 className="text-2xl sm:text-3xl font-black text-white capitalize">{adminTab}</h1>
          </div>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/35 text-xs font-mono text-rose-300">
            <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
            Admin Session Active
          </span>
        </div>

        {adminTab === 'dashboard' && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <TiltCard3D glowColor="rose" className="p-5 cursor-pointer" onClick={() => setAdminTab('customers')}>
              <div className="text-xs text-slate-400">Customers</div>
              <div className="text-3xl font-black text-white mt-1">{customers.length}</div>
            </TiltCard3D>
            <TiltCard3D glowColor="rose" className="p-5 cursor-pointer" onClick={() => setAdminTab('projects')}>
              <div className="text-xs text-slate-400">Projects & Launch</div>
              <div className="text-3xl font-black text-cyan-400 mt-1">{projects.length}</div>
            </TiltCard3D>
            <TiltCard3D glowColor="rose" className="p-5 cursor-pointer" onClick={() => setAdminTab('orders')}>
              <div className="text-xs text-slate-400">Orders</div>
              <div className="text-3xl font-black text-amber-400 mt-1">{orders.length}</div>
            </TiltCard3D>
            <TiltCard3D glowColor="rose" className="p-5 cursor-pointer" onClick={() => setAdminTab('reviews')}>
              <div className="text-xs text-slate-400">Customer Reviews</div>
              <div className="text-3xl font-black text-emerald-400 mt-1">{reviews.length}</div>
            </TiltCard3D>
          </div>
        )}

        {adminTab === 'inquiries' && (
          <div className="space-y-4">
            {inquiries.map((inq) => (
              <TiltCard3D key={inq.id} glowColor="rose" className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-white">{inq.name}</h3>
                    <p className="text-xs text-slate-400">{inq.email} {inq.phone ? `• ${inq.phone}` : ''}</p>
                  </div>
                  <button
                    onClick={async () => {
                      await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'inquiries', inq.id));
                      notify('success', 'Inquiry deleted.');
                    }}
                    className="p-2 rounded-lg bg-slate-900 text-rose-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 text-sm text-slate-200">{inq.message}</div>
              </TiltCard3D>
            ))}
          </div>
        )}

        {adminTab === 'customers' && (
          <div className="space-y-4">
            {customers.map((c) => (
              <TiltCard3D key={c.id} glowColor="rose" className="p-5 flex justify-between items-center">
                <div>
                  <div className="font-bold text-white">{c.name} (@{c.username})</div>
                  <div className="text-xs text-slate-400">{c.email} • Password: {c.password}</div>
                </div>
                <button
                  onClick={async () => {
                    await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'customers', c.id));
                    notify('success', 'Customer deleted.');
                  }}
                  className="p-2.5 rounded-xl bg-slate-900 text-rose-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </TiltCard3D>
            ))}
          </div>
        )}

        {adminTab === 'projects' && (
          <div className="space-y-6">
            <TiltCard3D glowColor="rose" className="p-6">
              <form onSubmit={handleAssignProject} className="space-y-4">
                <h3 className="font-bold text-white text-sm">Launch / Upload Website for Client</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <select
                    required
                    value={newProject.customerId}
                    onChange={(e) => setNewProject({ ...newProject, customerId: e.target.value })}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                  >
                    <option value="">Select Customer...</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>{c.name} (@{c.username})</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    required
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    placeholder="Project Title"
                    className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="url"
                    value={newProject.launchedUrl}
                    onChange={(e) => setNewProject({ ...newProject, launchedUrl: e.target.value })}
                    placeholder="Live Website URL (https://...)"
                    className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                  />
                  <select
                    value={newProject.status}
                    onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                  >
                    <option value="In Development">In Development</option>
                    <option value="Completed">Completed</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
                <div>
                  <textarea
                    rows={3}
                    value={newProject.launchedFileCode}
                    onChange={(e) => setNewProject({ ...newProject, launchedFileCode: e.target.value })}
                    placeholder="Paste website source code / notes for client view..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm font-mono"
                  />
                </div>
                <button type="submit" className="px-6 py-3 rounded-xl bg-rose-600 text-white font-bold text-sm">
                  Launch & Sync to Customer
                </button>
              </form>
            </TiltCard3D>

            <div className="space-y-3">
              {projects.map((p) => (
                <TiltCard3D key={p.id} glowColor="rose" className="p-5 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-white">{p.title}</div>
                    <div className="text-xs text-slate-400">Client: {p.customerName} • Status: {p.status}</div>
                  </div>
                  <button
                    onClick={async () => {
                      await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'projects', p.id));
                      notify('success', 'Project removed.');
                    }}
                    className="p-2 rounded-lg bg-slate-900 text-rose-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </TiltCard3D>
              ))}
            </div>
          </div>
        )}

        {adminTab === 'orders' && (
          <div className="space-y-4">
            {orders.map((o) => (
              <TiltCard3D key={o.id} glowColor="rose" className="p-5 flex flex-wrap justify-between items-center gap-4">
                <div>
                  <div className="font-bold text-white text-base">{o.serviceTitle}</div>
                  <div className="text-xs text-slate-300 mt-1">
                    Customer: <span className="text-cyan-300 font-semibold">{o.customerName}</span> ({o.customerUsername || o.customerEmail}) • Plan: <span className="text-emerald-300 font-semibold">{o.planType === 'website' ? 'Only Website (₹850)' : 'Website + Meta Ads (₹700 + ₹400)'}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">Requirements: {o.requirements}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    {o.status}
                  </span>
                  <select
                    value={o.status}
                    onChange={async (e) => {
                      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'orders', o.id), {
                        status: e.target.value
                      });
                      notify('success', `Order status updated to ${e.target.value}.`);
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-950 border border-rose-500/30 text-xs text-white font-bold focus:outline-none focus:border-rose-400"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <button
                    onClick={async () => {
                      await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'orders', o.id));
                      notify('success', 'Order deleted.');
                    }}
                    className="p-2 rounded-xl bg-slate-900 text-rose-400 hover:text-white"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </TiltCard3D>
            ))}
            {orders.length === 0 && (
              <div className="text-center py-12 text-slate-500 text-sm">
                No customer orders recorded in cloud yet.
              </div>
            )}
          </div>
        )}

        {adminTab === 'payments' && (
          <div className="space-y-4">
            {invoices.map((inv) => (
              <TiltCard3D key={inv.id} glowColor="rose" className="p-5 flex flex-wrap justify-between items-center gap-4">
                <div>
                  <div className="font-mono font-bold text-white text-base">{inv.invoiceNumber}</div>
                  <div className="text-xs text-slate-300 mt-0.5">
                    Client: <span className="text-cyan-300 font-semibold">{inv.customerName}</span> • {inv.orderTitle} • ₹{inv.amount}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    inv.status === 'Paid'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}>
                    {inv.status}
                  </span>
                  <select
                    value={inv.status}
                    onChange={async (e) => {
                      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'invoices', inv.id), {
                        status: e.target.value
                      });
                      notify('success', `Invoice ${inv.invoiceNumber} status updated to ${e.target.value}.`);
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-950 border border-rose-500/30 text-xs text-white font-bold focus:outline-none focus:border-rose-400"
                  >
                    <option value="Unpaid">Unpaid</option>
                    <option value="Paid">Paid</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                  <button
                    onClick={async () => {
                      await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'invoices', inv.id));
                      notify('success', 'Invoice deleted.');
                    }}
                    className="p-2 rounded-xl bg-slate-900 text-rose-400 hover:text-white"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </TiltCard3D>
            ))}
            {invoices.length === 0 && (
              <div className="text-center py-12 text-slate-500 text-sm">
                No invoices found in cloud database.
              </div>
            )}
          </div>
        )}

        {adminTab === 'reviews' && (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <TiltCard3D key={rev.id} glowColor="rose" className="p-5 flex justify-between items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{rev.customerName}</span>
                    <span className="text-amber-400 text-xs">
                      {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </span>
                  </div>
                  <div className="text-xs text-emerald-300 font-bold mt-1">{rev.reviewText}</div>
                  {rev.comment && <p className="text-xs text-slate-300 mt-1">{rev.comment}</p>}
                </div>
                <button
                  onClick={async () => {
                    await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'reviews', rev.id));
                    notify('success', 'Review deleted from public display.');
                  }}
                  className="p-2 rounded-xl bg-slate-900 text-rose-400 hover:text-white"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </TiltCard3D>
            ))}
            {reviews.length === 0 && (
              <div className="text-center py-12 text-slate-500 text-sm">
                No customer reviews submitted yet.
              </div>
            )}
          </div>
        )}

        {adminTab === 'tickets' && (
          <div className="space-y-4">
            {tickets.map((t) => (
              <TiltCard3D key={t.id} glowColor="rose" className="p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-white text-base">{t.subject}</div>
                    <div className="text-xs text-cyan-300">Client: {t.customerName} • Priority: {t.priority}</div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs bg-amber-500/20 text-amber-300">{t.status}</span>
                </div>
                <p className="text-sm text-slate-300">{t.message}</p>
                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <input
                    type="text"
                    placeholder="Type admin reply..."
                    onKeyDown={async (e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const val = e.target.value;
                        if (!val) return;
                        await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'tickets', t.id), {
                          adminReply: val,
                          status: 'Resolved'
                        });
                        notify('success', 'Admin reply sent to customer.');
                        e.target.value = '';
                      }
                    }}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                  {t.adminReply && (
                    <div className="text-xs text-emerald-300">
                      <strong>Reply:</strong> {t.adminReply}
                    </div>
                  )}
                </div>
              </TiltCard3D>
            ))}
          </div>
        )}

        {adminTab === 'content' && (
          <TiltCard3D glowColor="rose" className="p-6 max-w-2xl">
            <form onSubmit={handleSaveContent} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 uppercase mb-1">Hero Headline</label>
                <input
                  type="text"
                  value={contentForm.heroTitle}
                  onChange={(e) => setContentForm({ ...contentForm, heroTitle: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                />
              </div>
              <button type="submit" className="px-6 py-3 rounded-xl bg-rose-600 text-white font-bold text-sm">
                Publish Content
              </button>
            </form>
          </TiltCard3D>
        )}
      </main>
    </div>
  );
};
