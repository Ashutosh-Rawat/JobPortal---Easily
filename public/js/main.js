async function getDeleteJobAuth(jobid) {
    const res = confirm('Are you sure you want to delete this job application?')
    if(res) {
        // getting the server request from our js function
        const request = await fetch(
            `/jobs/${jobid}/delete`, 
            {method:'POST'}
        )
        if(request.ok) window.location.href = '/jobs'
    }
}

async function getUpdateJobAuth(jobid) {
    const res = confirm('Are you sure you want to update this job application?')
    if(res) document.getElementById('updateJobForm').submit()
}

async function getDeleteUser(userid) {
    const res = confirm('Are you sure, this will delete all your posted jobs and data?')
    if(res) {
        const request = await fetch(
            `/deleteUser`,
            {method: 'POST'}
        )
        if(request.ok) window.location.href = '/'
    }
}