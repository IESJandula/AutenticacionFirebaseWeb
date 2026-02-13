<template>
  <div class="page">
    <div class="card">
      <div class="header">
        <div class="somos">SEMOS</div>
        <div class="brand">Jándula</div>
      </div>

      <button class="google-btn" @click="loginWithGoogle" :disabled="loading">
        <span class="g-icon">G</span>
        <span>{{ loading ? "Conectando..." : "Conecta con Google" }}</span>
      </button>

      <div v-if="status" class="status">{{ status }}</div>
      <div v-if="error" class="error">{{ error }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const router = useRouter();

const firebaseConfig = {
  apiKey: "AIzaSyC6sN1RVExWAjlvl0oudTLHfexxJKiOTcg",
  authDomain: "reaktor-c18c4.firebaseapp.com",
  projectId: "reaktor-c18c4",
  storageBucket: "reaktor-c18c4.firebasestorage.app",
  messagingSenderId: "621047726640",
  appId: "1:621047726640:web:0ea4396831204adff3a3f5",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const loading = ref(false);
const status = ref("");
const error = ref("");

function decodeJwtPayload(token) {
  const parts = token.split(".");
  if (parts.length < 2) return null;

  const base64Url = parts[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "===".slice((base64.length + 3) % 4);

  try {
    const json = atob(padded);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function extractRoles(payload) {
  const roles = [];
  if (Array.isArray(payload?.roles)) roles.push(...payload.roles);
  if (Array.isArray(payload?.authorities)) roles.push(...payload.authorities);

  return roles.map((r) => (typeof r === "string" ? r.replace(/^ROLE_/, "") : r));
}

async function loginWithGoogle() {
  loading.value = true;
  error.value = "";
  status.value = "Abriendo Google...";

  try {
    const result = await signInWithPopup(auth, provider);
    const idToken = await result.user.getIdToken(true);

    status.value = "Enviando token a backend...";

    const res = await fetch("/api/auth/exchange", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Error del backend: ${res.status} ${text}`);
    }

    const data = await res.json();
    const jwt = data.token;

    // ✅ Guarda el JWT (para Admin/User)
    localStorage.setItem("jwt", jwt);

    // ✅ Redirige según roles
    const payload = decodeJwtPayload(jwt);
    const roles = extractRoles(payload);

    status.value = "Login correcto ✅ Redirigiendo...";

    if (roles.includes("ADMIN")) {
      router.push("/admin");
    } else {
      router.push("/user");
    }
  } catch (e) {
    error.value = e?.message || String(e);
    status.value = "Error ❌";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #6fa7c8;
  font-family: Arial, sans-serif;
}

.card {
  background: white;
  padding: 40px;
  border-radius: 10px;
  text-align: center;
  width: 400px;
}

.somos {
  color: #2e76a8;
  font-weight: bold;
  font-size: 22px;
}

.brand {
  color: #1f6fa3;
  font-weight: bold;
  font-size: 32px;
  margin-bottom: 20px;
}

.google-btn {
  margin: 30px auto 0;
  padding: 12px 24px;
  border-radius: 30px;
  border: 1px solid #ccc;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  background: #f3f3f3;
  width: fit-content;
}

.google-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.g-icon {
  font-weight: bold;
  color: #4285f4;
}

.status {
  margin-top: 15px;
}

.error {
  margin-top: 15px;
  color: red;
}
</style>
