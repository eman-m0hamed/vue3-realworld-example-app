<template>
  <div class="article-revisions-list">
    <h3>Article Revisions</h3>
    <ul v-if="revisions.length">
      <li
        v-for="rev in [...revisions].reverse()"
        :key="rev.id"
        class="revision-item"
      >
        <router-link
          :to="{
            name: 'revision-details',
            params: { slug: rev.articleId, revisionId: rev.id },
          }"
          class="revision-link"
          style="text-decoration: none; color: inherit; display: block"
        >
          <div class="revision-header">
            <div>
              <strong class="revision-title">{{ rev.title }}</strong>
              <span class="revision-meta"
                >by {{ rev.author.username }} &bull;
                {{ new Date(rev.createdAt).toLocaleString() }}</span
              >
            </div>
            <button
              v-if="isAuthorized"
              class="btn btn-sm btn-outline-primary revert-btn"
              @click.stop.prevent="$emit('revert', rev.id)"
            >
              Revert
            </button>
          </div>
          <div class="revision-description" style="text-align: left;">
            {{ rev.description.length > 30 ? rev.description.slice(0, 30) + '...' : rev.description }}
          </div>

          <div v-if="rev.tags && rev.tags.length" class="tags-row">
            <strong style="margin-right: 0.5em;">Tags:</strong>
            <ul class="revision-tags">
              <li v-for="tag in rev.tags" :key="tag">{{ tag }}</li>
            </ul>
          </div>
        </router-link>
      </li>
    </ul>
    <div v-else>No revisions found.</div>
  </div>
</template>

<script setup lang="ts">
import type { ArticleRevision } from "src/services/api";
import { defineProps, defineEmits } from "vue";
import { useUserStore } from "src/store/user";
import { storeToRefs } from "pinia";

const props = defineProps<{ revisions: ArticleRevision[] }>();
const emit = defineEmits<{ (e: "revert", revisionId: string): void }>();

const { isAuthorized } = storeToRefs(useUserStore());
</script>

<style scoped>
.article-revisions-list {
  margin-top: 2rem;
}
.revision-item {
  border-bottom: 1px solid #eee;
  padding: 1rem 0 0 0;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 1.2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}
.revision-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5em;
}
.revision-title {
  font-size: 1.1em;
  color: #2d3a4b;
  margin-right: 0.5em;
}
.revision-meta {
  color: #888;
  font-size: 0.9em;
}
.revision-description {
  margin: 0.5em 0;
  font-family: monospace;
  background: #f9f9f9;
  padding: 0.5em;
  border-radius: 4px;
  white-space: pre-wrap;
  text-align: left;
}
.tags-row {
  display: flex;
  margin-bottom: 0.5em;
  text-align: left;
}
.revision-body {
  margin-bottom: 0.5em;
  color: #555;
}
.revision-tags {
  list-style: none;
  padding: 0;
  margin: 0 0 0.5em 0;
  display: flex;
  flex-wrap: wrap;
}
.revision-tags li {
  margin-right: 0.5em;
  background: #f3f3f3;
  border-radius: 3px;
  padding: 2px 8px;
  font-size: 0.95em;
  color: #555;
}
.revert-btn {
  margin-left: auto;
  margin-top: 0;
  align-self: flex-start;
}
</style>
