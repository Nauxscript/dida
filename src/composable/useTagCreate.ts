import { useDialog, useMessage } from 'naive-ui'
import { h } from 'vue'
import TagCreateView from '@/components/task/TagCreateView.vue'

export function useTagCreate() {
  const dialog = useDialog()
  const message = useMessage()
  function onShowCreateTag() {
    dialog.create({
      title: '添加清单',
      showIcon: false,
      content: () => h(TagCreateView),
      onPositiveClick: () => {
        message.success('确定')
      },
      onNegativeClick: () => {
        message.error('不确定')
      },
      onClose: () => {
        message.error('关闭')
      },
    })
  }

  return {
    onShowCreateTag,
  }
}
