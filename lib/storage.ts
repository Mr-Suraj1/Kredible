// Simple in-memory storage that persists across API routes
// In production, replace this with a proper database

export interface RecruiterRequest {
  id: string
  firstName: string
  lastName: string
  email: string
  company: string
  jobTitle: string
  companySize?: string
  candidateEmail: string
  candidateName: string
  positionTitle: string
  additionalNotes?: string
  token: string
  status: 'pending' | 'completed' | 'expired'
  createdAt: Date
  expiresAt: Date
  candidateData?: {
    fullName?: string
    githubUsername?: string
    linkedinUrl?: string
    stackoverflowUrl?: string
    portfolioUrl?: string
    additionalProfiles: string[]
    additionalInfo?: string
    submittedAt: Date
  }
}

// Multiple storage strategies for development reliability
let globalStorage: Map<string, RecruiterRequest> | null = null

export function getKredibleStorage(): Map<string, RecruiterRequest> {
  // Strategy 1: Use existing global storage
  if (!globalStorage) {
    globalStorage = new Map<string, RecruiterRequest>()
    
    // Strategy 2: Check if storage exists on globalThis
    if (typeof globalThis !== 'undefined') {
      const existingStorage = (globalThis as any).__KREDIBLE_REQUESTS__
      if (existingStorage && existingStorage instanceof Map) {
        console.log('📦 Restored storage from globalThis with', existingStorage.size, 'items')
        globalStorage = existingStorage
      } else {
        // Set it on globalThis for persistence
        (globalThis as any).__KREDIBLE_REQUESTS__ = globalStorage
        console.log('📦 Created new storage on globalThis')
      }
    }
    
    // Strategy 3: Load from temporary file storage (development only)
    if (globalStorage.size === 0) {
      try {
        const fs = require('fs')
        const path = require('path')
        const tempFile = path.join(process.cwd(), '.kredible-temp-storage.json')
        
        if (fs.existsSync(tempFile)) {
          const data = fs.readFileSync(tempFile, 'utf8')
          const stored = JSON.parse(data)
          
          // Convert back to Map and restore dates
          stored.forEach((item: any) => {
            globalStorage!.set(item.id, {
              ...item,
              createdAt: new Date(item.createdAt),
              expiresAt: new Date(item.expiresAt),
              candidateData: item.candidateData ? {
                ...item.candidateData,
                submittedAt: new Date(item.candidateData.submittedAt)
              } : undefined
            })
          })
          
          console.log('📦 Restored storage from temp file with', globalStorage.size, 'items')
        }
      } catch (error) {
        console.log('⚠️ Could not load temp storage file:', error)
      }
    }
  }
  
  return globalStorage
}

export function findRequestByToken(token: string): RecruiterRequest | null {
  const storage = getKredibleStorage()
  
  console.log('🔍 Searching for token:', token)
  console.log('📊 Available tokens:', Array.from(storage.values()).map(r => r.token))
  
  for (const request of storage.values()) {
    if (request.token === token) {
      console.log('✅ Token found for request:', request.id)
      return request
    }
  }
  
  console.log('❌ Token not found')
  return null
}

export function saveRequest(request: RecruiterRequest): void {
  const storage = getKredibleStorage()
  storage.set(request.id, request)
  
  // Also persist to temp file for development
  saveTempStorage(storage)
  
  console.log('💾 Saved request:', request.id, 'with token:', request.token)
}

export function updateRequest(requestId: string, updates: Partial<RecruiterRequest>): RecruiterRequest | null {
  const storage = getKredibleStorage()
  const existing = storage.get(requestId)
  
  if (!existing) {
    return null
  }
  
  const updated = { ...existing, ...updates }
  storage.set(requestId, updated)
  
  // Persist changes
  saveTempStorage(storage)
  
  return updated
}

export function deleteRequest(requestId: string): boolean {
  const storage = getKredibleStorage()
  const result = storage.delete(requestId)
  
  if (result) {
    saveTempStorage(storage)
  }
  
  return result
}

export function getAllRequests(): RecruiterRequest[] {
  const storage = getKredibleStorage()
  return Array.from(storage.values())
}

export function getCompletedProfiles(): RecruiterRequest[] {
  const storage = getKredibleStorage()
  return Array.from(storage.values()).filter(request => 
    request.status === 'completed' && request.candidateData
  )
}

// Save to temporary file for development persistence
function saveTempStorage(storage: Map<string, RecruiterRequest>): void {
  try {
    const fs = require('fs')
    const path = require('path')
    const tempFile = path.join(process.cwd(), '.kredible-temp-storage.json')
    
    const data = Array.from(storage.values())
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2))
    
    console.log('💾 Persisted', data.length, 'requests to temp file')
  } catch (error) {
    console.log('⚠️ Could not save temp storage file:', error)
  }
}

// Debug functions
export function debugStorage(): void {
  const storage = getKredibleStorage()
  console.log('📊 Storage Debug:')
  console.log('- Total requests:', storage.size)
  console.log('- Request IDs:', Array.from(storage.keys()))
  console.log('- Tokens:', Array.from(storage.values()).map(r => r.token))
}
