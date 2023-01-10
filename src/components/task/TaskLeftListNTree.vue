<script setup lang="ts">
import type { TreeOption } from 'naive-ui'
import { NTree } from 'naive-ui'
import { ref } from 'vue'
import { useProjectSelectedStatusStore, useTaskStore } from '@/store'

const projectSelectedStatusStore = useProjectSelectedStatusStore()
const taskStore = useTaskStore()

const data = ref<any[]>([
  {
    key: 100,
    label: '清单',
    checkboxDisabled: false,
    isLeaf: false,
    children: taskStore.treeProjectChildren.length
      ? taskStore.treeProjectChildren
      : [{
          label: '用清单来分类收集、组织和管理你的任务和笔记',
          placeholder: true,
        }],
  },
  {
    key: 200,
    label: '标签',
    checkboxDisabled: false,
    isLeaf: false,
    children: [].length
      ? []
      : [{
          label: '以标签的维度展示不同清单的任务。在添加任务时输入“#”可快速选择标签',
          placeholder: true,
        }],
  },
])
const nodeProps = ({ option }: { option: TreeOption }) => {
  return {
    onClick() {
      if (treeOption.option.key === 100)
        return
      const projectName = treeOption.option.label
      taskStore.changeCurrentActiveProject(projectName)
    },
    class: option.placeholder ? 'placeholder' : '',
  }
}

const changeSelectedKey = (key: number[]) => {
  projectSelectedStatusStore.changeSelectedKey(key)
}
</script>

<template>
  <NTree
    v-model:selected-keys="projectSelectedStatusStore.selectedKey"
    :default-expanded-keys="projectSelectedStatusStore.listDefaultSelectedKey"
    block-line
    expand-on-click
    :data="data"
    :node-props="nodeProps"
    @update:selected-keys="changeSelectedKey"
  />
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
</style>
