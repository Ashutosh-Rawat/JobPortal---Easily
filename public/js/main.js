// main.js

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

// Search bar visibility toggle
document.addEventListener('DOMContentLoaded', () => {
  const jobSearchForm = document.getElementById('jobSearchForm')

  if (jobSearchForm) {
    const pathname = window.location.pathname
    if (pathname === '/jobs' || pathname.startsWith('/jobs')) {
      jobSearchForm.classList.remove('d-none')
    } else {
      jobSearchForm.classList.add('d-none')
    }
  }
})

// Perform search
function searchJobs() {
  const query = document.getElementById('jobSearch').value.trim().toLowerCase()
  if (!query) return

  window.location.href = `/jobs?search=${encodeURIComponent(query)}`
}


// add job form
document.addEventListener('DOMContentLoaded', async () => {
  const categorySelect = document.getElementById('jobCategory')
  const skillsSelect = document.getElementById('skillsRequired')

  const response = await fetch('/jobs/categories')
  const categories = await response.json()

  // Populate categories dropdown
  categories.forEach(category => {
    const option = document.createElement('option')
    option.value = category.jobCategory
    option.textContent = category.jobCategory
    categorySelect.appendChild(option)
  })

  // Update skills dropdown on category change
  categorySelect.addEventListener('change', () => {
    const selectedCategory = categories.find(cat => cat.jobCategory === categorySelect.value)
    skillsSelect.innerHTML = '' // Clear previous options
    selectedCategory.skillsNeeded.forEach(skill => {
      const option = document.createElement('option')
      option.value = skill
      option.textContent = skill
      skillsSelect.appendChild(option)
    })
  })
})
