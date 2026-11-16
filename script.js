
// ========================================
// NEIGHBOURHOOD CONNECT
// JavaScript for Issue Reporting Website
// ========================================


// 1. VARIABLES

// Array to store all reported issues
let reports = [];


// 2. GET HTML ELEMENTS

const issueForm = document.getElementById("issueForm");

const issueTitle = document.getElementById("issueTitle");
const category = document.getElementById("category");
const locationInput = document.getElementById("location");
const description = document.getElementById("description");

const issueList = document.getElementById("issueList");

const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");

const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const progressCount = document.getElementById("progressCount");
const resolvedCount = document.getElementById("resolvedCount");

const visibleCount = document.getElementById("visibleCount");
const emptyState = document.getElementById("emptyState");
const formMessage = document.getElementById("formMessage");


// 3. FUNCTION TO SHOW A MESSAGE

function showMessage(message, color) {
    formMessage.textContent = message;
    formMessage.style.color = color;
}


// 4. FUNCTION TO SUBMIT A NEW ISSUE

function addReport(event) {

    // Prevent the page from refreshing
    event.preventDefault();

    // Get values entered by the user
    let title = issueTitle.value.trim();
    let issueCategory = category.value;
    let issueLocation = locationInput.value.trim();
    let issueDescription = description.value.trim();

    // Check whether required information is entered
    if (title === "" || issueCategory === "" ||
        issueLocation === "" || issueDescription === "") {

        showMessage("Please fill in all required fields.", "red");
        return;
    }

    // Create an object containing issue details
    let newReport = {
        id: Date.now(),
        title: title,
        category: issueCategory,
        location: issueLocation,
        description: issueDescription,
        status: "Pending",
        date: new Date().toLocaleDateString()
    };

    // Add the new object to the reports array
    reports.push(newReport);

    // Clear the form
    issueForm.reset();

    // Show success message
    showMessage("Your issue has been reported successfully!", "green");

    // Update the website
    renderReports();
    updateDashboard();
}


// 5. FUNCTION TO CREATE AN ISSUE CARD

function createReportCard(report) {

    // Create the main card
    let card = document.createElement("div");
    card.className = "issue-card";

    // Create the issue title
    let title = document.createElement("h3");
    title.textContent = report.title;

    // Create category information
    let categoryText = document.createElement("p");
    categoryText.textContent = "Category: " + report.category;

    // Create location information
    let locationText = document.createElement("p");
    locationText.textContent = "Location: " + report.location;

    // Create description
    let descriptionText = document.createElement("p");
    descriptionText.textContent = report.description;

    // Create date information
    let dateText = document.createElement("p");
    dateText.textContent = "Reported on: " + report.date;

    // Create status dropdown
    let statusSelect = document.createElement("select");

    let statuses = ["Pending", "In Progress", "Resolved"];

    // Add status options using a loop
    for (let i = 0; i < statuses.length; i++) {

        let option = document.createElement("option");

        option.value = statuses[i];
        option.textContent = statuses[i];

        if (report.status === statuses[i]) {
            option.selected = true;
        }

        statusSelect.appendChild(option);
    }

    // Change the issue status when dropdown changes
    statusSelect.addEventListener("change", function () {

        changeReportStatus(report.id, statusSelect.value);

    });

    // Add all elements to the card
    card.appendChild(title);
    card.appendChild(categoryText);
    card.appendChild(locationText);
    card.appendChild(descriptionText);
    card.appendChild(dateText);
    card.appendChild(statusSelect);

    return card;
}


// 6. FUNCTION TO DISPLAY REPORTS

function renderReports() {

    // Remove previously displayed cards
    issueList.innerHTML = "";

    // Get search text and selected status
    let searchText = searchInput.value.toLowerCase().trim();
    let selectedStatus = statusFilter.value;

    let count = 0;

    // Check each report using a loop
    for (let i = 0; i < reports.length; i++) {

        let report = reports[i];

        // Search by title or location
        let titleMatch = report.title.toLowerCase().includes(searchText);
        let locationMatch = report.location.toLowerCase().includes(searchText);

        let searchMatch = titleMatch || locationMatch;

        // Check selected status
        let statusMatch = selectedStatus === "all" ||
                          report.status === selectedStatus;

        // Display only matching reports
        if (searchMatch && statusMatch) {

            let card = createReportCard(report);

            issueList.appendChild(card);

            count++;
        }
    }

    // Display number of visible reports
    visibleCount.textContent = count;

    // Show or hide the empty message
    if (count === 0) {
        emptyState.style.display = "block";
    } else {
        emptyState.style.display = "none";
    }
}


// 7. FUNCTION TO CHANGE ISSUE STATUS

function changeReportStatus(reportId, newStatus) {

    // Find the matching report
    for (let i = 0; i < reports.length; i++) {

        if (reports[i].id === reportId) {

            reports[i].status = newStatus;

            break;
        }
    }

    // Refresh cards and dashboard
    renderReports();
    updateDashboard();
}


// 8. FUNCTION TO UPDATE DASHBOARD COUNTS

function updateDashboard() {

    let total = reports.length;
    let pending = 0;
    let inProgress = 0;
    let resolved = 0;

    // Count reports according to their status
    for (let i = 0; i < reports.length; i++) {

        if (reports[i].status === "Pending") {

            pending++;

        } else if (reports[i].status === "In Progress") {

            inProgress++;

        } else if (reports[i].status === "Resolved") {

            resolved++;
        }
    }

    // Display the counts on the webpage
    totalCount.textContent = total;
    pendingCount.textContent = pending;
    progressCount.textContent = inProgress;
    resolvedCount.textContent = resolved;
}


// 9. EVENT LISTENERS

// Run addReport when the form is submitted
issueForm.addEventListener("submit", addReport);

// Run search when the user types
searchInput.addEventListener("input", renderReports);

// Run filter when the selected status changes
statusFilter.addEventListener("change", renderReports);


// 10. INITIAL DISPLAY

renderReports();
updateDashboard();
