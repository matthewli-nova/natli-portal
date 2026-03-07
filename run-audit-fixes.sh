#!/bin/zsh
cd /Users/natlee/Projects/natli-portal
exec claude --dangerously-skip-permissions -p "$(cat AUDIT-FIXES-TASK.md)"
