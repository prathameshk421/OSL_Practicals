window.OSL_EXPERIMENTS_1_4 = [
  {
    "id": "exp-1",
    "num": 1,
    "co": "CO1",
    "shortTitle": "Shell",
    "title": "Linux Basics, Permissions & Shell Scripting",
    "subtitle": "Part A (20 core Linux commands, `chmod` 4-2-1, `ps`/`top`/`kill`) & Part B (`practice.sh` Student Record CRUD + Grade Calculator).",
    "compileCmd": "cd 01_Linux_and_Shell && bash practice.sh",
    "bigPicture": [
      "**Linux / Unix:** Multi-user, multitasking OS. Everything in Linux is treated as a file in an upside-down tree starting at `/` (root).",
      "**Kernel (The Brain):** Core of the OS that talks directly to hardware (CPU, RAM, disk). Users never touch it directly.",
      "**Shell (The Translator):** Takes commands (`ls`, `grep`, `mkdir`) and translates them for the kernel (e.g., `bash`, `sh`, `zsh`).",
      "**Paths:** Absolute path starts from root (`/home/user/stud.db`); relative path starts from current folder (`./stud.db`, `..`, `~`).",
      "**Part B App:** Plain-text database (`stud.db`) separated by `|` supporting **CRUD** (Create, Read, Update, Delete) + Grade calculation."
    ],
    "traps": [
      {
        "title": "grep vs find",
        "body": "`find` searches for **files/folders** by name, size, or type (`find . -name \"*.sh\"`). `grep` searches for **text patterns inside a file** (`grep \"^101|\" stud.db`)."
      },
      {
        "title": "What does 'x' (execute) mean on a FOLDER?",
        "body": "On a file, `x` lets you run it. On a **directory**, `x` lets you **enter (`cd`) into it**! Without `x`, you cannot `cd` into a folder even if you have `r`."
      }
    ],
    "tables": [
      {
        "title": "File Permissions & chmod (4-2-1 Rule)",
        "headers": [
          "Octal",
          "Binary / Perm",
          "Owner / Group / Others Example"
        ],
        "rows": [
          [
            "`755`",
            "`rwx r-x r-x`",
            "Standard for scripts (`r=4, w=2, x=1`)"
          ],
          [
            "`754`",
            "`rwx r-x r--`",
            "Lab manual example: Owner full, Group r+x, Others read-only"
          ],
          [
            "`644`",
            "`rw- r-- r--`",
            "Standard for normal text/data files"
          ],
          [
            "`777`",
            "`rwx rwx rwx`",
            "Everyone has full access (insecure in production)"
          ]
        ]
      },
      {
        "title": "Must-Know Linux Commands",
        "headers": [
          "Command",
          "What it does",
          "Common Flag / Example"
        ],
        "rows": [
          [
            "`ls` / `pwd` / `cd`",
            "List files / current path / change dir",
            "`ls -la`, `cd ..`, `cd ~`"
          ],
          [
            "`mkdir` / `rmdir` / `touch`",
            "Make dir / remove empty dir / create file",
            "`touch stud.db`"
          ],
          [
            "`cp` / `mv` / `rm`",
            "Copy / move or rename / delete permanently",
            "`mv temp.db stud.db`, `rm -rf`"
          ],
          [
            "`cat` / `head` / `tail`",
            "Print full / first / last lines",
            "`head -5 a.txt`, `tail -5 a.txt`"
          ],
          [
            "`grep` / `sed` / `awk`",
            "Search lines / edit streams / process columns",
            "`grep \"^101|\" stud.db`"
          ],
          [
            "`chmod` / `chown`",
            "Change permissions / change owner",
            "`chmod +x shellscript.sh`"
          ],
          [
            "`ps` / `top` / `kill`",
            "Process snapshot / live monitor / send signal",
            "`ps -ef`, `kill -9 PID`"
          ]
        ]
      }
    ],
    "vivaQA": [
      {
        "q": "What is the difference between Kernel and Shell?",
        "a": "Kernel is the core of the OS that talks directly to hardware. Shell (like Bash) is the command-line translator between the user and the kernel."
      },
      {
        "q": "What is a shebang (`#!/bin/bash`)? What happens if you omit it?",
        "a": "It tells the OS which interpreter to run the script with. If omitted, it runs in the default shell (often `sh`), which may break Bash features like `$(( ))` or arrays."
      },
      {
        "q": "How do you run a shell script? Why do we type `./script.sh`?",
        "a": "Run `chmod +x script.sh` then `./script.sh`, or directly `bash script.sh`. We need `./` because Linux does not search the current directory in `$PATH` for security."
      },
      {
        "q": "Explain `chmod 754 file`.",
        "a": "`7` (`rwx`) = Owner can read, write, execute; `5` (`r-x`) = Group can read & execute; `4` (`r--`) = Others can only read (`r=4, w=2, x=1`)."
      },
      {
        "q": "What is the difference between `chmod` and `chown`?",
        "a": "`chmod` changes file permissions (`r`, `w`, `x`). `chown` changes file ownership (user and group)."
      },
      {
        "q": "What is the difference between `>` and `>>`?",
        "a": "`>` overwrites the file completely (erases old content). `>>` appends new data to the end of the file.",
        "codeRef": {
          "fileId": "shellscript",
          "hlId": "create-fn"
        }
      },
      {
        "q": "Why did you put `^` and `|` in `grep -q \"^$roll|\" stud.db`?",
        "a": "`^` anchors to the start of the line and `|` marks the end of the roll column — so roll `1` won't accidentally match `101` or marks `10`. `-q` keeps it quiet (returns exit status only).",
        "codeRef": {
          "fileId": "shellscript",
          "hlId": "delete-fn"
        }
      },
      {
        "q": "How does delete work in your script?",
        "a": "`grep -v \"^$roll|\"` copies every line EXCEPT the matching roll number into `temp.db`, then `mv temp.db stud.db` atomically replaces the original file.",
        "codeRef": {
          "fileId": "shellscript",
          "hlId": "delete-fn"
        }
      },
      {
        "q": "What does `sed -i \"s/^$roll|.*/new/\" stud.db` do?",
        "a": "`sed` is a stream editor. `-i` edits in-place, `s/old/new/` substitutes, and `.*` matches the rest of the line to replace the entire student record.",
        "codeRef": {
          "fileId": "shellscript",
          "hlId": "modify-fn"
        }
      },
      {
        "q": "What is `IFS` in `while IFS='|' read -r roll name m1 m2 m3`?",
        "a": "`IFS` = Internal Field Separator. By default Bash splits on spaces; setting `IFS='|'` tells `read` to split each record on the pipe `|` symbol.",
        "codeRef": {
          "fileId": "shellscript",
          "hlId": "grade-fn"
        }
      },
      {
        "q": "Why do we use `-ge` instead of `>=` in Bash `if` statements?",
        "a": "Inside `[ ]`, `>` and `<` are treated as file redirection operators, not numeric comparisons. Bash uses `-eq`, `-ne`, `-gt`, `-ge`, `-lt`, `-le`.",
        "codeRef": {
          "fileId": "shellscript",
          "hlId": "grade-fn"
        }
      },
      {
        "q": "What does `[ -z \"$name\" ]` check?",
        "a": "`-z` checks if the string length is zero (empty), preventing blank entries from being inserted into `stud.db`.",
        "codeRef": {
          "fileId": "shellscript",
          "hlId": "insert-val"
        }
      },
      {
        "q": "What is the difference between `ps` and `top`?",
        "a": "`ps` shows a static one-time snapshot of running processes. `top` gives a live, continuously updating view of CPU, RAM, and processes."
      },
      {
        "q": "What is the difference between `kill PID` and `kill -9 PID`?",
        "a": "`kill PID` sends `SIGTERM` (`-15`), politely asking the process to save and exit. `kill -9 PID` sends `SIGKILL`, forcing the kernel to terminate it immediately."
      },
      {
        "q": "What is the difference between `grep`, `sed`, and `awk`?",
        "a": "`grep` searches/filters lines; `sed` edits/replaces/deletes text in streams/files; `awk` processes structured columns/fields."
      },
      {
        "q": "What is the difference between `rm` and `rmdir`?",
        "a": "`rmdir` deletes only empty directories. `rm` deletes files, and `rm -r` deletes non-empty directories recursively."
      },
      {
        "q": "What is a Pipe (`|`) in Linux?",
        "a": "It connects the standard output (`stdout`) of one command directly as the standard input (`stdin`) of the next command, e.g., `ps -ef | grep bash`."
      },
      {
        "q": "What is the difference between single quotes `' '` and double quotes `\" \"`?",
        "a": "Double quotes expand variables (`\"$roll\"` → `101`). Single quotes treat everything as literal text (`'$roll'` → `$roll`)."
      },
      {
        "q": "What is `$?` in Bash?",
        "a": "It stores the exit status of the last executed command: `0` = success (true), `1–255` = error/failure (opposite of C!)."
      },
      {
        "q": "Can you do floating-point math in Bash using `$(( ))`?",
        "a": "No — `$(( ))` does integer-only arithmetic (truncates decimals). For decimals, pipe to `bc`: `echo \"scale=2; 91/3\" | bc`.",
        "codeRef": {
          "fileId": "shellscript",
          "hlId": "grade-fn"
        }
      }
    ],
    "proTips": [
      "Live modification: Search a student → `grep \"^$roll|\" stud.db | column -t -s '|'`",
      "Count total students → `wc -l stud.db` (subtract 1 for the header row!)",
      "Sort by roll number → `sort -t '|' -k1 -n stud.db` (`-t` delimiter, `-k1` col 1, `-n` numeric)."
    ],
    "files": [
      {
        "id": "shellscript",
        "name": "practice.sh",
        "path": "01_Linux_and_Shell/practice.sh",
        "lang": "bash",
        "desc": "Your practice Student Record CRUD & Grade Calculator using `stud.db` with `|` delimiter.",
        "code": "\n\ncreate(){\n    if [ ! -f \"stud.db\" ]; then \n        touch stud.db;\n        echo \"Roll No.|Name|Marks1|Marks2|Marks3\" > stud.db;\n    else \n        echo \"Using Existing Database\";\n    fi\n}\n\nview(){\n    echo \"\";\n    if [ -f \"stud.db\" ]; then \n        column -t -s '|' \"stud.db\";\n        echo \"\"\n    else \n        echo \"Database Not found!!\"\n    fi\n}\n\ninsert(){\n    echo \"Enter Roll No.:\"\n    read roll_no\n\n    echo \"Enter Name:\"\n    read name\n\n    echo \"Enter Marks 1:\"\n    read marks1\n\n    echo \"Enter Marks 2:\"\n    read marks2\n\n    echo \"Enter Marks 3:\"\n    read marks3\n\n    if [ -z \"$roll_no\" ]; then \n        echo \"Roll No. canot be empty!!\"\n    elif [ -z \"$name\" ]; then \n        echo \"Name cannot be empty!!\"\n    elif [ -z \"$marks1\" ]; then\n        echo \"Marks 1 cannot be empty!!\"\n    elif [ -z \"$marks2\" ]; then\n        echo \"Marks 2 cannot be empty!!\"\n    elif [ -z \"$marks3\" ]; then\n        echo \"Marks 3 cannot be empty!!\"\n    else \n        echo \"$roll_no|$name|$marks1|$marks2|$marks3\" >> stud.db\n        echo \"Record Inserted!\"\n    fi\n}\n\ndelete(){\n    echo \"Enter Roll No to delete:\"\n    read roll_no\n\n    if [ -z \"$roll_no\" ]; then \n        echo \"Input cannot be empty!\"\n        return \n    fi \n\n    if grep -q \"^$roll_no|\" stud.db; then \n        touch temp.db\n        grep -v \"^$roll_no|\" stud.db > temp.db\n        mv temp.db stud.db\n        echo \"$roll_no deleted succesfully!\"\n    else \n        echo \"Roll No. not found!!\"\n    fi\n}\n\nmodify(){\n    echo \"Enter Roll No to be modified\"\n    read roll_no \n\n    echo \"Enter New Roll No.:\"\n    read new_roll_no\n\n    echo \"Enter New Name:\"\n    read name\n\n    echo \"Enter New Marks 1:\"\n    read marks1\n\n    echo \"Enter New Marks 2:\"\n    read marks2\n\n    echo \"Enter New Marks 3:\"\n    read marks3\n\n    if grep -q \"^$roll_no|\" stud.db; then \n        sed -i \"s/^$roll_no|.*/$new_roll_no|$name|$marks1|$marks2|$marks3/\" stud.db\n        echo \"Modified\"\n    else \n        echo \"Roll No not found!!\"\n    fi\n}\n\ngrade(){\n\n    touch grade.db\n    echo \"Roll No|Grade\" > grade.db\n\n    while IFS=\"|\" read -r roll_no name m1 m2 m3 \n    do\n        if [ \"$roll_no\" = \"Roll No.\" ]; then \n            continue\n        fi\n\n        avg=$(( (m1+m2+m3)/3 ))\n\n        if [ $avg -ge 90 ]; then \n            grade='O';\n        elif [ $avg -ge 80 ]; then\n            grade='A';\n        elif [ $avg -ge 70 ]; then\n            grade='B';\n        elif [ $avg -ge 60 ]; then\n            grade='C';\n        elif [ $avg -ge 50 ]; then \n            grade='D';\n        else \n            grade='F';\n        fi\n\n        echo \"$roll_no|$grade\" >> grade.db\n    \n    done < stud.db\n\n    column -t -s '|' grade.db\n    rm grade.db\n\n}\n\n\ncreate \n\nwhile true\ndo\n    echo -e \"student menu \\n\"\n    echo -e \"pick choice : 1: insert , 2:delete , 3:modify, 4:grade calc, 5:view 6)exit\\n\"\n    echo \"enter choice: \"\n    read choice\n\n    case $choice in\n        1)insert;;\n        2)delete;;\n        3)modify;;\n        4)grade;;\n        5)view;;\n        6)break;;\n    esac\ndone\necho \"Byee!!\"",
        "highlights": [
          {
            "id": "create-fn",
            "startLine": 3,
            "endLine": 10,
            "badge": "KEY",
            "label": "Create DB (`-f` & `>`)",
            "explanation": "`[ ! -f \"stud.db\" ]` checks if `stud.db` does NOT exist (spaces inside `[ ... ]` are mandatory!). `>` writes the header row fresh."
          },
          {
            "id": "view-fn",
            "startLine": 12,
            "endLine": 20,
            "badge": "KEY",
            "label": "Pretty Table (`column -t`)",
            "explanation": "`column -t -s '|'` formats the pipe-delimited `stud.db` into neatly aligned columns."
          },
          {
            "id": "insert-val",
            "startLine": 38,
            "endLine": 51,
            "badge": "KEY",
            "label": "Empty Validation (`-z`) & Append (`>>`)",
            "explanation": "`[ -z \"$var\" ]` returns true if any field is empty. `>>` appends the new record to `stud.db` without erasing existing rows."
          },
          {
            "id": "delete-fn",
            "startLine": 63,
            "endLine": 70,
            "badge": "VIVA TRAP",
            "label": "Exact Delete (`grep -q` + `grep -v`)",
            "explanation": "`grep -q \"^$roll_no|\"` silently checks exact roll match (`^` = line start, `|` = column end so `1` cannot match `101`). `grep -v` keeps all other lines into `temp.db`, then `mv` replaces `stud.db`."
          },
          {
            "id": "modify-fn",
            "startLine": 92,
            "endLine": 97,
            "badge": "KEY",
            "label": "In-Place Edit (`sed -i`)",
            "explanation": "`sed -i \"s/^$roll_no|.*/.../\"` edits `stud.db` in-place, matching the roll number plus `.*` (rest of line) and replacing the whole record."
          },
          {
            "id": "grade-fn",
            "startLine": 105,
            "endLine": 129,
            "badge": "CORE ALGO",
            "label": "`IFS=\"|\"`, Integer Math & `-ge`",
            "explanation": "`IFS=\"|\"` splits each line on `|`; `-r` disables backslash escaping; `$(( (m1+m2+m3)/3 ))` does integer math; `-ge` compares numbers (because `>` means redirection inside `[ ]`); `done < stud.db` feeds the file into the loop."
          },
          {
            "id": "menu-case",
            "startLine": 139,
            "endLine": 154,
            "badge": "KEY",
            "label": "Infinite Menu & `case ... esac`",
            "explanation": "`while true` keeps showing the menu until choice `6` hits `break`. Each branch ends with `;;` and `esac` closes `case`."
          }
        ]
      }
    ]
  },
  {
    "id": "exp-2",
    "num": 2,
    "co": "CO2",
    "shortTitle": "Fork/Exec",
    "title": "Process Management: fork(), wait(), Orphan, Zombie & exec()",
    "subtitle": "Your practice programs: Part A (`even_odd.c`, `orphan.c`, `zombie.c`) & Part B (`parent.c` + `factorial.c` using `execvp()`).",
    "compileCmd": "cd 02_Process_Management/practice && gcc factorial.c -o factorial && gcc parent.c -o parent && ./parent 5",
    "bigPicture": [
      "**Program vs Process:** Program = passive executable on disk (`./parent`). Process = active instance in RAM with its own PID, memory (text, data, heap, stack), and registers.",
      "**PCB (`task_struct`):** Kernel structure holding PID, state, program counter, registers, open file descriptors, and memory pointers.",
      "**5 Process States:** `New → Ready → Running → Waiting/Blocked → Terminated`.",
      "**`fork()`:** Called ONCE, returns TWICE — `0` in child, child's positive PID in parent, `-1` on error. Uses **Copy-on-Write (CoW)** so RAM pages are only copied when modified.",
      "**`exec()`:** Replaces the current process's memory image with a brand-new program while keeping the **exact same PID**. Never returns on success!"
    ],
    "traps": [
      {
        "title": "Can you kill a Zombie process using `kill -9`?",
        "body": "**NO!** A zombie is already dead — it has no running code or memory left, only a leftover entry in the Process Table (`<defunct>`, state `Z`). Either the parent must call `wait()` to reap it, or you must **kill the parent** so `init` adopts and reaps it."
      },
      {
        "title": "Who runs first after `fork()` — Parent or Child?",
        "body": "**Non-deterministic!** The OS CPU Scheduler decides. That's why in `evenodd.c`, even and odd numbers can interleave unless synchronized with `wait()`."
      }
    ],
    "tables": [
      {
        "title": "Orphan Process vs Zombie Process",
        "headers": [
          "Feature",
          "Orphan (`orphan.c`)",
          "Zombie (`zombie.c`)"
        ],
        "rows": [
          [
            "What happened?",
            "Parent exits BEFORE child finishes",
            "Child exits BEFORE parent calls `wait()`"
          ],
          [
            "Handled by",
            "Adopted (reparented) by `init`/`systemd` (PID 1)",
            "Stuck in Process Table holding PID & exit status"
          ],
          [
            "`ps` state",
            "Running/Sleeping (`R`/`S`), new PPID = `1` (or subreaper)",
            "`<defunct>`, state `Z` (`ps -el | grep defunct`)"
          ],
          [
            "Harmful?",
            "Usually harmless (`init` reaps it cleanly)",
            "Many zombies exhaust the Process Table / PIDs!"
          ],
          [
            "Fix",
            "Parent calls `wait()` before exiting",
            "Parent calls `wait()`/`waitpid()` (or kill parent)"
          ]
        ]
      },
      {
        "title": "The `exec()` Family Cheat Sheet",
        "headers": [
          "Variant",
          "Letters",
          "How Arguments Work"
        ],
        "rows": [
          [
            "`execl()`",
            "`l` = list",
            "Comma-separated args ending in `NULL`; needs full path"
          ],
          [
            "`execv()`",
            "`v` = vector",
            "`char *argv[]` array ending in `NULL`; needs full path"
          ],
          [
            "`execlp()`",
            "`l` + `p`",
            "List of args + searches `$PATH`"
          ],
          [
            "`execvp()`",
            "`v` + `p`",
            "**Used in `parent.c`!** Array of args + searches `$PATH`"
          ],
          [
            "`execve()`",
            "`v` + `e`",
            "Takes custom `envp[]`; the actual Linux kernel syscall"
          ]
        ]
      }
    ],
    "vivaQA": [
      {
        "q": "What is a process? How is it different from a program?",
        "a": "A program is a passive file on disk. A process is an active program in execution inside RAM with its own PID, memory space, and PCB."
      },
      {
        "q": "What is a PCB (Process Control Block)?",
        "a": "A kernel data structure (`struct task_struct` in Linux) storing a process's PID, state, registers, program counter, and memory/file info."
      },
      {
        "q": "What does `fork()` return to the parent and to the child?",
        "a": "Returns `0` to the child, the child's positive PID to the parent, and `-1` on failure.",
        "codeRef": {
          "fileId": "parent",
          "hlId": "fork-call"
        }
      },
      {
        "q": "If `fork()` is called 3 times sequentially, how many total processes exist?",
        "a": "`2^3 = 8` total processes (1 original parent + 7 newly created child processes)."
      },
      {
        "q": "Does `fork()` copy the entire parent memory immediately?",
        "a": "No! Linux uses **Copy-on-Write (CoW)** — pages are shared read-only and copied only when either process writes to a page."
      },
      {
        "q": "What is an orphan process?",
        "a": "A running child whose parent terminated early. It is adopted by `init`/`systemd` (PID 1 or user subreaper).",
        "codeRef": {
          "fileId": "orphan",
          "hlId": "orphan-sleep"
        }
      },
      {
        "q": "What is a zombie process?",
        "a": "A terminated child whose parent hasn't called `wait()` yet. Its process table entry stays as `<defunct>` (`Z` state) to hold its exit status.",
        "codeRef": {
          "fileId": "zombie",
          "hlId": "zombie-sleep"
        }
      },
      {
        "q": "How do you see a zombie process in Linux?",
        "a": "Run `ps -el | grep defunct` or `ps aux | grep Z` in another terminal while the parent sleeps."
      },
      {
        "q": "Why are zombie processes dangerous if too many accumulate?",
        "a": "Each zombie occupies a slot in the kernel's Process Table and a PID. If the table fills up, the OS cannot create new processes."
      },
      {
        "q": "How do you prevent zombie processes?",
        "a": "Call `wait()` or `waitpid()` in the parent to reap the child, or handle `SIGCHLD`."
      },
      {
        "q": "What does `wait()` do?",
        "a": "Blocks the parent until a child terminates, collects its exit status, and removes its entry from the process table (reaping).",
        "codeRef": {
          "fileId": "parent",
          "hlId": "wait-macros"
        }
      },
      {
        "q": "What is the difference between `fork()` and `exec()`?",
        "a": "`fork()` creates a NEW process with a new PID. `exec()` replaces the current process's code/memory with a new program while keeping the SAME PID."
      },
      {
        "q": "Why did you put `perror(\"execvp failed\")` right after `execvp()`?",
        "a": "Because if `execvp()` succeeds, the old program is wiped out and that line NEVER runs. It executes only on failure (e.g., `./fac` missing).",
        "codeRef": {
          "fileId": "parent",
          "hlId": "execvp-block"
        }
      },
      {
        "q": "Why is `NULL` required at the end of `char *args[] = {\"./fac\", argv[1], NULL}`?",
        "a": "`execvp()` doesn't take a length parameter, so it uses the trailing `NULL` pointer to know where the argument list ends.",
        "codeRef": {
          "fileId": "parent",
          "hlId": "execvp-block"
        }
      },
      {
        "q": "What do `'v'` and `'p'` mean in `execvp()`?",
        "a": "`v` = vector (`char*` array of arguments); `p` = PATH (automatically searches `$PATH` if no `/` is in the filename).",
        "codeRef": {
          "fileId": "parent",
          "hlId": "execvp-block"
        }
      },
      {
        "q": "What do `WIFEXITED(flag)` and `WEXITSTATUS(flag)` do?",
        "a": "`WIFEXITED` checks if the child exited normally; `WEXITSTATUS` extracts its actual `return`/`exit()` code (`0` or `1`).",
        "codeRef": {
          "fileId": "parent",
          "hlId": "wait-macros"
        }
      },
      {
        "q": "What are `argc` and `argv` in `main(int argc, char *argv[])`?",
        "a": "`argc` is the number of command-line arguments; `argv` is the array of argument strings (`argv[0]` = program name, `argv[1]` = first user arg).",
        "codeRef": {
          "fileId": "parent",
          "hlId": "argc-check"
        }
      },
      {
        "q": "What does `atoi()` do in `fac.c`?",
        "a": "ASCII to Integer (`<stdlib.h>`) — converts CLI string `\"5\"` from `argv[1]` into integer `5`.",
        "codeRef": {
          "fileId": "fac",
          "hlId": "atoi-conv"
        }
      },
      {
        "q": "In `orphan.c`, why did you call `sleep(10)` inside the child?",
        "a": "To keep the child alive long enough for the parent to exit first, forcing the kernel to reparent the child before its second `getppid()`.",
        "codeRef": {
          "fileId": "orphan",
          "hlId": "orphan-sleep"
        }
      },
      {
        "q": "What happens if you run `./parent 5` without compiling `fac.c` first?",
        "a": "`fork()` succeeds, child calls `execvp(\"./fac\", args)`, it fails with `No such file or directory`, `perror()` prints the error, and child exits."
      }
    ],
    "proTips": [
      "Always compile `fac.c` to `-o fac` first because `parent.c` explicitly executes `\"./fac\"`!",
      "Eagle-eye catch in `evenodd.c` line 10–11: `if(p<0)` is followed by `if(p==0)` instead of `else if(p==0)`. Mentioning that `else if` prevents a failed fork from also entering the `else` parent branch impresses examiners!"
    ],
    "files": [
      {
        "id": "parent",
        "name": "parent.c",
        "path": "02_Process_Management/practice/parent.c",
        "lang": "c",
        "desc": "Part B parent process: forks a child, replaces child with `./factorial` via `execvp()`, and reaps exit status via `wait(&flag)`.",
        "code": "#include<unistd.h>\n#include<sys/wait.h>\n#include<stdio.h>\n\nint main(int argc,char* argv[]){\n    if(argc!=2){\n        printf(\"Argumnet list is wrong\\n\");\n        return 1;\n    }\n    pid_t child=fork();\n    if(child==0){\n        printf(\"Child Process id %d,Parent Process id %d\\n\",getpid(),getppid());\n        char* args[]={\"./factorial\",argv[1],NULL};\n        execvp(\"./factorial\",args);\n        perror(\"execvp Failed\");\n    }\n    else if(child>0){\n        printf(\"Chid Process id:%d , Parent Process id:%d\\n\",child,getpid());\n        int flag;\n        wait(&flag);\n        if(WIFEXITED(flag)){\n            printf(\"Child Process exited successfully!! Status:%d\\n\",WEXITSTATUS(flag));\n        }\n    }\n    else{\n        printf(\"Fork failed!!\\n\");\n        return 1;\n    }\n}",
        "highlights": [
          {
            "id": "argc-check",
            "startLine": 5,
            "endLine": 9,
            "badge": "KEY",
            "label": "CLI Argument Validation (`argc != 2`)",
            "explanation": "Ensures exactly one number is passed (`./parent 5`). `argc` includes `argv[0]` (program name)."
          },
          {
            "id": "fork-call",
            "startLine": 10,
            "endLine": 10,
            "badge": "SYSCALL",
            "label": "`fork()` Process Creation",
            "explanation": "`pid_t child = fork();` duplicates the process: returns `0` in child, child PID (`> 0`) in parent, `< 0` on error."
          },
          {
            "id": "execvp-block",
            "startLine": 11,
            "endLine": 16,
            "badge": "SYSCALL",
            "label": "Child Image Replacement (`execvp`)",
            "explanation": "`args[]` MUST end with `NULL`. `execvp(\"./factorial\", args)` replaces the child image keeping the SAME PID. `perror()` only runs if `execvp()` fails!"
          },
          {
            "id": "wait-macros",
            "startLine": 17,
            "endLine": 24,
            "badge": "SYSCALL",
            "label": "`wait(&flag)` & Exit Status Macros",
            "explanation": "`wait(&flag)` blocks parent and reaps child (no zombie). `WIFEXITED(flag)` verifies normal exit; `WEXITSTATUS(flag)` extracts the return code."
          }
        ]
      },
      {
        "id": "fac",
        "name": "factorial.c",
        "path": "02_Process_Management/practice/factorial.c",
        "lang": "c",
        "desc": "Part B child target program executed by `parent.c` via `execvp()` to compute factorial.",
        "code": "#include<unistd.h>\n#include<stdio.h>\n#include<stdlib.h>\n\nint main(int argc,char* argv[]){\n    if(argc!=2){\n        printf(\"Argumnet list is wrong\\n\");\n        return 1;\n    }\n\n    int num=atoi(argv[1]);\n    if(num<0){\n        printf(\"Number cannot be negative!!\\n\");\n        return 1;\n    }\n    long long int factorial=1;\n    for(int i=1;i<=num;i++){\n        factorial=factorial*i;\n    }\n    printf(\"Factorial of %d is %lld\\n\",num,factorial);\n    return 0;\n}",
        "highlights": [
          {
            "id": "atoi-conv",
            "startLine": 11,
            "endLine": 15,
            "badge": "KEY",
            "label": "`atoi()` String-to-Int & Guard",
            "explanation": "`atoi(argv[1])` converts CLI string `\"5\"` to int `5`. Rejects negative inputs and returns exit status `1`."
          },
          {
            "id": "fac-loop",
            "startLine": 16,
            "endLine": 21,
            "badge": "KEY",
            "label": "64-Bit Factorial Loop",
            "explanation": "`long long int` holds up to `20!` cleanly and prints with `%lld`."
          }
        ]
      },
      {
        "id": "evenodd",
        "name": "even_odd.c",
        "path": "02_Process_Management/practice/even_odd.c",
        "lang": "c",
        "desc": "Part A: Child prints odd numbers while Parent prints even numbers, then Parent reaps child with `wait(NULL)`.",
        "code": "#include<stdio.h>\n#include<stdlib.h>\n#include<unistd.h>\n#include<sys/wait.h>\n\nint main(){\n    printf(\"Enter Number:\");\n    int n;\n    scanf(\"%d\",&n);\n    pid_t child=fork();\n\n    if(child==0){\n        printf(\"Process id:%d,Parent Process id:%d\\n\",getpid(),getppid());\n        printf(\"Odd Numbers: \");\n        for(int i=1;i<=n;i+=2){\n            printf(\"%d \",i);\n        }\n        printf(\"\\n\");\n    }\n    else if(child>0){\n        printf(\"Child Process id:%d,Process id:%d\\n\",child,getpid());\n        printf(\"Even Numbers: \");\n        for(int i=0;i<=n;i+=2){\n            printf(\"%d \",i);\n        }\n        printf(\"\\n\");\n        wait(NULL);\n        printf(\"Child Exited\\n\");\n    }\n    else{\n        printf(\"Fork failed!!\\n\");\n    }\n}",
        "highlights": [
          {
            "id": "evenodd-child",
            "startLine": 10,
            "endLine": 19,
            "badge": "SYSCALL",
            "label": "`fork()` & Child Odd Numbers",
            "explanation": "Child (`child == 0`) prints its PID/PPID and odd numbers `1..n`."
          },
          {
            "id": "evenodd-wait",
            "startLine": 20,
            "endLine": 29,
            "badge": "SYSCALL",
            "label": "Parent Even Numbers & `wait(NULL)`",
            "explanation": "Parent (`child > 0`) prints even numbers concurrently, then calls `wait(NULL)` so no zombie is left behind."
          }
        ]
      },
      {
        "id": "orphan",
        "name": "orphan.c",
        "path": "02_Process_Management/practice/orphan.c",
        "lang": "c",
        "desc": "Demonstrates an Orphan Process: Parent exits immediately while Child sleeps 10s and gets adopted by `init`/subreaper.",
        "code": "#include<stdio.h>\n#include<unistd.h>\n#include<stdlib.h>\n\nint main(){\n    pid_t p=fork();\n\n    if(p<0)printf(\"Fork didn't work!\");\n    else if(p==0){\n        printf(\"Process Id:%d,Parent Process Id:%d\\n\",getpid(),getppid());\n        sleep(10);\n        printf(\"Child back up !!\\n\");\n        printf(\"Process Id:%d,Parent Process Id:%d\\n\",getpid(),getppid());\n    }\n    else{\n        printf(\"Process Id:%d,Child Process Id:%d\\n\",getpid(),p);\n        printf(\"Parent Exiting!!\\n\");\n    }\n}",
        "highlights": [
          {
            "id": "orphan-sleep",
            "startLine": 9,
            "endLine": 14,
            "badge": "CORE ALGO",
            "label": "Child Sleeps → Reparented!",
            "explanation": "Child prints original `getppid()`, calls `sleep(10)` so parent exits first, then prints `getppid()` again showing the new adoptive parent PID."
          },
          {
            "id": "orphan-parent",
            "startLine": 15,
            "endLine": 18,
            "badge": "KEY",
            "label": "Parent Exits Immediately",
            "explanation": "Parent exits without `wait()`, turning the sleeping child into an orphan."
          }
        ]
      },
      {
        "id": "zombie",
        "name": "zombie.c",
        "path": "02_Process_Management/practice/zombie.c",
        "lang": "c",
        "desc": "Demonstrates a Zombie Process (`<defunct>`): Child exits immediately while Parent sleeps 10s without `wait()`.",
        "code": "#include<stdio.h>\n#include<unistd.h>\n#include<stdlib.h>\n\nint main(){\n    pid_t p=fork();\n\n    if(p<0)printf(\"Fork didn't work!\");\n    else if(p==0){\n        printf(\"Process Id:%d,Parent Process Id:%d\\n\",getpid(),getppid());\n        printf(\"Child exiting..\");\n    }\n    else{\n        printf(\"Process Id:%d,Child Process Id:%d\\n\",getpid(),p);\n        sleep(10);\n        printf(\"Parent Exiting!!\\n\");\n    }\n}",
        "highlights": [
          {
            "id": "zombie-child",
            "startLine": 9,
            "endLine": 12,
            "badge": "KEY",
            "label": "Child Exits Immediately",
            "explanation": "Child terminates right away, leaving its exit status in the Process Table waiting to be reaped."
          },
          {
            "id": "zombie-sleep",
            "startLine": 13,
            "endLine": 17,
            "badge": "VIVA TRAP",
            "label": "Parent Sleeps Without `wait()` → Zombie (`Z`)",
            "explanation": "While parent sleeps 10s without `wait()`, `ps -el | grep defunct` shows the child in `Z` state. `kill -9` cannot remove a zombie!"
          }
        ]
      }
    ]
  },
  {
    "id": "exp-3",
    "num": 3,
    "co": "CO2 / CO3",
    "shortTitle": "CPU Sched",
    "title": "CPU Scheduling: FCFS, SJF, SRTF, Priority (NP & P) & Round Robin",
    "subtitle": "Your updated `practice.cpp` with Arrival Time (`AT`) & CPU idle gaps across all 6 algorithms (FCFS, SJF, SRTF, Priority NP & P, Round Robin).",
    "compileCmd": "cd 03_CPU_Scheduling && g++ -std=c++17 practice.cpp -o practice && ./practice",
    "bigPicture": [
      "**Short-Term (CPU) Scheduler:** Picks which Ready-Queue process gets the CPU next. **Dispatcher** does the actual context switch (delay = Dispatch Latency).",
      "**Non-Preemptive vs Preemptive:** Non-preemptive (`FCFS`, `SJF`, `Priority NP`) lets a running process keep CPU until it finishes; Preemptive (`SRTF`, `Priority P`, `Round Robin`) can interrupt mid-run when a shorter/higher-priority process arrives or a quantum expires.",
      "**Core Formulas (with Arrival Time):** `CT` = finish clock time, `TAT = CT - AT`, `WT = TAT - BT`, `Response Time = First CPU Start - AT`. If no process has arrived yet, clock jumps/ticks across the **CPU idle gap** (`t = max(t, at)`).",
      "**Convoy Effect (FCFS):** One huge CPU-bound process blocks many short processes behind it.",
      "**Starvation & Aging:** Low-priority / long jobs can starve in SJF/SRTF/Priority; **Aging** gradually boosts waiting processes' priority."
    ],
    "traps": [
      {
        "title": "Round Robin Time Quantum (q) — Too Large vs Too Small",
        "body": "If `q` is **too large** (> max burst time) → Round Robin degenerates into **FCFS**. If `q` is **too small** → excessive **context-switch overhead** wastes CPU cycles!"
      },
      {
        "title": "Round Robin Enqueue Order with Arrival Time!",
        "body": "When a process finishes its time slice `q` at clock `t` and still has `rem > 0`, you **MUST enqueue newly arrived processes (`at <= t`) FIRST**, and THEN re-enqueue the preempted process at the back of the Ready Queue!"
      }
    ],
    "tables": [
      {
        "title": "Worked Example with Arrival Time (P1: AT=0 BT=8 PR=3, P2: AT=1 BT=4 PR=1, P3: AT=2 BT=9 PR=4, P4: AT=3 BT=5 PR=2, q=3)",
        "headers": [
          "Algorithm",
          "Type",
          "Avg WT",
          "Avg TAT"
        ],
        "rows": [
          [
            "**FCFS**",
            "Non-Preemptive",
            "`8.75`",
            "`15.25`"
          ],
          [
            "**SJF**",
            "Non-Preemptive",
            "`7.75`",
            "`14.25`"
          ],
          [
            "**SRTF (Preemptive SJF)**",
            "Preemptive",
            "**`6.50` (Optimal!)**",
            "**`13.00` (Optimal!)**"
          ],
          [
            "**Priority (NP, low=high)**",
            "Non-Preemptive",
            "`7.75`",
            "`14.25`"
          ],
          [
            "**Priority (P, low=high)**",
            "Preemptive",
            "`6.50`",
            "`13.00`"
          ],
          [
            "**Round Robin (`q=3`)**",
            "Preemptive",
            "`13.50`",
            "`20.00`"
          ]
        ]
      },
      {
        "title": "All 6 Algorithms Compared",
        "headers": [
          "Algorithm",
          "Type",
          "Pros",
          "Cons"
        ],
        "rows": [
          [
            "**FCFS**",
            "Non-Preemptive",
            "Simple, zero starvation",
            "**Convoy Effect**, poor AWT"
          ],
          [
            "**SJF**",
            "Non-Preemptive",
            "Optimal among non-preemptive",
            "Cannot know future BT; **Starvation**"
          ],
          [
            "**SRTF**",
            "Preemptive SJF",
            "**Globally optimal** minimum Avg WT",
            "More context switches; **Starvation** of long jobs"
          ],
          [
            "**Priority (NP / P)**",
            "Both supported",
            "Urgent/real-time jobs run immediately (Preemptive)",
            "**Starvation** of low-priority jobs (fixed by **Aging**)"
          ],
          [
            "**Round Robin**",
            "Preemptive",
            "Fair, best Response Time, no starvation",
            "Higher AWT; context-switch overhead if `q` too small"
          ]
        ]
      }
    ],
    "vivaQA": [
      {
        "q": "What is the main goal of CPU scheduling?",
        "a": "Maximize CPU utilization & throughput while minimizing turnaround time, waiting time, and response time."
      },
      {
        "q": "Difference between Preemptive and Non-Preemptive scheduling?",
        "a": "Non-preemptive lets a process keep CPU until it finishes or blocks; preemptive lets the OS interrupt and switch it out mid-execution."
      },
      {
        "q": "Which algorithms in your code are non-preemptive and which are preemptive?",
        "a": "**Non-preemptive:** FCFS, SJF, Priority (NP). **Preemptive:** SRTF (Preemptive SJF), Priority (P), and Round Robin."
      },
      {
        "q": "Define Turnaround Time and Waiting Time with Arrival Time.",
        "a": "`TAT = CT - AT` (total time from arrival to completion). `WT = TAT - BT` (total time spent waiting in the Ready Queue).",
        "codeRef": {
          "fileId": "cpu_sched",
          "hlId": "fcfs-fn"
        }
      },
      {
        "q": "What happens if the CPU is idle (no process has arrived at time `t`)?",
        "a": "In FCFS/SJF/Priority(NP) we jump clock `t` directly to the next arriving process's `at` (`t = max(t, at)`). In SRTF/Priority(P) we advance `t++` across idle ticks.",
        "codeRef": {
          "fileId": "cpu_sched",
          "hlId": "sjf-fn"
        }
      },
      {
        "q": "What is Response Time and why does it matter?",
        "a": "Time from arrival until the process gets the CPU for the FIRST time — critical for interactive/GUI systems."
      },
      {
        "q": "What is the Convoy Effect? Which algorithm suffers from it?",
        "a": "Many short processes stuck waiting behind one long CPU-bound process — classic flaw of FCFS."
      },
      {
        "q": "Why is SRTF called globally optimal?",
        "a": "Because preempting whenever a shorter remaining burst arrives mathematically guarantees the lowest possible Average Waiting Time.",
        "codeRef": {
          "fileId": "cpu_sched",
          "hlId": "srtf-fn"
        }
      },
      {
        "q": "Why is pure SJF / SRTF impossible in a real OS?",
        "a": "The OS cannot know exact future CPU burst lengths — it can only predict them via **Exponential Averaging**: `τ(n+1) = α·t(n) + (1-α)·τ(n)`."
      },
      {
        "q": "How does SRTF work in your code?",
        "a": "Tracks remaining time `rem[i]`. Every 1 time unit `t`, picks the arrived process (`at <= t`) with minimum `rem[i]`, decrements `rem[best]--`, and records `ct = t` when `rem[best] == 0`.",
        "codeRef": {
          "fileId": "cpu_sched",
          "hlId": "srtf-fn"
        }
      },
      {
        "q": "How does Preemptive Priority differ from Non-Preemptive Priority?",
        "a": "Non-preemptive runs the chosen highest-priority job to completion. Preemptive checks every tick and immediately switches if a higher-priority (smaller `pr`) process arrives!",
        "codeRef": {
          "fileId": "cpu_sched",
          "hlId": "pr-p-fn"
        }
      },
      {
        "q": "What is Starvation (Indefinite Blocking) and how do you solve it?",
        "a": "When a low-priority or long-burst process waits forever because higher-priority/shorter jobs keep arriving. Solved by **Aging** — gradually increasing priority of waiting processes."
      },
      {
        "q": "In your Priority Scheduling, is 1 higher priority or 4?",
        "a": "Lower number = higher priority (`1` is highest), because we compare `procs[i].pr < procs[best].pr`.",
        "codeRef": {
          "fileId": "cpu_sched",
          "hlId": "pr-np-fn"
        }
      },
      {
        "q": "How do you break ties in SJF, SRTF, and Priority?",
        "a": "By earlier Arrival Time (`procs[i].at < procs[best].at`), and then input order — fair FCFS tie-breaking!"
      },
      {
        "q": "What happens to Round Robin if the time quantum is very large vs very small?",
        "a": "Too large → degenerates into FCFS. Too small → excessive context-switch overhead wastes CPU cycles."
      },
      {
        "q": "Why does Round Robin with Arrival Time use a `queue<int>` Ready Queue?",
        "a": "Because processes must execute in exact arrival/re-entry order! Newly arriving processes (`at <= t`) are pushed BEFORE the preempted process is pushed back.",
        "codeRef": {
          "fileId": "cpu_sched",
          "hlId": "rr-fn"
        }
      },
      {
        "q": "How does Round Robin calculate Waiting Time without tracking every gap?",
        "a": "Using `TAT = CT - AT` and `WT = TAT - BT`, because all time between arrival and completion not spent running (`BT`) was spent waiting!",
        "codeRef": {
          "fileId": "cpu_sched",
          "hlId": "rr-fn"
        }
      },
      {
        "q": "What is a Dispatcher and Dispatch Latency?",
        "a": "Dispatcher performs the context switch and hands CPU to the chosen process. Dispatch latency is the time to stop one process and start another."
      },
      {
        "q": "Difference between Short-Term and Long-Term Scheduler?",
        "a": "Long-term loads jobs from disk to RAM (controls degree of multiprogramming). Short-term picks which ready process in RAM gets the CPU next."
      },
      {
        "q": "What is a Gantt Chart?",
        "a": "A timeline bar chart showing which process occupies the CPU in each time interval — used to visually compute CT, TAT, and WT."
      }
    ],
    "proTips": [
      "Live tweak for **higher number = higher priority**: just flip `procs[i].pr < procs[best].pr` to `>` in `priority_non_preemptive` and `priority_preemptive`!",
      "Point out how `round_robin()` enqueues newly arrived processes BEFORE re-pushing the unfinished current process — examiners love checking that exact edge case!"
    ],
    "files": [
      {
        "id": "cpu_sched",
        "name": "practice.cpp",
        "path": "03_CPU_Scheduling/practice.cpp",
        "lang": "cpp",
        "desc": "Your updated practice CPU scheduling suite with Arrival Time (`AT`), idle-gap handling, and all 6 non-preemptive & preemptive algorithms.",
        "code": "#include <algorithm>\n#include <climits>\n#include <iostream>\n#include <queue>\n#include <string>\n#include <vector>\nusing namespace std;\n\nstruct Process {\n    int id, at, bt, pr;\n};\n\nvoid print_result(const string &title, const vector<Process> &p,\n                  const vector<int> &ct, const vector<int> &tat,\n                  const vector<int> &wt) {\n    float twt = 0, ttat = 0;\n    int n = p.size();\n    cout << \"\\n--- \" << title << \" ---\\n\";\n    cout << \"PID\\tAT\\tBT\\tPR\\tCT\\tTAT\\tWT\\n\";\n    for (int i = 0; i < n; i++) {\n        cout << \"P\" << p[i].id << \"\\t\" << p[i].at << \"\\t\" << p[i].bt\n             << \"\\t\" << p[i].pr << \"\\t\" << ct[i] << \"\\t\" << tat[i]\n             << \"\\t\" << wt[i] << \"\\n\";\n        twt += wt[i];\n        ttat += tat[i];\n    }\n    cout << \"Avg Waiting Time: \" << (twt / n)\n         << \"\\nAvg Turnaround Time: \" << (ttat / n) << \"\\n\";\n}\n\n// 1. FCFS (Non-Preemptive) with Arrival Time\nvoid fcfs(const vector<Process> &p) {\n    int n = p.size();\n    vector<int> order(n);\n    for (int i = 0; i < n; i++) order[i] = i;\n    stable_sort(order.begin(), order.end(), [&](int a, int b) {\n        return p[a].at < p[b].at;\n    });\n\n    vector<int> ct(n, 0), tat(n, 0), wt(n, 0);\n    int cur_t = 0;\n    for (int idx : order) {\n        if (cur_t < p[idx].at) cur_t = p[idx].at;\n        cur_t += p[idx].bt;\n        ct[idx] = cur_t;\n        tat[idx] = ct[idx] - p[idx].at;\n        wt[idx] = tat[idx] - p[idx].bt;\n    }\n    print_result(\"FCFS (Non-Preemptive)\", p, ct, tat, wt);\n}\n\n// 2. SJF (Non-Preemptive) with Arrival Time\nvoid sjf(const vector<Process> &p) {\n    int n = p.size();\n    vector<int> ct(n, 0), tat(n, 0), wt(n, 0);\n    vector<bool> done(n, false);\n    int completed = 0, cur_t = 0;\n\n    while (completed < n) {\n        int best = -1;\n        for (int i = 0; i < n; i++) {\n            if (!done[i] && p[i].at <= cur_t) {\n                if (best == -1 || p[i].bt < p[best].bt ||\n                    (p[i].bt == p[best].bt && p[i].at < p[best].at)) {\n                    best = i;\n                }\n            }\n        }\n        if (best == -1) {\n            int next_at = INT_MAX;\n            for (int i = 0; i < n; i++)\n                if (!done[i]) next_at = min(next_at, p[i].at);\n            cur_t = next_at;\n            continue;\n        }\n        cur_t += p[best].bt;\n        ct[best] = cur_t;\n        tat[best] = ct[best] - p[best].at;\n        wt[best] = tat[best] - p[best].bt;\n        done[best] = true;\n        completed++;\n    }\n    print_result(\"SJF (Non-Preemptive)\", p, ct, tat, wt);\n}\n\n// 3. SRTF (Preemptive SJF) with Arrival Time\nvoid srtf(const vector<Process> &p) {\n    int n = p.size();\n    vector<int> rem(n), ct(n, 0), tat(n, 0), wt(n, 0);\n    for (int i = 0; i < n; i++) rem[i] = p[i].bt;\n\n    int completed = 0, cur_t = 0;\n    while (completed < n) {\n        int best = -1;\n        for (int i = 0; i < n; i++) {\n            if (rem[i] > 0 && p[i].at <= cur_t) {\n                if (best == -1 || rem[i] < rem[best] ||\n                    (rem[i] == rem[best] && p[i].at < p[best].at)) {\n                    best = i;\n                }\n            }\n        }\n        if (best == -1) {\n            cur_t++;\n            continue;\n        }\n        rem[best]--;\n        cur_t++;\n        if (rem[best] == 0) {\n            ct[best] = cur_t;\n            tat[best] = ct[best] - p[best].at;\n            wt[best] = tat[best] - p[best].bt;\n            completed++;\n        }\n    }\n    print_result(\"SRTF (Preemptive SJF)\", p, ct, tat, wt);\n}\n\n// 4. Priority (Non-Preemptive, lower number = higher priority)\nvoid priority_np(const vector<Process> &p) {\n    int n = p.size();\n    vector<int> ct(n, 0), tat(n, 0), wt(n, 0);\n    vector<bool> done(n, false);\n    int completed = 0, cur_t = 0;\n\n    while (completed < n) {\n        int best = -1;\n        for (int i = 0; i < n; i++) {\n            if (!done[i] && p[i].at <= cur_t) {\n                if (best == -1 || p[i].pr < p[best].pr ||\n                    (p[i].pr == p[best].pr && p[i].at < p[best].at)) {\n                    best = i;\n                }\n            }\n        }\n        if (best == -1) {\n            int next_at = INT_MAX;\n            for (int i = 0; i < n; i++)\n                if (!done[i]) next_at = min(next_at, p[i].at);\n            cur_t = next_at;\n            continue;\n        }\n        cur_t += p[best].bt;\n        ct[best] = cur_t;\n        tat[best] = ct[best] - p[best].at;\n        wt[best] = tat[best] - p[best].bt;\n        done[best] = true;\n        completed++;\n    }\n    print_result(\"Priority (Non-Preemptive, low=high)\", p, ct, tat, wt);\n}\n\n// 5. Priority (Preemptive, lower number = higher priority)\nvoid priority_p(const vector<Process> &p) {\n    int n = p.size();\n    vector<int> rem(n), ct(n, 0), tat(n, 0), wt(n, 0);\n    for (int i = 0; i < n; i++) rem[i] = p[i].bt;\n\n    int completed = 0, cur_t = 0;\n    while (completed < n) {\n        int best = -1;\n        for (int i = 0; i < n; i++) {\n            if (rem[i] > 0 && p[i].at <= cur_t) {\n                if (best == -1 || p[i].pr < p[best].pr ||\n                    (p[i].pr == p[best].pr && p[i].at < p[best].at)) {\n                    best = i;\n                }\n            }\n        }\n        if (best == -1) {\n            cur_t++;\n            continue;\n        }\n        rem[best]--;\n        cur_t++;\n        if (rem[best] == 0) {\n            ct[best] = cur_t;\n            tat[best] = ct[best] - p[best].at;\n            wt[best] = tat[best] - p[best].bt;\n            completed++;\n        }\n    }\n    print_result(\"Priority (Preemptive, low=high)\", p, ct, tat, wt);\n}\n\n// 6. Round Robin (Preemptive) with Arrival Time & Ready Queue\nvoid round_robin(const vector<Process> &p, int time_q) {\n    int n = p.size();\n    vector<int> order(n);\n    for (int i = 0; i < n; i++) order[i] = i;\n    stable_sort(order.begin(), order.end(), [&](int a, int b) {\n        return p[a].at < p[b].at;\n    });\n\n    vector<int> rem(n), ct(n, 0), tat(n, 0), wt(n, 0);\n    for (int i = 0; i < n; i++) rem[i] = p[i].bt;\n\n    queue<int> rq;\n    int next_idx = 0, completed = 0, cur_t = 0;\n\n    while (completed < n) {\n        if (rq.empty()) {\n            cur_t = max(cur_t, p[order[next_idx]].at);\n            while (next_idx < n && p[order[next_idx]].at <= cur_t)\n                rq.push(order[next_idx++]);\n        }\n\n        int i = rq.front();\n        rq.pop();\n\n        int run = min(time_q, rem[i]);\n        rem[i] -= run;\n        cur_t += run;\n\n        while (next_idx < n && p[order[next_idx]].at <= cur_t)\n            rq.push(order[next_idx++]);\n\n        if (rem[i] == 0) {\n            ct[i] = cur_t;\n            tat[i] = ct[i] - p[i].at;\n            wt[i] = tat[i] - p[i].bt;\n            completed++;\n        } else {\n            rq.push(i);\n        }\n    }\n    print_result(\"Round Robin (q=\" + to_string(time_q) + \")\", p, ct, tat, wt);\n}\n\nint main() {\n    int n, time_q;\n    cout << \"Enter number of processes: \";\n    cin >> n;\n\n    vector<Process> p(n);\n    for (int i = 0; i < n; i++) {\n        p[i].id = i + 1;\n        cout << \"Enter Arrival Time, Burst Time, Priority for P\" << p[i].id << \": \";\n        cin >> p[i].at >> p[i].bt >> p[i].pr;\n    }\n\n    cout << \"Enter time quantum for Round Robin: \";\n    cin >> time_q;\n\n    fcfs(p);\n    sjf(p);\n    srtf(p);\n    priority_np(p);\n    priority_p(p);\n    round_robin(p, time_q);\n\n    return 0;\n}\n",
        "highlights": [
          {
            "id": "proc-struct",
            "startLine": 9,
            "endLine": 11,
            "badge": "KEY",
            "label": "`struct Process` (ID, AT, BT, PR)",
            "explanation": "Stores each process's ID, Arrival Time (`at`), Burst Time (`bt`), and Priority (`pr`) cleanly."
          },
          {
            "id": "fcfs-fn",
            "startLine": 32,
            "endLine": 49,
            "badge": "CORE ALGO",
            "label": "FCFS with Arrival Time & Idle Gap",
            "explanation": "Sorts by `at` with `stable_sort`, jumps `cur_t` across any idle gap (`if (cur_t < p[idx].at)`), and computes `CT`, `TAT = CT - AT`, `WT = TAT - BT`."
          },
          {
            "id": "sjf-fn",
            "startLine": 52,
            "endLine": 82,
            "badge": "CORE ALGO",
            "label": "SJF (Non-Preemptive) with Arrival Time",
            "explanation": "Picks the arrived (`at <= cur_t`), unfinished process with smallest `bt`. Jumps `cur_t` to `next_at` when CPU is idle."
          },
          {
            "id": "srtf-fn",
            "startLine": 85,
            "endLine": 115,
            "badge": "CORE ALGO",
            "label": "SRTF (Preemptive SJF) Tick-by-Tick",
            "explanation": "Tracks remaining time `rem[]`. Every tick picks the arrived process with minimum `rem[i]`, automatically preempting when a shorter job arrives!"
          },
          {
            "id": "pr-np-fn",
            "startLine": 118,
            "endLine": 148,
            "badge": "CORE ALGO",
            "label": "Priority (Non-Preemptive, Low = High)",
            "explanation": "Among arrived processes (`at <= cur_t`), picks lowest priority number (`pr`) and runs it to completion."
          },
          {
            "id": "pr-p-fn",
            "startLine": 151,
            "endLine": 180,
            "badge": "CORE ALGO",
            "label": "Priority (Preemptive, Low = High)",
            "explanation": "Checks every tick for the arrived process with highest priority (lowest `pr`), immediately preempting when a more urgent job arrives!"
          },
          {
            "id": "rr-fn",
            "startLine": 183,
            "endLine": 225,
            "badge": "VIVA TRAP",
            "label": "Round Robin with `queue<int>` & Arrival Order",
            "explanation": "Maintains a FIFO Ready Queue `rq`. After running `min(time_q, rem[i])`, **enqueues newly arrived processes (`at <= cur_t`) BEFORE re-pushing `i`**!"
          }
        ]
      }
    ]
  },
  {
    "id": "exp-4",
    "num": 4,
    "co": "CO3 / CO4",
    "shortTitle": "Shared Mem",
    "title": "IPC using System V Shared Memory (Chat App)",
    "subtitle": "Your practice System V Shared Memory chat app (`writer_chat.c` & `reader_chat.c`) using `ftok`, `shmget`, `shmat`, `shmdt`, `shmctl`.",
    "compileCmd": "cd 04_Shared_Memory_IPC/practice && touch chatfile && gcc writer_chat.c -o writer_chat && gcc reader_chat.c -o reader_chat",
    "bigPicture": [
      "**Why IPC?** Processes have isolated virtual address spaces for security; IPC lets cooperating processes exchange data.",
      "**2 IPC Models:** Message Passing (pipes, queues, sockets — copies data user → kernel → user) vs **Shared Memory** (maps one physical RAM segment into both processes).",
      "**Fastest IPC:** Once attached with `shmat()`, reads/writes happen directly in user space via normal C pointers (`buf->msg`) with **zero kernel copying**!",
      "**The Catch:** Kernel does NOT synchronize shared memory — the programmer must coordinate turns (`buf->flag`, semaphores, or mutex) to avoid race conditions.",
      "**Terminal Inspection:** `ipcs -m` lists active shared memory segments (`nattch`, `bytes`); `ipcrm -m <shmid>` removes leaked segments."
    ],
    "traps": [
      {
        "title": "What if `chatfile` does NOT exist?",
        "body": "`ftok(\"chatfile\", 65)` fails and returns `-1` because it hashes the file's **inode & device number** from disk! Always run `touch chatfile` first."
      },
      {
        "title": "Busy Waiting (Spinlock) Drawback",
        "body": "`while (buf->flag == 1);` and `while (buf->flag == 0);` burn **100% CPU** spinning in a tight loop. Production code replaces polling with **Semaphores** or **Mutex + Condition Variables** so waiting processes sleep."
      }
    ],
    "tables": [
      {
        "title": "The 5 System V Shared Memory Calls (Lifecycle)",
        "headers": [
          "Call",
          "Returns",
          "Purpose (Say This in Viva!)"
        ],
        "rows": [
          [
            "`ftok(\"chatfile\", 65)`",
            "`key_t` (`-1` err)",
            "Generates unique IPC key from file inode + project ID `65`"
          ],
          [
            "`shmget(key, size, 0666 \\| IPC_CREAT)`",
            "`int shmid`",
            "Creates/fetches shared RAM segment; `0666` = `rw-rw-rw-`"
          ],
          [
            "`shmat(shmid, NULL, 0)`",
            "`void *` pointer",
            "Attaches segment into process's virtual address space"
          ],
          [
            "`shmdt(buf)`",
            "`0` / `-1`",
            "Detaches segment from THIS process (does NOT delete from kernel!)"
          ],
          [
            "`shmctl(shmid, IPC_RMID, NULL)`",
            "`0` / `-1`",
            "Marks segment for deletion once all attached processes detach"
          ]
        ]
      }
    ],
    "vivaQA": [
      {
        "q": "What is IPC (Inter-Process Communication)?",
        "a": "OS mechanisms allowing separate processes to exchange data and synchronize actions."
      },
      {
        "q": "Name the common IPC mechanisms in Linux.",
        "a": "Pipes (unnamed), Named Pipes (FIFOs), Message Queues, Shared Memory, Semaphores, Signals, and Sockets."
      },
      {
        "q": "Why is Shared Memory faster than Pipes or Message Queues?",
        "a": "Pipes/queues copy data user → kernel → user. Shared memory maps the same physical RAM into both processes — zero kernel copying after `shmat()`."
      },
      {
        "q": "If Shared Memory is fastest, why don't we use it everywhere?",
        "a": "No built-in synchronization (race condition risk) and works only on a single machine (not over a network like sockets)."
      },
      {
        "q": "What is the role of `ftok()`?",
        "a": "Generates a unique `key_t` IPC key from an existing file's inode and a project ID so unrelated processes open the exact same segment.",
        "codeRef": {
          "fileId": "chat_writer",
          "hlId": "w-shm-setup"
        }
      },
      {
        "q": "Why must both writer and reader pass the same filename and project ID to `ftok()`?",
        "a": "So both compute the identical `key_t` and attach to the same shared memory segment."
      },
      {
        "q": "What does `shmget()` do?",
        "a": "Creates a new shared memory segment (with `IPC_CREAT`) or returns the `shmid` of an existing segment matching `key`.",
        "codeRef": {
          "fileId": "chat_writer",
          "hlId": "w-shm-setup"
        }
      },
      {
        "q": "What does `0666 | IPC_CREAT` mean in `shmget()`?",
        "a": "`0666` grants `rw-` permissions to owner/group/others; `IPC_CREAT` creates the segment if it doesn't exist.",
        "codeRef": {
          "fileId": "chat_writer",
          "hlId": "w-shm-setup"
        }
      },
      {
        "q": "What does `shmat(shmid, NULL, 0)` do?",
        "a": "Attaches the segment to the process's virtual address space (`NULL` = OS chooses address; `0` = read-write mode).",
        "codeRef": {
          "fileId": "chat_writer",
          "hlId": "w-shm-setup"
        }
      },
      {
        "q": "Do both processes get the exact same virtual memory address from `shmat()`?",
        "a": "Not necessarily! Each process has its own virtual address space; both virtual pointers simply map to the **same physical RAM frames**."
      },
      {
        "q": "Difference between `shmdt()` and `shmctl(..., IPC_RMID, NULL)`?",
        "a": "`shmdt()` only detaches from the current process. `shmctl(IPC_RMID)` marks the segment to be freed from kernel RAM once all processes detach.",
        "codeRef": {
          "fileId": "chat_reader",
          "hlId": "r-cleanup"
        }
      },
      {
        "q": "What happens if neither process calls `shmctl(IPC_RMID)`?",
        "a": "The segment persists in kernel RAM even after both programs exit until manually deleted with `ipcrm -m` or reboot."
      },
      {
        "q": "How do you view and delete active shared memory segments in terminal?",
        "a": "`ipcs -m` lists active segments; `ipcrm -m <shmid>` deletes one."
      },
      {
        "q": "Why do we need `buf->flag` in `struct shm_buf`?",
        "a": "To synchronize turns (`0` = writer's turn, `1` = reader's turn) so reader never reads half-written data and writer never overwrites unread messages.",
        "codeRef": {
          "fileId": "chat_writer",
          "hlId": "w-struct"
        }
      },
      {
        "q": "What is a Race Condition?",
        "a": "A bug where concurrent processes access shared data without synchronization, making output depend on unpredictable execution timing."
      },
      {
        "q": "What is Busy Waiting? Where does it occur in your code?",
        "a": "Tight polling loops `while (buf->flag == 1);` and `while (buf->flag == 0);` that burn CPU cycles instead of sleeping.",
        "codeRef": {
          "fileId": "chat_writer",
          "hlId": "w-loop"
        }
      },
      {
        "q": "How can you eliminate Busy Waiting in this chat app?",
        "a": "Replace flag polling with two Semaphores (or mutex + condition variable) so waiting processes block with 0% CPU usage."
      },
      {
        "q": "Why did you use `fgets()` + `strcspn()` instead of `scanf()`?",
        "a": "`scanf(\"%s\")` stops at spaces. `fgets()` safely reads multi-word lines, and `strcspn(buf->msg, \"\\n\")` strips the trailing newline so `strcmp(..., \"exit\")` matches cleanly.",
        "codeRef": {
          "fileId": "chat_writer",
          "hlId": "w-loop"
        }
      },
      {
        "q": "Can this chat app be made full-duplex (two-way)?",
        "a": "Yes — use two message buffers/flags (`a_to_b` and `b_to_a`), or two threads per process (one reading, one writing)."
      },
      {
        "q": "Which process should you start first and why?",
        "a": "Start `./chat_writer` first because it initializes `buf->flag = 0`. If reader starts first on dirty memory, it could read stale data once."
      }
    ],
    "proTips": [
      "Live Demo Flex: While both `./chat_writer` and `./chat_reader` are open, run `ipcs -m` in a 3rd terminal to show `nattch = 2` and `bytes = 1028` (`4` bytes `int` + `1024` bytes `char`)!",
      "Compiler trap: under `-O2`, declare `volatile int flag;` so the compiler doesn't cache `buf->flag` in a register!"
    ],
    "files": [
      {
        "id": "chat_writer",
        "name": "writer_chat.c",
        "path": "04_Shared_Memory_IPC/practice/writer_chat.c",
        "lang": "c",
        "desc": "Practice Writer (Producer) process: creates/attaches shared memory, writes messages when `flag == 0`, and signals reader (`flag = 1`).",
        "code": "#include<stdio.h>\n#include<stdlib.h>\n#include<sys/ipc.h>\n#include<sys/shm.h>\n#include<string.h>\n\n#define SIZE 1024\n\nstruct shm_buf{\n    int flag;\n    char msg[SIZE];\n};\n\nint main(){\n    key_t key=ftok(\"chatfile\",65);\n    int shmid=shmget(key,sizeof(struct shm_buf),0666 | IPC_CREAT);\n    struct shm_buf* buf=(struct shm_buf*)shmat(shmid,NULL,0);\n\n    printf(\"Writer Ready,Enter Ur Message\\n\");\n    buf->flag=0;\n    while(1){\n        while(buf->flag==1);\n        printf(\"Writer> \");\n        fgets(buf->msg,SIZE,stdin);\n        buf->msg[strcspn(buf->msg,\"\\n\")]=0;\n        buf->flag=1;\n        if(strcmp(buf->msg,\"exit\")==0){\n            printf(\"Exiting!\");\n            break;\n        }\n    }   \n    shmdt(buf);\n    return 0;\n}",
        "highlights": [
          {
            "id": "w-struct",
            "startLine": 9,
            "endLine": 12,
            "badge": "KEY",
            "label": "Shared Memory Struct Layout",
            "explanation": "Identical `struct shm_buf` in both processes (`4` bytes `flag` + `1024` bytes `msg` = `1028` bytes)."
          },
          {
            "id": "w-shm-setup",
            "startLine": 15,
            "endLine": 20,
            "badge": "SYSCALL",
            "label": "`ftok` → `shmget` → `shmat` Lifecycle",
            "explanation": "`ftok(\"chatfile\", 65)` generates IPC key from inode; `shmget` creates/fetches segment (`0666 | IPC_CREAT`); `shmat` attaches it and initializes `buf->flag = 0`."
          },
          {
            "id": "w-loop",
            "startLine": 21,
            "endLine": 31,
            "badge": "VIVA TRAP",
            "label": "Busy-Wait + `fgets()` + `strcspn()`",
            "explanation": "`while (buf->flag == 1);` spins until reader finishes. `fgets()` safely reads spaces; `strcspn` strips `\\n`; setting `buf->flag = 1` signals reader."
          },
          {
            "id": "w-detach",
            "startLine": 32,
            "endLine": 32,
            "badge": "SYSCALL",
            "label": "Detach (`shmdt`)",
            "explanation": "Writer detaches cleanly so reader can finish reading `\"exit\"` and remove the segment."
          }
        ]
      },
      {
        "id": "chat_reader",
        "name": "reader_chat.c",
        "path": "04_Shared_Memory_IPC/practice/reader_chat.c",
        "lang": "c",
        "desc": "Practice Reader (Consumer) process: waits for `flag == 1`, prints messages, resets `flag = 0`, and destroys segment on `\"exit\"`.",
        "code": "#include<stdio.h>\n#include<stdlib.h>\n#include<sys/ipc.h>\n#include<sys/shm.h>\n#include<string.h>\n\n#define SIZE 1024\nstruct shm_buf{\n    int flag;\n    char msg[SIZE];\n};\n\nint main(){\n    key_t key=ftok(\"chatfile\",65);\n    int shmid=shmget(key,sizeof(struct shm_buf),0666 | IPC_CREAT);\n    struct shm_buf* buf=(struct shm_buf*)shmat(shmid,NULL,0);\n    printf(\"Reader is ready\\n\");\n\n    while(1){\n        while(buf->flag==0);\n        if(strcmp(buf->msg,\"exit\")==0){\n            printf(\"Chat ended\\n\");\n            break;\n        }\n        printf(\"Reader received:%s\\n\",buf->msg);\n        buf->flag=0;\n    }\n    shmdt(buf);\n    shmctl(shmid,IPC_RMID,NULL);\n    return 0;\n}",
        "highlights": [
          {
            "id": "r-shm-setup",
            "startLine": 14,
            "endLine": 16,
            "badge": "SYSCALL",
            "label": "Attach to Same Segment",
            "explanation": "Uses identical `ftok(\"chatfile\", 65)` so `shmget` returns the exact same `shmid` created by writer."
          },
          {
            "id": "r-loop",
            "startLine": 19,
            "endLine": 27,
            "badge": "VIVA TRAP",
            "label": "Wait for Signal & Reset Turn",
            "explanation": "Spins while `buf->flag == 0`. Prints message (or breaks on `\"exit\"`), then sets `buf->flag = 0` for writer's next turn."
          },
          {
            "id": "r-cleanup",
            "startLine": 28,
            "endLine": 29,
            "badge": "SYSCALL",
            "label": "Detach & Destroy (`IPC_RMID`)",
            "explanation": "`shmdt(buf)` unmaps from reader; `shmctl(shmid, IPC_RMID, NULL)` frees the kernel segment!"
          }
        ]
      }
    ]
  }
];
