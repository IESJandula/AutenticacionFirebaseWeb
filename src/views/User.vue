<template>
  <div class="page">
    <h1>Eres usuario 👤</h1>

    <div v-if="jwt" class="token-box">
      <div class="token-title">Token (JWT):</div>
      <code class="token">{{ jwt }}</code>

      <a class="jwt-link" href="https://jwt.io" target="_blank" rel="noopener noreferrer">
        Abrir jwt.io
      </a>
    </div>

    <button @click="logout" class="logout-btn">Cerrar sesión</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const jwt = ref("");

onMounted(() => {
  jwt.value = history.state?.jwt || "";
  if (!jwt.value) jwt.value = localStorage.getItem("jwt") || "";
});

function logout() {
  localStorage.removeItem("jwt");
  router.push("/");
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  gap: 18px;
  padding: 24px;
  font-family: Arial, sans-serif;
}

.token-box {
  width: min(900px, 92vw);
  background: white;
  border: 1px solid #e6e6e6;
  border-radius: 10px;
  padding: 16px;
  text-align: left;
}

.token-title {
  font-weight: 700;
  margin-bottom: 8px;
}

.token {
  display: block;
  white-space: pre-wrap;
  word-break: break-word;
  background: #f6f6f6;
  border: 1px solid #ededed;
  border-radius: 8px;
  padding: 12px;
  font-size: 12px;
}

.jwt-link {
  display: inline-block;
  margin-top: 10px;
  color: #2e76a8;
  text-decoration: none;
}

.jwt-link:hover {
  text-decoration: underline;
}

.logout-btn {
  padding: 10px 18px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  background: #3498db;
  color: white;
  font-weight: 700;
}
</style>
