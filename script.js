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
                const response = await fetch(` https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=notifications=${encodeURIComponent(query)}`);
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
        //  function handleSearch() {
        //     const query = document.getElementById('searchInput').value;
        //     searchIssues(query);
        // }
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
            } else if (currentFilter === 'closed') {
                filteredIssues = allIssues.filter(issue => issue.status === 'closed');
            }
            
            countElement.textContent = filteredIssues.length;
            
            if (filteredIssues.length === 0) {
                grid.innerHTML = '<div class="col-span-full text-center py-20 text-gray-500">No issues found</div>';
                return;
            }
            
            grid.innerHTML = filteredIssues.map(issue => `
                <div onclick="openIssueModal(${issue.id})" class="bg-white rounded-lg shadow-sm hover:shadow-md transition cursor-pointer ${issue.status === 'open' ? 'border-top-green' : 'border-top-purple'}">
                    <div class="p-4">
                        <h3 class="font-semibold text-gray-800 mb-2 line-clamp-2">${issue.title}</h3>
                        <p class="text-sm text-gray-600 mb-3 line-clamp-2">${issue.description}</p>
                        
                        <div class="flex items-center space-x-2 mb-2">
                            <span class="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">${issue.status}</span>
                            <span class="text-xs px-2 py-1 ${issue.priority === 'high' ? 'bg-red-100 text-red-700' : issue.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'} rounded-full">${issue.priority}</span>
                        </div>
                        
                        <div class="flex items-center justify-between text-xs text-gray-500">
                            <span><i class="far fa-user mr-1"></i>${issue.author}</span>
                            <span><i class="far fa-calendar mr-1"></i>${new Date(issue.createdAt).toLocaleDateString()}</span>
                        </div>
                        
                        <div class="mt-2 flex flex-wrap gap-1">
                            ${issue.labels.map(label => `
                                <span class="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded">${label}</span>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `).join('');
        }