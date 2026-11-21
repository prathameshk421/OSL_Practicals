/* Exp 5a: Producer-Consumer (Bounded Buffer) using POSIX semaphores + mutex.
'empty' counts free slots, 'full' counts filled slots, mutex guards buffer. */
#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <semaphore.h>
#include <unistd.h>
#include <time.h>

#define BUF 10

int buffer[BUF], in = 0, out = 0;
sem_t empty, full;
pthread_mutex_t mutex;

void display_buffer() {
    printf("buffer:[");
    for (int i = 0; i < BUF; i++) {
        if (buffer[i] != 0) {
            printf("%d ", buffer[i]);
        } else {
            printf("_ ");
        }
    }
    printf("]\n");
    fflush(stdout); // Forces the terminal to display the buffer immediately
}

void *producer(void *arg) {
    int p_id = (int)(size_t)arg;

    while (1) {
        int k = (rand() % 10); // Generate item value between 1 and 9

        // 1. Trying to access
        printf("Producer %d wants to add item %d\n", p_id, k);
        
        sem_wait(&empty);
        pthread_mutex_lock(&mutex);

        // 2. Critical Section Action
        buffer[in] = k;
        printf("Producer %d has added item %d at slot %d\n", p_id, k, in);
        in = (in + 1) % BUF;
        display_buffer();

        pthread_mutex_unlock(&mutex);
        sem_post(&full);

        // 3. Finished accessing
        printf("Producer %d has finished accessing the buffer\n", p_id);
        
        usleep((rand() % 5 + 1) * 50000); // Dynamic random delay
    }
    return NULL;
}

void *consumer(void *arg) {
    int c_id = (int)(size_t)arg;

    while (1) {
        // 1. Trying to access (Print 1)
        printf("Consumer %d wants to consume item\n", c_id);
        
        sem_wait(&full);
        pthread_mutex_lock(&mutex);

        // 2. Critical Section Action (Print 2)
        int item = buffer[out];
        buffer[out] = 0;
        printf("Consumer %d has consumed item %d from slot %d\n", c_id, item, out);
        out = (out + 1) % BUF;
        display_buffer();

        pthread_mutex_unlock(&mutex);
        sem_post(&empty);

        // 3. Finished accessing (Print 3)
        printf("Consumer %d has finished accessing the buffer\n", c_id);

        usleep((rand() % 5 + 1) * 90000); // Dynamic random delay
    }
    return NULL;
}

int main() {
    srand(time(NULL)); // Seed random number generator

    pthread_t pt, ct;
    int p_id = 1, c_id = 1;

    sem_init(&empty, 0, BUF);
    sem_init(&full, 0, 0);
    pthread_mutex_init(&mutex, NULL);

    for (int i = 0; i < BUF; i++) buffer[i] = 0;

    // Passing IDs safely using direct value-to-pointer casting
    pthread_create(&pt, NULL, producer, (void *)(size_t)p_id);
    pthread_create(&ct, NULL, consumer, (void *)(size_t)c_id);

    // Threads run indefinitely in while(1), so main blocks on join
    pthread_join(pt, NULL);
    pthread_join(ct, NULL);

    // Cleanup code (Reached if threads are canceled/interrupted)
    sem_destroy(&empty);
    sem_destroy(&full);
    pthread_mutex_destroy(&mutex);

    return 0;
}
