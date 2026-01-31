#!/bin/bash

ping() {
  afplay /System/Library/Sounds/Glass.aiff
}

notify() {
  osascript -e "display notification \"$1\" with title \"Ralph\" sound name \"Blow\""
}

MAX_ITERATIONS=${1:-50}
SPEC_FOLDER=${2:-specs}
AGENT=${3:-default-model}

SPEC_FILE="$SPEC_FOLDER/SPEC.md"
PROGRESS_FILE="$SPEC_FOLDER/PROGRESS.md"
ITERATION_FILE="$SPEC_FOLDER/.iteration"

if [ ! -f "$SPEC_FILE" ]; then
  echo "Error: $SPEC_FILE not found"
  exit 1
fi

if [ ! -f "$PROGRESS_FILE" ]; then
  touch "$PROGRESS_FILE"
fi

if [ ! -f "$ITERATION_FILE" ]; then
  echo "0" > "$ITERATION_FILE"
fi

PROMPT="You are an autonomous coding agent.

## Instructions
1. Read the progress file at: $PROGRESS_FILE
2. Read the spec file at: $SPEC_FILE
3. Work on ONE task at a time from the spec file
4. After making all the changes for the task, run npm run build and make sure everything is working. If it's not, fix it.
4. When a task is done and build is passing, mark the task as complete in the spec file by adding [x]
5. After marking it as complete, append the progress of what was done to the progress file

## Completion
- Work on only ONE task per iteration
- When a task is complete, mark it in the spec file and update the progress file
- When ALL tasks are complete, output <promise>COMPLETE</promise>
- Do not output <promise>COMPLETE</promise> until everything is done
"

for i in $(seq 1 "$MAX_ITERATIONS"); do
  echo "=== Iteration $i/$MAX_ITERATIONS ==="
  
  output=$(kiro-cli chat --agent "$AGENT" --no-interactive --trust-all-tools "$PROMPT" 2>&1 | tee /dev/tty)
  
  current_iteration=$(cat "$ITERATION_FILE")
  if [ "$current_iteration" -gt "$i" ]; then
    echo "$((current_iteration + 1))" > "$ITERATION_FILE"
  else
    echo "$i" > "$ITERATION_FILE"
  fi
  
  ping
  
  if echo "$output" | grep -q "<promise>COMPLETE</promise>"; then
    echo "=== Task completed at iteration $i ==="
    notify "Task completed successfully"
    exit 0
  fi
done

echo "=== Max iterations reached without completion ==="
notify "Max iterations reached"
exit 1
