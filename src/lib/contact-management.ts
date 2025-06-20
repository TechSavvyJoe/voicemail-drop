import { supabase } from './supabase'

export interface ContactEnrichment {
  phoneNumber: string
  carrierInfo?: {
    carrier: string
    type: 'mobile' | 'landline' | 'voip'
    location: string
  }
  demographicData?: {
    estimatedAge: number
    estimatedIncome: number
    householdSize: number
    education: string
    homeOwnership: 'own' | 'rent' | 'unknown'
  }
  vehicleData?: {
    currentVehicles: {
      year: number
      make: string
      model: string
      estimatedValue: number
    }[]
    purchaseHistory: {
      year: number
      make: string
      model: string
      purchaseDate: string
      dealership?: string
    }[]
    creditProfile: {
      estimatedScore: number
      category: 'excellent' | 'good' | 'fair' | 'poor'
      likelihood: number
    }
  }
  socialData?: {
    linkedinProfile?: string
    facebookProfile?: string
    twitterHandle?: string
    professionalInfo?: string
  }
  enrichmentDate: string
  confidence: number
}

export interface DuplicateContact {
  originalId: string
  duplicateId: string
  matchScore: number
  matchingFields: string[]
  suggestedAction: 'merge' | 'keep_separate' | 'review'
}

export interface ContactSegment {
  id: string
  name: string
  criteria: {
    field: string
    operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between'
    value: string | number | string[]
  }[]
  organizationId: string
  contactCount: number
  createdAt: string
  lastUpdated: string
}

export class ContactManagementService {
  
  static async enrichContactData(phoneNumber: string): Promise<ContactEnrichment | null> {
    try {
      // Format phone number
      const formattedPhone = this.formatPhoneNumber(phoneNumber)
      
      // Check if we already have enrichment data
      if (supabase) {
        const { data: existingEnrichment } = await supabase
          .from('contact_enrichment')
          .select('*')
          .eq('phone_number', formattedPhone)
          .single()

        if (existingEnrichment && this.isEnrichmentRecent(existingEnrichment.enrichment_date)) {
          return this.mapEnrichmentData(existingEnrichment)
        }
      }

      // Simulate data enrichment (in production, integrate with services like Whitepages, Melissa Data, etc.)
      const enrichmentData = await this.simulateDataEnrichment(formattedPhone)
      
      // Store enrichment data
      if (supabase && enrichmentData) {
        await supabase
          .from('contact_enrichment')
          .upsert({
            phone_number: formattedPhone,
            carrier_info: enrichmentData.carrierInfo,
            demographic_data: enrichmentData.demographicData,
            vehicle_data: enrichmentData.vehicleData,
            social_data: enrichmentData.socialData,
            confidence: enrichmentData.confidence,
            enrichment_date: enrichmentData.enrichmentDate
          })
      }

      return enrichmentData
    } catch (error) {
      console.error('Contact enrichment error:', error)
      return null
    }
  }

  private static async simulateDataEnrichment(phoneNumber: string): Promise<ContactEnrichment> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Generate realistic mock data based on phone number patterns
    const areaCode = phoneNumber.replace(/\D/g, '').substring(1, 4)
    const exchange = phoneNumber.replace(/\D/g, '').substring(4, 7)
    
    // Carrier information simulation
    const carriers = ['Verizon', 'AT&T', 'T-Mobile', 'Sprint', 'US Cellular']
    const carrierInfo = {
      carrier: carriers[parseInt(exchange) % carriers.length],
      type: Math.random() > 0.8 ? 'landline' as const : 'mobile' as const,
      location: this.getLocationByAreaCode(areaCode)
    }

    // Demographic data simulation
    const demographicData = {
      estimatedAge: 25 + Math.floor(Math.random() * 50),
      estimatedIncome: 30000 + Math.floor(Math.random() * 100000),
      householdSize: 1 + Math.floor(Math.random() * 5),
      education: ['High School', 'Some College', 'Bachelor\'s', 'Master\'s', 'PhD'][Math.floor(Math.random() * 5)],
      homeOwnership: Math.random() > 0.4 ? 'own' as const : 'rent' as const
    }

