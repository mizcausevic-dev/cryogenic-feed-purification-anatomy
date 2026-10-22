import { animate } from 'motion'

export type CanonicalEventName =
  | 'lead_submit'
  | 'sponsor_click'
  | 'affiliate_out'
  | 'demo_request'
  | 'premium_view'
  | 'partner_click'
  | 'newsletter_signup'
  | 'tool_complete'
  | 'marketplace_outbound_click'
  | 'content_engagement_click'
  | 'self_serve_cta_click'

export interface AnalyticsEventPayload {
  destination?: string
  content_type?: string
  cta_target?: string
  offer?: string
  placement?: string
  vendor?: string
  property_id: string
}

export interface LoggedEvent {
  id: string
  timestamp: string
  event: CanonicalEventName
  payload: AnalyticsEventPayload
}

const PROPERTY_ID = 'cryogenic-feed-purification-explainer'

const eventListeners = new Set<(events: LoggedEvent[]) => void>()
let eventLog: LoggedEvent[] = []

export function trackCanonicalEvent(
  event: CanonicalEventName,
  params: Omit<AnalyticsEventPayload, 'property_id'>
): LoggedEvent {
  const entry: LoggedEvent = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toISOString().split('T')[1].slice(0, 12),
    event,
    payload: {
      ...params,
      property_id: PROPERTY_ID,
    },
  }

  eventLog = [entry, ...eventLog].slice(0, 40)
  eventListeners.forEach((cb) => cb(eventLog))

  const win = window as unknown as { dataLayer?: Record<string, unknown>[] }
  if (Array.isArray(win.dataLayer)) {
    win.dataLayer.push({
      event,
      ...entry.payload,
    })
  }

  return entry
}

export function subscribeEventLog(cb: (events: LoggedEvent[]) => void): () => void {
  eventListeners.add(cb)
  cb(eventLog)
  return () => {
    eventListeners.delete(cb)
  }
}

export function getEventLog(): LoggedEvent[] {
  return eventLog
}

/**
 * Pattern B: Value interpolator / Animated Counter using Motion core animate()
 */
export function interpolateNumericValue(
  from: number,
  to: number,
  duration: number,
  onUpdate: (val: number) => void
): () => void {
  const controls = animate(from, to, {
    duration,
    ease: 'easeOut',
    onUpdate,
  })
  return () => controls.stop()
}
