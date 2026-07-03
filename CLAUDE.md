# Two-workstation git workflow

This repo is worked on from two machines. To avoid diverged branches and lost work:

- **Before starting work**, run `git fetch --all` and check `git status` / `git log HEAD..origin/<branch> --oneline`.
  If the current branch is behind its remote, pull (or rebase) before making changes.
- **Don't leave work uncommitted across sessions.** At the end of a session, either commit
  and push, or explicitly flag to the user that work is being left uncommitted on this
  machine so it isn't silently lost or conflicted with from the other workstation.
- **Prefer short-lived feature branches** for anything non-trivial over committing directly
  to a long-lived shared branch — reduces the chance both machines edit the same branch at
  the same time.
- If a push is rejected as non-fast-forward, don't force-push. Pull/rebase and resolve
  conflicts normally, or ask the user how they want to reconcile it.
