#include <unistd.h>
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <sys/types.h>
#include <sys/ipc.h>
#include <sys/shm.h>

#include "shm_com.h"

int main(void)
{
    int running = 1;
    void *shared_memory = (void *)0;
    struct shared_use_st *shared_stuff;
    char buffer[TEXT_SZ];
    int shmid;

    shmid = shmget((key_t)1234, sizeof(struct shared_use_st), 0666 | IPC_CREAT);
    if (shmid == -1) {
        perror("shmget failed");
        exit(EXIT_FAILURE);
    }

    shared_memory = shmat(shmid, (void *)0, 0);
    if (shared_memory == (void *)-1) {
        perror("shmat failed");
        exit(EXIT_FAILURE);
    }

    printf("=== Peer 1 Started (Attached at %p) ===\n", shared_memory);
    shared_stuff = (struct shared_use_st *)shared_memory;
    shared_stuff->written_by_1 = 0;

    while (running) {
        /* Check if Peer 2 sent a message */
        if (shared_stuff->written_by_2) {
            printf("\n[Peer 2]: %s", shared_stuff->msg_2_to_1);
            shared_stuff->written_by_2 = 0; /* Acknowledge read */

            if (strncmp(shared_stuff->msg_2_to_1, "end", 3) == 0) {
                printf("Peer 2 ended the session.\n");
                running = 0;
                break;
            }
        }

        /* Check if Peer 1 is ready to send a message */
        if (shared_stuff->written_by_1 == 0) {
            printf("[Peer 1] Enter message: ");
            fflush(stdout);

            if (fgets(buffer, TEXT_SZ, stdin) != NULL) {
                strncpy(shared_stuff->msg_1_to_2, buffer, TEXT_SZ - 1);
                shared_stuff->msg_1_to_2[TEXT_SZ - 1] = '\0';
                shared_stuff->written_by_1 = 1; /* Mark as ready for Peer 2 */

                if (strncmp(buffer, "end", 3) == 0) {
                    running = 0;
                }
            }
        } else {
            /* Sleep briefly to prevent high CPU utilization while waiting */
            sleep(1);
        }
    }

    if (shmdt(shared_memory) == -1) {
        perror("shmdt failed");
        exit(EXIT_FAILURE);
    }

    /* Destroy shared memory segment */
    if (shmctl(shmid, IPC_RMID, 0) == -1) {
        perror("shmctl(IPC_RMID) failed");
        exit(EXIT_FAILURE);
    }

    printf("Peer 1 exited cleanly.\n");
    exit(EXIT_SUCCESS);
}
