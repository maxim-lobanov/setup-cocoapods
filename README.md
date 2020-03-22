# setup-cocoapods
This action sets up specific version of Cocoapods in GitHub Actions workflow.  

# Available parameters
| Argument      | Description                             | Supported format           |
|---------------|-----------------------------------------|----------------------------|
| version       | Specify version of Cocoapods to install | `latest`, `1.5.2`, `1.9.1` |

# Usage
```
name: CI
on: [push]
jobs:
  build:
    name: Setup Cocoapods
    runs-on: macos-latest
    steps:
    - name: setup-cocoapods
      uses: maxim-lobanov/setup-cocoapods
      with:
        version: 1.9.1
```

# License
The scripts and documentation in this project are released under the [MIT License](LICENSE)