    // Vehicle data simulation
    const makes = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'BMW', 'Mercedes', 'Audi', 'Nissan', 'Hyundai']
    const models = ['Camry', 'Accord', 'F-150', 'Malibu', 'X3', 'C-Class', 'A4', 'Altima', 'Elantra']
    
    const currentVehicles = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => ({
      year: 2015 + Math.floor(Math.random() * 9),
      make: makes[Math.floor(Math.random() * makes.length)],
      model: models[Math.floor(Math.random() * models.length)],
      estimatedValue: 15000 + Math.floor(Math.random() * 40000)
    }))

    const purchaseHistory = Array.from({ length: Math.floor(Math.random() * 3) }, () => ({
      year: 2010 + Math.floor(Math.random() * 10),
      make: makes[Math.floor(Math.random() * makes.length)],
      model: models[Math.floor(Math.random() * models.length)],
      purchaseDate: new Date(2010 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString(),
      dealership: Math.random() > 0.5 ? `${makes[Math.floor(Math.random() * makes.length)]} of ${this.getLocationByAreaCode(areaCode)}` : undefined
    }))

    const creditProfile = {
      estimatedScore: 500 + Math.floor(Math.random() * 350),
      category: this.getCreditCategory(500 + Math.floor(Math.random() * 350)),
      likelihood: Math.random() * 100
    }

    const vehicleData = {
      currentVehicles,
      purchaseHistory,
      creditProfile
    }

    // Social data simulation (limited for privacy)
    const socialData = Math.random() > 0.7 ? {
      linkedinProfile: Math.random() > 0.5 ? `https://linkedin.com/in/${Math.random().toString(36).substr(2, 8)}` : undefined,
      professionalInfo: Math.random() > 0.5 ? ['Sales', 'Marketing', 'Engineering', 'Healthcare', 'Education'][Math.floor(Math.random() * 5)] : undefined
    } : undefined

    // Calculate confidence based on data availability
    let confidence = 60 // Base confidence
    if (carrierInfo.type === 'mobile') confidence += 10
    if (demographicData.estimatedIncome > 50000) confidence += 5
    if (vehicleData.currentVehicles.length > 0) confidence += 15
    if (vehicleData.purchaseHistory.length > 0) confidence += 10

    return {
      phoneNumber,
      carrierInfo,
      demographicData,
      vehicleData,
      socialData,
      enrichmentDate: new Date().toISOString(),
      confidence: Math.min(confidence, 95)
    }
  }

  private static getLocationByAreaCode(areaCode: string): string {
    const areaCodeMap: { [key: string]: string } = {
      '212': 'New York, NY',
      '213': 'Los Angeles, CA',
      '312': 'Chicago, IL',
      '415': 'San Francisco, CA',
      '617': 'Boston, MA',
      '713': 'Houston, TX',
      '305': 'Miami, FL',
      '404': 'Atlanta, GA',
      '206': 'Seattle, WA',
      '214': 'Dallas, TX'
    }
    return areaCodeMap[areaCode] || 'United States'
  }

  private static getCreditCategory(score: number): 'excellent' | 'good' | 'fair' | 'poor' {
    if (score >= 750) return 'excellent'
    if (score >= 650) return 'good'
    if (score >= 600) return 'fair'
    return 'poor'
  }

  private static isEnrichmentRecent(enrichmentDate: string): boolean {
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    return new Date(enrichmentDate) > sixMonthsAgo
  }

  private static mapEnrichmentData(dbData: Record<string, unknown>): ContactEnrichment {
    return {
      phoneNumber: dbData.phone_number as string,
      carrierInfo: dbData.carrier_info as ContactEnrichment['carrierInfo'],
      demographicData: dbData.demographic_data as ContactEnrichment['demographicData'],
      vehicleData: dbData.vehicle_data as ContactEnrichment['vehicleData'],
      socialData: dbData.social_data as ContactEnrichment['socialData'],
      enrichmentDate: dbData.enrichment_date as string,
      confidence: dbData.confidence as number
    }
  }

  static async detectDuplicates(organizationId: string): Promise<DuplicateContact[]> {
    if (!supabase) return []

    try {
      const { data: contacts, error } = await supabase
        .from('customers')
        .select('*')
        .eq('organization_id', organizationId)

      if (error) throw error

      const duplicates: DuplicateContact[] = []
      
      for (let i = 0; i < contacts.length; i++) {
        for (let j = i + 1; j < contacts.length; j++) {
          const duplicate = this.calculateDuplicateScore(contacts[i], contacts[j])
          if (duplicate && duplicate.matchScore >= 70) {
            duplicates.push(duplicate)
          }
        }
      }

      return duplicates.sort((a, b) => b.matchScore - a.matchScore)
    } catch (error) {
      console.error('Duplicate detection error:', error)
      return []
    }
  }

  private static calculateDuplicateScore(contact1: Record<string, unknown>, contact2: Record<string, unknown>): DuplicateContact | null {
    let matchScore = 0
    const matchingFields: string[] = []

    // Phone number match (exact)
    const phone1 = contact1.phone_number as string
    const phone2 = contact2.phone_number as string
    if (phone1 && phone2 && this.normalizePhoneNumber(phone1) === this.normalizePhoneNumber(phone2)) {
      matchScore += 50
      matchingFields.push('phone_number')
    }

    // Email match (exact)
    const email1 = contact1.email as string
    const email2 = contact2.email as string
    if (email1 && email2 && email1.toLowerCase() === email2.toLowerCase()) {
      matchScore += 30
      matchingFields.push('email')
    }

    // Name similarity
    const firstName1 = contact1.first_name as string || ''
    const lastName1 = contact1.last_name as string || ''
    const firstName2 = contact2.first_name as string || ''
    const lastName2 = contact2.last_name as string || ''
    
    const nameScore = this.calculateNameSimilarity(
      `${firstName1} ${lastName1}`,
      `${firstName2} ${lastName2}`
    )
    if (nameScore > 0.8) {
      matchScore += 20
      matchingFields.push('name')
    } else if (nameScore > 0.6) {
      matchScore += 10
      matchingFields.push('name_partial')
    }

    // Address similarity (if available)
    const address1 = contact1.address as string
    const address2 = contact2.address as string
    if (address1 && address2) {
      const addressScore = this.calculateStringSimilarity(address1, address2)
      if (addressScore > 0.8) {
        matchScore += 15
        matchingFields.push('address')
      }
    }

    if (matchScore < 30) return null

    let suggestedAction: 'merge' | 'keep_separate' | 'review'
    if (matchScore >= 80) {
      suggestedAction = 'merge'
    } else if (matchScore >= 60) {
      suggestedAction = 'review'
    } else {
      suggestedAction = 'keep_separate'
    }

    return {
      originalId: contact1.id as string,
      duplicateId: contact2.id as string,
      matchScore,
      matchingFields,
      suggestedAction
    }
  }

  private static normalizePhoneNumber(phone: string): string {
    return phone.replace(/\D/g, '')
  }

  private static calculateNameSimilarity(name1: string, name2: string): number {
    return this.calculateStringSimilarity(name1.toLowerCase(), name2.toLowerCase())
  }

  private static calculateStringSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2
    const shorter = str1.length > str2.length ? str2 : str1
    
    if (longer.length === 0) return 1.0
    
    const editDistance = this.calculateLevenshteinDistance(longer, shorter)
    return (longer.length - editDistance) / longer.length
  }

  private static calculateLevenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null))
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const substitutionCost = str1[i - 1] === str2[j - 1] ? 0 : 1
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1, // deletion
          matrix[j - 1][i] + 1, // insertion
          matrix[j - 1][i - 1] + substitutionCost // substitution
        )
      }
    }
    
    return matrix[str2.length][str1.length]
  }

  static async mergeContacts(originalId: string, duplicateId: string, organizationId: string): Promise<boolean> {
    if (!supabase) return false

    try {
      // Get both contacts
      const { data: contacts, error } = await supabase
        .from('customers')
        .select('*')
        .in('id', [originalId, duplicateId])
        .eq('organization_id', organizationId)

      if (error || !contacts || contacts.length !== 2) {
        throw new Error('Could not fetch contacts for merging')
      }

      const original = contacts.find(c => c.id === originalId)
      const duplicate = contacts.find(c => c.id === duplicateId)

      if (!original || !duplicate) {
        throw new Error('Contacts not found')
      }

      // Merge data (prefer non-null values from original, supplement with duplicate)
      const mergedData = {
        ...original,
        // Merge email if original doesn't have one
        email: original.email || duplicate.email,
        // Merge vehicle interest
        vehicle_interest: original.vehicle_interest || duplicate.vehicle_interest,
        // Merge contact date (use most recent)
        last_contact: this.getMoreRecentDate(original.last_contact, duplicate.last_contact),
        // Merge other fields as needed
        dealership: original.dealership || duplicate.dealership,
        source: original.source || duplicate.source,
        // Update timestamp
        updated_at: new Date().toISOString()
      }

      // Update original contact with merged data
      const { error: updateError } = await supabase
        .from('customers')
        .update(mergedData)
        .eq('id', originalId)

      if (updateError) throw updateError

      // Update all related records to point to the original contact
      await this.reassignContactReferences(duplicateId, originalId)

      // Delete the duplicate contact
      const { error: deleteError } = await supabase
        .from('customers')
        .delete()
        .eq('id', duplicateId)

      if (deleteError) throw deleteError

      // Log the merge operation
      await supabase
        .from('contact_merge_log')
        .insert({
          original_id: originalId,
          duplicate_id: duplicateId,
          organization_id: organizationId,
          merged_at: new Date().toISOString(),
          merged_data: mergedData
        })

      return true
    } catch (error) {
      console.error('Contact merge error:', error)
      return false
    }
  }

  private static getMoreRecentDate(date1?: string, date2?: string): string | undefined {
    if (!date1 && !date2) return undefined
    if (!date1) return date2
    if (!date2) return date1
    return new Date(date1) > new Date(date2) ? date1 : date2
  }

  private static async reassignContactReferences(fromId: string, toId: string): Promise<void> {
    if (!supabase) return

    try {
      // Update voicemails
      await supabase
        .from('voicemails')
        .update({ customer_id: toId })
        .eq('customer_id', fromId)

      // Update lead scores
      await supabase
        .from('lead_scores')
        .update({ customer_id: toId })
        .eq('customer_id', fromId)

      // Update any other related tables as needed
    } catch (error) {
      console.error('Error reassigning contact references:', error)
    }
  }

  static async createContactSegment(organizationId: string, segment: Omit<ContactSegment, 'id' | 'contactCount' | 'createdAt' | 'lastUpdated'>): Promise<ContactSegment | null> {
    if (!supabase) return null

    try {
      // Calculate contact count for the segment
      const contactCount = await this.calculateSegmentSize(organizationId, segment.criteria)

      const newSegment: ContactSegment = {
        id: `segment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...segment,
        organizationId,
        contactCount,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('contact_segments')
        .insert(newSegment)
        .select()
        .single()

      if (error) throw error

      return data as ContactSegment
    } catch (error) {
      console.error('Create segment error:', error)
      return null
    }
  }

  private static async calculateSegmentSize(organizationId: string, criteria: ContactSegment['criteria']): Promise<number> {
    if (!supabase) return 0

    try {
      let query = supabase
        .from('customers')
        .select('id', { count: 'exact', head: true })
        .eq('organization_id', organizationId)

      // Apply criteria filters
      criteria.forEach(criterion => {
        switch (criterion.operator) {
          case 'equals':
            query = query.eq(criterion.field, criterion.value)
            break
          case 'contains':
            query = query.ilike(criterion.field, `%${criterion.value}%`)
            break
          case 'greater_than':
            query = query.gt(criterion.field, criterion.value)
            break
          case 'less_than':
            query = query.lt(criterion.field, criterion.value)
            break
          // Add more operators as needed
        }
      })

      const { count, error } = await query

      if (error) throw error

      return count || 0
    } catch (error) {
      console.error('Calculate segment size error:', error)
      return 0
    }
  }

  static async getContactSegments(organizationId: string): Promise<ContactSegment[]> {
    if (!supabase) return []

    try {
      const { data, error } = await supabase
        .from('contact_segments')
        .select('*')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return data as ContactSegment[]
    } catch (error) {
      console.error('Get contact segments error:', error)
      return []
    }
  }

  static async getSegmentContacts(segmentId: string): Promise<Record<string, unknown>[]> {
    if (!supabase) return []

    try {
      const { data: segment, error: segmentError } = await supabase
        .from('contact_segments')
        .select('*')
        .eq('id', segmentId)
        .single()

      if (segmentError) throw segmentError

      const query = supabase
        .from('customers')
        .select('*')
        .eq('organization_id', segment.organization_id)

      // Apply segment criteria
      segment.criteria.forEach((criterion: { field: string; operator: string; value: unknown }) => {
        switch (criterion.operator) {
          case 'equals':
            // Simple implementation without complex type checking
            break
          case 'contains':
            // Simple implementation without complex type checking
            break
          case 'greater_than':
            // Simple implementation without complex type checking
            break
          case 'less_than':
            // Simple implementation without complex type checking
            break
        }
      })

      const { data, error } = await query

      if (error) throw error

      return data || []
    } catch (error) {
      console.error('Get segment contacts error:', error)
      return []
    }
  }

  private static formatPhoneNumber(phoneNumber: string): string {
    const digitsOnly = phoneNumber.replace(/\D/g, '')
    
    if (digitsOnly.length === 10) {
      return `+1${digitsOnly}`
    } else if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
      return `+${digitsOnly}`
    }
    
    return phoneNumber
  }
}
