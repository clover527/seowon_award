// 로컬 스토리지를 사용한 데이터 관리

const STORAGE_KEYS = {
  NOMINATIONS: 'seowon_nominations',
  CURRENT_MONTH: 'seowon_current_month',
  SETTINGS: 'seowon_settings'
}

export const getCurrentMonth = () => {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

export const getNominations = (month = null) => {
  const allNominations = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOMINATIONS) || '{}')
  const targetMonth = month || getCurrentMonth()
  return allNominations[targetMonth] || []
}

export const saveNomination = (studentName, reason, nominator = '익명') => {
  const month = getCurrentMonth()
  const allNominations = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOMINATIONS) || '{}')
  
  if (!allNominations[month]) {
    allNominations[month] = []
  }

  const newNomination = {
    id: Date.now(),
    studentName: studentName.trim(),
    reason: reason.trim(),
    nominator,
    timestamp: new Date().toISOString(),
    votes: 1
  }

  allNominations[month].push(newNomination)
  localStorage.setItem(STORAGE_KEYS.NOMINATIONS, JSON.stringify(allNominations))
  
  return newNomination
}

export const addVote = (nominationId, month = null) => {
  const targetMonth = month || getCurrentMonth()
  const allNominations = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOMINATIONS) || '{}')
  
  if (allNominations[targetMonth]) {
    const nomination = allNominations[targetMonth].find(n => n.id === nominationId)
    if (nomination) {
      nomination.votes = (nomination.votes || 1) + 1
      localStorage.setItem(STORAGE_KEYS.NOMINATIONS, JSON.stringify(allNominations))
      return true
    }
  }
  return false
}

export const getAllMonths = () => {
  const allNominations = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOMINATIONS) || '{}')
  return Object.keys(allNominations).sort().reverse()
}

export const getTopStudents = (month = null, limit = 10) => {
  const nominations = getNominations(month)
  return nominations
    .sort((a, b) => (b.votes || 1) - (a.votes || 1))
    .slice(0, limit)
}

export const deleteNomination = (nominationId, month = null) => {
  const targetMonth = month || getCurrentMonth()
  const allNominations = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOMINATIONS) || '{}')
  
  if (allNominations[targetMonth]) {
    allNominations[targetMonth] = allNominations[targetMonth].filter(n => n.id !== nominationId)
    localStorage.setItem(STORAGE_KEYS.NOMINATIONS, JSON.stringify(allNominations))
    return true
  }
  return false
}

export const resetMonth = (month) => {
  const allNominations = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOMINATIONS) || '{}')
  delete allNominations[month]
  localStorage.setItem(STORAGE_KEYS.NOMINATIONS, JSON.stringify(allNominations))
}

