# wpvip
CLI Tool to convert normal WordPress Instance to WordPressVIP Instance

## Prerequisite

- Git
- NPM

## Installation

```bash
git clone https://github.com/dishitpala/wpvip.git && cd wpvip && npm install && npm install -g
```

## Usage

Go to WordPress directory and run below command

```bash
# It reduces four steps to convert into WordPressVIP Instance
# - Removing existing WordPress directory
# - Cloning Repository
# - Cloning VIP MU Plugins
# - Updating wp-config.php file

# Warning: It will delete existing wp-content directory
wpvip init GITHUB_REPO_URL
```
