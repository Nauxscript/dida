import { computed, reactive, ref } from 'vue'
import { defineStore } from 'pinia'
// import { TreeRootKeys } from '../services/task'
import type { Project, Task } from '../services/task'
import { TreeRootKeys } from '../services/task'
import * as taskService from '../services/task'
import type { Tag } from '@/services/task/tag'

export const useTaskStore = defineStore('task', () => {
  const projects = reactive(taskService.projects)
  const tags = reactive(taskService.tags)
  const currentActiveTask = ref<Task>()
  // const currentActiveProject = ref<Project | undefined>(projects[0])
  const currentActiveArchive = ref<Project | Tag | undefined>(projects[0])

  const projectNames = computed(() => {
    return projects.map((project) => {
      return project.name
    })
  })

  const tagsData = computed(() => {
    return tags.map(({ name, color }) => ({
      name,
      color,
    }))
  })

  function addTask(title: string) {
    const task = taskService.createTask(title)
    taskService.addTask(task, currentActiveArchive.value!)
    changeActiveTask(task)
  }

  function changeActiveTask(task: Task | undefined) {
    currentActiveTask.value = task
  }

  function completeTask(task: Task) {
    taskService.completeTask(task)
    changeActiveTask(undefined)
  }

  function removeTask(task: Task) {
    taskService.removeTask(task)
    changeActiveTask(undefined)
  }

  function changeCurrentActiveProject(projectName: string) {
    currentActiveArchive.value = taskService.findProjectByName(projectName)
    changeActiveTask(undefined)
  }

  function changeCurrentActiveArchive(parentKey: TreeRootKeys, name: string) {
    if (parentKey === TreeRootKeys.PROJECT)
      currentActiveArchive.value = taskService.findProjectByName(name)
    if (parentKey === TreeRootKeys.TAG)
      currentActiveArchive.value = taskService.findTagByName(name)

    changeActiveTask(undefined)
  }

  function restoreTask(task: Task) {
    taskService.restoreTask(task)
    changeActiveTask(undefined)
  }

  return {
    projects,
    tagsData,
    currentActiveArchive,
    projectNames,
    currentActiveTask,
    addTask,
    removeTask,
    completeTask,
    restoreTask,
    changeActiveTask,
    changeCurrentActiveProject,
    changeCurrentActiveArchive,
  }
})
