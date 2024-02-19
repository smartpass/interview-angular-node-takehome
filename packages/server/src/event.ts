import { Locations, Passes, Students } from "@smartpass/angular-node-takehome-common"
import EventEmitter from "events"

export type Resource = 'student' | 'location' | 'pass'

export type CreatedEvent = `${Resource}_created`
export type UpdatedEvent = `${Resource}_updated`
export type DeletedEvent = `${Resource}_deleted`

export class ResourceEventEmitter<T> extends EventEmitter {
  private createdEvent: `${Resource}_created`
  private updatedEvent: `${Resource}_updated`
  private deletedEvent: `${Resource}_deleted`

  constructor(resourceName: Resource) {
    super()
    this.createdEvent = `${resourceName}_created` as const
    this.updatedEvent = `${resourceName}_updated` as const
    this.deletedEvent = `${resourceName}_deleted` as const
  }

  /**
   * Synchronously calls each of the listeners registered for the event named`<resourceName>_created`, in the order they were registered, passing the supplied argument
   * to each.
   *
   * Returns `true` if the event had listeners, `false` otherwise.
   */
  emitResourceCreated(resource: T): boolean {
    return super.emit(this.createdEvent, resource)
  }

  /**
   * Synchronously calls each of the listeners registered for the event named`<resourceName>_deleted`, in the order they were registered, passing the supplied argument
   * to each.
   *
   * Returns `true` if the event had listeners, `false` otherwise.
   */
  emitResourceDeleted(resource: T): boolean {
    return super.emit(this.deletedEvent, resource)
  }

  /**
   * Synchronously calls each of the listeners registered for the event named`<resourceName>_updated`, in the order they were registered, passing the supplied argument
   * to each.
   *
   * Returns `true` if the event had listeners, `false` otherwise.
   */
  emitResourceUpdated(resource: T): boolean {
    return super.emit(this.updatedEvent, resource)
  }

}

export const createResourceEmitters = () => ({
  student: new ResourceEventEmitter<Students.Model.Retrieve>('student'),
  location: new ResourceEventEmitter<Locations.Model.Retrieve>('location'),
  pass: new ResourceEventEmitter<Passes.Model.Retrieve>('pass'),
})

export type ResourceEmitters = ReturnType<typeof createResourceEmitters>

export type EmitterSelector<K extends keyof ResourceEmitters> =
  (_: ResourceEmitters) => ResourceEmitters[K]
