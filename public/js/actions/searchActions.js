// Search bar visibility toggle
export function toggleSearchBar() {
    const jobSearchForm = document.getElementById('jobSearchForm')
  
    if (jobSearchForm) {
      const pathname = window.location.pathname
      if (pathname === '/jobs' || pathname.startsWith('/jobs')) {
        jobSearchForm.classList.remove('d-none')
      } else {
        jobSearchForm.classList.add('d-none')
      }
    }
}

// Perform search
export function searchJobs() {
    const query = document.getElementById('jobSearch').value.trim().toLowerCase()
    if (!query) return

    window.location.href = `/jobs?search=${encodeURIComponent(query)}`
}
  