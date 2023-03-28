export type EventItem = {
	eventName: string
	triggers: Trigger[]
}

export type EventName = 'message' | 'command'
export type Trigger<T> = (...args: T[]) => Promise<T> | void
