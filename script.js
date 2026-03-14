//    // State management
        let allIssues = [];
        let currentFilter = 'all';
        let currentUser = null;

        // API Functions
        async function fetchAllIssues() {
            showLoading(true);
            try {
                const response = await fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues');
                const data = await response.json();
                allIssues = data.data || [];
                displayIssues();
            } catch (error) {
                console.error('Error fetching issues:', error);
                showError('Failed to load issues');
            } finally {
                showLoading(false);
            }
        }

        async function fetchIssueById(id) {
            try {
                const response = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
                const data = await response.json();
                return data.data;
            } catch (error) {
                console.error('Error fetching issue:', error);
                return null;
            }
        }

      async function searchIssues(query) {
    if (!query.trim()) {
        fetchAllIssues();
        return;
    }
    
    showLoading(true);
    try {
        const response = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        allIssues = data.data || [];
        displayIssues();
    } catch (error) {
        console.error('Error searching issues:', error);
        showError('Search failed');
    } finally {
        showLoading(false);
    }
}

function filterIssues(filter) {
    currentFilter = filter;
    
    // Update tab styles
    const tabAll = document.getElementById('tabAll');
    const tabOpen = document.getElementById('tabOpen');
    const tabClosed = document.getElementById('tabClosed');
    
    // Remove active class
    tabAll.className = 'px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition';
    tabOpen.className = 'px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition';
    tabClosed.className = 'px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition';
    
    // Add active class to selected tab
    if (filter === 'all') {
        tabAll.className = 'active-tab px-6 py-2 rounded-lg font-medium transition';
    } else if (filter === 'open') {
        tabOpen.className = 'active-tab px-6 py-2 rounded-lg font-medium transition';
    } else if (filter === 'closed') {
        tabClosed.className = 'active-tab px-6 py-2 rounded-lg font-medium transition';
    }
    
    displayIssues();
}
        // login
