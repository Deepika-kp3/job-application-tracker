let applications = [];

const jobForm =
    document.getElementById("jobForm");

const applicationList =
    document.getElementById("applicationList");

const totalApplications =
    document.getElementById("totalApplications");

const appliedCount =
    document.getElementById("appliedCount");

const interviewCount =
    document.getElementById("interviewCount");

const rejectedCount =
    document.getElementById("rejectedCount");

const searchInput =
    document.getElementById("searchInput");

const filterStatus =
    document.getElementById("filterStatus");


jobForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const company =
        document.getElementById("company").value.trim();

    const role =
        document.getElementById("role").value.trim();

    const date =
        document.getElementById("date").value;

    const status =
        document.getElementById("status").value;

    const application = {
        id: Date.now(),
        company: company,
        role: role,
        date: date,
        status: status
    };

    applications.push(application);

    saveApplications();

    displayApplications();

    updateDashboard();

    jobForm.reset();

});


function displayApplications() {

    applicationList.innerHTML = "";

    const searchText =
        searchInput.value.toLowerCase().trim();

    const selectedStatus =
        filterStatus.value;

    const filteredApplications =
        applications.filter(function (application) {

            const companyMatches =
                application.company
                    .toLowerCase()
                    .includes(searchText);

            const roleMatches =
                application.role
                    .toLowerCase()
                    .includes(searchText);

            const statusMatches =
                selectedStatus === "All" ||
                application.status === selectedStatus;

            return (
                (companyMatches || roleMatches) &&
                statusMatches
            );

        });


    if (filteredApplications.length === 0) {

        applicationList.innerHTML = `
            <tr>
                <td colspan="5" class="empty-message">
                    No applications found.
                </td>
            </tr>
        `;

        return;
    }


    filteredApplications.forEach(function (application) {

        const row =
            document.createElement("tr");

        let statusClass = "";

        if (application.status === "Applied") {
            statusClass = "status-applied";
        }
        else if (application.status === "Interview") {
            statusClass = "status-interview";
        }
        else if (application.status === "Selected") {
            statusClass = "status-selected";
        }
        else if (application.status === "Rejected") {
            statusClass = "status-rejected";
        }


        row.innerHTML = `

            <td>
                ${application.company}
            </td>

            <td>
                ${application.role}
            </td>

            <td>
                ${application.date}
            </td>

            <td>
                <span class="status ${statusClass}">
                    ${application.status}
                </span>
            </td>

            <td>
                <button
                    onclick="deleteApplication(${application.id})">
                    Delete
                </button>
            </td>

        `;

        applicationList.appendChild(row);

    });

}


function deleteApplication(id) {

    const confirmDelete =
        confirm("Are you sure you want to delete this application?");

    if (!confirmDelete) {
        return;
    }

    const index =
        applications.findIndex(function (application) {
            return application.id === id;
        });

    if (index !== -1) {
        applications.splice(index, 1);
    }

    saveApplications();

    displayApplications();

    updateDashboard();

}


function updateDashboard() {

    totalApplications.textContent =
        applications.length;

    const applied =
        applications.filter(function (application) {
            return application.status === "Applied";
        }).length;

    const interview =
        applications.filter(function (application) {
            return application.status === "Interview";
        }).length;

    const rejected =
        applications.filter(function (application) {
            return application.status === "Rejected";
        }).length;

    appliedCount.textContent =
        applied;

    interviewCount.textContent =
        interview;

    rejectedCount.textContent =
        rejected;

}


searchInput.addEventListener("input", function () {
    displayApplications();
});


filterStatus.addEventListener("change", function () {
    displayApplications();
});


function saveApplications() {

    localStorage.setItem(
        "jobApplications",
        JSON.stringify(applications)
    );

}


function loadApplications() {

    const savedApplications =
        localStorage.getItem("jobApplications");

    if (savedApplications) {
        applications =
            JSON.parse(savedApplications);
    }

    displayApplications();

    updateDashboard();

}


loadApplications();