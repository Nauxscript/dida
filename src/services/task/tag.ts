import type { FetchTaskData } from './project'
import type { Task } from './task'
import { createTask } from './task'

export interface FetchTagData {
  name: string
  color: string
  tasks: FetchTaskData[]
}

export interface Tag {
  name: string
  color: string
  tasks: Task[]
}

export const tags: Tag[] = []

export const findTagByName = (name: string) => {
  return tags.find(tag => tag.name === name)
}

export const initTags = (tagsData: FetchTagData[]) => {
  tags.length = 0
  tagsData.forEach((tagRaw) => {
    const tag = createTag(tagRaw)

    tagRaw.tasks.forEach(({ title, id, content }) => {
      const task = createTask(title, id, content)
      addTaskToTag(task, tag)
    })
  })
}

export function createTag({ name, color }: FetchTagData) {
  return {
    name,
    color,
    tasks: [],
  }
}

export function addTaskToTag(task: Task, tag: Tag) {
  tag.tasks.push(task)
}
