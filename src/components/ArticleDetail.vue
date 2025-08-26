<template>
  <div class="banner">
    <div class="container">
      <h1>{{ article.title }}</h1>

      <ArticleDetailMeta
        v-if="article"
        :article="article"
        @update="updateArticle"
        @showRevisions="onShowRevisions"
      />
    </div>
  </div>

  <div class="container page">
    <div class="row article-content">
      <!-- eslint-disable vue/no-v-html -->
      <div id="article-content" class="col-md-12" v-html="articleHandledBody" />
      <!-- eslint-enable vue/no-v-html -->

      <div v-if="revertMsg" :class="['alert', revertMsgType === 'success' ? 'alert-success' : 'alert-danger']" style="margin: 1em 0;">
        {{ revertMsg }}
      </div>
      <!-- TODO: abstract tag list component -->
      <ul class="tag-list">
        <li
          v-for="tag in article.tagList"
          :key="tag"
          class="tag-default tag-pill tag-outline"
        >
          {{ tag }}
        </li>
      </ul>
    </div>



    <div class="article-actions">
      <ArticleDetailMeta
        v-if="article"
        :article="article"
        @update="updateArticle"
        @showRevisions="onShowRevisions"
      />
      <hr>

       <!-- Article Revisions List -->
    <ArticleDetailRevisionsList
      v-if="showRevisionsList"
      :revisions="revisions"
      @revert="revertToRevision"
    />

    <hr>
    </div>
  </div>
</template>

<script setup lang="ts">
import Swal from 'sweetalert2'
import { computed, reactive, ref } from 'vue'
  const revertMsg = ref('')
  const revertMsgType = ref<'success' | 'error'>('success')
import { useRoute } from 'vue-router'
import marked from 'src/plugins/marked'
import { api } from 'src/services'
import type { Article } from 'src/services/api'
import ArticleDetailMeta from './ArticleDetailMeta.vue'
import ArticleDetailRevisionsList from './ArticleDetailRevisionsList.vue'
import type { ArticleRevision } from 'src/services/api'

const route = useRoute()
const slug = route.params.slug as string
const article: Article = reactive(await api.articles.getArticle(slug).then(res => res.data.article))
const showRevisionsList = ref(false)
const revisions = ref<ArticleRevision[]>([])

const articleHandledBody = computed(() => marked(article.body))


function updateArticle(newArticle: Article) {
  Object.assign(article, newArticle)
}

async function onShowRevisions() {
  // Always use the current article.slug for API calls
  const res = await api.articles.getArticleRevisions(article.slug)
  revisions.value = res.data.data || []
  showRevisionsList.value = true
}


import { useRouter } from "vue-router";

const router = useRouter();

async function revertToRevision(revisionId: number) {
  try {
    // Always use the current article.slug for API calls
    let revetRes = await api.articles.revertArticleToRevision(article.slug, revisionId)
    let newSlug = revetRes?.data?.data?.slug;
    await Swal.fire({
      icon: 'success',
      title: 'Success',
      text: 'Article successfully reverted to the selected revision.',
      timer: 2500,
      showConfirmButton: false
    })
    if (!newSlug) {
      return;
    }

    // Change slug in the URL
    router.push({ name: "article", params: { slug: newSlug } });
    // Refresh the article data
    const res = await api.articles.getArticle(newSlug)
    Object.assign(article, res.data.article)

    // Refresh the revisions list
    const revRes = await api.articles.getArticleRevisions(newSlug)
    revisions.value = revRes.data.data || []
    showRevisionsList.value = true
  } catch (err: any) {
    const errorMsg = err?.error?.body?.[0] || err?.message || 'Failed to revert article.'
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: errorMsg,
      timer: 2000,
      showConfirmButton: false
    })
  }
}
</script>
