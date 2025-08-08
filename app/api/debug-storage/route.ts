import { NextRequest, NextResponse } from 'next/server'
import { getKredibleStorage, debugStorage, getAllRequests } from '../../../lib/storage'

export async function GET(request: NextRequest) {
  try {
    debugStorage()
    const allRequests = getAllRequests()
    
    console.log('🔍 Storage Debug API called')
    console.log('📊 Current storage contents:', allRequests)
    
    return NextResponse.json({
      success: true,
      totalRequests: allRequests.length,
      requests: allRequests.map(req => ({
        id: req.id,
        token: req.token,
        candidateEmail: req.candidateEmail,
        candidateName: req.candidateName,
        status: req.status,
        createdAt: req.createdAt
      }))
    })
  } catch (error) {
    console.error('❌ Storage debug error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to debug storage'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()
    
    if (action === 'clear') {
      const storage = getKredibleStorage()
      storage.clear()
      console.log('🧹 Storage cleared')
      
      return NextResponse.json({
        success: true,
        message: 'Storage cleared successfully'
      })
    }
    
    return NextResponse.json({
      success: false,
      error: 'Invalid action'
    }, { status: 400 })
    
  } catch (error) {
    console.error('❌ Storage action error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to perform storage action'
    }, { status: 500 })
  }
}
