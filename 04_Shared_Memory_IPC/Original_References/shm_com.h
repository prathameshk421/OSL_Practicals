#ifndef SHM_COM_H
#define SHM_COM_H

#define TEXT_SZ 2048

struct shared_use_st {
    int written_by_1;          /* 1 when Process 1 writes a message for Process 2 */
    char msg_1_to_2[TEXT_SZ];  /* Message payload from Process 1 -> Process 2 */

    int written_by_2;          /* 1 when Process 2 writes a message for Process 1 */
    char msg_2_to_1[TEXT_SZ];  /* Message payload from Process 2 -> Process 1 */
};

#endif
