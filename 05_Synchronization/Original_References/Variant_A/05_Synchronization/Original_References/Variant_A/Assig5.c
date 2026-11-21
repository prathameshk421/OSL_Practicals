/* Exp 5a: Producer-Consumer (Bounded Buffer) using POSIX semaphores + mutex.
'empty' counts free slots, 'full' counts filled slots, mutex guards buffer. */
#include <stdio.h>
#include <pthread.h>
#include <semaphore.h>
#include <unistd.h>
#define BUF 5
#define ITEMS 10
int buffer[BUF], in = 0, out = 0;
sem_t empty, full;
pthread_mutex_t mutex;
void display_buffer() {
    printf("Buffer: [ ");
    for (int i = 0; i < BUF; i++) {
        if (buffer[i] != 0) printf("%d ", buffer[i]);
        else printf("_ ");
    }
    printf("]\n");
}
void *producer(void *arg) {
    int p_id = *((int *)arg);
for (int i = 1; i <= ITEMS; i++) {
sem_wait(&empty);
pthread_mutex_lock(&mutex);
buffer[in] = i;
printf("Producer %d produced item %d at slot %d | ", p_id, i, in);
    in = (in + 1) % BUF;
    display_buffer();
pthread_mutex_unlock(&mutex);
sem_post(&full);
usleep(50000);
}
return NULL;
}
void *consumer(void *arg) {
for (int i = 1; i <= ITEMS; i++) {
sem_wait(&full);
pthread_mutex_lock(&mutex);
int item = buffer[out];
    buffer[out] = 0; 
    printf("Consumer consumed item %d from slot %d   | ", item, out);
    out = (out + 1) % BUF;
    display_buffer();
pthread_mutex_unlock(&mutex);
sem_post(&empty);
usleep(90000);
}
return NULL;
}
int main() {
pthread_t pt, ct;
int p_id=1;
sem_init(&empty, 0, BUF);
sem_init(&full, 0, 0);
pthread_mutex_init(&mutex, NULL);
for(int i=0;i<BUF;i++) buffer[i]=0;
pthread_create(&pt, NULL, producer, &p_id);
pthread_create(&ct, NULL, consumer, NULL);
pthread_join(pt, NULL);
pthread_join(ct, NULL);
sem_destroy(&empty); sem_destroy(&full);
pthread_mutex_destroy(&mutex);
printf("Producer-Consumer finished without overflow/underflow.\n");
return 0;
}