function handleLogin() {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            if (username === 'admin' && password === 'admin123') {
                currentUser = { username };
                document.getElementById('loginPage').classList.add('hidden');
                document.getElementById('mainPage').classList.remove('hidden');
                fetchAllIssues();
            } else {
                alert('Invalid credentials. Use admin/admin123');
            }
        }

        // function handleLogout() {
        //     currentUser = null;
        //     document.getElementById('loginPage').classList.remove('hidden');
        //     document.getElementById('mainPage').classList.add('hidden');
        // }
        function handleSearch() {
    const query = document.getElementById('searchInput').value;
    searchIssues(query);
}
         function showLoading(show) {
            const spinner = document.getElementById('loadingSpinner');
            const grid = document.getElementById('issuesGrid');
            
            if (show) {
                spinner.classList.remove('hidden');
                grid.classList.add('hidden');
            } else {
                spinner.classList.add('hidden');
                grid.classList.remove('hidden');
            }
        }

        function showError(message) {
           
            alert(message);
        }
      function displayIssues() {
  const grid = document.getElementById('issuesGrid');
  const countElement = document.getElementById('issueCount');

  let filteredIssues = allIssues;

  if (currentFilter === 'open') {
    filteredIssues = allIssues.filter(issue => issue.status === 'open');
  } 
  else if (currentFilter === 'closed') {
    filteredIssues = allIssues.filter(issue => issue.status === 'closed');
  }

  countElement.textContent = filteredIssues.length;

  if (filteredIssues.length === 0) {
    grid.innerHTML =
      '<div class="col-span-full text-center py-20 text-gray-500">No issues found</div>';
    return;
  }

  grid.innerHTML = filteredIssues.map(issue => {

    const priorityBadge =
      issue.priority === 'high'
        ? 'bg-red-100 text-red-600'
        : issue.priority === 'medium'
        ? 'bg-yellow-100 text-yellow-700'
        : 'bg-gray-100 text-gray-600';

    const borderColor =
      issue.status === 'open'
        ? 'border-green-500'
        : 'border-purple-500';

    const statusIcon =
      issue.status === 'open'
        ? `<img src="assets/Open-Status.png" class="w-4 h-4">`
        : `<class="w-4 h-4"i class="fa-regular fa-circle-check"></i>`;

    const formattedDate = new Date(issue.createdAt).toLocaleDateString(
      'en-US',
      { month: 'numeric', day: 'numeric', year: 'numeric' }
    );

    return `
    <div onclick="openIssueModal(${issue.id})"
      class="bg-white rounded-xl border-t-4 ${borderColor} shadow-sm hover:shadow-md transition cursor-pointer">

      <div class="p-5">

        <!-- Top Row -->
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            ${statusIcon}
          </div>

          <span class="text-xs font-semibold px-3 py-1 rounded-full ${priorityBadge}">
            ${issue.priority.toUpperCase()}
          </span>
        </div>

        <!-- Title -->
        <h3 class="font-semibold text-gray-800 mb-2">
          ${issue.title}
        </h3>

        <!-- Description -->
        <p class="text-sm text-gray-500 mb-4">
          ${issue.description.substring(0, 80)}...
        </p>

        <!-- Labels -->
        <div class="flex flex-wrap gap-2 mb-4">
          ${issue.labels
            .map(
              label => `
              <span class="text-xs px-3 py-1 rounded-full bg-orange-100 text-orange-600 font-medium">
                ${label}
              </span>`
            )
            .join('')}
        </div>

        <!-- Footer -->
        <div class="flex justify-between text-xs text-gray-400">
          <span>#${issue.id} by ${issue.author}</span>
          <span>${formattedDate}</span>
        </div>

      </div>
    </div>
    `;
  }).join('');
}
       async function openIssueModal(id) {
  const issue = await fetchIssueById(id);
  if (!issue) return;

  const modal = document.getElementById('issueModal');
  const content = document.getElementById('modalContent');

  const statusBadge =
    issue.status === "open"
      ? `<span class="px-3 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">Opened</span>`
      : `<span class="px-3 py-1 text-xs font-semibold bg-purple-100 text-purple-700 rounded-full">Closed</span>`;

  const priorityBadge =
    issue.priority === "high"
      ? `<span class="px-2 py-1 text-xs font-semibold bg-red-100 text-red-600 rounded">HIGH</span>`
      : issue.priority === "medium"
      ? `<span class="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-700 rounded">MEDIUM</span>`
      : `<span class="px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-600 rounded">LOW</span>`;

  content.innerHTML = `
  
  <div class="space-y-4">

    <!-- Title -->
    <h2 class="text-xl font-semibold text-gray-800">
      ${issue.title}
    </h2>

    <!-- Status Row -->
    <div class="flex items-center gap-3 text-sm text-gray-500">
      ${statusBadge}
      <span>Opened by <span class="font-medium text-gray-700">${issue.author}</span></span>
      <span>•</span>
      <span>${new Date(issue.createdAt).toLocaleDateString()}</span>
    </div>

    <!-- Labels -->
    <div class="flex gap-2">
      ${issue.labels
        .map(
          label => `
          <span class="px-3 py-1 text-xs font-medium bg-orange-100 text-orange-600 rounded-full">
            ${label}
          </span>`
        )
        .join("")}
    </div>

    <!-- Description -->
    <p class="text-gray-600 text-sm">
      ${issue.description}
    </p>

    <!-- Info Box -->
    <div class="bg-gray-50 p-4 rounded-lg grid grid-cols-2 gap-6 text-sm">

      <div>
        <p class="text-gray-500 mb-1">Assignee:</p>
        <p class="font-medium text-gray-800">
          ${issue.assignee || "Unassigned"}
        </p>
      </div>

      <div>
        <p class="text-gray-500 mb-1">Priority:</p>
        ${priorityBadge}
      </div>

    </div>

  </div>
  `;

  modal.classList.remove("hidden");
}

        function closeModal() {
            document.getElementById('issueModal').classList.add('hidden');
        }

        function handleSearch() {
            const query = document.getElementById('searchInput').value;
            searchIssues(query);
        }
   document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });

        // Close modal when clicking outside
        document.getElementById('issueModal').addEventListener('click', (e) => {
            if (e.target === document.getElementById('issueModal')) {
                closeModal();
            }
        });

        // Initialize
        document.addEventListener('DOMContentLoaded', () => {
            // Check if user is already logged in (you could implement session storage)
        });