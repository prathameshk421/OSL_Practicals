/* Exp 4: IPC using System V shared memory - WRITER process.
Writes messages into a shared segment; reader reads them.
A status flag byte synchronises turns (0 = writer's turn, 1 = reader's turn). */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/ipc.h>
#include <sys/shm.h>
#define SIZE 1024

struct shm_buf {
    int flag;
    char msg[SIZE];
}; /* flag=1 -> new msg from writer */

int main() {
    key_t key = ftok("chatfile", 65);
    int shmid = shmget(key, sizeof(struct shm_buf), 0666 | IPC_CREAT);
    struct shm_buf *buf = (struct shm_buf *)shmat(shmid, NULL, 0);
    buf->flag = 0;
    printf("WRITER ready. Type 'exit' to quit.\n");
    while (1) {
        while (buf->flag == 1)
            ; /* wait until reader consumed last */
        printf("Writer> ");
        fgets(buf->msg, SIZE, stdin);
        buf->msg[strcspn(buf->msg, "\n")] = 0;
        buf->flag = 1; /* signal reader */
        if (strcmp(buf->msg, "exit") == 0)
            break;
    }
    shmdt(buf);
    return 0;
}
