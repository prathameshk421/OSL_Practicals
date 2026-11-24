window.OSL_EXPERIMENTS_5_8 = [
  {
    "id": "exp-5",
    "num": 5,
    "co": "CO4",
    "shortTitle": "Sync",
    "title": "Process Synchronization: Producer–Consumer & Reader–Writer",
    "subtitle": "Your practice multithreaded `practice_producer_consumer.c` (`SIZE = 10`) & `practice_reader_writer.c` using POSIX semaphores & mutex.",
    "compileCmd": "cd 05_Synchronization && gcc practice_producer_consumer.c -o pc -lpthread && gcc practice_reader_writer.c -o rw -lpthread",
    "bigPicture": [
      "**Race Condition & Critical Section (CS):** Concurrent threads modifying shared variables (`buffer[]`, `in`, `out`, `readcount`, `k`) corrupt data unless protected.",
      "**3 Mandatory CS Requirements:** 1. **Mutual Exclusion** (only 1 conflicting thread inside CS), 2. **Progress** (decision not postponed indefinitely), 3. **Bounded Waiting** (no starvation).",
      "**Semaphore (`sem_t`):** Atomic integer counter: `sem_wait()` (`P()` / Down) decrements or blocks if `0`; `sem_post()` (`V()` / Up) increments and wakes a waiter.",
      "**Producer–Consumer:** Bounded circular buffer (`SIZE = 5`) using counting semaphores `empty = 5`, `full = 0` + `pthread_mutex_t mutex`.",
      "**Reader–Writer (Readers-Preference):** Multiple readers read `k` concurrently; first reader (`readcount == 1`) locks `wrt`, last reader (`readcount == 0`) unlocks `wrt`."
    ],
    "traps": [
      {
        "title": "Mutex vs Binary Semaphore (95% Viva Probability!)",
        "body": "**Mutex = Lock with Ownership:** Only the exact thread that locked it can unlock it. **Semaphore = Signaling Mechanism (No Ownership):** Any thread can `sem_post()` to wake another thread (e.g., Producer posts `full`, Consumer waits on `full`)."
      },
      {
        "title": "Swapping `sem_wait(&empty)` and `pthread_mutex_lock(&mutex)` → DEADLOCK!",
        "body": "If buffer is full (`empty == 0`) and Producer locks `mutex` FIRST, it sleeps on `sem_wait(&empty)` while still holding `mutex`. Consumer can never acquire `mutex` to free a slot! **Rule:** Always wait on counting semaphore BEFORE locking mutex."
      }
    ],
    "tables": [
      {
        "title": "Synchronization Variables Across Both Programs",
        "headers": [
          "Program",
          "Variable",
          "Init",
          "Exact Role"
        ],
        "rows": [
          [
            "Producer–Consumer",
            "`sem_t empty`",
            "`SIZE` (`5`)",
            "Counts free slots; blocks producer when buffer is full"
          ],
          [
            "Producer–Consumer",
            "`sem_t full`",
            "`0`",
            "Counts filled slots; blocks consumer when buffer is empty"
          ],
          [
            "Producer–Consumer",
            "`pthread_mutex_t mutex`",
            "Unlocked",
            "Mutual exclusion around `buffer[]`, `in`, `out`"
          ],
          [
            "Reader–Writer",
            "`sem_t mutex`",
            "`1`",
            "Protects `readcount++` and `readcount--` from races"
          ],
          [
            "Reader–Writer",
            "`sem_t wrt`",
            "`1`",
            "Exclusive writer lock; held by 1st→last reader or 1 writer"
          ]
        ]
      }
    ],
    "vivaQA": [
      {
        "q": "What is a Race Condition?",
        "a": "When multiple threads concurrently access/modify shared data without synchronization, making results depend on unpredictable thread scheduling."
      },
      {
        "q": "What is a Critical Section?",
        "a": "The code block where a thread accesses shared resources that must not be concurrently accessed by conflicting threads."
      },
      {
        "q": "What are the 3 requirements of a valid Critical Section solution?",
        "a": "**Mutual Exclusion**, **Progress**, and **Bounded Waiting**."
      },
      {
        "q": "What is a Semaphore? What do `P()` and `V()` stand for?",
        "a": "An integer sync counter. `P()` (Proberen = test/wait = `sem_wait`) decrements/blocks; `V()` (Verhogen = increment/signal = `sem_post`) increments/wakes."
      },
      {
        "q": "Why must `sem_wait()` and `sem_post()` be atomic?",
        "a": "If two threads checked and decremented non-atomically, both could enter the CS simultaneously, breaking mutual exclusion."
      },
      {
        "q": "Difference between Counting Semaphore and Binary Semaphore?",
        "a": "Counting ranges over `0..N` (tracks resource slots like `empty`/`full`). Binary is strictly `0` or `1` (like `wrt`)."
      },
      {
        "q": "Key difference between Mutex and Binary Semaphore?",
        "a": "**Ownership!** Only the thread that locks a mutex can unlock it; any thread can call `sem_post()` on a semaphore."
      },
      {
        "q": "In Producer–Consumer, what if `empty` is initialized to `0` instead of `SIZE`?",
        "a": "Producer immediately blocks on `sem_wait(&empty)` and Consumer blocks on `sem_wait(&full)` — instant deadlock!",
        "codeRef": {
          "fileId": "pc",
          "hlId": "pc-init"
        }
      },
      {
        "q": "Why do we need BOTH `empty`/`full` AND `mutex` in Producer–Consumer?",
        "a": "`empty`/`full` prevent buffer overflow & underflow; `mutex` prevents two threads from corrupting `buffer[]`, `in`, and `out` simultaneously.",
        "codeRef": {
          "fileId": "pc",
          "hlId": "pc-deadlock"
        }
      },
      {
        "q": "What happens if `pthread_mutex_lock(&mutex)` is placed BEFORE `sem_wait(&empty)`?",
        "a": "**Deadlock!** Producer holds `mutex` while sleeping on a full buffer, blocking every consumer from entering to free a slot.",
        "codeRef": {
          "fileId": "pc",
          "hlId": "pc-deadlock"
        }
      },
      {
        "q": "Why do we use `(in + 1) % SIZE` in the buffer?",
        "a": "Implements a circular (ring) buffer so indices wrap cleanly from `SIZE - 1` back to `0`.",
        "codeRef": {
          "fileId": "pc",
          "hlId": "pc-cs"
        }
      },
      {
        "q": "What does the 2nd parameter (`0`) in `sem_init(&s, 0, val)` mean?",
        "a": "`0` = semaphore shared between **threads** of the same process; non-zero = shared across **processes** (in shared memory).",
        "codeRef": {
          "fileId": "pc",
          "hlId": "pc-init"
        }
      },
      {
        "q": "In Reader–Writer, why can multiple readers read simultaneously?",
        "a": "Reading does not modify shared variable `k`, so concurrent reads never cause data inconsistency."
      },
      {
        "q": "Explain why `readcount == 1` calls `sem_wait(&wrt)` in Reader–Writer.",
        "a": "Only the FIRST arriving reader needs to lock out writers. Subsequent concurrent readers skip `sem_wait(&wrt)` and read immediately!",
        "codeRef": {
          "fileId": "rw",
          "hlId": "rw-first"
        }
      },
      {
        "q": "Explain why `readcount == 0` calls `sem_post(&wrt)` in Reader–Writer.",
        "a": "Only when the VERY LAST active reader finishes is it safe to release `wrt` so a waiting writer can modify `k`.",
        "codeRef": {
          "fileId": "rw",
          "hlId": "rw-last"
        }
      },
      {
        "q": "Why do readers need `mutex` around `readcount++` and `readcount--`?",
        "a": "Without `mutex`, two concurrent readers could race on `readcount`, causing wrong counts or missed `wrt` locks/unlocks.",
        "codeRef": {
          "fileId": "rw",
          "hlId": "rw-first"
        }
      },
      {
        "q": "What is Writer Starvation in your Reader–Writer code?",
        "a": "Because this is Readers-Preference, if readers continuously overlap, `readcount` never hits `0` and writers starve indefinitely (fixed by Writers-Preference or a FIFO turnstile semaphore)."
      },
      {
        "q": "Difference between a Thread and a Process?",
        "a": "Processes have separate address spaces (heavyweight). Threads live inside the same process sharing global variables/heap (lightweight), making synchronization mandatory."
      },
      {
        "q": "What does `pthread_join()` do?",
        "a": "Blocks `main()` until the specified worker thread finishes — just like `wait()` for processes.",
        "codeRef": {
          "fileId": "pc",
          "hlId": "pc-shutdown"
        }
      },
      {
        "q": "Why did you pass `&p_id[i]` instead of `&i` to `pthread_create()`?",
        "a": "Passing `&i` causes a race condition because the loop increments `i` before the new thread reads it, giving multiple threads the same ID!",
        "codeRef": {
          "fileId": "pc",
          "hlId": "pc-create"
        }
      }
    ],
    "proTips": [
      "Always link with `-lpthread`: `gcc producer_consumer.c -o pc -lpthread`.",
      "Highlight your **graceful shutdown** in `producer_consumer.c`: pressing `q` sets `running = 0` AND posts to `empty` & `full` so blocked threads wake up and exit cleanly instead of hanging at `pthread_join()`!"
    ],
    "files": [
      {
        "id": "pc",
        "name": "practice_producer_consumer.c",
        "path": "05_Synchronization/practice_producer_consumer.c",
        "lang": "c",
        "desc": "Practice Bounded-Buffer Producer–Consumer (`SIZE = 10`) with counting semaphores (`empty`, `full`), mutex, and clean `q`-to-quit shutdown.",
        "code": "#include <stdio.h>\n#include <unistd.h>\n#include <pthread.h>\n#include <semaphore.h>\n#include <stdlib.h> \n#include <time.h>\n\n#define SIZE 10\n\nint buffer[SIZE];\nint in=0,out=0,running=1;\n\nsem_t full,empty;\npthread_mutex_t mutex;\n\nvoid show_buffer(){\n    printf(\"Buffer:[ \");\n    for(int i=0;i<SIZE;i++){\n        if(buffer[i]!=0){\n            printf(\"%d \",buffer[i]);\n        }\n        else printf(\"_ \");\n    }\n    printf(\"]\\n\");\n}\n\nvoid * producer(void *arg){\n    int id=*((int *)arg);\n    while(1){\n        sem_wait(&empty);\n        pthread_mutex_lock(&mutex);\n\n        if(!running){\n            pthread_mutex_unlock(&mutex);\n            break;\n        }\n\n        int item=(rand()%9)+1;\n        buffer[in]=item;\n        printf(\"Producer %d Added %d at %d | \",id,item,in);\n        in=(in+1)%SIZE;\n        show_buffer();\n\n        pthread_mutex_unlock(&mutex);\n        sem_post(&full);\n\n        sleep(1);\n    }\n    return NULL;\n}\n\nvoid * consumer(void * args){\n    int id=*((int *)args);\n\n    while(1){\n        sem_wait(&full);\n        pthread_mutex_lock(&mutex);\n\n        if(!running){\n            pthread_mutex_unlock(&mutex);\n            break;\n        }\n        \n        int item=buffer[out];\n        buffer[out]=0;\n        printf(\"Consumer %d removed %d from slot %d | \",id,item,out);\n        out=(out+1)%SIZE;\n        show_buffer();\n        \n        pthread_mutex_unlock(&mutex);\n        sem_post(&empty);\n\n        sleep(2);\n    }\n    return NULL;\n}\n\nint main(){\n    int p,c;\n    srand(time(NULL));\n\n    printf(\"Enter No. of Producers:\");\n    scanf(\"%d\",&p);\n    printf(\"Enter No. of Consumers:\");\n    scanf(\"%d\",&c);\n\n    pthread_t prod[p],cons[c];\n    int p_id[p],c_id[c];\n\n    sem_init(&full,0,0);\n    sem_init(&empty,0,SIZE);\n    pthread_mutex_init(&mutex,NULL);\n\n\n    for(int i=0;i<p;i++){\n        p_id[i]=i+1;\n        pthread_create(&prod[i],NULL,producer,&p_id[i]);        \n    }\n    for(int i=0;i<c;i++){\n        c_id[i]=i+1;\n        pthread_create(&cons[i],NULL,consumer,&c_id[i]);\n    }\n\n    int ch;\n    while((ch=getchar())!='q' && ch!='Q' && ch!=EOF);\n\n    pthread_mutex_lock(&mutex);\n    running=0;\n    pthread_mutex_unlock(&mutex);\n    \n    for(int i=0;i<p;i++)sem_post(&empty);\n    for(int i=0;i<c;i++)sem_post(&full);\n\n    for(int i=0;i<p;i++)pthread_join(prod[i],NULL);\n    for(int i=0;i<c;i++)pthread_join(cons[i],NULL);\n\n    sem_destroy(&full);\n    sem_destroy(&empty);\n    pthread_mutex_destroy(&mutex);\n    \n    printf(\"\\n Finished Cleanly!\\n\");\n    return 0;\n}",
        "highlights": [
          {
            "id": "pc-globals",
            "startLine": 10,
            "endLine": 14,
            "badge": "KEY",
            "label": "Shared Circular Buffer & Sync Primitives",
            "explanation": "`buffer[10]`, `in`, `out` are shared across threads. `empty` & `full` control capacity; `mutex` guards the critical section."
          },
          {
            "id": "pc-deadlock",
            "startLine": 30,
            "endLine": 31,
            "badge": "VIVA TRAP",
            "label": "Lock Order: `sem_wait(&empty)` BEFORE `mutex`!",
            "explanation": "CRITICAL! Never lock `mutex` before `sem_wait(&empty)` — if buffer is full, producer sleeps holding `mutex` and deadlocks every consumer!"
          },
          {
            "id": "pc-cs",
            "startLine": 38,
            "endLine": 47,
            "badge": "CORE ALGO",
            "label": "Circular Insert, Signal & Sleep Outside Lock",
            "explanation": "Inserts item, wraps `in = (in + 1) % SIZE`, unlocks `mutex`, posts `full`, and calls `sleep(1)` outside the lock."
          },
          {
            "id": "pc-cons",
            "startLine": 56,
            "endLine": 73,
            "badge": "CORE ALGO",
            "label": "Consumer Mirror Flow",
            "explanation": "`sem_wait(&full)` → lock `mutex` → remove `buffer[out]` → `out = (out + 1) % SIZE` → unlock `mutex` → `sem_post(&empty)`."
          },
          {
            "id": "pc-init",
            "startLine": 90,
            "endLine": 92,
            "badge": "SYSCALL",
            "label": "Semaphore & Mutex Initialization",
            "explanation": "`sem_init(&full, 0, 0)` and `sem_init(&empty, 0, SIZE)` (`0` = shared between threads of the same process)."
          },
          {
            "id": "pc-create",
            "startLine": 95,
            "endLine": 102,
            "badge": "VIVA TRAP",
            "label": "Passing `&p_id[i]` (Not `&i`!)",
            "explanation": "Each thread gets its own array element `&p_id[i]` so the loop incrementing `i` cannot race with thread startup."
          },
          {
            "id": "pc-shutdown",
            "startLine": 107,
            "endLine": 115,
            "badge": "KEY",
            "label": "Graceful Shutdown + Unblock Waiters",
            "explanation": "Sets `running = 0` under mutex, posts `empty`/`full` to wake blocked threads, then `pthread_join()` finishes cleanly!"
          }
        ]
      },
      {
        "id": "rw",
        "name": "practice_reader_writer.c",
        "path": "05_Synchronization/practice_reader_writer.c",
        "lang": "c",
        "desc": "Practice First Readers–Writers (Readers-Preference) solution using binary semaphores `mutex` and `wrt`.",
        "code": "#include<unistd.h>\n#include<stdlib.h>\n#include<stdio.h>\n#include<time.h>\n#include<semaphore.h>\n#include<pthread.h>\n\nsem_t mutex;\nsem_t wrt;\nint k=0;\nint read_count=0;\nint running=1;\n\nvoid * reader(void * args){\n    int id=*((int *) args);\n\n    while(running){\n        printf(\"Reader %d wants to read k\",id);\n        sem_wait(&mutex);\n        read_count++;\n        if(read_count==1)sem_wait(&wrt);\n        sem_post(&mutex);\n\n        printf(\"Reader %d has read the value of k as %d\",id,k);\n        sleep(rand()%5);\n        sem_wait(&mutex);\n        read_count--;\n        if(read_count==0)sem_post(&wrt);\n        sem_post(&mutex);\n        \n        printf(\"Reader %d has finished reading\\n\",id);\n        sleep(rand()%5);\n\n\n    }   \n    return NULL;\n}\n\nvoid * writer(void * args){\n    int id=*((int *)args);\n\n    while(running){\n        printf(\"Writer %d wants to read\",id);\n        sem_wait(&wrt);\n        k++;\n        printf(\"Writer %d has updated k to %d\",id,k);\n        sleep(rand()%5);\n        sem_post(&wrt);\n\n        printf(\"Writer %d has finished writing\\n\",id);\n        sleep(rand()%5);\n    }\n    return NULL;\n}\n\nint main(){\n    int r,w;\n    printf(\"Enter no. of readers:\");\n    scanf(\"%d\",&r);\n    printf(\"Enter no. of writers:\");\n    scanf(\"%d\",&w);\n\n    srand(time(NULL));\n    sem_init(&wrt,0,1);\n    sem_init(&mutex,0,1);\n\n    pthread_t readers[r],writers[w];\n    int r_id[r],w_id[w];\n    for(int i=0;i<r;i++){\n        r_id[i]=i+1;\n        pthread_create(&readers[i],NULL,reader,&r_id[i]);\n    }\n    for(int i=0;i<w;i++){\n        w_id[i]=i+1;\n        pthread_create(&writers[i],NULL,writer,&w_id[i]);\n    }\n\n    printf(\"\\nPress 'q' and Enter to exit the program.\\n\");\n\n    char choice;\n    while (1) {\n        choice = getchar();\n        if (choice == 'q' || choice == 'Q') {\n            running = 0;\n            break;\n        }\n    }\n\n    for(int i=0;i<r;i++)pthread_join(readers[i],NULL);\n    for(int i=0;i<w;i++)pthread_join(writers[i],NULL);\n\n    sem_destroy(&wrt);\n    sem_destroy(&mutex);\n\n    printf(\"\\nClean up done\\n\");\n    return 0;\n}",
        "highlights": [
          {
            "id": "rw-globals",
            "startLine": 8,
            "endLine": 12,
            "badge": "KEY",
            "label": "Shared `k`, `read_count`, `mutex`, `wrt`",
            "explanation": "`k` is the shared integer; `read_count` tracks active readers; `mutex` guards `read_count`; `wrt` grants exclusive writer access."
          },
          {
            "id": "rw-first",
            "startLine": 19,
            "endLine": 22,
            "badge": "CORE ALGO",
            "label": "First Reader Locks Out Writers",
            "explanation": "Locks `mutex`, increments `read_count`. Only when `read_count == 1` (first reader) does it call `sem_wait(&wrt)` — letting other readers read concurrently!"
          },
          {
            "id": "rw-last",
            "startLine": 26,
            "endLine": 29,
            "badge": "CORE ALGO",
            "label": "Last Reader Releases Writers",
            "explanation": "Locks `mutex`, decrements `read_count`. Only when `read_count == 0` (last active reader leaves) does it `sem_post(&wrt)`."
          },
          {
            "id": "rw-writer",
            "startLine": 44,
            "endLine": 48,
            "badge": "CORE ALGO",
            "label": "Exclusive Writer Critical Section",
            "explanation": "Writer acquires `sem_wait(&wrt)` — guaranteed zero other writers AND zero readers are active while updating `k++`."
          },
          {
            "id": "rw-init",
            "startLine": 64,
            "endLine": 65,
            "badge": "SYSCALL",
            "label": "Binary Semaphore Init (`1`)",
            "explanation": "Both `wrt` and `mutex` start at `1` (unlocked binary semaphores)."
          }
        ]
      }
    ]
  },
  {
    "id": "exp-6",
    "num": 6,
    "co": "CO4 / CO5",
    "shortTitle": "Mem Alloc",
    "title": "Contiguous Memory Allocation: First, Next, Best & Worst Fit",
    "subtitle": "Internal vs External Fragmentation, Compaction, Coalescing, and all 4 strategies (First, Next, Best & Worst Fit) in `mem_alloc.c`.",
    "compileCmd": "cd 06_Memory_Allocation && gcc mem_alloc.c -o mem_alloc && ./mem_alloc",
    "bigPicture": [
      "**Contiguous Allocation:** Each process gets one unbroken block of physical RAM. Free blocks are called **Holes**.",
      "**Fixed (MFT) vs Variable (MVT) Partitioning:** Fixed causes **Internal Fragmentation** (wasted space inside a block); Variable eliminates internal frag but causes **External Fragmentation** (enough total free RAM, but scattered into tiny non-contiguous holes).",
      "**Fixes for External Fragmentation:** **Compaction** (shuffle processes together; expensive + needs dynamic relocation), **Coalescing** (merge adjacent free holes), or **Paging** (non-contiguous — Exp 7!).",
      "**50-Percent Rule (First Fit):** With `N` allocated blocks, ~`0.5N` blocks (~1/3 of RAM) are lost to external fragmentation."
    ],
    "traps": [
      {
        "title": "Which is actually better in practice — First Fit or Best Fit?",
        "body": "**First Fit!** Despite its name, Best Fit must scan ALL holes (slower) and leaves behind microscopic unusable slivers (worst external fragmentation!). First Fit stops early and achieves great utilization."
      }
    ],
    "tables": [
      {
        "title": "Worked Lab Manual Dry Run (Blocks = {100, 500, 200, 300, 600}, Procs = {212, 417, 112, 426})",
        "headers": [
          "Process",
          "First Fit",
          "Next Fit",
          "Best Fit",
          "Worst Fit"
        ],
        "rows": [
          [
            "**P1 (212)**",
            "`B2` (500→288)",
            "`B2` (500→288)",
            "`B4` (300→88)",
            "`B5` (600→388)"
          ],
          [
            "**P2 (417)**",
            "`B5` (600→183)",
            "`B5` (600→183)",
            "`B2` (500→83)",
            "`B2` (500→83)"
          ],
          [
            "**P3 (112)**",
            "`B2` (288→176)",
            "`B2` (288→176)",
            "`B3` (200→88)",
            "`B5` (388→276)"
          ],
          [
            "**P4 (426)**",
            "Not Allocated",
            "Not Allocated",
            "**`B5` (600→174)**",
            "Not Allocated"
          ]
        ]
      },
      {
        "title": "Internal vs External Fragmentation",
        "headers": [
          "Feature",
          "Internal Fragmentation",
          "External Fragmentation"
        ],
        "rows": [
          [
            "Meaning",
            "Wasted space **inside** an allocated block",
            "Enough total free RAM, but **scattered** in small holes"
          ],
          [
            "Example",
            "18 KB proc in 20 KB fixed block → 2 KB wasted",
            "959 KB free across 5 blocks, yet 426 KB P4 fails!"
          ],
          [
            "Happens in",
            "Fixed partitioning & Paging (last page)",
            "Variable contiguous allocation & Segmentation"
          ],
          [
            "Fix",
            "Variable partitioning / smaller block sizes",
            "Compaction, Coalescing, or Paging"
          ]
        ]
      }
    ],
    "vivaQA": [
      {
        "q": "What is Contiguous Memory Allocation?",
        "a": "Assigning each process a single unbroken (continuous) block of physical RAM."
      },
      {
        "q": "What is a 'Hole' in memory management?",
        "a": "A contiguous block of free available memory waiting to be allocated."
      },
      {
        "q": "Difference between Fixed Partitioning and Variable Partitioning?",
        "a": "Fixed divides RAM into static partitions (causes internal frag). Variable carves exact space dynamically (causes external frag)."
      },
      {
        "q": "Define Internal Fragmentation.",
        "a": "Unused memory wasted inside an allocated block because the block is larger than the process needs."
      },
      {
        "q": "Define External Fragmentation.",
        "a": "Total free RAM is enough for a process, but split into non-contiguous small holes so no single hole can fit it."
      },
      {
        "q": "How does First Fit work?",
        "a": "Scans from block 0 and allocates the first hole where `block[j] >= p[i]`.",
        "codeRef": {
          "fileId": "mem_alloc",
          "hlId": "ma-first"
        }
      },
      {
        "q": "How does Next Fit differ from First Fit?",
        "a": "Resumes scanning circularly from where the previous allocation ended instead of restarting at block 0.",
        "codeRef": {
          "fileId": "mem_alloc",
          "hlId": "ma-next"
        }
      },
      {
        "q": "How does Best Fit work?",
        "a": "Scans ALL holes and allocates the **smallest** hole that is still `>= p[i]`.",
        "codeRef": {
          "fileId": "mem_alloc",
          "hlId": "ma-best"
        }
      },
      {
        "q": "How does Worst Fit work?",
        "a": "Scans ALL holes and allocates the **largest** available hole to leave big reusable leftovers.",
        "codeRef": {
          "fileId": "mem_alloc",
          "hlId": "ma-worst"
        }
      },
      {
        "q": "Which algorithm is fastest and why?",
        "a": "First Fit / Next Fit — they stop as soon as they find any fitting hole, whereas Best Fit & Worst Fit always scan every hole."
      },
      {
        "q": "Why does Best Fit often cause worse external fragmentation than First Fit?",
        "a": "Picking the tightest fit leaves tiny leftover slivers too small for any future process."
      },
      {
        "q": "What is Compaction and its limitation?",
        "a": "Shifting allocated processes together to merge scattered holes into one big hole. Expensive in CPU time and requires dynamic relocation hardware."
      },
      {
        "q": "What is Coalescing?",
        "a": "Merging two or more adjacent free holes into one larger hole when a process terminates."
      },
      {
        "q": "Does Paging solve External Fragmentation? What about Internal?",
        "a": "Yes — paging completely eliminates external fragmentation (non-contiguous frames), though slight internal frag remains in a process's last page."
      },
      {
        "q": "Why do you copy `b[]` into a local `block[]` array in every function?",
        "a": "Because each strategy subtracts `p[i]` from `block[j]`. Without a fresh copy, later strategies would receive already-depleted blocks!",
        "codeRef": {
          "fileId": "mem_alloc",
          "hlId": "ma-copy"
        }
      },
      {
        "q": "Why subtract `block[j] -= p[i]` instead of marking the block 'used'?",
        "a": "Models variable-style splitting where leftover space in a block can still fit another smaller process (e.g., `P3=112` fitting into leftover `B2=288`).",
        "codeRef": {
          "fileId": "mem_alloc",
          "hlId": "ma-first"
        }
      },
      {
        "q": "How would you modify your code for Fixed Partitioning (1 process per block max)?",
        "a": "Add `used[MAX]`, check `if (!used[j] && block[j] >= p[i])`, set `used[j] = 1`, and internal frag = `block[j] - p[i]`."
      },
      {
        "q": "What is the time complexity of your allocation functions?",
        "a": "`O(np × nb)` where `np` = number of processes and `nb` = number of blocks."
      },
      {
        "q": "What is the 50-Percent Rule?",
        "a": "Under First Fit with `N` allocated blocks, ~`0.5N` blocks (~1/3 of RAM) are lost to external fragmentation."
      },
      {
        "q": "Difference between Logical Address and Physical Address?",
        "a": "Logical (virtual) address is generated by the CPU; Physical address is the real RAM location translated by the **MMU** using base/limit registers."
      }
    ],
    "proTips": [
      "Bonus Flex: Your `mem_alloc.cpp` implements **Next Fit** (circular `(last + k) % nb`) on top of the lab manual's 3 strategies!",
      "If asked to print remaining free space per block, pass `block[]` into `print_result` and loop `0..nb-1` — just 3 extra lines!"
    ],
    "files": [
      {
        "id": "mem_alloc",
        "name": "mem_alloc.c",
        "path": "06_Memory_Allocation/mem_alloc.c",
        "lang": "c",
        "desc": "C implementation of First Fit, Next Fit (newly added!), Best Fit, and Worst Fit on a shared input dataset.",
        "code": "\n#include<stdio.h>\n\n#define MAX 20\n\nvoid firstFit(int b[],int nb,int p[],int np){\n    int block[MAX],alloc[MAX];\n\n    for(int i=0;i<nb;i++){\n        block[i]=b[i];\n    }\n\n    for(int i=0;i<np;i++){\n        alloc[i]=-1;\n    }\n\n    for(int i=0;i<np;i++){\n        for(int j=0;j<nb;j++){\n            if(block[j]>=p[i]){\n                alloc[i]=j;\n                block[j]=block[j]-p[i];\n                break;\n            }\n        }\n    }\n\n    printf(\"\\n--- First Fit ---\\n\");\n    printf(\"Process\\tSize\\tBlock\\n\");\n\n    for(int i=0;i<np;i++){\n        printf(\"P%d\\t%d\\t\",i+1,p[i]);\n\n        if(alloc[i]!=-1){\n            printf(\"B%d\\n\",alloc[i]+1);\n        }\n        else{\n            printf(\"Not Allocated\\n\");\n        }\n    }\n}\n\nvoid nextFit(int b[],int nb,int p[],int np){\n    int block[MAX],alloc[MAX];\n\n    for(int i=0;i<nb;i++){\n        block[i]=b[i];\n    }\n\n    for(int i=0;i<np;i++){\n        alloc[i]=-1;\n    }\n\n    int last=0;\n\n    for(int i=0;i<np;i++){\n        int found=-1;\n\n        for(int k=0;k<nb;k++){\n            int j=(last+k)%nb;\n            if(block[j]>=p[i]){\n                found=j;\n                break;\n            }\n        }\n\n        if(found!=-1){\n            alloc[i]=found;\n            block[found]=block[found]-p[i];\n            last=(found+1)%nb;\n        }\n    }\n\n    printf(\"\\n--- Next Fit ---\\n\");\n    printf(\"Process\\tSize\\tBlock\\n\");\n\n    for(int i=0;i<np;i++){\n        printf(\"P%d\\t%d\\t\",i+1,p[i]);\n\n        if(alloc[i]!=-1){\n            printf(\"B%d\\n\",alloc[i]+1);\n        }\n        else{\n            printf(\"Not Allocated\\n\");\n        }\n    }\n}\n\nvoid bestFit(int b[],int nb,int p[],int np){\n    int block[MAX],alloc[MAX];\n\n    for(int i=0;i<nb;i++){\n        block[i]=b[i];\n    }\n\n    for(int i=0;i<np;i++){\n        alloc[i]=-1;\n    }\n\n    for(int i=0;i<np;i++){\n        int best=-1;\n\n        for(int j=0;j<nb;j++){\n            if(block[j]>=p[i] && (best==-1 || block[j]<block[best])){\n                best=j;\n            }\n        }\n\n        if(best!=-1){\n            alloc[i]=best;\n            block[best]=block[best]-p[i];\n        }\n    }\n\n    printf(\"\\n--- Best Fit ---\\n\");\n    printf(\"Process\\tSize\\tBlock\\n\");\n\n    for(int i=0;i<np;i++){\n        printf(\"P%d\\t%d\\t\",i+1,p[i]);\n\n        if(alloc[i]!=-1){\n            printf(\"B%d\\n\",alloc[i]+1);\n        }\n        else{\n            printf(\"Not Allocated\\n\");\n        }\n    }\n}\n\nvoid worstFit(int b[],int nb,int p[],int np){\n    int block[MAX],alloc[MAX];\n\n    for(int i=0;i<nb;i++){\n        block[i]=b[i];\n    }\n\n    for(int i=0;i<np;i++){\n        alloc[i]=-1;\n    }\n\n    for(int i=0;i<np;i++){\n        int worst=-1;\n\n        for(int j=0;j<nb;j++){\n            if(block[j]>=p[i] && (worst==-1 || block[j]>block[worst])){\n                worst=j;\n            }\n        }\n\n        if(worst!=-1){\n            alloc[i]=worst;\n            block[worst]=block[worst]-p[i];\n        }\n    }\n\n    printf(\"\\n--- Worst Fit ---\\n\");\n    printf(\"Process\\tSize\\tBlock\\n\");\n\n    for(int i=0;i<np;i++){\n        printf(\"P%d\\t%d\\t\",i+1,p[i]);\n\n        if(alloc[i]!=-1){\n            printf(\"B%d\\n\",alloc[i]+1);\n        }\n        else{\n            printf(\"Not Allocated\\n\");\n        }\n    }\n}\n\nint main(){\n    int blocks[MAX],procs[MAX];\n    int nb,np;\n\n    printf(\"Enter Number of Blocks: \");\n    scanf(\"%d\",&nb);\n\n    if(nb<1 || nb>MAX){\n        printf(\"Invalid input\\n\");\n        return 1;\n    }\n\n    for(int i=0;i<nb;i++){\n        printf(\"Enter Size of Block %d: \",i+1);\n        scanf(\"%d\",&blocks[i]);\n    }\n\n    printf(\"Enter Number of Processes: \");\n    scanf(\"%d\",&np);\n\n    if(np<1 || np>MAX){\n        printf(\"Invalid input\\n\");\n        return 1;\n    }\n\n    for(int i=0;i<np;i++){\n        printf(\"Enter Size of Process %d: \",i+1);\n        scanf(\"%d\",&procs[i]);\n    }\n\n    firstFit(blocks,nb,procs,np);\n    nextFit(blocks,nb,procs,np);\n    bestFit(blocks,nb,procs,np);\n    worstFit(blocks,nb,procs,np);\n\n    return 0;\n}\n",
        "highlights": [
          {
            "id": "ma-copy",
            "startLine": 9,
            "endLine": 15,
            "badge": "KEY",
            "label": "Fresh Copy of `block[]` & `-1` Sentinel",
            "explanation": "Copies `b[]` so subtracting allocated sizes doesn't corrupt input for later strategies. `alloc[i] = -1` marks unallocated processes."
          },
          {
            "id": "ma-first",
            "startLine": 17,
            "endLine": 25,
            "badge": "CORE ALGO",
            "label": "First Fit (Stop Early + Split)",
            "explanation": "Scans from `j = 0`, picks the first block where `block[j] >= p[i]`, subtracts `p[i]`, and `break`s immediately."
          },
          {
            "id": "ma-next",
            "startLine": 54,
            "endLine": 73,
            "badge": "CORE ALGO",
            "label": "Next Fit (Circular Roving Pointer)",
            "explanation": "Starts scanning from `last` using `j = (last + k) % nb` to wrap around circularly, checking at most `nb` blocks, and updates `last = (found + 1) % nb`."
          },
          {
            "id": "ma-best",
            "startLine": 99,
            "endLine": 112,
            "badge": "CORE ALGO",
            "label": "Best Fit (Smallest Fitting Hole)",
            "explanation": "Scans ALL blocks; picks `best` where `block[j] < block[best]`. (`best == -1` sets the first valid candidate.)"
          },
          {
            "id": "ma-worst",
            "startLine": 140,
            "endLine": 153,
            "badge": "CORE ALGO",
            "label": "Worst Fit (Largest Fitting Hole)",
            "explanation": "Identical to Best Fit except `block[j] > block[worst]` — picks the largest available hole."
          }
        ]
      }
    ]
  },
  {
    "id": "exp-7",
    "num": 7,
    "co": "CO5 / CO6",
    "shortTitle": "Page Repl",
    "title": "Virtual Memory & Page Replacement: FIFO, LRU & Optimal",
    "subtitle": "Demand Paging, Page Faults, Belady's Anomaly, Thrashing, and your updated `practice.cpp` (FIFO, LRU & Optimal).",
    "compileCmd": "cd 07_Page_Replacement && g++ -std=c++17 practice.cpp -o practice && ./practice",
    "bigPicture": [
      "**Virtual Memory & Demand Paging:** Run programs larger than physical RAM by loading fixed-size **Pages** into RAM **Frames** lazily (only on a Page Fault).",
      "**Page Table & Valid Bit:** Maps Page → Frame; `valid = 1` (Page Hit — fast RAM access), `valid = 0` (Page Fault — trap to OS, load from disk, restart instruction).",
      "**Effective Access Time (EAT):** `EAT = (1 - p) × t_mem + p × t_fault` (`p` = fault rate; disk access is thousands of times slower than RAM!).",
      "**Thrashing:** Too few frames → OS spends more time swapping pages than executing code, collapsing CPU utilization. Fixed by Working Set / PFF.",
      "**Dirty Bit:** If victim page has `dirty == 0` (clean), overwrite directly without writing back to disk — saving 50% disk I/O!"
    ],
    "traps": [
      {
        "title": "Belady's Anomaly (99% Viva Probability!)",
        "body": "In **FIFO**, giving a process MORE RAM frames can paradoxically **INCREASE** page faults! Memorize this string: `1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5` → **3 frames = 9 faults**, **4 frames = 10 faults**! LRU & Optimal NEVER suffer from it because they are **Stack Algorithms** (Inclusion Property)."
      }
    ],
    "tables": [
      {
        "title": "Worked Lab Manual Example (7 0 1 2 0 3 0 4 2 3 0 3 2 1 2 0 1 7 0 1, Frames = 3)",
        "headers": [
          "Algorithm",
          "Page Faults",
          "Page Hits",
          "Hit Ratio / Verdict"
        ],
        "rows": [
          [
            "**FIFO**",
            "`15`",
            "`5`",
            "`25%` — Suffers from Belady's Anomaly"
          ],
          [
            "**LRU**",
            "`12`",
            "`8`",
            "`40%` — Best practical algorithm (Temporal Locality)"
          ],
          [
            "**Optimal (OPT)**",
            "**`9`**",
            "**`11`**",
            "**`55%`** — Theoretical minimum (needs future knowledge)"
          ]
        ]
      }
    ],
    "vivaQA": [
      {
        "q": "What is Virtual Memory?",
        "a": "Separates logical memory from physical RAM so programs larger than RAM can run by keeping only active pages in frames."
      },
      {
        "q": "Difference between a Page and a Frame?",
        "a": "A **Page** is a fixed-size block of logical (virtual) memory. A **Frame** is an equal-sized slot of physical RAM."
      },
      {
        "q": "What is Demand Paging?",
        "a": "Loading a page from disk into RAM only when it is actually referenced (on a page fault), rather than loading the entire program upfront."
      },
      {
        "q": "What is a Page Fault?",
        "a": "A hardware trap triggered when the CPU accesses a page whose valid-invalid bit is invalid (not currently in RAM)."
      },
      {
        "q": "What steps does the OS take to handle a Page Fault?",
        "a": "Trap to OS → check validity → find free frame (or evict victim) → load page from disk → update Page Table (`valid = 1`) → restart instruction."
      },
      {
        "q": "What is a Reference String?",
        "a": "The sequence of page numbers accessed by a process over time, used to benchmark replacement policies."
      },
      {
        "q": "How does FIFO Page Replacement work?",
        "a": "Tracks arrival order with a circular pointer `ptr` and always evicts the oldest loaded page.",
        "codeRef": {
          "fileId": "page_repl",
          "hlId": "pr-fifo"
        }
      },
      {
        "q": "What is Belady's Anomaly?",
        "a": "A flaw in FIFO where increasing the number of physical frames paradoxically increases page faults."
      },
      {
        "q": "Give an example reference string showing Belady's Anomaly.",
        "a": "`1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5` — **9 faults** with 3 frames, **10 faults** with 4 frames in FIFO!"
      },
      {
        "q": "How does LRU work and why does it beat FIFO?",
        "a": "Evicts the page unused for the longest time in the past. Beats FIFO by exploiting **Temporal Locality**.",
        "codeRef": {
          "fileId": "page_repl",
          "hlId": "pr-lru"
        }
      },
      {
        "q": "Why do LRU and Optimal NOT suffer from Belady's Anomaly?",
        "a": "They are **Stack Algorithms** satisfying the Inclusion Property (RAM contents for `n` frames ⊆ RAM contents for `n+1` frames)."
      },
      {
        "q": "How does Optimal (OPT) Page Replacement work?",
        "a": "Looks ahead in the future reference string and evicts the page not used for the longest time (or never used again).",
        "codeRef": {
          "fileId": "page_repl",
          "hlId": "pr-opt"
        }
      },
      {
        "q": "If Optimal gives the fewest faults, why don't Windows/Linux use it?",
        "a": "An OS cannot predict future memory references of a running program! Optimal is only a theoretical lower-bound benchmark."
      },
      {
        "q": "How did you implement LRU in your code?",
        "a": "A `last[]` array stores loop index `i` (timestamp) of each frame's latest access; on fault, evict the frame with minimum `last[j]`.",
        "codeRef": {
          "fileId": "page_repl",
          "hlId": "pr-lru"
        }
      },
      {
        "q": "In your LRU code, why is `last[]` initialized to `-1`?",
        "a": "So empty frames (`-1`) always have a smaller timestamp than any real access (`i >= 0`), guaranteeing empty frames fill first!",
        "codeRef": {
          "fileId": "page_repl",
          "hlId": "pr-lru"
        }
      },
      {
        "q": "What happens to the FIFO pointer on a Page Hit?",
        "a": "Nothing! FIFO only cares about arrival time, never reuse.",
        "codeRef": {
          "fileId": "page_repl",
          "hlId": "pr-fifo"
        }
      },
      {
        "q": "What is Thrashing?",
        "a": "Excessive paging where the OS spends more time swapping pages than executing instructions, collapsing CPU utilization."
      },
      {
        "q": "What is the Dirty Bit (Modify Bit)?",
        "a": "Page Table bit showing if a page was written to in RAM. Clean pages (`0`) don't need to be written back to disk on eviction."
      },
      {
        "q": "Formula for Hit Ratio and Effective Access Time (EAT)?",
        "a": "`Hit Ratio = Hits / Total Refs`. `EAT = (1 - p) * RAM_time + p * Fault_time`."
      },
      {
        "q": "How do real OSes approximate LRU cheaply in hardware?",
        "a": "Using the **Second-Chance (Clock) Algorithm** with a 1-bit hardware Reference Bit per frame."
      }
    ],
    "proTips": [
      "Live Belady's Anomaly Demo: run with `n = 12`, string `1 2 3 4 1 2 5 1 2 3 4 5` — once with `frames = 3` (FIFO=9) and once with `frames = 4` (FIFO=10). Instant full marks!",
      "If asked for Hit Ratio live: `int hits = n - faults; cout << (float)hits / n;`."
    ],
    "files": [
      {
        "id": "page_repl",
        "name": "practice.cpp",
        "path": "07_Page_Replacement/practice.cpp",
        "lang": "cpp",
        "desc": "Your practice Page Replacement simulator now covering FIFO, LRU, and Optimal!",
        "code": "#include <algorithm>\n#include <iostream>\n#include <vector>\n\nusing namespace std;\n\nvoid print_f(vector<int> &f, int frames) {\n    cout << \"\\nFrames:\\n\";\n    for (int i = 0; i < frames; i++) {\n        cout << f[i] << ' ';\n    }\n    cout << '\\n';\n}\n\nvoid fifo(vector<int> &ref, int n, int frames) {\n    cout << \"\\n===== FIFO =====\\n\";\n    vector<int> f(frames, -1);\n    int ptr = 0;\n    int faults = 0;\n    for (int i = 0; i < n; i++) {\n        int found = 0;\n        for (int j = 0; j < frames; j++) {\n            if (ref[i] == f[j]) {\n                cout << \"\\nPage Hit!!!\\n\";\n                found = 1;\n                break;\n            }\n        }\n        if (!found) {\n            cout << \"\\nPage Fault!!\\n\";\n            f[ptr] = ref[i];\n            ptr = (ptr + 1) % frames;\n            faults++;\n        }\n        print_f(f, frames);\n    }\n    cout << \"\\nTotal Page Faults (FIFO): \" << faults << '\\n';\n}\n\nvoid lru(vector<int> &ref, int n, int frames) {\n    cout << \"\\n===== LRU =====\\n\";\n    vector<int> f(frames, -1);\n    vector<int> last_used(frames, -1);\n    int faults = 0;\n    for (int i = 0; i < n; i++) {\n        int found = 0;\n        for (int j = 0; j < frames; j++) {\n            if (ref[i] == f[j]) {\n                cout << \"\\nPage Hit!!!\\n\";\n                last_used[j] = i;\n                found = 1;\n                break;\n            }\n        }\n        if (!found) {\n            cout << \"\\nPage Fault!!\\n\";\n            faults++;\n            int done = 0;\n            for (int j = 0; j < frames; j++) {\n                if (f[j] == -1) {\n                    f[j] = ref[i];\n                    last_used[j] = i;\n                    done = 1;\n                    break;\n                }\n            }\n            if (!done) {\n                int min_index = min_element(last_used.begin(), last_used.end()) - last_used.begin();\n                f[min_index] = ref[i];\n                last_used[min_index] = i;\n            }\n        }\n        print_f(f, frames);\n    }\n    cout << \"\\nTotal Page Faults (LRU): \" << faults << '\\n';\n}\n\nvoid optimal(vector<int> &ref, int n, int frames) {\n    cout << \"\\n===== OPTIMAL =====\\n\";\n    vector<int> f(frames, -1);\n    int faults = 0;\n    for (int i = 0; i < n; i++) {\n        int found = 0;\n        for (int j = 0; j < frames; j++) {\n            if (ref[i] == f[j]) {\n                cout << \"\\nPage Hit!!!\\n\";\n                found = 1;\n                break;\n            }\n        }\n        if (!found) {\n            cout << \"\\nPage Fault!!\\n\";\n            faults++;\n            int victim = -1;\n            int farthest = -1;\n            for (int j = 0; j < frames; j++) {\n                if (f[j] == -1) {\n                    victim = j;\n                    break;\n                }\n                int k = i + 1;\n                while (k < n && ref[k] != f[j]) k++;\n                if (k > farthest) {\n                    farthest = k;\n                    victim = j;\n                }\n            }\n            f[victim] = ref[i];\n        }\n        print_f(f, frames);\n    }\n    cout << \"\\nTotal Page Faults (Optimal): \" << faults << '\\n';\n}\n\nint main() {\n    int n, frames;\n\n    cout << \"Enter number of pages in reference string: \";\n    cin >> n;\n\n    vector<int> ref(n);\n    cout << \"Enter the reference string (space separated): \";\n    for (int i = 0; i < n; i++) {\n        cin >> ref[i];\n    }\n\n    cout << \"\\nEnter number of frames: \";\n    cin >> frames;\n\n    fifo(ref, n, frames);\n    lru(ref, n, frames);\n    optimal(ref, n, frames);\n\n    return 0;\n}\n",
        "highlights": [
          {
            "id": "pr-fifo",
            "startLine": 15,
            "endLine": 35,
            "badge": "VIVA TRAP",
            "label": "FIFO Circular Pointer (`ptr`)",
            "explanation": "`f(frames, -1)` represents empty RAM frames. On fault, overwrites `f[ptr]` and advances `ptr = (ptr + 1) % frames`. `ptr` does NOT move on a hit! Suffers from Belady's Anomaly."
          },
          {
            "id": "pr-lru",
            "startLine": 40,
            "endLine": 72,
            "badge": "CORE ALGO",
            "label": "LRU Timestamp Array (`last_used[]`)",
            "explanation": "Tracks most recent index `last_used[j] = i`. Fills empty `-1` frames first; when full, uses `min_element(last_used)` to evict the Least Recently Used page!"
          },
          {
            "id": "pr-opt",
            "startLine": 77,
            "endLine": 111,
            "badge": "CORE ALGO",
            "label": "Optimal Future Lookahead",
            "explanation": "Fills any empty frame (`f[j] == -1`) first. Otherwise scans `ref[i+1..n-1]` for each frame's next use; if never used again, `k == n` (max) so it gets evicted immediately!"
          }
        ]
      }
    ]
  },
  {
    "id": "exp-8",
    "num": 8,
    "co": "CO6",
    "shortTitle": "Disk Sched",
    "title": "Disk Scheduling: FCFS, SSTF, SCAN & C-SCAN",
    "subtitle": "HDD Geometry, Disk Access Time, Elevator Algorithm, LOOK/C-LOOK, and your clean `practice.cpp` (FCFS, SSTF, SCAN & C-SCAN).",
    "compileCmd": "cd 08_Disk_Scheduling && g++ -std=c++17 practice.cpp -o practice && ./practice",
    "bigPicture": [
      "**HDD Geometry:** **Platters** (spinning disks) → **Tracks** (concentric rings `0..disk-1`) → **Cylinder** (same-radius tracks across all platters) → **Sectors** (smallest read/write pie slice, 512 B / 4 KB).",
      "**Disk Access Time (3 Components):** `Seek Time` (dominant — moving the mechanical arm!) + `Rotational Latency` (spinning sector under head) + `Transfer Time` (reading/writing bytes).",
      "**FCFS:** Strict arrival order — fair, no starvation, worst seek time.",
      "**SSTF:** Greedy nearest track — huge seek reduction, but causes **Starvation** of far tracks.",
      "**SCAN (Elevator) vs C-SCAN:** SCAN sweeps to `disk-1` then reverses to `0`. C-SCAN sweeps to `disk-1`, jumps straight back to `0` (no service on return), and sweeps forward again for **uniform wait time**."
    ],
    "traps": [
      {
        "title": "SCAN vs LOOK, and C-SCAN vs C-LOOK",
        "body": "**SCAN / C-SCAN** travel all the way to the physical disk ends (`0` and `disk - 1`) even if empty. **LOOK / C-LOOK** stop and reverse (or jump) at the **last actual request** in each direction, saving wasted head movement! (To convert your SCAN to LOOK live: just delete the two `req.push_back` lines!)"
      },
      {
        "title": "Do SSDs need SCAN or SSTF?",
        "body": "**NO!** SSDs have no moving mechanical arm or spinning platters (zero seek time). Linux uses lightweight schedulers like `none` / `mq-deadline` for SSDs."
      }
    ],
    "tables": [
      {
        "title": "Worked Lab Manual Example (Req = {98, 183, 37, 122, 14, 124, 65, 67}, Head = 53, Disk = 200)",
        "headers": [
          "Algorithm",
          "Seek Sequence",
          "Total Seek Time"
        ],
        "rows": [
          [
            "**FCFS**",
            "`53→98→183→37→122→14→124→65→67`",
            "`640` (Worst)"
          ],
          [
            "**SSTF**",
            "`53→65→67→37→14→98→122→124→183`",
            "**`236` (Best!)**"
          ],
          [
            "**SCAN**",
            "`53→65→67→98→122→124→183→199→37→14→0`",
            "`345`"
          ],
          [
            "**C-SCAN**",
            "`53→65→67→98→122→124→183→199→0→14→37`",
            "`382`"
          ]
        ]
      }
    ],
    "vivaQA": [
      {
        "q": "What is the main objective of Disk Scheduling?",
        "a": "Order pending disk I/O requests to minimize total head movement (**Seek Time**) and maximize disk throughput."
      },
      {
        "q": "What are the 3 components of Disk Access Time?",
        "a": "**Seek Time** (arm to track) + **Rotational Latency** (platter spin to sector) + **Transfer Time** (bytes read/written)."
      },
      {
        "q": "Which component is the slowest and targeted by scheduling?",
        "a": "**Seek Time**, because physically moving the mechanical read/write arm across tracks takes the most milliseconds."
      },
      {
        "q": "Define Track, Cylinder, and Sector.",
        "a": "Track = concentric ring on one platter; Cylinder = all tracks at the same radius across platters; Sector = smallest pie-slice unit of a track."
      },
      {
        "q": "How does FCFS Disk Scheduling work?",
        "a": "Serves requests strictly in arrival order — fair with zero starvation, but causes wild back-and-forth head swings.",
        "codeRef": {
          "fileId": "disk_sched",
          "hlId": "ds-fcfs"
        }
      },
      {
        "q": "How does SSTF work?",
        "a": "Always picks the unvisited request with minimum `|curr - req[j]|` from the current head position.",
        "codeRef": {
          "fileId": "disk_sched",
          "hlId": "ds-sstf"
        }
      },
      {
        "q": "What is the biggest disadvantage of SSTF?",
        "a": "**Starvation!** Far-away tracks may wait indefinitely if nearby requests keep arriving."
      },
      {
        "q": "Why is SCAN called the Elevator Algorithm?",
        "a": "Like an elevator, the arm sweeps all the way up to `disk - 1` servicing stops along the way, then reverses and sweeps down to `0`.",
        "codeRef": {
          "fileId": "disk_sched",
          "hlId": "ds-scan"
        }
      },
      {
        "q": "How does SCAN solve SSTF's starvation problem?",
        "a": "By sweeping steadily from one end of the disk to the other and back, guaranteeing every track is visited in bounded time."
      },
      {
        "q": "How does C-SCAN differ from SCAN?",
        "a": "After reaching `disk - 1`, C-SCAN jumps straight back to `0` without servicing on the return trip, then scans forward again.",
        "codeRef": {
          "fileId": "disk_sched",
          "hlId": "ds-cscan"
        }
      },
      {
        "q": "Why does C-SCAN give more uniform wait times than SCAN?",
        "a": "In SCAN, middle tracks get serviced twice as often as edge tracks. C-SCAN treats all cylinders uniformly like a circular list."
      },
      {
        "q": "Difference between SCAN and LOOK?",
        "a": "SCAN goes to physical ends (`0` and `disk - 1`) even if empty. LOOK reverses at the last actual request in each direction."
      },
      {
        "q": "Difference between C-SCAN and C-LOOK?",
        "a": "C-SCAN goes to `disk - 1` and jumps to `0`. C-LOOK stops at the highest request and jumps directly to the lowest request."
      },
      {
        "q": "Does C-SCAN count the jump from `disk-1` to `0` in Total Seek Time?",
        "a": "Per PICT lab manual / syllabus convention, **YES** (`total += disk - 1`, giving `382`). Some textbooks exclude it — mention your code follows the lab manual!",
        "codeRef": {
          "fileId": "disk_sched",
          "hlId": "ds-cscan"
        }
      },
      {
        "q": "If disk size is 200, what are the valid track numbers?",
        "a": "`0` to `199` (`0` to `disk - 1`), which is why we push `0` and `disk - 1` in SCAN and C-SCAN."
      },
      {
        "q": "In SSTF, why initialize `min = 9999`?",
        "a": "As a large sentinel so the first unvisited distance is guaranteed smaller. (Even safer: use `INT_MAX` from `<climits>`!)",
        "codeRef": {
          "fileId": "disk_sched",
          "hlId": "ds-sstf"
        }
      },
      {
        "q": "Time complexity of FCFS, SSTF, SCAN, and C-SCAN?",
        "a": "FCFS: `O(n)`. SSTF: `O(n²)` (nested loop). SCAN / C-SCAN: `O(n log n)` due to `sort()`."
      },
      {
        "q": "Which algorithm gave the lowest seek time on the lab manual dataset?",
        "a": "**SSTF (`236`)**, followed by SCAN (`345`), C-SCAN (`382`), and FCFS (`640`)."
      },
      {
        "q": "Do SSDs need SCAN or SSTF disk scheduling?",
        "a": "No! SSDs have no mechanical arm or spinning platters (zero seek time), so Linux uses `none` / `mq-deadline`."
      },
      {
        "q": "How do you calculate Average Seek Time?",
        "a": "Divide `total` (total head movement) by `n` (number of requests), e.g., SSTF: `236 / 8 = 29.5` tracks/request."
      }
    ],
    "proTips": [
      "Great C++ style in your `practice.cpp`: `scan()` and `cscan()` take `vector<int> a` **by value** (so sorting never mutates the caller's array) and `sstf()` safely uses `INT_MAX`!",
      "Convert SCAN → LOOK live in 2 seconds: remove the `if (cur != disk_end)` boundary step in `scan()`!"
    ],
    "files": [
      {
        "id": "disk_sched",
        "name": "practice.cpp",
        "path": "08_Disk_Scheduling/practice.cpp",
        "lang": "cpp",
        "desc": "Your practice Disk Scheduling simulator implementing FCFS, SSTF, SCAN, and C-SCAN cleanly.",
        "code": "#include <bits/stdc++.h>\nusing namespace std;\n\nint fcfs(vector<int> &a,int n,int head,int disk_end){\n    cout<<\"\\nFCFS\\n\";\n    int cur=head;\n    int total=0;\n    cout<<\"Order of Serving Requests:\";\n    cout<<head<<' ';\n    for(int i=0;i<n;i++){\n        total+=abs(cur-a[i]);\n        cur=a[i];\n        cout<<a[i]<<\" \";\n    }\n    return total;\n}\n\nint sstf(vector<int> &a,int n,int head,int disk_end){\n    cout<<\"\\nSSTF\\n\";\n    int cur=head;\n    int total=0;\n    cout<<\"Order of Serving Requests:\";\n    vector<int> visited(n,0);\n    cout<<head<<' ';\n    for(int i=0;i<n;i++){\n        int min=INT_MAX;\n        int index=-1;\n        for(int j=0;j<n;j++){\n            if(!visited[j] && min>abs(a[j]-cur)){\n                min=abs(a[j]-cur);\n                index=j;\n            }\n        }\n        if(index!=-1){\n            visited[index]=1;\n            total+=min;\n            cur=a[index];\n            cout<<a[index]<<' ';\n        }\n    }\n    return total;\n}\n\nint scan(vector<int> a,int n,int head,int disk_end){\n\n    cout<<\"\\nSCAN\\n\";\n    vector<int> visited(n,0);\n    sort(a.begin(),a.end());\n    int cur=head;\n    cout<<\"Order of Serving Requests:\";\n    cout<<head<<' ';\n    int total=0;\n    for(int i=0;i<n;i++){\n        if(a[i]>=cur && !visited[i]){\n            visited[i]=1;\n            total+=abs(cur-a[i]);\n            cur=a[i];\n            cout<<a[i]<<' ';\n        }\n    }\n    if(cur!=disk_end){\n        cout<<disk_end<<' ';\n        total+=abs(cur-disk_end);\n        cur=disk_end;\n    }\n    for(int i=n-1;i>=0;i--){\n        if(a[i]<=cur && !visited[i]){\n            visited[i]=1;\n            total+=abs(cur-a[i]);\n            cur=a[i];\n            cout<<a[i]<<' ';\n        }\n    }\n    return total;\n    \n}\n\nint cscan(vector<int> a,int n,int head,int disk_end){\n\n    cout<<\"\\nC-SCAN\\n\";\n    vector<int> visited(n,0);\n    sort(a.begin(),a.end());\n    int cur=head;\n    cout<<\"Order of Serving Requests:\";\n    cout<<head<<' ';\n    int total=0;\n    for(int i=0;i<n;i++){\n        if(a[i]>=cur && !visited[i]){\n            visited[i]=1;\n            total+=abs(cur-a[i]);\n            cur=a[i];\n            cout<<a[i]<<' ';\n        }\n    }\n    total+=disk_end+abs(cur-disk_end);\n    cur=0;\n    for(int i=0;i<n;i++){\n        if(!visited[i]){\n            visited[i]=1;\n            total+=abs(cur-a[i]);\n            cur=a[i];\n            cout<<a[i]<<' ';\n        }\n    }\n    return total;\n    \n}\n\n\nint main()\n{\n    int n, head, disk_end;\n\n    cout << \"Enter number of requests: \";\n    cin >> n;\n\n    vector<int> a(n);\n\n    cout << \"Enter request queue: \";\n    for(int i = 0; i < n; i++) {\n        cin >> a[i];\n    }\n\n    cout << \"Enter initial head position: \";\n    cin >> head;\n\n    cout << \"Enter maximum cylinder number: \";\n    cin >> disk_end;\n\n    cout << \"\\nTotal Head Movement: \" << fcfs(a, n, head, disk_end);\n\n    cout << \"\\nTotal Head Movement: \" << sstf(a, n, head, disk_end);\n\n    cout << \"\\nTotal Head Movement: \" << scan(a, n, head, disk_end);\n\n    cout << \"\\nTotal Head Movement: \" << cscan(a, n, head, disk_end);\n\n    return 0;\n}\n",
        "highlights": [
          {
            "id": "ds-fcfs",
            "startLine": 10,
            "endLine": 14,
            "badge": "CORE ALGO",
            "label": "FCFS Head Movement",
            "explanation": "Sums `abs(cur - a[i])` strictly in input queue order and updates `cur = a[i]`."
          },
          {
            "id": "ds-sstf",
            "startLine": 23,
            "endLine": 40,
            "badge": "CORE ALGO",
            "label": "SSTF Greedy Nearest Track (`INT_MAX`)",
            "explanation": "`visited(n, 0)` ensures each request is served once; inner loop picks unvisited track with minimum `abs(a[j] - cur)` using `INT_MAX` sentinel (`O(n²)`)."
          },
          {
            "id": "ds-scan",
            "startLine": 44,
            "endLine": 74,
            "badge": "CORE ALGO",
            "label": "SCAN Elevator Sweep (Pass-by-Value)",
            "explanation": "Takes `vector<int> a` by value, sorts ascending, sweeps upward `>= cur` to `disk_end`, then reverses downward `n-1..0` servicing remaining requests."
          },
          {
            "id": "ds-cscan",
            "startLine": 78,
            "endLine": 105,
            "badge": "VIVA TRAP",
            "label": "C-SCAN Circular Jump (`disk_end` → `0`)",
            "explanation": "Sweeps upward to `disk_end`, adds jump `disk_end + abs(cur - disk_end)` and resets `cur = 0`, then serves remaining lower tracks in ascending order for uniform wait times."
          }
        ]
      }
    ]
  }
];
