import { initTags } from './tag'
import { fetchData } from './data'
import { initProjects } from './project'
import { initCompletedSmartProject } from './smartProject'
export { SmartProjectNames } from './smartProject'
export { projects, findProjectByName } from './project'
export {
  TaskState,
  TreeRootKeys,
  addTask,
  removeTask,
  restoreTask,
  completeTask,
  createTask,
} from './task'
export type { Task } from './task'
export {
  tags,
  createTag,
  addTaskToTag,
  findTagByName,
} from './tag'
export type { Project } from './project'

initProjects(fetchData.projects)
initTags(fetchData.tags)
initCompletedSmartProject(fetchData.completed)
