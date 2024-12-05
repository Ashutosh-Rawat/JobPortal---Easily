import jobCategories from "./jobCategories.js"

document.addEventListener('DOMContentLoaded', () => {
  const jobCategorySelect = document.getElementById('jobCategory')
  const jobDesignSelect = document.getElementById('jobDesign')
  const skillsSelect = document.getElementById('skillsRequired')

  const choices = new Choices(skillsSelect, {
    removeItemButton: true,
    searchResultLimit: 5,
    renderChoiceLimit: 5
  })

  const populateSkills = (category) => {
    choices.clearStore()
    if (category) {
      category.skillsNeeded.forEach(skill => {
        choices.setChoices([{ value: skill, label: skill }], 'value', 'label', false)
      })
    }
  }

  const populateJobDesignations = (category) => {
    jobDesignSelect.innerHTML = '<option value="">--Select Job--</option>'
    if (category) {
      category.jobNames.forEach(job => {
        const option = document.createElement('option')
        option.value = job
        option.textContent = job
        jobDesignSelect.appendChild(option)
      })
    }
  }

  jobCategorySelect.addEventListener('change', () => {
    const selectedCategory = jobCategorySelect.value
    const category = jobCategories.find(job => job.jobCategory === selectedCategory)
    populateJobDesignations(category)
    populateSkills(category)
  })

  // Prepopulate skills for the update form
  if (window.location.pathname.includes('update')) {
    const preselectedSkills = JSON.parse(document.getElementById('skillsRequired').dataset.preselectedSkills || '[]')
    preselectedSkills.forEach(skill => {
      choices.setChoiceByValue(skill)
    })

    const selectedCategory = jobCategorySelect.value
    const category = jobCategories.find(job => job.jobCategory === selectedCategory)
    populateJobDesignations(category)
    populateSkills(category)
  }
})
