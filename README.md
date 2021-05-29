# Read The Bin

An extension to easily create bins with https://bin.readthedocs.fr.

![Create a bin](https://raw.githubusercontent.com/readthedocs-fr/bin-client-vscode/main/images/create-a-bin.png)

## Contributing

After forking, do these commands:

```sh
git clone https://github.com/<your_username>/bin-client-vscode
cd bin-client-vscode

# we recommend you add this repo as an upstream remote (e.g. for updating your fork)
git remote add upstream https://github.com/readthedocs-fr/bin-client-vscode

yarn install
```

_We use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for commits messages._

```sh
git checkout -b <branch_name>
# make somes changes

yarn lint # or lint-fix
yarn format
yarn build --noEmit # check typescript types

git commit -am "conventional commit"
git push origin <branch_name>
```
