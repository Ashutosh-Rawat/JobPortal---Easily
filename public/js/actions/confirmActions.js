// Delete user function confirmation
async function getDeleteUser() {
    const res = confirm('Are you sure, this will delete all your posted jobs and data?')
    if (res) {
      const request = await fetch(
        `/deleteUser`,
        { method: 'POST' }
      )
      if (request.ok) window.location.href = '/'
    }
  }
  
// Delete job function confirmation
async function getDeleteJobAuth(jobid) {
    const res = confirm('Are you sure you want to delete this job application?')
    if (res) {
        const request = await fetch(
        `/jobs/${jobid}/delete`,
        { method: 'POST' }
        )
        if (request.ok) window.location.href = '/jobs'
    }
}

// Update job function confirmation
async function getUpdateJobAuth() {
  const res = confirm('Are you sure you want to update this job application?')
  if (res) document.getElementById('updateJobForm').submit()
}
  