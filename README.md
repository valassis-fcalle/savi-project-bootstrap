# SAVI Project Bootstrap

This repo is a showcase on how to setup a modern JS project using som defacto
tools for a better and easier CI.

## Tooling

* Husky
* cSpell
* commitlint
* eslint
* prettier
* lint-staged
* semantic-release

## HOW-TO: commands

* `node bootstrap.msj` creates a new project with all the setup already done
* `node commit-lint-jira.msj` changes the commitlint config to use jira rules

## HOW-TO: commit message

Using commitlint we will enforce the commit messages to have certain format and
characteristics. There are many pre-built configuration and and comunity rules
and plugins.

### Using conventional commit lint configuration

The commit message can be divided into several pieces. This is the structure of
a commit `<type>(<scope>): <subject>` where `type` means what kind of change it
is, the `scope` is the affected unit (this is optional) and the `subject` is the
meaningful message for the commit.

Possible types:

* feat: new feature for the user, not a new feature for build script
* fix: bug fix for the user, not a fix to a build script
* docs: changes to the documentation
* style: formatting, missing semi colons, etc; no production code change
* refactor: refactoring production code, eg. renaming a variable
* test: adding missing tests, refactoring tests; no production code change
* chore: updating grunt tasks etc; no production code change

### CommitLint References

* <https://www.conventionalcommits.org/en/v1.0.0/>
* <https://karma-runner.github.io/1.0/dev/git-commit-msg.html>

## HOW-TO: semantic-release

Based on the semantic commits, whe can use semantic-release for bumping the
version of our projects.

### Semantic Release References

* <https://semantic-release.gitbook.io/semantic-release/>
