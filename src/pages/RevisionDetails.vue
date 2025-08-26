<template>
  <div class="revision-details-page">
    <h2 style="text-align: center;">Revision Details</h2>
    <div v-if="revision">
      <h3>title: {{ revision.title }}</h3>
      <p><strong>Description:</strong> {{ revision.description }}</p>
      <div><strong>Body:</strong></div>
      <pre class="revision-body">{{ revision.body }}</pre>

      <div v-if="revision.tags && revision.tags.length">
        <strong>Tags:</strong>
        <ul class="revision-tags">
          <li v-for="tag in revision.tags" :key="tag">{{ tag }}</li>
        </ul>
      </div>

      <div class="revision-meta">
        <span>By: {{ revision.author.username }}</span> |
        <span>{{ new Date(revision.createdAt).toLocaleString() }}</span>
      </div>
      <div style="display: flex; justify-content: end;">
        <button
          v-if="revision && userStore.isAuthorized"
          class="btn btn-outline-primary mt-3"

          @click="revertRevision"
        >
          Revert to this Revision
        </button>
      </div>
    </div>
    <div v-else>
      <p>Loading revision details...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { api } from "src/services";
import { withSweetAlert } from "src/utils/withSweetAlert";
import { useUserStore } from "src/store/user";
import type { ArticleRevision } from "src/services/api";

const route = useRoute();
const router = useRouter();
const slug = route.params.slug as string;
const revisionId = route.params.revisionId as string;
const revision = ref<ArticleRevision | null>(null);
const userStore = useUserStore();

onMounted(async () => {
  const res = await api.articles.getArticleRevisionDetails(slug, revisionId);
    revision.value = res.data.data || null; // assuming API returns { data: { id, title, body, ... } }


});

async function revertRevision() {
  const reverted = await withSweetAlert(
    () => api.articles.revertArticleToRevision(slug, Number(revisionId)),
    "Article successfully reverted to this revision!"
  );
  if (
    reverted &&
    reverted.data &&
    reverted.data.data &&
    reverted.data.data.slug
  ) {
    router.push({ name: "article", params: { slug: reverted.data.data.slug } });
  }
}
</script>

<style scoped>
.revision-details-page {
  max-width: 700px;
  margin: 2rem auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 2rem;
}
.revision-body {
  background: #f9f9f9;
  padding: 1em;
  border-radius: 4px;
  white-space: pre-wrap;
  margin-bottom: 1em;
}
.revision-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
  list-style: none;
  padding: 0;
  margin: 0.5em 0 1em 0;
}
.revision-tags li {
  background: #f3f3f3;
  border-radius: 3px;
  padding: 2px 8px;
  font-size: 0.95em;
  color: #555;
}
.revision-meta {
  color: #888;
  font-size: 0.95em;
  margin-top: 1em;
}
</style>
