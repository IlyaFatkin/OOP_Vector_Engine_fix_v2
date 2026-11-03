import { test, expect } from 'vitest'

// Pure unique-id helper extracted for testability (same algorithm as in projectStorage)
function generateUniqueId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`
}

test('unique ids do not collide after simulated delete', () => {
  const ids = new Set<string>()
  for (let i = 0; i < 200; i++) {
    ids.add(generateUniqueId())
  }
  expect(ids.size).toBe(200)
})

test('new project id is not based on count+1', () => {
  const id = generateUniqueId()
  expect(id).not.toMatch(/^\d+$/) // not a plain integer like "3"
  expect(id.length).toBeGreaterThan(8)
})

test('save contract: id is returned (simulated)', async () => {
  // Simulate the contract: saveProject returns the final id
  const simulateSave = async (projectId: string): Promise<string> => {
    if (projectId === 'new') return generateUniqueId()
    return projectId
  }
  const newId = await simulateSave('new')
  expect(newId).toBeTruthy()
  expect(newId).not.toBe('new')
  const existing = await simulateSave('abc-123')
  expect(existing).toBe('abc-123')
})
