## Setup LIFF-Server

• Create .env (file)

# Port configuration
PORT=YourPort

# HTTPS configuration
HTTP= YOUR_CLIENT_HTTP
BASE_URL= YOUR_SERVER_HTTP/posts/pic/

# Database configuration
DB_HOST=localhost
DB_USER=Your_Username
DB_NAME=Name_Database

# Authentication configuration
SECRET=mysecret  # Secret key for authentication token in modules/auth.js (change as needed)

# Line Message API configuration
LINE_CHANNEL_ACCESS_TOKEN= YOUR_LINE_ACCESS_TOKEN

# Line Rich Menu IDs
RICH_MENU_DEFAULT=richmenu-a88e74321df5abf0525d5ceb0ff93748
RICH_MENU_USER=richmenu-a64bf1bae002b8f6fd84443c4da97e4a
RICH_MENU_POLICE=richmenu-e736a203ce0fc82940f0258536cab877
RICH_MENU_DEFAULT2=richmenu-55ed49aea218f0309be0d9faa85d4017