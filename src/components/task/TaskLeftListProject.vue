<script setup lang="ts">
import type { TreeOption } from 'naive-ui'
import { NTree } from 'naive-ui'
import { Icon } from '@iconify/vue'
import { h, onMounted, ref, watchEffect } from 'vue'
import TagCreateView from './TagCreateView.vue'
import { useProjectSelectedStatusStore, useTaskStore } from '@/store'
import 'vue3-emoji-picker/css'
import ProjectCreateView from '@/components/task/ProjectCreatedView.vue'
import { TreeRootKeys } from '@/services/task/task'

const { projectViewRef, projectRender } = useCreateProjectButton()

function useCreateProjectButton() {
  const projectViewRef = ref()
  const projectRender = ref(undefined)
  onMounted(() => {
    projectRender.value = projectViewRef.value.renderCreateProjectButton
  })
  return {
    projectRender, projectViewRef,
  }
}

const projectSelectedStatusStore = useProjectSelectedStatusStore()
const taskStore = useTaskStore()
const createTagVisible = ref(false)

// fake data to simulate tags render
const fakeTagsNamesData = ref<TreeOption[]>([{
  label: 'tag 1',
  color: '#2b9fda',
  isLeaf: true,
  prefix: () => h(Icon, {
    icon: 'carbon:tag',
    width: '18',
  }),
  suffix: () => h('div', { class: 'flex flex-row items-center' },
    [
      h(Icon, {
        icon: 'carbon:circle-solid',
        width: '6',
        color: '#2b9fda',
        class: 'mx-2',
      }),
      h(Icon, {
        icon: 'mdi:dots-horizontal',
        width: '20',
      }),
    ],
  ),

}])
const defaultExpandedKeys = ref<TreeRootKeys[]>([])
const treeProjectChildren = ref<TreeOption[]>([])
const treeTagChildren = ref<TreeOption[]>([])

watchEffect(() => {
  treeProjectChildren.value = taskStore.projectNames.map((projectname, index) => ({
    key: TreeRootKeys.PROJECT + index + 1,
    label: projectname,
    isleaf: true,
  }))
  treeTagChildren.value = taskStore.tagsData.map((tag, index) => ({
    key: TreeRootKeys.PROJECT + index + 1,
    label: tag.name,
    color: tag.color,
    prefix: () => h(Icon, {
      icon: 'carbon:tag',
      width: '18',
    }),
    suffix: () => h('div', { class: 'flex flex-row items-center' },
      [
        h(Icon, {
          icon: 'carbon:circle-solid',
          width: '6',
          color: '#2b9fda',
          class: 'mx-2',
        }),
        h(Icon, {
          icon: 'mdi:dots-horizontal',
          width: '20',
        }),
      ],
    ),
    isleaf: true,
  }))
  defaultExpandedKeys.value = [...new Set([
    ...(taskStore.projectNames.length ? [] : [TreeRootKeys.PROJECT]),
    ...(treeTagChildren.value.length ? [] : [TreeRootKeys.TAG]),
    ...projectSelectedStatusStore.listDefaultSelectedKey,
  ])]
})

const data = ref<any[]>([
  {
    key: TreeRootKeys.PROJECT,
    label: '清单',
    checkboxDisabled: false,
    isLeaf: false,
    children: treeProjectChildren,
  },
  {
    key: TreeRootKeys.TAG,
    label: '标签',
    checkboxDisabled: false,
    isLeaf: false,
    children: treeTagChildren.value.length
      ? treeTagChildren.value
      : [{
          label: '以标签的维度展示不同清单的任务。在添加任务时输入“#”可快速选择标签',
          placeholder: true,
        }],
    suffix: () => h(Icon, {
      icon: 'ic:baseline-plus',
      width: '20',
      class: 'invisible rounded-1 hover:bg-gray-2',
      onclick(e: Event) {
        createTagVisible.value = true
        e.stopPropagation()
      },
    }),
  },
])

const nodeProps = ({ option }: { option: TreeOption }) => {
  return {
    onClick() {
      if (option.key === TreeRootKeys.PROJECT || option.key === TreeRootKeys.TAG)
        return
      const nodeName = option.label
      if (!nodeName || !option.key)
        return
      // tag children
      if (option.key < 200)
        return taskStore.changeCurrentActiveArchive(TreeRootKeys.TAG, nodeName)

      // project children
      taskStore.changeCurrentActiveArchive(TreeRootKeys.PROJECT, nodeName)
    },
    class: option.placeholder ? 'placeholder' : '',
  }
}

const changeSelectedKey = (key: number[]) => {
  if (key[0] === TreeRootKeys.PROJECT)
    projectSelectedStatusStore.changePreSelectKey(projectSelectedStatusStore.selectedKey)

  projectSelectedStatusStore.changeSelectedKey(key)
}

const onExpandedKey = (key: number[]) => {
  if (key.includes(TreeRootKeys.PROJECT))
    projectSelectedStatusStore.changeSelectedKey(projectSelectedStatusStore.preSelectKey)
}
</script>

<template>
  <NTree
    v-model:selected-keys="projectSelectedStatusStore.selectedKey"
    :default-expanded-keys="defaultExpandedKeys"
    block-line
    expand-on-click
    :data="data"
    :node-props="nodeProps"
    @update:expanded-keys="onExpandedKey"
    @update:selected-keys="changeSelectedKey"
  />
  <ProjectCreateView ref="projectViewRef" />
  <TagCreateView v-model:show="createTagVisible" />
</template>

<style>
.n-tree.n-tree--block-line .n-tree-node:not(.n-tree-node--disabled).n-tree-node--pending {
  background-color: transparent;
}
.n-tree.n-tree--block-line .n-tree-node:not(.n-tree-node--disabled).n-tree-node--selected {
  background-color: var(--n-node-color-active)
}

.n-tree-node-wrapper .placeholder .n-tree-node-indent {
  display: none;
}

.n-tree-node-wrapper .placeholder .n-tree-node-switcher {
  display: none;
}

.n-tree-node-wrapper .placeholder {
  pointer-events: none;
  padding: 6px 8px;
  margin: 0 8px 0 20px;
  background-color: rgb(25, 25, 25, 0.03);
  border-radius: 4px;
}

.n-tree-node-wrapper .placeholder .n-tree-node-content__text {
  color: rgb(25, 25, 25, 0.4);
  font-size: 12px;
}

.dark .n-tree-node-wrapper .placeholder {
  background-color: rgb(59,59,59, 1);
}

.dark .placeholder .n-tree-node-content__text {
  color: rgba(156,163,175,0.5);
}

.n-tree.n-tree--block-line .n-tree-node:not(.n-tree-node--disabled):hover .iconify  {
  visibility: visible;
}
</style>
