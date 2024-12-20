import { toggleSearchBar, searchJobs } from './actions/searchActions.js'
import { manageCategoryActions } from './actions/categoryActions.js'

const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
tooltipTriggerList.forEach(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

document.addEventListener('DOMContentLoaded', () => {
  toggleSearchBar()

  // Search functionality
  const jobSearchForm = document.getElementById('jobSearchForm')
  if (jobSearchForm) {
    jobSearchForm.addEventListener('submit', e => {
      e.preventDefault()
      searchJobs()
    })
  }

  // Manage job categories and skills
  const addJobModel = document.getElementById('addJobModal')
  if (addJobModel) {
    addJobModel.addEventListener('show.bs.modal', 
      manageCategoryActions()
    )
  }
})
