# IMS(Inventory Management System)

This is for the Course DBMS-II Project

## Table of Contents:

- [Prerequisites](#Prerequisites)
- [installation](#installation)
- [Usage](#Usage)
- [Git Instructions](#GitInstructions)
- [frontend readme](services/frontend/README.md)
- [backend readme](services/backend/readme.md)
- [credits](#Credits)
- [License](#License)
- [Third party licenses](#Third-Party-Licenses)

## Prerequisites

have to be added later

## installation:

- clone repo from GitHub

```bash
git clone git@github.com:NagaRohithKumarJakkala/IMS.git
```

- go to the project folder and run these commands

```bash
cd services/backend
```

- and keep your .env in this folder with variable DB_URL in it in the format:

```bash
<username>:<password>@tcp(<url:port>)/<db_name>
```

- example .env:

```bash
DB_URL = "root:root@tcp(127.0.0.1:3306)/test"
```

- and do the following to ensure your backend installation:

```bash
go get .

go run main.go

```

- and do the following to ensure your frontend installation:

```bash
cd services/frontend

npm install

npm run dev

```

## Usage

have to be added later

## GitInstructions:

- git basic instructions to do:

```bash
# before every add/commit ensure you do

git pull

# for adding files for commit

git add file_names

# this is preferred most times

git add .

# then commit

git commit -m " message "

# and push to repo

git push origin <branch_name>


```

- create pull request in github website and check for merge confits

- then delete the branch which you created in github and delete in local repo using these commands:

```bash
git checkout main

git pull

git branch -d <branch_name>

# i am not sure if this is necessary or not

git pull

```

- make sure u do git pull after these changes

- we need to create a specific branch for every feature and fix which is to merged later execpt readme fixes
- to create branch :
  for feature:

```bash
    git checkout -b feature/feature_name
```

for fixes:

```bash
    git checkout -b fixes/bug_name
```

## Credits

Contributors:

- [Naga Rohith Kumar Jakkala](https://github.com/NagaRohithKumarJakkala)
- [Sai Kaushik P](https://github.com/saikaushhikp)
- [Vishal Varukolu](https://github.com/Vishal45187)
- [Sairam Suhas Muvvala](https://github.com/suhas-1012)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Third-Party-Licenses

This project uses the following third-party libraries:
- will add it later
