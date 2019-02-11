
class GoogleCredentials {
  
  isSet() {
    if (!process.env.ROUTINE_DESIGN_GOOGLE_CREDS) {
      return false;
    }
    return true;
  }

  getValue() {
    if (!this.isSet()) {
      throw new Error('Routine Design Google credentials are not set');
    }
    return process.env.ROUTINE_DESIGN_GOOGLE_CREDS;
  }
}

module.exports = GoogleCredentials;
