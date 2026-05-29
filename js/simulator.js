/**
 * Simulador de sincronización Maestro → Alumno
 * Usa Firestore en tiempo real cuando Firebase está configurado;
 * de lo contrario funciona en modo local (misma pestaña).
 */
(function () {
  const APP_URL = "https://escuelasabatica-sable.vercel.app";
  const SIM_DOC_PATH = "landing_simulator/demo";

  const simData = {
    1: {
      Lección: {
        title: "Semana 1: Lección Interactiva",
        desc: "La gran controversia cósmica y el plan redentor de la gracia divina revelado en las Sagradas Escrituras.",
      },
      Visual: {
        title: "Semana 1: Material Visual",
        desc: "Gráficos cronológicos, infografías de los imperios bíblicos y mapas de las tierras de la profecía.",
      },
      Resumen: {
        title: "Semana 1: Resumen Semanal",
        desc: "Puntos clave y lecciones espirituales prácticas sintetizadas para un repaso rápido y conciso.",
      },
      Preguntas: {
        title: "Semana 1: Preguntas de Discusión",
        desc: "Preguntas disparadoras de debate para reflexionar de forma grupal y compartir testimonios.",
      },
    },
    2: {
      Lección: {
        title: "Semana 2: Lección Interactiva",
        desc: "El pacto de Dios en el Sinaí, los estatutos de amor y la relación viva de fe para hoy en día.",
      },
      Visual: {
        title: "Semana 2: Ilustraciones del Templo",
        desc: "Representaciones artísticas 3D del tabernáculo, sus utensilios y el profundo simbolismo del santuario.",
      },
      Resumen: {
        title: "Semana 2: Resumen del Pacto",
        desc: "Resumen de las promesas divinas, la ley moral y la respuesta activa de obediencia por amor.",
      },
      Preguntas: {
        title: "Semana 2: Preguntas para la Clase",
        desc: "Cuestionamientos sobre cómo vivir el pacto en el hogar, el trabajo y las presiones de la vida moderna.",
      },
    },
    3: {
      Lección: {
        title: "Semana 3: Lección Interactiva",
        desc: "La profecía de Daniel y Apocalipsis: Esperanza para el pueblo remanente en los tiempos de prueba.",
      },
      Visual: {
        title: "Semana 3: Gráfico de los 2300 días",
        desc: "Líneas de tiempo detalladas del cumplimiento profético de Daniel 8 y el inicio del juicio investigador.",
      },
      Resumen: {
        title: "Semana 3: Síntesis Profética",
        desc: "Puntos esenciales de las profecías apocalípticas y cómo alimentan nuestra certeza en el regreso de Cristo.",
      },
      Preguntas: {
        title: "Semana 3: Preguntas sobre la Profecía",
        desc: "Dinámicas para analizar el mensaje de los tres ángeles y nuestro rol en la proclamación del evangelio eterno.",
      },
    },
  };

  let currentSimWeek = 1;
  let currentSimMaterial = "Lección";
  let whiteboardOpen = false;
  let firebaseReady = false;
  let simDocRef = null;
  let applyingRemote = false;

  function isFirebaseConfigured() {
    const cfg = window.FIREBASE_CONFIG;
    return cfg && cfg.apiKey && cfg.apiKey !== "TU_API_KEY" && cfg.projectId && cfg.projectId !== "tu-proyecto-id";
  }

  function initFirebase() {
    if (!isFirebaseConfigured() || typeof firebase === "undefined") {
      updateFirebaseStatus("Modo local", false);
      return;
    }

    try {
      if (!firebase.apps.length) {
        firebase.initializeApp(window.FIREBASE_CONFIG);
      }
      const db = firebase.firestore();
      simDocRef = db.doc(SIM_DOC_PATH);

      simDocRef.onSnapshot(
        (snap) => {
          if (!snap.exists) {
            simDocRef.set({
              week: 1,
              material: "Lección",
              whiteboardOpen: false,
              updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            });
            return;
          }
          applyingRemote = true;
          const data = snap.data();
          currentSimWeek = data.week || 1;
          currentSimMaterial = data.material || "Lección";
          whiteboardOpen = !!data.whiteboardOpen;
          updateSimUI();
          applyingRemote = false;
        },
        (err) => {
          console.warn("Firestore listener:", err);
          updateFirebaseStatus("Error de conexión", false);
        }
      );

      firebaseReady = true;
      updateFirebaseStatus("Sincronizando vía Firebase Firestore", true);
    } catch (err) {
      console.warn("Firebase init:", err);
      updateFirebaseStatus("Modo local", false);
    }
  }

  function updateFirebaseStatus(text, active) {
    const el = document.getElementById("firebaseStatusText");
    const dot = document.getElementById("firebaseStatusDot");
    if (el) el.textContent = text;
    if (dot) {
      dot.className = active
        ? "w-2 h-2 rounded-full bg-emerald-500"
        : "w-2 h-2 rounded-full bg-yellow-500";
    }
  }

  async function pushSimState() {
    if (applyingRemote || !firebaseReady || !simDocRef) return;
    try {
      await simDocRef.set(
        {
          week: currentSimWeek,
          material: currentSimMaterial,
          whiteboardOpen,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
    } catch (err) {
      console.warn("Firestore write:", err);
    }
  }

  function updateSimUI() {
    document.querySelectorAll(".sim-week-btn").forEach((btn) => {
      btn.classList.remove("bg-sabado-accent", "text-sabado-primary", "font-bold");
      btn.classList.add("bg-sabado-secondary", "text-white", "font-medium");
    });
    const activeWeekBtn = document.getElementById(`simWeek${currentSimWeek}`);
    if (activeWeekBtn) {
      activeWeekBtn.classList.remove("bg-sabado-secondary", "text-white", "font-medium");
      activeWeekBtn.classList.add("bg-sabado-accent", "text-sabado-primary", "font-bold");
    }

    document.querySelectorAll(".sim-mat-btn").forEach((btn) => {
      btn.classList.remove("bg-sabado-accent", "text-sabado-primary", "font-bold");
      btn.classList.add("bg-sabado-secondary", "text-white", "font-medium");
    });
    const matIds = { Lección: "simMatLec", Visual: "simMatVis", Resumen: "simMatRes", Preguntas: "simMatPre" };
    const activeMatBtn = document.getElementById(matIds[currentSimMaterial]);
    if (activeMatBtn) {
      activeMatBtn.classList.remove("bg-sabado-secondary", "text-white", "font-medium");
      activeMatBtn.classList.add("bg-sabado-accent", "text-sabado-primary", "font-bold");
    }

    const data = simData[currentSimWeek][currentSimMaterial];
    const weekEl = document.getElementById("simLabelWeek");
    const titleEl = document.getElementById("simLabelTitle");
    const descEl = document.getElementById("simLabelDesc");
    if (weekEl) weekEl.textContent = `Semana ${currentSimWeek}`;
    if (titleEl) titleEl.textContent = data.title;
    if (descEl) descEl.textContent = data.desc;

    toggleSimWhiteboard(whiteboardOpen, false);

    const syncInd = document.getElementById("simSyncIndicator");
    if (syncInd) {
      syncInd.textContent = "¡SINCRONIZADO!";
      syncInd.className =
        "flex items-center gap-1.5 text-[10px] bg-emerald-500 text-white border border-emerald-400 px-2 py-0.5 rounded animate-pulse font-bold";
      setTimeout(() => {
        syncInd.textContent = "CON EL MAESTRO";
        syncInd.className =
          "flex items-center gap-1.5 text-[10px] bg-sabado-secondary/30 text-sabado-accent border border-sabado-accent/20 px-2 py-0.5 rounded font-semibold";
      }, 1000);
    }
  }

  function setSimWeek(week) {
    currentSimWeek = week;
    updateSimUI();
    pushSimState();
  }

  function setSimMaterial(material) {
    currentSimMaterial = material;
    updateSimUI();
    pushSimState();
  }

  function toggleSimWhiteboard(isOpen, push = true) {
    whiteboardOpen = isOpen;
    const overlay = document.getElementById("simWhiteboardOverlay");
    const openBtn = document.getElementById("simBoardOpen");
    const closeBtn = document.getElementById("simBoardClose");
    if (!overlay) return;

    if (isOpen) {
      overlay.classList.remove("hidden");
      openBtn?.classList.add("bg-yellow-500");
      closeBtn?.classList.remove("bg-gray-500");
      closeBtn?.classList.add("bg-gray-600");
    } else {
      overlay.classList.add("hidden");
      openBtn?.classList.remove("bg-yellow-500");
      openBtn?.classList.add("bg-sabado-accent");
      closeBtn?.classList.add("bg-gray-500");
      closeBtn?.classList.remove("bg-gray-600");
    }
    if (push) pushSimState();
  }

  window.setSimWeek = setSimWeek;
  window.setSimMaterial = setSimMaterial;
  window.toggleSimWhiteboard = toggleSimWhiteboard;
  window.APP_URL = APP_URL;

  document.addEventListener("DOMContentLoaded", () => {
    initFirebase();
    updateSimUI();
  });
})();
