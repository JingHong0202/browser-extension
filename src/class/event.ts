import { EventItem, Trigger, EventName } from '@/types/event'

export default class Events<T> {
	eventListener: Map<EventName, EventItem> = new Map()
	triggerIndexMap: WeakMap<Trigger<T>, string | number> = new WeakMap()

	// constructor() {}

	on(eventName: EventName, trigger: Trigger<T>) {
		if (this.eventListener.has(eventName)) {
			const item = this.eventListener.get(eventName)
			item!.triggers.push(trigger)
			this.triggerIndexMap.set(trigger, item!.triggers.length - 1)
		} else {
			this.eventListener.set(eventName, { eventName, triggers: [trigger] })
			this.triggerIndexMap.set(trigger, 0)
		}
	}

	off(eventName: EventName, trigger?: Trigger<T>) {
		if (this.eventListener.has(eventName)) return
		const item = this.eventListener.get(eventName)

		if (trigger) {
			const index = this.triggerIndexMap.get(trigger)
			index !== undefined && item?.triggers.splice(+index - 1, 1)
		} else {
			this.eventListener.delete(eventName)
		}
	}

	trigger(
		{ eventName, trigger }: { eventName: EventName; trigger?: Trigger<T> },
		...args: unknown[]
	) {
		if (!this.eventListener.has(eventName)) return
		const events = this.eventListener.get(eventName)
		if (!trigger) {
			events?.triggers.forEach(event => event(...args))
			return
		}
		const index = this.triggerIndexMap.get(trigger)
		if (index === undefined || events?.triggers[+index]) {
			events?.triggers.forEach(event => event(...args))
			return
		}
		events?.triggers[+index](...args)
	}
}
