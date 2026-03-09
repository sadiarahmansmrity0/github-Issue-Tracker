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

        function handleLogout() {
            currentUser = null;
            document.getElementById('loginPage').classList.remove('hidden');
            document.getElementById('mainPage').classList.add('hidden');
        }