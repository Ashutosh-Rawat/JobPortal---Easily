// Manage job categories and skills
export function manageCategoryActions() {
    const categorySelect = document.getElementById('jobCategory')
    const skillsSelect = document.getElementById('skillsRequired')
  
    if (categorySelect && skillsSelect) {
      fetch('/jobs/categories')
        .then(response => response.json())
        .then(categories => {
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
            if (selectedCategory && selectedCategory.skillsNeeded) {
              selectedCategory.skillsNeeded.forEach(skill => {
                const option = document.createElement('option')
                option.value = skill
                option.textContent = skill
                skillsSelect.appendChild(option)
              })
            }
          })
  
          // Set default job category to empty
          categorySelect.value = ''
        })
        .catch(error => console.error('Error loading categories:', error))
    }
}
  