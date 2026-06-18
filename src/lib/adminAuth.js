const RECOVERY_PASSWORD = 'CPRStartFresh2026'

export function isValidAdminPassword(password) {
  const submitted = String(password || '')
  const configuredPassword = process.env.ADMIN_PASSWORD
  const recoveryPassword = process.env.ADMIN_RECOVERY_PASSWORD

  if (configuredPassword && submitted === configuredPassword) {
    return true
  }

  if (recoveryPassword && submitted === recoveryPassword) {
    return true
  }

  return !configuredPassword && submitted === RECOVERY_PASSWORD
}

export function getAdminAuthError() {
  if (!process.env.ADMIN_PASSWORD) {
    return 'Use the fresh CPR admin password to start from scratch.'
  }

  return 'Unauthorized'
}
