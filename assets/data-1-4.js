window.OSL_EXPERIMENTS_1_4 = [
  {
    id: "exp-1",
    num: 1,
    co: "CO1",
    shortTitle: "Shell",
    title: "Linux Basics, Permissions & Shell Scripting",
    subtitle: "Part A (20 core Linux commands, `chmod` 4-2-1, `ps`/`top`/`kill`) & Part B (`shellscript.sh` Student Record CRUD + Grade Calculator).",
    compileCmd: "cd 01_Linux_and_Shell && chmod +x shellscript.sh && ./shellscript.sh",
    bigPicture: [
      "**Linux / Unix:** Multi-user, multitasking OS. Everything in Linux is treated as a file in an upside-down tree starting at `/` (root).",
      "**Kernel (The Brain):** Core of the OS that talks directly to hardware (CPU, RAM, disk). Users never touch it directly.",
      "**Shell (The Translator):** Takes commands (`ls`, `grep`, `mkdir`) and translates them for the kernel (e.g., `bash`, `sh`, `zsh`).",
      "**Paths:** Absolute path starts from root (`/home/user/stud.db`); relative path starts from current folder (`./stud.db`, `..`, `~`).",
      "**Part B App:** Plain-text database (`stud.db`) separated by `|` supporting **CRUD** (Create, Read, Update, Delete) + Grade calculation."
    ],
    traps: [
      {
        title: "grep vs find",
        body: "`find` searches for **files/folders** by name, size, or type (`find . -name \"*.sh\"`). `grep` searches for **text patterns inside a file** (`grep \"^101|\" stud.db`)."
      },
      {
        title: "What does 'x' (execute) mean on a FOLDER?",
        body: "On a file, `x` lets you run it. On a **directory**, `x` lets you **enter (`cd`) into it**! Without `x`, you cannot `cd` into a folder even if you have `r`."
      }
    ],
    tables: [
      {
        title: "File Permissions & chmod (4-2-1 Rule)",
        headers: ["Octal", "Binary / Perm", "Owner / Group / Others Example"],
        rows: [
          ["`755`", "`rwx r-x r-x`", "Standard for scripts (`r=4, w=2, x=1`)"],
          ["`754`", "`rwx r-x r--`", "Lab manual example: Owner full, Group r+x, Others read-only"],
          ["`644`", "`rw- r-- r--`", "Standard for normal text/data files"],
          ["`777`", "`rwx rwx rwx`", "Everyone has full access (insecure in production)"]
        ]
      },
      {
        title: "Must-Know Linux Commands",
        headers: ["Command", "What it does", "Common Flag / Example"],
        rows: [
          ["`ls` / `pwd` / `cd`", "List files / current path / change dir", "`ls -la`, `cd ..`, `cd ~`"],
          ["`mkdir` / `rmdir` / `touch`", "Make dir / remove empty dir / create file", "`touch stud.db`"],
          ["`cp` / `mv` / `rm`", "Copy / move or rename / delete permanently", "`mv temp.db stud.db`, `rm -rf`"],
          ["`cat` / `head` / `tail`", "Print full / first / last lines", "`head -5 a.txt`, `tail -5 a.txt`"],
          ["`grep` / `sed` / `awk`", "Search lines / edit streams / process columns", "`grep \"^101|\" stud.db`"],
          ["`chmod` / `chown`", "Change permissions / change owner", "`chmod +x shellscript.sh`"],
          ["`ps` / `top` / `kill`", "Process snapshot / live monitor / send signal", "`ps -ef`, `kill -9 PID`"]
        ]
      }
    ],
    vivaQA: [
      { q: "What is the difference between Kernel and Shell?", a: "Kernel is the core of the OS that talks directly to hardware. Shell (like Bash) is the command-line translator between the user and the kernel." },
      { q: "What is a shebang (`#!/bin/bash`)? What happens if you omit it?", a: "It tells the OS which interpreter to run the script with. If omitted, it runs in the default shell (often `sh`), which may break Bash features like `$(( ))` or arrays.", codeRef: { fileId: "shellscript", hlId: "shebang" } },
      { q: "How do you run a shell script? Why do we type `./script.sh`?", a: "Run `chmod +x script.sh` then `./script.sh`, or directly `bash script.sh`. We need `./` because Linux does not search the current directory in `$PATH` for security." },
      { q: "Explain `chmod 754 file`.", a: "`7` (`rwx`) = Owner can read, write, execute; `5` (`r-x`) = Group can read & execute; `4` (`r--`) = Others can only read (`r=4, w=2, x=1`)." },
      { q: "What is the difference between `chmod` and `chown`?", a: "`chmod` changes file permissions (`r`, `w`, `x`). `chown` changes file ownership (user and group)." },
      { q: "What is the difference between `>` and `>>`?", a: "`>` overwrites the file completely (erases old content). `>>` appends new data to the end of the file.", codeRef: { fileId: "shellscript", hlId: "create-fn" } },
      { q: "Why did you put `^` and `|` in `grep -q \"^$roll|\" stud.db`?", a: "`^` anchors to the start of the line and `|` marks the end of the roll column — so roll `1` won't accidentally match `101` or marks `10`. `-q` keeps it quiet (returns exit status only).", codeRef: { fileId: "shellscript", hlId: "delete-fn" } },
      { q: "How does delete work in your script?", a: "`grep -v \"^$roll|\"` copies every line EXCEPT the matching roll number into `temp.db`, then `mv temp.db stud.db` atomically replaces the original file.", codeRef: { fileId: "shellscript", hlId: "delete-fn" } },
      { q: "What does `sed -i \"s/^$roll|.*/new/\" stud.db` do?", a: "`sed` is a stream editor. `-i` edits in-place, `s/old/new/` substitutes, and `.*` matches the rest of the line to replace the entire student record.", codeRef: { fileId: "shellscript", hlId: "modify-fn" } },
      { q: "What is `IFS` in `while IFS='|' read -r roll name m1 m2 m3`?", a: "`IFS` = Internal Field Separator. By default Bash splits on spaces; setting `IFS='|'` tells `read` to split each record on the pipe `|` symbol.", codeRef: { fileId: "shellscript", hlId: "grade-fn" } },
      { q: "Why do we use `-ge` instead of `>=` in Bash `if` statements?", a: "Inside `[ ]`, `>` and `<` are treated as file redirection operators, not numeric comparisons. Bash uses `-eq`, `-ne`, `-gt`, `-ge`, `-lt`, `-le`.", codeRef: { fileId: "shellscript", hlId: "grade-fn" } },
      { q: "What does `[ -z \"$name\" ]` check?", a: "`-z` checks if the string length is zero (empty), preventing blank entries from being inserted into `stud.db`.", codeRef: { fileId: "shellscript", hlId: "insert-val" } },
      { q: "What is the difference between `ps` and `top`?", a: "`ps` shows a static one-time snapshot of running processes. `top` gives a live, continuously updating view of CPU, RAM, and processes." },
      { q: "What is the difference between `kill PID` and `kill -9 PID`?", a: "`kill PID` sends `SIGTERM` (`-15`), politely asking the process to save and exit. `kill -9 PID` sends `SIGKILL`, forcing the kernel to terminate it immediately." },
      { q: "What is the difference between `grep`, `sed`, and `awk`?", a: "`grep` searches/filters lines; `sed` edits/replaces/deletes text in streams/files; `awk` processes structured columns/fields." },
      { q: "What is the difference between `rm` and `rmdir`?", a: "`rmdir` deletes only empty directories. `rm` deletes files, and `rm -r` deletes non-empty directories recursively." },
      { q: "What is a Pipe (`|`) in Linux?", a: "It connects the standard output (`stdout`) of one command directly as the standard input (`stdin`) of the next command, e.g., `ps -ef | grep bash`." },
      { q: "What is the difference between single quotes `' '` and double quotes `\" \"`?", a: "Double quotes expand variables (`\"$roll\"` → `101`). Single quotes treat everything as literal text (`'$roll'` → `$roll`)." },
      { q: "What is `$?` in Bash?", a: "It stores the exit status of the last executed command: `0` = success (true), `1–255` = error/failure (opposite of C!)." },
      { q: "Can you do floating-point math in Bash using `$(( ))`?", a: "No — `$(( ))` does integer-only arithmetic (truncates decimals). For decimals, pipe to `bc`: `echo \"scale=2; 91/3\" | bc`.", codeRef: { fileId: "shellscript", hlId: "grade-fn" } }
    ],
    proTips: [
      "Live modification: Search a student → `grep \"^$roll|\" stud.db | column -t -s '|'`",
      "Count total students → `wc -l stud.db` (subtract 1 for the header row!)",
      "Sort by roll number → `sort -t '|' -k1 -n stud.db` (`-t` delimiter, `-k1` col 1, `-n` numeric)."
    ],
    files: [
      {
        id: "shellscript",
        name: "shellscript.sh",
        path: "01_Linux_and_Shell/shellscript.sh",
        lang: "bash",
        desc: "Menu-driven Student Record CRUD & Grade Calculator using `stud.db` with `|` delimiter.",
        code: "#!/bin/bash\n\ncreate(){\n    if [ ! -f \"stud.db\" ]; then\n        touch stud.db\n        echo \"RollNum|Name|m1|m2|m3\" > stud.db\n    else\n        echo \"using existing database\"\n    fi\n}\n\n\nview(){\n    echo \"\"\n    if [ -f \"stud.db\" ]; then\n        column -t -s '|' \"stud.db\"\n        echo \"\"\n    else\n        echo \"database not found!\"\n    fi       \n}\n\ninsert(){\n        echo \"enter roll num:\"\n        read roll_num\n        echo \"enter name: \"\n        read name\n        echo \"enter marks of m1: \"\n        read m1\n        echo \"enter marks of m2: \"\n        read m2\n        echo \"enter marks of m3: \"\n        read m3\n\n        if [ -z \"$roll_num\" ];then\n            echo \"roll num empty\"\n            return\n        fi\n        if [ -z \"$name\" ];then\n            echo \"name empty\"\n            return\n        fi\n        if [ -z \"$m1\" ];then\n            echo \"m1 empty\"\n            return\n        fi\n        if [ -z \"$m2\" ];then\n            echo \"m2  empty\"\n            return\n        fi\n        if [ -z \"$m3\" ];then\n            echo \"m3 empty\"\n            return\n        fi\n\n        echo \"$roll_num|$name|$m1|$m2|$m3\" >> stud.db\n        echo \"record inserted\"\n\n}\n\n\ndelete(){\n    echo \"enter roll num u want to delete: \"\n    read roll_num\n    if grep -q \"^$roll_num|\" stud.db; then\n        #sed -i \"/^$roll_num|/d\" stud.db\n        touch temp.db\n        grep -v \"^$roll_num|\" stud.db > temp.db\n        mv temp.db stud.db\n        echo \"$roll_num deleted!\"\n    else\n        echo \"roll number not found\"\n    fi\n}\n\nmodify(){\n    echo \"enter roll num u want modified: \"\n    read roll_num\n    echo \"enter new roll num: \"\n    read new_roll\n    echo \"enter name\"\n    read name\n    echo \"enter marks of m1: \"\n    read m1\n    echo \"enter marks of m2: \"\n    read m2\n    echo \"enter marks of m3: \"\n    read m3\n    \n    if grep -q \"^$roll_num|\" stud.db; then\n        sed -i \"s/^$roll_num|.*/$new_roll|$name|$m1|$m2|$m3/\" stud.db\n        echo \"modified\"\n    else\n        echo \"roll num not found :(\"\n    fi\n}\n\n\ngrade(){\n    touch grade.db\n    echo \"RollNum|grade\" > grade.db\n    while IFS='|' read -r roll name m1 m2 m3\n    do\n        if [ \"$roll\" = \"RollNum\" ]; then\n            continue\n        fi\n    \n        avg=$(( (m1 + m2 + m3) / 3 ))\n\n        if [ $avg -ge 90 ]; then\n            grade='O'\n        \n        elif [ $avg -ge 80 ];then\n            grade='A'\n        \n        elif [ $avg -ge 70 ]; then\n            grade='B'\n        \n        elif [ $avg -ge 50 ]; then\n            grade='C'\n        \n        elif [ $avg -ge 36 ]; then\n            grade='D'\n        \n        else\n            grade='FAIL'\n        fi\n    \n        echo \"$roll|$grade\" >> grade.db\n    done < stud.db\n\n    column -t -s '|' grade.db\n    rm grade.db \n\n}\n\n\ncreate\n\nwhile true\ndo \n    echo -e \"student menu \\n\"\n    echo -e \"pick choice : 1: insert , 2:delete , 3:modify, 4:grade calc, 5:view 6)exit\\n\"\n    echo \"enter choice: \"\n    read choice\n    \n    case $choice in\n        1)insert;;\n        2)delete;;\n        3)modify;;\n        4)grade;;\n        5)view;;\n        6)break;;\n\n    esac\ndone\necho \"goodbyeeeee\"\n\n\n    \n",
        highlights: [
          { id: "shebang", startLine: 1, endLine: 1, badge: "KEY", label: "Shebang Interpreter", explanation: "`#!/bin/bash` tells the OS kernel to execute this script with Bash at `/bin/bash`. Without it, `sh` may fail on Bash features like `$(( ))`." },
          { id: "create-fn", startLine: 3, endLine: 10, badge: "KEY", label: "Create DB (`-f` & `>`)", explanation: "`[ ! -f \"stud.db\" ]` checks if `stud.db` does NOT exist (spaces inside `[ ... ]` are mandatory!). `>` writes the header row fresh." },
          { id: "view-fn", startLine: 13, endLine: 21, badge: "KEY", label: "Pretty Table (`column -t`)", explanation: "`column -t -s '|'` formats the pipe-delimited `stud.db` into neatly aligned columns (alternative to `awk -F`)." },
          { id: "insert-val", startLine: 35, endLine: 57, badge: "KEY", label: "Empty Validation (`-z`) & Append (`>>`)", explanation: "`[ -z \"$var\" ]` returns true if the string is empty (`return` exits only this function). `>>` appends the new record to `stud.db` without erasing existing rows." },
          { id: "delete-fn", startLine: 65, endLine: 70, badge: "VIVA TRAP", label: "Exact Delete (`grep -q` + `grep -v`)", explanation: "`grep -q \"^$roll_num|\"` silently checks exact roll match (`^` = line start, `|` = column end so `1` doesn't match `101`). `grep -v` keeps all OTHER lines into `temp.db`, then `mv` replaces `stud.db`." },
          { id: "modify-fn", startLine: 90, endLine: 92, badge: "KEY", label: "In-Place Edit (`sed -i`)", explanation: "`sed -i \"s/^$roll_num|.*/.../\"` edits `stud.db` in-place, matching the roll number plus `.*` (rest of line) and replacing the whole record." },
          { id: "grade-fn", startLine: 102, endLine: 130, badge: "CORE ALGO", label: "`IFS='|'`, Integer Math & `-ge`", explanation: "`IFS='|'` splits each line on `|`; `-r` disables backslash escaping; `$(( (m1+m2+m3)/3 ))` does integer math; `-ge` compares numbers (because `>` means redirection inside `[ ]`); `done < stud.db` feeds the file into the loop." },
          { id: "menu-case", startLine: 140, endLine: 156, badge: "KEY", label: "Infinite Menu & `case ... esac`", explanation: "`while true` keeps showing the menu until choice `6` hits `break`. Each branch ends with `;;` (like `break` in C), and `esac` closes `case`." }
        ]
      }
    ]
  },
  {
    id: "exp-2",
    num: 2,
    co: "CO2",
    shortTitle: "Fork/Exec",
    title: "Process Management: fork(), wait(), Orphan, Zombie & exec()",
    subtitle: "Part A (`evenodd.c`, `orphan.c`, `zombie.c`) and Part B (`parent.c` + `fac.c` using the classic `fork-exec-wait` pattern).",
    compileCmd: "cd 02_Process_Management && gcc fac.c -o fac && gcc parent.c -o parent && ./parent 5",
    bigPicture: [
      "**Program vs Process:** Program = passive executable on disk (`./parent`). Process = active instance in RAM with its own PID, memory (text, data, heap, stack), and registers.",
      "**PCB (`task_struct`):** Kernel structure holding PID, state, program counter, registers, open file descriptors, and memory pointers.",
      "**5 Process States:** `New → Ready → Running → Waiting/Blocked → Terminated`.",
      "**`fork()`:** Called ONCE, returns TWICE — `0` in child, child's positive PID in parent, `-1` on error. Uses **Copy-on-Write (CoW)** so RAM pages are only copied when modified.",
      "**`exec()`:** Replaces the current process's memory image with a brand-new program while keeping the **exact same PID**. Never returns on success!"
    ],
    traps: [
      {
        title: "Can you kill a Zombie process using `kill -9`?",
        body: "**NO!** A zombie is already dead — it has no running code or memory left, only a leftover entry in the Process Table (`<defunct>`, state `Z`). Either the parent must call `wait()` to reap it, or you must **kill the parent** so `init` adopts and reaps it."
      },
      {
        title: "Who runs first after `fork()` — Parent or Child?",
        body: "**Non-deterministic!** The OS CPU Scheduler decides. That's why in `evenodd.c`, even and odd numbers can interleave unless synchronized with `wait()`."
      }
    ],
    tables: [
      {
        title: "Orphan Process vs Zombie Process",
        headers: ["Feature", "Orphan (`orphan.c`)", "Zombie (`zombie.c`)"],
        rows: [
          ["What happened?", "Parent exits BEFORE child finishes", "Child exits BEFORE parent calls `wait()`"],
          ["Handled by", "Adopted (reparented) by `init`/`systemd` (PID 1)", "Stuck in Process Table holding PID & exit status"],
          ["`ps` state", "Running/Sleeping (`R`/`S`), new PPID = `1` (or subreaper)", "`<defunct>`, state `Z` (`ps -el | grep defunct`)"],
          ["Harmful?", "Usually harmless (`init` reaps it cleanly)", "Many zombies exhaust the Process Table / PIDs!"],
          ["Fix", "Parent calls `wait()` before exiting", "Parent calls `wait()`/`waitpid()` (or kill parent)"]
        ]
      },
      {
        title: "The `exec()` Family Cheat Sheet",
        headers: ["Variant", "Letters", "How Arguments Work"],
        rows: [
          ["`execl()`", "`l` = list", "Comma-separated args ending in `NULL`; needs full path"],
          ["`execv()`", "`v` = vector", "`char *argv[]` array ending in `NULL`; needs full path"],
          ["`execlp()`", "`l` + `p`", "List of args + searches `$PATH`"],
          ["`execvp()`", "`v` + `p`", "**Used in `parent.c`!** Array of args + searches `$PATH`"],
          ["`execve()`", "`v` + `e`", "Takes custom `envp[]`; the actual Linux kernel syscall"]
        ]
      }
    ],
    vivaQA: [
      { q: "What is a process? How is it different from a program?", a: "A program is a passive file on disk. A process is an active program in execution inside RAM with its own PID, memory space, and PCB." },
      { q: "What is a PCB (Process Control Block)?", a: "A kernel data structure (`struct task_struct` in Linux) storing a process's PID, state, registers, program counter, and memory/file info." },
      { q: "What does `fork()` return to the parent and to the child?", a: "Returns `0` to the child, the child's positive PID to the parent, and `-1` on failure.", codeRef: { fileId: "parent", hlId: "fork-call" } },
      { q: "If `fork()` is called 3 times sequentially, how many total processes exist?", a: "`2^3 = 8` total processes (1 original parent + 7 newly created child processes)." },
      { q: "Does `fork()` copy the entire parent memory immediately?", a: "No! Linux uses **Copy-on-Write (CoW)** — pages are shared read-only and copied only when either process writes to a page." },
      { q: "What is an orphan process?", a: "A running child whose parent terminated early. It is adopted by `init`/`systemd` (PID 1 or user subreaper).", codeRef: { fileId: "orphan", hlId: "orphan-sleep" } },
      { q: "What is a zombie process?", a: "A terminated child whose parent hasn't called `wait()` yet. Its process table entry stays as `<defunct>` (`Z` state) to hold its exit status.", codeRef: { fileId: "zombie", hlId: "zombie-sleep" } },
      { q: "How do you see a zombie process in Linux?", a: "Run `ps -el | grep defunct` or `ps aux | grep Z` in another terminal while the parent sleeps." },
      { q: "Why are zombie processes dangerous if too many accumulate?", a: "Each zombie occupies a slot in the kernel's Process Table and a PID. If the table fills up, the OS cannot create new processes." },
      { q: "How do you prevent zombie processes?", a: "Call `wait()` or `waitpid()` in the parent to reap the child, or handle `SIGCHLD`." },
      { q: "What does `wait()` do?", a: "Blocks the parent until a child terminates, collects its exit status, and removes its entry from the process table (reaping).", codeRef: { fileId: "parent", hlId: "wait-macros" } },
      { q: "What is the difference between `fork()` and `exec()`?", a: "`fork()` creates a NEW process with a new PID. `exec()` replaces the current process's code/memory with a new program while keeping the SAME PID." },
      { q: "Why did you put `perror(\"execvp failed\")` right after `execvp()`?", a: "Because if `execvp()` succeeds, the old program is wiped out and that line NEVER runs. It executes only on failure (e.g., `./fac` missing).", codeRef: { fileId: "parent", hlId: "execvp-block" } },
      { q: "Why is `NULL` required at the end of `char *args[] = {\"./fac\", argv[1], NULL}`?", a: "`execvp()` doesn't take a length parameter, so it uses the trailing `NULL` pointer to know where the argument list ends.", codeRef: { fileId: "parent", hlId: "execvp-block" } },
      { q: "What do `'v'` and `'p'` mean in `execvp()`?", a: "`v` = vector (`char*` array of arguments); `p` = PATH (automatically searches `$PATH` if no `/` is in the filename).", codeRef: { fileId: "parent", hlId: "execvp-block" } },
      { q: "What do `WIFEXITED(flag)` and `WEXITSTATUS(flag)` do?", a: "`WIFEXITED` checks if the child exited normally; `WEXITSTATUS` extracts its actual `return`/`exit()` code (`0` or `1`).", codeRef: { fileId: "parent", hlId: "wait-macros" } },
      { q: "What are `argc` and `argv` in `main(int argc, char *argv[])`?", a: "`argc` is the number of command-line arguments; `argv` is the array of argument strings (`argv[0]` = program name, `argv[1]` = first user arg).", codeRef: { fileId: "parent", hlId: "argc-check" } },
      { q: "What does `atoi()` do in `fac.c`?", a: "ASCII to Integer (`<stdlib.h>`) — converts CLI string `\"5\"` from `argv[1]` into integer `5`.", codeRef: { fileId: "fac", hlId: "atoi-conv" } },
      { q: "In `orphan.c`, why did you call `sleep(10)` inside the child?", a: "To keep the child alive long enough for the parent to exit first, forcing the kernel to reparent the child before its second `getppid()`.", codeRef: { fileId: "orphan", hlId: "orphan-sleep" } },
      { q: "What happens if you run `./parent 5` without compiling `fac.c` first?", a: "`fork()` succeeds, child calls `execvp(\"./fac\", args)`, it fails with `No such file or directory`, `perror()` prints the error, and child exits." }
    ],
    proTips: [
      "Always compile `fac.c` to `-o fac` first because `parent.c` explicitly executes `\"./fac\"`!",
      "Eagle-eye catch in `evenodd.c` line 10–11: `if(p<0)` is followed by `if(p==0)` instead of `else if(p==0)`. Mentioning that `else if` prevents a failed fork from also entering the `else` parent branch impresses examiners!"
    ],
    files: [
      {
        id: "parent",
        name: "parent.c",
        path: "02_Process_Management/parent.c",
        lang: "c",
        desc: "Part B parent process: forks a child, replaces child with `./fac` via `execvp()`, and reaps exit status via `wait(&flag)`.",
        code: "#include<stdio.h>\n#include<sys/wait.h>\n#include<unistd.h>\n\nint main(int argc, char* argv[]){\nif(argc < 2){\n    printf(\"status: %s\", argv[0]);\n    return 1;\n}\n\n    pid_t p = fork();\n\n    if(p<0){\n    printf(\"fork failed!\");\n}\n    else if(p==0){\n    printf(\"child proccess id : %d \\nParent proccess if: %d\\n\", getpid(),getppid());\n    char* args[] = {\"./fac\",argv[1],NULL};\n    execvp(args[0],args);\n    perror(\"execvp failed\");\n}\n    else{\n    printf(\"child proccess id : %d \\nParent proccess if: %d\\n\", p,getpid());\n    int flag;\n    wait(&flag);\n    if(WIFEXITED(flag)){\n    printf(\"child exited with status: %d\\n\", WEXITSTATUS(flag));\n}\n}\n    \n\n\n}\n",
        highlights: [
          { id: "argc-check", startLine: 5, endLine: 9, badge: "KEY", label: "CLI Argument Validation (`argc`/`argv`)", explanation: "Ensures the user passed a number (`./parent 5`). `argc` includes the program name (`argv[0]`), so `argc < 2` means no number was supplied." },
          { id: "fork-call", startLine: 11, endLine: 15, badge: "SYSCALL", label: "`fork()` Process Creation", explanation: "`pid_t p = fork();` duplicates the process. Returns `< 0` on error, `0` in the child, and child's PID (`> 0`) in the parent." },
          { id: "execvp-block", startLine: 16, endLine: 21, badge: "SYSCALL", label: "Child Image Replacement (`execvp`)", explanation: "`args[]` MUST end with `NULL`. `execvp()` replaces the child's code/RAM with `./fac` keeping the SAME PID. `perror()` only runs if `execvp()` fails!" },
          { id: "wait-macros", startLine: 22, endLine: 29, badge: "SYSCALL", label: "`wait(&flag)` & Exit Status Macros", explanation: "`wait(&flag)` blocks the parent and reaps the child (no zombie). `WIFEXITED(flag)` verifies normal exit; `WEXITSTATUS(flag)` extracts the child's return code (`0` or `1`)." }
        ]
      },
      {
        id: "fac",
        name: "fac.c",
        path: "02_Process_Management/fac.c",
        lang: "c",
        desc: "Part B child target program executed by `parent.c` via `execvp()` to compute factorial.",
        code: "#include <stdio.h>\n#include <stdlib.h>\n\nint main(int argc, char* argv[]){\n    \n    if(argc < 2){\n    printf(\"status: %s\" ,argv[0]);\n    return 1;\n}\n\n    int n = atoi(argv[1]);\n    if(n<0){\n    printf(\"factorial n cant be negative!\");\n    return 1;\n}\n\n    unsigned long long fac = 1;\n    for(int i=1;i<=n;i++)fac*=i;\n    printf(\"factorial for %d: %lld \\n\", n, fac);\n    return 0;\n\n}\n",
        highlights: [
          { id: "atoi-conv", startLine: 11, endLine: 15, badge: "KEY", label: "`atoi()` String-to-Int & Guard", explanation: "`atoi(argv[1])` converts CLI string `\"5\"` to int `5`. Rejects negative inputs and returns exit code `1` (which parent reads via `WEXITSTATUS`)." },
          { id: "fac-loop", startLine: 17, endLine: 20, badge: "KEY", label: "64-Bit Factorial Computation", explanation: "`unsigned long long` holds up to `20!` without overflowing 32-bit `int`. (Viva note: ideally format with `%llu` instead of `%lld`.)" }
        ]
      },
      {
        id: "evenodd",
        name: "evenodd.c",
        path: "02_Process_Management/evenodd.c",
        lang: "c",
        desc: "Part A: Child prints odd numbers while Parent prints even numbers, then Parent reaps child with `wait(NULL)`.",
        code: "#include<stdio.h>\n#include<unistd.h>\n#include<sys/wait.h>\n\nint main(){\n    int n;\n    printf(\"enter n upto which u want numbers printed: \");\n    scanf(\"%d\", &n);\n    pid_t p = fork();\n    if(p<0)printf(\"fork failed! \\n\");\n     if(p == 0){\n       printf(\"child process id : %d , parent id : %d \\n\" , getpid(), getppid());\n       for(int i=1;i<n;i+=2)printf(\"%d \",i);\n     printf(\"\\n\");\n       \n}\n    else{\n    printf(\"parent process id : %d , parent of parent id : %d, child id: %d \\n\" , getpid(), getppid(), p);\n       for(int i=0;i<n;i+=2)printf(\"%d \",i);\n    \n    wait(NULL);\n    printf(\"child exited successfully!!\");\n\n}\n\n    return 0;\n}\n",
        highlights: [
          { id: "evenodd-trap", startLine: 9, endLine: 16, badge: "VIVA TRAP", label: "`fork()` + `else if` Eagle-Eye Catch", explanation: "Child (`p == 0`) prints odd numbers `1, 3, 5...`. Notice line 11 uses `if(p == 0)` instead of `else if(p == 0)` — good viva point to mention `else if` avoids entering the `else` block if `fork()` fails!" },
          { id: "evenodd-wait", startLine: 17, endLine: 24, badge: "SYSCALL", label: "Parent Even Loop & `wait(NULL)`", explanation: "Parent prints even numbers concurrently (output order is scheduler-dependent!), then `wait(NULL)` blocks until the child finishes so no zombie is created." }
        ]
      },
      {
        id: "orphan",
        name: "orphan.c",
        path: "02_Process_Management/orphan.c",
        lang: "c",
        desc: "Demonstrates an Orphan Process: Parent exits immediately while Child sleeps and gets adopted by `init`/subreaper.",
        code: "#include<stdio.h>\n#include<unistd.h>\n#include<sys/wait.h>\n\nint main(){\n    pid_t p = fork();\n    \n    if(p<0){\n    printf(\"fork failed\");}\n    else if(p==0){\n    printf(\"\\nChild created \\nChild proccess id: %d \\nParent proccess id: %d\\n\", getpid(),getppid());\n    sleep(10);\n    printf(\"Child back up!: new parent: %d\\n child id: %d\",getppid(),getpid());\n}\n    else{\n    printf(\"parent proccess id: %d \\nchild proccess id:%d\\n\", getpid(), p);\n    //printf(\"parent exiting..\");\n}\n\n\n}\n",
        highlights: [
          { id: "orphan-sleep", startLine: 10, endLine: 14, badge: "CORE ALGO", label: "Child Sleeps → Reparented!", explanation: "Child prints original `getppid()`, calls `sleep(10)` so the parent exits first, then prints `getppid()` again — showing the new adoptive parent PID (`1` / subreaper)." },
          { id: "orphan-parent", startLine: 15, endLine: 18, badge: "KEY", label: "Parent Exits Without `wait()`", explanation: "Parent exits immediately without waiting, turning the sleeping child into an orphan." }
        ]
      },
      {
        id: "zombie",
        name: "zombie.c",
        path: "02_Process_Management/zombie.c",
        lang: "c",
        desc: "Demonstrates a Zombie Process (`<defunct>`): Child exits immediately while Parent sleeps without calling `wait()`.",
        code: "#include<stdio.h>\n#include<unistd.h>\n#include<sys/wait.h>\n// zombie : parent sleeps , so child gets killed/ zombied fr\n\nint main(){\n    pid_t p = fork();\n    if(p<0){printf(\"fork error\");}\n    else if(p == 0){\n    printf(\"child proccess id: %d \\nparent proccess id: %d\\n\", getpid(),getppid());\n    printf(\"child exiting...\");\n}\n    else{\n    printf(\"parent proccess id: %d and child proccess id: %d \\n\", getpid(), p);\n    sleep(10);\n    printf(\"parent awak again\");    \n}\n}\n",
        highlights: [
          { id: "zombie-child", startLine: 9, endLine: 12, badge: "KEY", label: "Child Exits Immediately", explanation: "Child finishes and terminates right away, leaving its exit status in the Process Table waiting to be reaped." },
          { id: "zombie-sleep", startLine: 13, endLine: 17, badge: "VIVA TRAP", label: "Parent Sleeps Without `wait()` → Zombie (`Z`)", explanation: "While parent sleeps 10s without calling `wait()`, running `ps -el | grep defunct` shows the child in `Z` (zombie) state. `kill -9` cannot remove it!" }
        ]
      }
    ]
  },
  {
    id: "exp-3",
    num: 3,
    co: "CO2 / CO3",
    shortTitle: "CPU Sched",
    title: "CPU Scheduling: FCFS, SJF, Priority & Round Robin",
    subtitle: "Preemptive vs Non-Preemptive scheduling, Convoy Effect, Starvation & Aging, and menu-driven `cpu_scheduling.cpp`.",
    compileCmd: "cd 03_CPU_Scheduling && g++ cpu_scheduling.cpp -o cpu_sched && ./cpu_sched",
    bigPicture: [
      "**Short-Term (CPU) Scheduler:** Picks which Ready-Queue process gets the CPU next. **Dispatcher** does the actual context switch (delay = Dispatch Latency).",
      "**Non-Preemptive:** Process keeps CPU until it finishes or blocks (`FCFS`, `SJF`, `Priority`). **Preemptive:** OS can interrupt mid-run (`Round Robin`, `SRTF`).",
      "**Core Formulas (AT = 0):** `TAT = CT - AT = WT + BT`, `WT = TAT - BT`, `Response Time = First CPU Start - AT`.",
      "**Convoy Effect (FCFS):** One huge CPU-bound process blocks many short processes behind it.",
      "**Starvation & Aging:** Low-priority / long jobs wait forever in Priority/SJF; **Aging** gradually boosts waiting processes' priority."
    ],
    traps: [
      {
        title: "Round Robin Time Quantum (q) — Too Large vs Too Small",
        body: "If `q` is **too large** (> max burst time) → Round Robin degenerates into **FCFS**. If `q` is **too small** → excessive **context-switch overhead** wastes CPU cycles!"
      }
    ],
    tables: [
      {
        title: "Worked Lab Manual Example (BT = {6, 8, 7, 3}, Pr = {2, 1, 4, 3}, q = 3)",
        headers: ["Algorithm", "Execution Order", "Avg WT", "Avg TAT"],
        rows: [
          ["**FCFS**", "`P1(6) → P2(8) → P3(7) → P4(3)`", "`10.25`", "`16.25`"],
          ["**SJF**", "`P4(3) → P1(6) → P3(7) → P2(8)`", "**`7.00` (Best!)**", "**`13.00` (Best!)**"],
          ["**Priority** (low=high)", "`P2(8) → P1(6) → P4(3) → P3(7)`", "`9.75`", "`15.75`"],
          ["**Round Robin** (`q=3`)", "`P1(3)→P2(3)→P3(3)→P4(3)→P1(3)→P2(3)→P3(3)→P2(2)→P3(1)`", "`12.50`", "`18.50`"]
        ]
      },
      {
        title: "4 Algorithms Compared",
        headers: ["Algorithm", "Type", "Pros", "Cons"],
        rows: [
          ["**FCFS**", "Non-Preemptive", "Simple, zero starvation", "**Convoy Effect**, poor AWT"],
          ["**SJF**", "Non-Preemptive (`SRTF` = Preemptive)", "**Optimal** (minimum Avg WT)", "Cannot know future BT; **Starvation** of long jobs"],
          ["**Priority**", "Non-Preemptive (can be preemptive)", "Important tasks run first", "**Starvation** (fixed by **Aging**)"],
          ["**Round Robin**", "Preemptive", "Fair, best Response Time, no starvation", "Higher AWT; context-switch overhead if `q` too small"]
        ]
      }
    ],
    vivaQA: [
      { q: "What is the main goal of CPU scheduling?", a: "Maximize CPU utilization & throughput while minimizing turnaround time, waiting time, and response time." },
      { q: "Difference between Preemptive and Non-Preemptive scheduling?", a: "Non-preemptive lets a process keep CPU until it finishes or blocks; preemptive lets the OS interrupt and switch it out mid-execution." },
      { q: "Which algorithms in your code are non-preemptive and which are preemptive?", a: "FCFS, SJF, and Priority are non-preemptive; Round Robin is preemptive." },
      { q: "Define Turnaround Time and Waiting Time.", a: "`TAT = CT - AT` (total time from arrival to completion). `WT = TAT - BT` (time spent waiting in Ready Queue).", codeRef: { fileId: "cpu_sched", hlId: "fcfs-fn" } },
      { q: "What is Response Time and why does it matter?", a: "Time from arrival until the process gets the CPU for the FIRST time — critical for interactive/GUI systems." },
      { q: "What is the Convoy Effect? Which algorithm suffers from it?", a: "Many short processes stuck waiting behind one long CPU-bound process — classic flaw of FCFS." },
      { q: "Why is SJF called optimal?", a: "It mathematically guarantees the minimum possible Average Waiting Time for a given set of processes." },
      { q: "Why is pure SJF impossible in a real OS?", a: "The OS cannot know exact future CPU burst lengths — it can only predict them via **Exponential Averaging**: `τ(n+1) = α·t(n) + (1-α)·τ(n)`." },
      { q: "What is SRTF?", a: "Shortest Remaining Time First — the preemptive version of SJF where a newly arrived shorter job preempts the running job." },
      { q: "What is Starvation (Indefinite Blocking)?", a: "When a low-priority or long-burst process waits forever because higher-priority/shorter processes keep arriving." },
      { q: "How do you solve Starvation?", a: "Using **Aging** — gradually increasing the priority of processes waiting in the ready queue over time." },
      { q: "In your Priority Scheduling, is 1 higher priority or 4?", a: "Lower number = higher priority (`1` is highest), because we sort ascending with `stable_sort`.", codeRef: { fileId: "cpu_sched", hlId: "pr-fn" } },
      { q: "Why did you use `stable_sort()` instead of `sort()` in SJF and Priority?", a: "`stable_sort` preserves original arrival order when two processes tie on burst time or priority — fair FCFS tie-breaking!", codeRef: { fileId: "cpu_sched", hlId: "sjf-fn" } },
      { q: "What happens to Round Robin if the time quantum is very large?", a: "Every process finishes in its first slice, so Round Robin behaves identically to FCFS." },
      { q: "What happens to Round Robin if the time quantum is very small?", a: "Frequent preemptions cause massive context-switch overhead, wasting CPU cycles." },
      { q: "How does Round Robin calculate Waiting Time without tracking every gap?", a: "Using `WT = Completion Time - Burst Time` (`t - bt[i]`), because every unit of time between `0` and `t` not spent running was spent waiting!", codeRef: { fileId: "cpu_sched", hlId: "rr-fn" } },
      { q: "What is a Dispatcher and Dispatch Latency?", a: "Dispatcher performs the context switch and hands CPU to the chosen process. Dispatch latency is the time to stop one process and start another." },
      { q: "Difference between Short-Term and Long-Term Scheduler?", a: "Long-term loads jobs from disk to RAM (controls degree of multiprogramming). Short-term picks which ready process in RAM gets the CPU next." },
      { q: "What is a Gantt Chart?", a: "A timeline bar chart showing which process occupies the CPU in each time interval — used to visually compute CT, TAT, and WT." },
      { q: "How would your formulas change if Arrival Times were non-zero (`AT != 0`)?", a: "Track clock `t = max(t, AT[i])`, compute `CT[i] = t + BT[i]`, then `TAT[i] = CT[i] - AT[i]` and `WT[i] = TAT[i] - BT[i]`." }
    ],
    proTips: [
      "Live tweak for **higher number = higher priority**: change `v.push_back({pr[i], i})` to `v.push_back({-pr[i], i})`!",
      "Point out `stable_sort` and `read_int()` input validation — examiners love clean defensive C++!"
    ],
    files: [
      {
        id: "cpu_sched",
        name: "cpu_scheduling.cpp",
        path: "03_CPU_Scheduling/cpu_scheduling.cpp",
        lang: "cpp",
        desc: "Menu-driven C++ implementation of FCFS, SJF, Priority, and Round Robin with input validation.",
        code: "#include <bits/stdc++.h>\nusing namespace std;\n\nint read_int(const string &prompt){\n    int x;\n    while(true){\n        cout << prompt;\n        if(cin >> x) return x;\n        cin.clear();\n        cin.ignore(numeric_limits<streamsize>::max(), '\\n');\n        cout << \"invalid input\\n\";\n    }\n}\n\nvoid print_result(vector<int> &process, vector<int> &bt, vector<int> &wt, vector<int> &tat){\n    float twt = 0, ttat = 0;\n    int p = process.size();\n    cout << \"srno \\t process id \\t burst time \\t waiting time \\t turnaround time\" << endl;\n\n    for(int i=0;i<p;i++){\n        cout << i << \"\\t \" << process[i] << \" \\t  \" << bt[i] << \"\\t   \" << wt[i] << \"\\t   \" << tat[i] << endl;\n        twt += wt[i];\n        ttat += tat[i];\n    }\n    cout << \"avg waiting time: \" << (twt/p) << endl << \"avg turnaround time: \" << (ttat/p) << endl;\n}\n\nvoid fcfs(vector<int> &process, vector<int> &bt){\n    int p = process.size();\n    vector<int> wt(p,0), tat(p,0);\n    for(int i=1;i<p;i++) wt[i] = wt[i-1] + bt[i-1];\n    for(int i=0;i<p;i++) tat[i] = wt[i] + bt[i];\n    print_result(process,bt,wt,tat);\n}\n\nvoid sjf(vector<int> &process, vector<int> &bt){\n    int p = process.size();\n    vector<int> np(p), nbt(p), wt(p,0), tat(p);\n    vector<pair<int,int>> v;\n    for(int i=0;i<p;i++) v.push_back({bt[i],i});\n\n    stable_sort(v.begin(),v.end());\n\n    for(int i=0;i<p;i++){\n        int index = v[i].second;\n        np[i] = process[index];\n        nbt[i] = bt[index];\n    }\n\n    for(int i=1;i<p;i++) wt[i] = wt[i-1] + nbt[i-1];\n    for(int i=0;i<p;i++) tat[i] = wt[i] + nbt[i];\n\n    print_result(np,nbt,wt,tat);\n}\n\nvoid pr_sched(vector<int> &process, vector<int> &bt, vector<int> &pr){\n    int p = process.size();\n    vector<int> np(p), nbt(p), wt(p,0), tat(p);\n    vector<pair<int,int>> v;\n    for(int i=0;i<p;i++) v.push_back({pr[i],i});\n\n    stable_sort(v.begin(),v.end());\n\n    for(int i=0;i<p;i++){\n        int index = v[i].second;\n        np[i] = process[index];\n        nbt[i] = bt[index];\n    }\n\n    for(int i=1;i<p;i++) wt[i] = wt[i-1] + nbt[i-1];\n    for(int i=0;i<p;i++) tat[i] = wt[i] + nbt[i];\n\n    print_result(np,nbt,wt,tat);\n}\n\nvoid round_robin(vector<int> &process, vector<int> &bt, int q){\n    int p = process.size();\n    vector<int> rem = bt, wt(p,0), tat(p,0);\n    int done = 0, t = 0;\n\n    while(done < p){\n        int did_work = 0;\n        for(int i=0;i<p;i++){\n            if(rem[i] <= 0) continue;\n            did_work = 1;\n            int run = min(rem[i],q);\n            t += run;\n            rem[i] -= run;\n            if(rem[i] == 0){\n                tat[i] = t;\n                wt[i] = t - bt[i];\n                done++;\n            }\n        }\n        if(!did_work) break;\n    }\n\n    print_result(process,bt,wt,tat);\n}\n\nint main(){\n    int p = read_int(\"enter number of process: \");\n    if(p < 1){\n        cout << \"need at least one process\\n\";\n        return 1;\n    }\n\n    vector<int> process(p), bt(p), pr(p);\n    for(int i=0;i<p;i++){\n        cout << \"enter proccess id , burst time and priority: \";\n        while(!(cin >> process[i] >> bt[i] >> pr[i])){\n            cin.clear();\n            cin.ignore(numeric_limits<streamsize>::max(), '\\n');\n            cout << \"invalid input\\nenter proccess id , burst time and priority: \";\n        }\n        while(bt[i] < 0){\n            bt[i] = read_int(\"burst time cannot be negative, re-enter: \");\n        }\n    }\n\n    int x;\n    do{\n        cout << endl;\n        x = read_int(\"enter choice : 1:fcfs 2:sjf 3:priority wise 4:round robin 5:quit : \");\n\n        switch(x){\n        case 1: fcfs(process,bt); break;\n        case 2: sjf(process,bt); break;\n        case 3: pr_sched(process,bt,pr); break;\n        case 4: {\n            int q = read_int(\"enter qunatam: \");\n            while(q < 1){\n                q = read_int(\"qunatam must be positive, re-enter: \");\n            }\n            round_robin(process,bt,q);\n            break;\n        }\n        case 5: break;\n        default: cout << \"invalid choice\\n\"; break;\n        }\n    }while(x != 5);\n\n    return 0;\n}\n",
        highlights: [
          { id: "read-int", startLine: 4, endLine: 13, badge: "KEY", label: "Safe Input Validation (`read_int`)", explanation: "Clears `cin` failbit and flushes bad characters so typing a letter never causes an infinite loop." },
          { id: "fcfs-fn", startLine: 28, endLine: 34, badge: "CORE ALGO", label: "FCFS Waiting & Turnaround Formulas", explanation: "With all `AT = 0`, `wt[0] = 0`, each next process waits `wt[i-1] + bt[i-1]`, and `tat[i] = wt[i] + bt[i]`." },
          { id: "sjf-fn", startLine: 36, endLine: 54, badge: "CORE ALGO", label: "SJF with `pair` + `stable_sort`", explanation: "Pairs `{bt[i], i}` so sorting by burst time keeps track of each process ID. `stable_sort` breaks equal-burst ties in FCFS order!" },
          { id: "pr-fn", startLine: 56, endLine: 74, badge: "CORE ALGO", label: "Priority Scheduling (Lower = Higher)", explanation: "Sorts ascending by `pr[i]` with `stable_sort` (so priority `1` runs before `4`). Flip sign (`-pr[i]`) if asked for higher-number = higher-priority." },
          { id: "rr-fn", startLine: 76, endLine: 99, badge: "CORE ALGO", label: "Round Robin Time-Slicing", explanation: "Copies `rem = bt` to preserve original `bt[]`. Each turn runs `run = min(rem[i], q)` and advances clock `t += run`. When `rem[i] == 0`, `tat[i] = t` and `wt[i] = t - bt[i]`!" }
        ]
      }
    ]
  },
  {
    id: "exp-4",
    num: 4,
    co: "CO3 / CO4",
    shortTitle: "Shared Mem",
    title: "IPC using System V Shared Memory (Chat App)",
    subtitle: "Fastest IPC mechanism (`ftok`, `shmget`, `shmat`, `shmdt`, `shmctl`) with flag-based synchronization (`chat_writer.c` & `chat_reader.c`).",
    compileCmd: "cd 04_Shared_Memory_IPC && touch chatfile && gcc chat_writer.c -o chat_writer && gcc chat_reader.c -o chat_reader",
    bigPicture: [
      "**Why IPC?** Processes have isolated virtual address spaces for security; IPC lets cooperating processes exchange data.",
      "**2 IPC Models:** Message Passing (pipes, queues, sockets — copies data user → kernel → user) vs **Shared Memory** (maps one physical RAM segment into both processes).",
      "**Fastest IPC:** Once attached with `shmat()`, reads/writes happen directly in user space via normal C pointers (`buf->msg`) with **zero kernel copying**!",
      "**The Catch:** Kernel does NOT synchronize shared memory — the programmer must coordinate turns (`buf->flag`, semaphores, or mutex) to avoid race conditions.",
      "**Terminal Inspection:** `ipcs -m` lists active shared memory segments (`nattch`, `bytes`); `ipcrm -m <shmid>` removes leaked segments."
    ],
    traps: [
      {
        title: "What if `chatfile` does NOT exist?",
        body: "`ftok(\"chatfile\", 65)` fails and returns `-1` because it hashes the file's **inode & device number** from disk! Always run `touch chatfile` first."
      },
      {
        title: "Busy Waiting (Spinlock) Drawback",
        body: "`while (buf->flag == 1);` and `while (buf->flag == 0);` burn **100% CPU** spinning in a tight loop. Production code replaces polling with **Semaphores** or **Mutex + Condition Variables** so waiting processes sleep."
      }
    ],
    tables: [
      {
        title: "The 5 System V Shared Memory Calls (Lifecycle)",
        headers: ["Call", "Returns", "Purpose (Say This in Viva!)"],
        rows: [
          ["`ftok(\"chatfile\", 65)`", "`key_t` (`-1` err)", "Generates unique IPC key from file inode + project ID `65`"],
          ["`shmget(key, size, 0666 \\| IPC_CREAT)`", "`int shmid`", "Creates/fetches shared RAM segment; `0666` = `rw-rw-rw-`"],
          ["`shmat(shmid, NULL, 0)`", "`void *` pointer", "Attaches segment into process's virtual address space"],
          ["`shmdt(buf)`", "`0` / `-1`", "Detaches segment from THIS process (does NOT delete from kernel!)"],
          ["`shmctl(shmid, IPC_RMID, NULL)`", "`0` / `-1`", "Marks segment for deletion once all attached processes detach"]
        ]
      }
    ],
    vivaQA: [
      { q: "What is IPC (Inter-Process Communication)?", a: "OS mechanisms allowing separate processes to exchange data and synchronize actions." },
      { q: "Name the common IPC mechanisms in Linux.", a: "Pipes (unnamed), Named Pipes (FIFOs), Message Queues, Shared Memory, Semaphores, Signals, and Sockets." },
      { q: "Why is Shared Memory faster than Pipes or Message Queues?", a: "Pipes/queues copy data user → kernel → user. Shared memory maps the same physical RAM into both processes — zero kernel copying after `shmat()`." },
      { q: "If Shared Memory is fastest, why don't we use it everywhere?", a: "No built-in synchronization (race condition risk) and works only on a single machine (not over a network like sockets)." },
      { q: "What is the role of `ftok()`?", a: "Generates a unique `key_t` IPC key from an existing file's inode and a project ID so unrelated processes open the exact same segment.", codeRef: { fileId: "chat_writer", hlId: "w-shm-setup" } },
      { q: "Why must both writer and reader pass the same filename and project ID to `ftok()`?", a: "So both compute the identical `key_t` and attach to the same shared memory segment." },
      { q: "What does `shmget()` do?", a: "Creates a new shared memory segment (with `IPC_CREAT`) or returns the `shmid` of an existing segment matching `key`.", codeRef: { fileId: "chat_writer", hlId: "w-shm-setup" } },
      { q: "What does `0666 | IPC_CREAT` mean in `shmget()`?", a: "`0666` grants `rw-` permissions to owner/group/others; `IPC_CREAT` creates the segment if it doesn't exist.", codeRef: { fileId: "chat_writer", hlId: "w-shm-setup" } },
      { q: "What does `shmat(shmid, NULL, 0)` do?", a: "Attaches the segment to the process's virtual address space (`NULL` = OS chooses address; `0` = read-write mode).", codeRef: { fileId: "chat_writer", hlId: "w-shm-setup" } },
      { q: "Do both processes get the exact same virtual memory address from `shmat()`?", a: "Not necessarily! Each process has its own virtual address space; both virtual pointers simply map to the **same physical RAM frames**." },
      { q: "Difference between `shmdt()` and `shmctl(..., IPC_RMID, NULL)`?", a: "`shmdt()` only detaches from the current process. `shmctl(IPC_RMID)` marks the segment to be freed from kernel RAM once all processes detach.", codeRef: { fileId: "chat_reader", hlId: "r-cleanup" } },
      { q: "What happens if neither process calls `shmctl(IPC_RMID)`?", a: "The segment persists in kernel RAM even after both programs exit until manually deleted with `ipcrm -m` or reboot." },
      { q: "How do you view and delete active shared memory segments in terminal?", a: "`ipcs -m` lists active segments; `ipcrm -m <shmid>` deletes one." },
      { q: "Why do we need `buf->flag` in `struct shm_buf`?", a: "To synchronize turns (`0` = writer's turn, `1` = reader's turn) so reader never reads half-written data and writer never overwrites unread messages.", codeRef: { fileId: "chat_writer", hlId: "w-struct" } },
      { q: "What is a Race Condition?", a: "A bug where concurrent processes access shared data without synchronization, making output depend on unpredictable execution timing." },
      { q: "What is Busy Waiting? Where does it occur in your code?", a: "Tight polling loops `while (buf->flag == 1);` and `while (buf->flag == 0);` that burn CPU cycles instead of sleeping.", codeRef: { fileId: "chat_writer", hlId: "w-loop" } },
      { q: "How can you eliminate Busy Waiting in this chat app?", a: "Replace flag polling with two Semaphores (or mutex + condition variable) so waiting processes block with 0% CPU usage." },
      { q: "Why did you use `fgets()` + `strcspn()` instead of `scanf()`?", a: "`scanf(\"%s\")` stops at spaces. `fgets()` safely reads multi-word lines, and `strcspn(buf->msg, \"\\n\")` strips the trailing newline so `strcmp(..., \"exit\")` matches cleanly.", codeRef: { fileId: "chat_writer", hlId: "w-loop" } },
      { q: "Can this chat app be made full-duplex (two-way)?", a: "Yes — use two message buffers/flags (`a_to_b` and `b_to_a`), or two threads per process (one reading, one writing)." },
      { q: "Which process should you start first and why?", a: "Start `./chat_writer` first because it initializes `buf->flag = 0`. If reader starts first on dirty memory, it could read stale data once." }
    ],
    proTips: [
      "Live Demo Flex: While both `./chat_writer` and `./chat_reader` are open, run `ipcs -m` in a 3rd terminal to show `nattch = 2` and `bytes = 1028` (`4` bytes `int` + `1024` bytes `char`)!",
      "Compiler trap: under `-O2`, declare `volatile int flag;` so the compiler doesn't cache `buf->flag` in a register!"
    ],
    files: [
      {
        id: "chat_writer",
        name: "chat_writer.c",
        path: "04_Shared_Memory_IPC/chat_writer.c",
        lang: "c",
        desc: "Writer (Producer) process: creates/attaches shared memory, writes messages when `flag == 0`, and signals reader (`flag = 1`).",
        code: "/* Exp 4: IPC using System V shared memory - WRITER process.\nWrites messages into a shared segment; reader reads them.\nA status flag byte synchronises turns (0 = writer's turn, 1 = reader's turn). */\n#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n#include <sys/ipc.h>\n#include <sys/shm.h>\n#define SIZE 1024\n\nstruct shm_buf {\n    int flag;\n    char msg[SIZE];\n}; /* flag=1 -> new msg from writer */\n\nint main() {\n    key_t key = ftok(\"chatfile\", 65);\n    int shmid = shmget(key, sizeof(struct shm_buf), 0666 | IPC_CREAT);\n    struct shm_buf *buf = (struct shm_buf *)shmat(shmid, NULL, 0);\n    buf->flag = 0;\n    printf(\"WRITER ready. Type 'exit' to quit.\\n\");\n    while (1) {\n        while (buf->flag == 1)\n            ; /* wait until reader consumed last */\n        printf(\"Writer> \");\n        fgets(buf->msg, SIZE, stdin);\n        buf->msg[strcspn(buf->msg, \"\\n\")] = 0;\n        buf->flag = 1; /* signal reader */\n        if (strcmp(buf->msg, \"exit\") == 0)\n            break;\n    }\n    shmdt(buf);\n    return 0;\n}\n",
        highlights: [
          { id: "w-struct", startLine: 11, endLine: 14, badge: "KEY", label: "Shared Memory Struct Layout", explanation: "Both writer and reader must define the exact same `struct shm_buf` layout (`4` bytes `flag` + `1024` bytes `msg` = `1028` bytes)." },
          { id: "w-shm-setup", startLine: 17, endLine: 20, badge: "SYSCALL", label: "`ftok` → `shmget` → `shmat` Lifecycle", explanation: "`ftok` hashes `chatfile`'s inode + `65` into a key; `shmget` creates/gets the segment (`0666 | IPC_CREAT`); `shmat` maps it into virtual RAM and casts `void*` to `struct shm_buf*`." },
          { id: "w-loop", startLine: 22, endLine: 31, badge: "VIVA TRAP", label: "Busy-Wait + `fgets()` + `strcspn()`", explanation: "`while (buf->flag == 1);` is **busy waiting** until reader finishes. `fgets()` safely reads spaces; `strcspn` strips `\\n` so `strcmp(msg, \"exit\")` works; setting `buf->flag = 1` signals reader." },
          { id: "w-detach", startLine: 32, endLine: 32, badge: "SYSCALL", label: "Detach (`shmdt`)", explanation: "Writer detaches cleanly but does NOT call `IPC_RMID` — letting the reader finish reading `\"exit\"` and destroy the segment." }
        ]
      },
      {
        id: "chat_reader",
        name: "chat_reader.c",
        path: "04_Shared_Memory_IPC/chat_reader.c",
        lang: "c",
        desc: "Reader (Consumer) process: waits for `flag == 1`, prints messages, resets `flag = 0`, and destroys the segment on `\"exit\"`.",
        code: "/* Exp 4: IPC using System V shared memory - READER process. */\n#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n#include <sys/ipc.h>\n#include <sys/shm.h>\n#define SIZE 1024\n\nstruct shm_buf {\n    int flag;\n    char msg[SIZE];\n};\n\nint main() {\n    key_t key = ftok(\"chatfile\", 65);\n    int shmid = shmget(key, sizeof(struct shm_buf), 0666 | IPC_CREAT);\n    struct shm_buf *buf = (struct shm_buf *)shmat(shmid, NULL, 0);\n    printf(\"READER ready.\\n\");\n    while (1) {\n        while (buf->flag == 0)\n            ; /* wait for a new message */\n        if (strcmp(buf->msg, \"exit\") == 0) {\n            printf(\"Chat ended.\\n\");\n            break;\n        }\n        printf(\"Reader received: %s\\n\", buf->msg);\n        buf->flag = 0; /* signal writer */\n    }\n    shmdt(buf);\n    shmctl(shmid, IPC_RMID, NULL); /* remove segment */\n    return 0;\n}\n",
        highlights: [
          { id: "r-shm-setup", startLine: 15, endLine: 17, badge: "SYSCALL", label: "Attach to Same Segment", explanation: "Uses identical `ftok(\"chatfile\", 65)` so `shmget` returns the exact same `shmid` created by writer." },
          { id: "r-loop", startLine: 19, endLine: 28, badge: "VIVA TRAP", label: "Wait for Signal & Reset Turn", explanation: "Spins while `buf->flag == 0`. Prints message (or breaks on `\"exit\"`), then sets `buf->flag = 0` to hand the turn back to writer." },
          { id: "r-cleanup", startLine: 29, endLine: 30, badge: "SYSCALL", label: "Detach & Destroy (`IPC_RMID`)", explanation: "`shmdt(buf)` unmaps from reader; `shmctl(shmid, IPC_RMID, NULL)` marks the kernel segment for deletion so no RAM leaks!" }
        ]
      }
    ]
  }
];
