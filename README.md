# DasIsBadAss

This is for the Course DBMS-II Project

## installation:

- clone repo from github

```
git clone git@github.com:NagaRohithKumarJakkala/DasIsBadAss.git
```

- go to project folder and run these commands

```
cd services/backend
```

- and keep your .env in this folder with variable DB_URL in it in the format:

```
<username>:<password>@tcp(<url:port>)/<db_name>
```

- example .env:

```
DB_URL = "root:root@tcp(127.0.0.1:3306)/test"
```

- and do the following to ensure your backend installation:

```
go get .

go run main.go

```

```
cd ../services/frontend

npm install

npm run dev

```

## helpful git instructions to follow:

- git basic instructions to do:

```
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

```
git checkout main

git branch -d <branch_name>

```

- make sure u do git pull after these changes

- we need to create a specific branch for every feature and fix which is to merged later execpt readme fixes
- to create branch :
  for feature:

```
    git checkout -b feature/feature_name
```

for fixes:

```
    git checkout -b fixes/bug_name
```
