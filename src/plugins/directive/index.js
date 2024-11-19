import { draggable } from '@/utils/directive'

export const setupDirective = (app) => {
  app.directive('draggable', draggable)
}
