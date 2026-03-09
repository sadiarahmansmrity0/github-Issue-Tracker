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
       