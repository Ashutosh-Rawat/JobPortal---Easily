import jobCategories from '../jobCategories.js'

export function manageCategoryActions() {
  const jobCategorySelect = document.getElementById('jobCategory')
  const skillsSelect = document.getElementById('skillsRequired')
  const designationSelect = document.getElementById('designation')

  // Populate job category dropdown
  jobCategorySelect.innerHTML = ''
  jobCategories.forEach(category => {
    const option = document.createElement('option')
    option.value = category.jobCategory
    option.text = category.jobCategory
    jobCategorySelect.appendChild(option)
  })

  // Handle category change to update skills and designations
  jobCategorySelect.addEventListener('change', () => {
    const selectedCategory = jobCategories.find(
      category => category.jobCategory === jobCategorySelect.value
    )

    // Update Skills
    skillsSelect.innerHTML = ''
    if (selectedCategory) {
      selectedCategory.skillsNeeded.forEach(skill => {
        const option = document.createElement('option')
        option.value = skill
        option.text = skill
        skillsSelect.appendChild(option)
      })
    }

    // Update Designations
    designationSelect.innerHTML = ''
    if (selectedCategory) {
      selectedCategory.jobNames.forEach(designation => {
        const option = document.createElement('option')
        option.value = designation
        option.text = designation
        designationSelect.appendChild(option)
      })
    }
  })
}
